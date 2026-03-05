<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting, Delete, InfoFilled } from '@element-plus/icons-vue'
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
      <div class="panel-badge">
        <span class="badge-dot"></span>
        <span class="panel-info">当前窗口: {{ panelCount }}</span>
      </div>
    </div>
    <div class="toolbar-actions">
      <el-button-group>
        <el-button :icon="Delete" size="default" plain @click="clearConversations" class="toolbar-btn">清空</el-button>
        <el-button :icon="Setting" size="default" plain @click="settingsVisible = true"
          class="toolbar-btn">设置</el-button>
      </el-button-group>
    </div>
  </div>

  <!-- Chat Panels -->
  <div class="panels-container">
    <div :class="['panels-grid', 'count-' + panelCount]">
      <ChatPanel v-for="(panel, index) in activePanels" :key="panel.id" :model-id="panel.modelId"
        :messages="conversations[panel.id] || []" :loading="loadingStates[panel.id]"
        @update:model-id="(id) => updatePanelModel(index, id)" @close="closePanel(index)" />
    </div>
  </div>

  <!-- Message Input -->
  <div class="input-area">
    <MessageInput :loading="isAnyLoading" @send="sendMessageToAllPanels" />
  </div>

  <!-- Settings Dialog -->
  <el-dialog v-model="settingsVisible" title="API 设置" width="460px" align-center class="settings-dialog" append-to-body>
    <div class="settings-scroll-area">
      <div class="settings-content">
        <div class="info-banner">
          <el-icon class="info-icon">
            <InfoFilled />
          </el-icon>
          <p>API Key 仅保存在您的浏览器中，绝对安全。</p>
        </div>

        <el-form label-position="top" class="key-form">
          <el-form-item v-for="provider in requiredProviders" :key="provider" :label="PROVIDER_LABELS[provider]">
            <el-input v-model="apiKeys[provider]" type="password" show-password
              :placeholder="`请输入 ${PROVIDER_LABELS[provider]} API Key`" class="custom-input" />
          </el-form-item>

          <div class="other-keys">
            <el-collapse>
              <el-collapse-item title="配置其他模型的 API Key">
                <el-form label-position="top">
                  <el-form-item v-for="(label, provider) in PROVIDER_LABELS" :key="provider" :label="label">
                    <el-input v-model="apiKeys[provider as keyof ApiKeys]" type="password" show-password
                      :placeholder="`请输入 ${label} API Key`" class="custom-input" />
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="settingsVisible = false" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="saveApiKeys" class="save-btn">保存配置</el-button>
      </div>
    </template>
  </el-dialog>
</div>
</template>

<style lang="scss" scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f8f9fa;
  overflow: hidden;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: transparent;
  flex-shrink: 0;
}

.panel-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.badge-dot {
  width: 6px;
  height: 6px;
  background-color: #3a6ffb;
  border-radius: 50%;
}

.panel-info {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.toolbar-btn {
  font-weight: 500;
}

/* Panels */
.panels-container {
  flex: 1;
  overflow: hidden;
  padding: 0 24px;
}

.panels-grid {
  display: grid;
  height: 100%;
  grid-gap: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.count-1 {
  grid-template-columns: 1fr;
}

.count-2 {
  grid-template-columns: repeat(2, 1fr);
}

.count-3 {
  grid-template-columns: repeat(3, 1fr);
}

.count-4 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.input-area {
  max-width: 100%;
  width: 100%;
}

/* Settings Dialog */
:deep(.settings-dialog) {
  border-radius: 16px;
}

.settings-scroll-area {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 4px;
  scrollbar-width: thin;
}

.settings-content {
  padding-bottom: 8px;
}

.info-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f0f7ff;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  border: 1px solid rgba(58, 111, 251, 0.1);
}

.info-icon {
  color: #3a6ffb;
  font-size: 20px;
}

.info-banner p {
  font-size: 13px;
  color: #4f8cff;
  margin: 0;
  font-weight: 500;
}

.key-form {
  padding-right: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 6px 12px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3a6ffb inset !important;
}

.other-keys {
  margin-top: 24px;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-weight: 500;
  color: #8c8c8c;
  background: transparent;
}

:deep(.el-collapse-item__content) {
  padding-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 0;
}

.save-btn {
  background: linear-gradient(135deg, #4f8cff 0%, #3a6ffb 100%);
  border: none;
  padding: 0 24px;
  height: 40px;
  font-weight: 600;
}

.cancel-btn {
  height: 40px;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .toolbar {
    padding: 12px 16px;
  }

  .panels-container {
    padding: 0 12px;
    overflow-y: auto;
  }

  .panels-grid {
    grid-gap: 12px;
    height: auto;
    min-height: 100%;
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
  }

  .panels-grid>div {
    min-height: 350px;
    height: 350px;
  }

  .settings-scroll-area {
    max-height: 50vh;
  }

  .count-1 {
    .chat-panel {
      height: 100%;
    }
  }
}
</style>
