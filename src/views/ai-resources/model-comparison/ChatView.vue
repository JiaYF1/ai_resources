<script setup lang="ts">
import { ref, reactive, computed, provide, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting, Delete, Plus } from '@element-plus/icons-vue'
import ChatPanel from '@/components/model-comparison/ChatPanel.vue'
import MessageInput from '@/components/model-comparison/MessageInput.vue'
import { AVAILABLE_MODELS, DEFAULT_PANEL_MODELS, getModelById } from '@/config/models'
import type { Message, ModelConfig, ApiKeys } from '@/types/model-comparison'
import { PROVIDER_LABELS } from '@/types/model-comparison'

// ─── Props ───────────────────────────────────────────────────────────────────

const props = defineProps<{
  panelCount: number
}>()

// ─── State ───────────────────────────────────────────────────────────────────

const panelModelIds = ref<string[]>(DEFAULT_PANEL_MODELS.slice(0, 4))
const conversations = reactive<Record<string, Message[]>>({})
const loadingStates = reactive<Record<string, boolean>>({})
const settingsVisible = ref(false)

const apiKeys = reactive<ApiKeys>({
  openai: '',
  anthropic: '',
  gemini: '',
  deepseek: '',
})

// ─── Computed ────────────────────────────────────────────────────────────────

const activePanels = computed(() => {
  return panelModelIds.value.slice(0, props.panelCount).map((modelId, index) => ({
    id: `panel-${index}`,
    modelId,
    messages: conversations[`panel-${index}`] || [],
  }))
})

const isAnyLoading = computed(() => {
  return activePanels.value.some((panel) => loadingStates[panel.id])
})

const requiredProviders = computed(() => {
  const providers = new Set(
    activePanels.value
      .map((p) => getModelById(p.modelId))
      .filter(Boolean)
      .map((m) => m!.provider)
  )
  return [...providers]
})

// ─── API Key Persistence ─────────────────────────────────────────────────────

const loadApiKeys = () => {
  try {
    const stored = localStorage.getItem('ai-chat-api-keys')
    if (stored) Object.assign(apiKeys, JSON.parse(stored))
  } catch { }
}

const saveApiKeys = () => {
  localStorage.setItem('ai-chat-api-keys', JSON.stringify(apiKeys))
  settingsVisible.value = false
  ElMessage.success('API Key 已保存')
}

loadApiKeys()

// ─── Initialize Conversations ────────────────────────────────────────────────

for (let i = 0; i < 4; i++) {
  if (!conversations[`panel-${i}`]) {
    conversations[`panel-${i}`] = []
  }
}

// ─── API Calls ───────────────────────────────────────────────────────────────

const callOpenAI = async (messages: Message[], apiKey: string, modelId: string): Promise<string> => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: modelId,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message ?? `OpenAI 请求失败 (${res.status})`)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

const callAnthropic = async (messages: Message[], apiKey: string, modelId: string): Promise<string> => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 8096,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message ?? `Anthropic 请求失败 (${res.status})`)
  }
  const data = await res.json()
  return data.content[0].text
}

const callGemini = async (messages: Message[], apiKey: string, modelId: string): Promise<string> => {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message ?? `Gemini 请求失败 (${res.status})`)
  }
  const data = await res.json()
  return data.candidates[0].content.parts[0].text
}

const callDeepSeek = async (messages: Message[], apiKey: string, modelId: string): Promise<string> => {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: modelId,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message ?? `DeepSeek 请求失败 (${res.status})`)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

const callModel = async (model: ModelConfig, messages: Message[]): Promise<string> => {
  const key = apiKeys[model.provider]
  if (!key) throw new Error(`请先在设置中配置 ${PROVIDER_LABELS[model.provider]}`)
  switch (model.provider) {
    case 'openai':
      return callOpenAI(messages, key, model.modelId)
    case 'anthropic':
      return callAnthropic(messages, key, model.modelId)
    case 'gemini':
      return callGemini(messages, key, model.modelId)
    case 'deepseek':
      return callDeepSeek(messages, key, model.modelId)
  }
}

// ─── Message Handling ────────────────────────────────────────────────────────

const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const sendMessageToAllPanels = async (content: string) => {
  if (isAnyLoading.value) return

  await Promise.allSettled(
    activePanels.value.map(async (panel) => {
      const model = getModelById(panel.modelId)
      if (!model) return

      const panelKey = panel.id
      if (!conversations[panelKey]) conversations[panelKey] = []

      const userMsg: Message = {
        id: generateMessageId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      }
      conversations[panelKey].push(userMsg)
      loadingStates[panelKey] = true

      try {
        const reply = await callModel(model, conversations[panelKey])
        const assistantMsg: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        }
        conversations[panelKey].push(assistantMsg)
      } catch (err) {
        const msg = err instanceof Error ? err.message : '未知错误'
        const errorMsg: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: `❌ ${msg}`,
          timestamp: Date.now(),
        }
        conversations[panelKey].push(errorMsg)
      } finally {
        loadingStates[panelKey] = false
      }
    })
  )
}

const clearConversations = () => {
  activePanels.value.forEach((panel) => {
    conversations[panel.id] = []
  })
}

const updatePanelModel = (panelIndex: number, newModelId: string) => {
  panelModelIds.value[panelIndex] = newModelId
}

const closePanel = (panelIndex: number) => {
  if (props.panelCount <= 1) {
    ElMessage.warning('至少保留一个对话面板')
    return
  }
  // This would need to emit an event to parent to change panelCount
  ElMessage.info('请通过侧边栏调整面板数量')
}
</script>

<template>
<div class="chat-view">
  <!-- Toolbar -->
  <div class="toolbar">
    <div class="toolbar-left">
      <span class="panel-info">当前 {{ panelCount }} 个对话窗口</span>
    </div>
    <div class="toolbar-actions">
      <el-button :icon="Delete" size="small" plain @click="clearConversations">清空对话</el-button>
      <el-button :icon="Setting" size="small" plain @click="settingsVisible = true">API 设置</el-button>
    </div>
  </div>

  <!-- Chat Panels -->
  <div :class="['panels-wrapper', 'count-' + panelCount]">
    <ChatPanel v-for="(panel, index) in activePanels" :key="panel.id" :model-id="panel.modelId"
      :messages="conversations[panel.id] || []" :loading="loadingStates[panel.id]"
      @update:model-id="(id) => updatePanelModel(index, id)" @close="closePanel(index)" />
  </div>

  <!-- Message Input -->
  <MessageInput :loading="isAnyLoading" @send="sendMessageToAllPanels" />

  <!-- Settings Dialog -->
  <el-dialog v-model="settingsVisible" title="API Key 设置" width="480px">
    <el-alert type="info" :closable="false" class="key-alert">
      API Key 仅保存在本地浏览器中，不会上传至任何服务器。
    </el-alert>
    <el-form label-width="160px" class="key-form">
      <el-form-item v-for="provider in requiredProviders" :key="provider" :label="PROVIDER_LABELS[provider]">
        <el-input v-model="apiKeys[provider]" type="password" show-password
          :placeholder="`请输入 ${PROVIDER_LABELS[provider]}`" />
      </el-form-item>
      <el-form-item label="其他 API Key">
        <el-collapse>
          <el-collapse-item title="展开配置其他模型的 Key">
            <el-form label-width="160px">
              <el-form-item v-for="(label, provider) in PROVIDER_LABELS" :key="provider" :label="label">
                <el-input v-model="apiKeys[provider as keyof ApiKeys]" type="password" show-password
                  :placeholder="`请输入 ${label}`" />
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="settingsVisible = false">取消</el-button>
      <el-button type="primary" @click="saveApiKeys">保存</el-button>
    </template>
  </el-dialog>
</div>
</template>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* slightly lighter background to distinguish panels */
  background: var(--color-background-soft);
  overflow: hidden;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.panel-info {
  font-size: 13px;
  color: #606266;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Panels */
.panels-wrapper {
  display: grid;
  flex: 1;
  overflow: hidden;
  grid-gap: 12px;
}

.count-1 {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.count-2 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
}

.count-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.count-4 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

/* Settings */
.key-alert {
  margin-bottom: 20px;
}

.key-form {
  padding-right: 8px;
}
</style>
