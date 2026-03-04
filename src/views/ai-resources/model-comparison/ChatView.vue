<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting, Delete } from '@element-plus/icons-vue'
import ChatPanel from '@/components/modelComparison/ChatPanel.vue'
import MessageInput from '@/components/modelComparison/MessageInput.vue'
import { DEFAULT_PANEL_MODELS, getModelById } from '@/config/models'
import type { Message, ModelConfig, ApiKeys, ChatEvent } from '@/types/model-comparison'
import { PROVIDER_LABELS } from '@/types/model-comparison'
import { getBot } from '@/utils/bots'

// ─── Props ───────────────────────────────────────────────────────────────────

const props = defineProps<{
  panelCount: number
}>()

// ─── State ───────────────────────────────────────────────────────────────────

const panelModelIds = ref<string[]>(DEFAULT_PANEL_MODELS.slice(0, 4))
const conversations = reactive<Record<string, Message[]>>({})
const loadingStates = reactive<Record<string, boolean>>({})
const settingsVisible = ref(false)
const abortControllers = ref<Record<string, AbortController>>({})

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

// ─── Core: Call Model with Streaming ─────────────────────────────────────────

const callModel = async (
  panelKey: string,
  model: ModelConfig,
  historyMessages: Message[],
  assistantMsg: Message,
) => {
  const key = apiKeys[model.provider]
  if (!key) {
    assistantMsg.content = `❌ 请先配置 ${PROVIDER_LABELS[model.provider]}`
    return
  }

  const bot = getBot(model.provider)
  const controller = new AbortController()
  abortControllers.value[panelKey] = controller

  await bot.sendMessage({
    messages: historyMessages,
    apiKey: key,
    modelId: model.modelId,
    signal: controller.signal,
    onEvent: (event: ChatEvent) => {
      if (event.type === 'UPDATE') {
        // 流式拼接增量文本到当前 assistant 消息
        assistantMsg.content += event.text
      } else if (event.type === 'ERROR') {
        assistantMsg.content = `❌ ${event.error.message}`
      }
      // DONE 事件由 finally 中的 loadingStates 清理处理
    },
  })

  delete abortControllers.value[panelKey]
}

// ─── Stop Generation ─────────────────────────────────────────────────────────

const stopGeneration = (panelKey: string) => {
  const controller = abortControllers.value[panelKey]
  if (controller) {
    controller.abort()
    delete abortControllers.value[panelKey]
  }
}

// ─── Message Handling ────────────────────────────────────────────────────────

const sendMessageToAllPanels = async (content: string) => {
  if (isAnyLoading.value) return

  await Promise.allSettled(
    activePanels.value.map(async (panel) => {
      const model = getModelById(panel.modelId)
      if (!model) return

      const panelKey = panel.id
      if (!conversations[panelKey]) conversations[panelKey] = []

      // 添加用户消息
      const userMsg: Message = {
        id: generateMessageId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      }
      conversations[panelKey].push(userMsg)

      // 创建空的 assistant 消息，用于流式填充
      conversations[panelKey].push({
        id: generateMessageId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      })
      // 从 reactive 数组中取回响应式代理引用，确保后续修改能触发 UI 更新
      const assistantMsg = conversations[panelKey][conversations[panelKey].length - 1]!
      loadingStates[panelKey] = true

      try {
        // 传入不含空 assistant 消息的历史记录
        const history = conversations[panelKey].slice(0, -1)
        await callModel(panelKey, model, history, assistantMsg)
      } catch (err) {
        const msg = err instanceof Error ? err.message : '未知错误'
        assistantMsg.content = `❌ ${msg}`
      } finally {
        loadingStates[panelKey] = false
      }
    })
  )
}

const clearConversations = () => {
  // 先中止所有正在进行的请求
  Object.keys(abortControllers.value).forEach(stopGeneration)
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
  <el-dialog v-model="settingsVisible" title="API Key 设置" :width="'min(480px, 90vw)'">
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

@media (max-width: 768px) {
  .toolbar {
    padding: 8px 12px;
    border-radius: 0;
  }

  .panel-info {
    font-size: 12px;
  }

  /* 移动端多面板纵向等分 */
  .panels-wrapper.count-2 {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
  }

  .panels-wrapper.count-3 {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
  }

  .panels-wrapper.count-4 {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
}
</style>
