<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import ChatHeader from './ChatHeader.vue'
import MessageBubble from './MessageBubble.vue'
import type { Message, ModelConfig } from '@/types/model-comparison'
import { AVAILABLE_MODELS, getModelById } from '@/config/models'
import { ChatLineRound } from '@element-plus/icons-vue'

const props = defineProps<{
  modelId: string
  messages: Message[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelId': [value: string]
  'update:messages': [value: Message[]]
  close: []
}>()

const messagesRef = ref<HTMLElement | null>()
const showModelSelector = ref(false)

// Default fallback model (guaranteed to exist)
const defaultModel: ModelConfig = AVAILABLE_MODELS[0]!

const model = computed((): ModelConfig => {
  return getModelById(props.modelId) ?? defaultModel
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

watch(() => props.messages.length, scrollToBottom)
watch(() => props.loading, scrollToBottom)
// 流式输出时，监听最后一条消息内容变化以自动滚动
watch(
  () => {
    const last = props.messages[props.messages.length - 1]
    return last?.content?.length ?? 0
  },
  scrollToBottom,
)

const handleChangeModel = () => {
  showModelSelector.value = true
}

const selectModel = (newModelId: string) => {
  emit('update:modelId', newModelId)
  showModelSelector.value = false
}
</script>

<template>
<div class="chat-panel">
  <ChatHeader :model="model" :loading="loading" @change-model="handleChangeModel" />

  <!-- Messages -->
  <div ref="messagesRef" class="messages-container">
    <div v-if="!messages.length" class="empty-state">
      <el-icon class="empty-icon">
        <ChatLineRound />
      </el-icon>
      <h3>开始对话</h3>
      <p>你可以问我任何问题，我将基于 {{ model.name }} 为你解答。</p>
    </div>

    <div v-else class="messages-list">
      <template v-for="msg in messages" :key="msg.id">
        <!-- 流式输出等待中：空 assistant 消息显示加载动画 -->
        <div v-if="msg.role === 'assistant' && !msg.content && loading" class="loading-message">
          <div class="assistant-avatar-placeholder" :style="{ backgroundColor: model.color }">AI</div>
          <div class="loading-bubble">
            <span class="dot" /><span class="dot" /><span class="dot" />
          </div>
        </div>
        <!-- 正常消息气泡 -->
        <MessageBubble v-else :message="msg" :model-color="model.color" />
      </template>
    </div>
  </div>

  <!-- Model Selector Dialog -->
  <el-dialog v-slot:default v-model="showModelSelector" title="选择 AI 模型" width="420px" append-to-body align-center
    class="custom-dialog">
    <div class="model-grid">
      <div v-for="m in AVAILABLE_MODELS" :key="m.id" class="model-card" :class="{ active: m.id === modelId }"
        @click="selectModel(m.id)">
        <div class="model-card-icon" :style="{ backgroundColor: m.color }">{{ m.name.charAt(0) }}</div>
        <div class="model-card-info">
          <span class="name">{{ m.name }}</span>
          <span class="provider">{{ m.provider }}</span>
        </div>
        <div v-if="m.id === modelId" class="active-check">
          <el-icon>
            <Check />
          </el-icon>
        </div>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script lang="ts">
import { Check } from '@element-plus/icons-vue'
</script>

<style scoped>
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fcfcfc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  min-width: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
  /* Scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

@media (max-width: 768px) {
  .messages-container {
    padding: 12px 10px;
  }
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-track {
  background-color: transparent;
}

.messages-list {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  padding: 5px 20px;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  text-align: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .empty-state {
    padding: 20px 10px;
  }
}

.empty-icon {
  font-size: 48px;
  color: #e8e8e8;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .empty-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .empty-state h3 {
    font-size: 15px;
    margin-bottom: 4px;
  }

  .empty-state p {
    font-size: 12px;
  }
}

.empty-state p {
  font-size: 14px;
  max-width: 280px;
  line-height: 1.6;
}

.loading-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .loading-message {
    gap: 8px;
    margin-bottom: 12px;
  }
}

.assistant-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .assistant-avatar-placeholder {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }
}

.loading-bubble {
  padding: 12px 20px;
  border-radius: 18px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

@media (max-width: 768px) {
  .loading-bubble {
    padding: 8px 14px;
    border-radius: 14px;
  }
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #bfbfbf;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-6px);
  }
}

/* Model Selector Grid */
.model-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 10px 0;
}

.model-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.model-card:hover {
  background-color: #f5f7fa;
}

.model-card.active {
  background-color: #f0f7ff;
  border-color: #3a6ffb;
}

.model-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.model-card-info {
  display: flex;
  flex-direction: column;
}

.model-card-info .name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.model-card-info .provider {
  font-size: 11px;
  color: #8c8c8c;
  text-transform: uppercase;
}

.active-check {
  margin-left: auto;
  color: #3a6ffb;
  font-size: 18px;
}

:deep(.custom-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.custom-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 20px 24px 10px;
}

:deep(.custom-dialog .el-dialog__title) {
  font-weight: 700;
  font-size: 18px;
}
</style>
