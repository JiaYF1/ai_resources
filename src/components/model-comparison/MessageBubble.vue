<script setup lang="ts">
import type { Message } from '@/types/model-comparison'

defineProps<{
  message: Message
  modelColor?: string
}>()
</script>

<template>
  <div :class="['message', message.role]">
    <div
      class="bubble"
      :style="message.role === 'assistant' ? { borderTopColor: modelColor || '#e4e7ed' } : {}"
    >
      <pre>{{ message.content }}</pre>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
}

.bubble pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
  font-size: inherit;
}

.message.user .bubble {
  background: #409eff;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message.assistant .bubble {
  background: #f0f2f5;
  color: #303133;
  border-top-left-radius: 4px;
  border-top: 2px solid #e4e7ed;
}
</style>
