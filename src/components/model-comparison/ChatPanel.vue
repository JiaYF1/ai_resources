<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import ChatHeader from './ChatHeader.vue'
import MessageBubble from './MessageBubble.vue'
import type { Message, ModelConfig } from '@/types/model-comparison'
import { AVAILABLE_MODELS, getModelById } from '@/config/models'

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
  <div ref="messagesRef" class="messages">
    <div v-if="!messages.length" class="empty-tip">
      <p>与 {{ model.name }} 开始对话</p>
    </div>

    <template v-else>
      <template v-for="msg in messages" :key="msg.id">
        <!-- 流式输出等待中：空 assistant 消息显示加载动画 -->
        <div v-if="msg.role === 'assistant' && !msg.content && loading" class="message assistant">
          <div class="bubble loading-bubble" :style="{ borderTopColor: model.color }">
            <span class="dot" /><span class="dot" /><span class="dot" />
          </div>
        </div>
        <!-- 正常消息气泡 -->
        <MessageBubble v-else :message="msg" :model-color="model.color" />
      </template>
    </template>
  </div>

  <!-- Model Selector Dialog -->
  <el-dialog v-model="showModelSelector" title="选择模型" width="400px">
    <div class="model-list">
      <div v-for="m in AVAILABLE_MODELS" :key="m.id" class="model-option" :class="{ active: m.id === modelId }"
        @click="selectModel(m.id)">
        <span class="model-dot" :style="{ background: m.color }" />
        <span>{{ m.name }}</span>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<style scoped>
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* full card style */
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  min-width: 0;
  /* allow grid-gap to create spacing, remove individual right border */
}



/* Messages */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-tip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 14px;
}

.message {
  display: flex;
}

.message.assistant {
  justify-content: flex-start;
}

/* Loading dots */
.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  background: #f0f2f5;
  border-top: 2px solid #e4e7ed;
  border-top-left-radius: 4px;
}

.loading-bubble {
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #909399;
  animation: bounce 1.2s infinite ease-in-out;
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

/* Model Selector */
.model-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.model-option:hover {
  background: #f5f7fa;
}

.model-option.active {
  background: #ecf5ff;
}

.model-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
