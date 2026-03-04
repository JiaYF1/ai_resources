<script setup lang="ts">
import { ref } from 'vue'
import { Promotion } from '@element-plus/icons-vue'

defineProps<{
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [message: string]
}>()

const inputMessage = ref('')

const handleSend = () => {
  const content = inputMessage.value.trim()
  if (!content) return
  emit('send', content)
  inputMessage.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="message-input">
    <el-input
      v-model="inputMessage"
      type="textarea"
      :rows="3"
      placeholder="输入消息，Enter 发送，Shift+Enter 换行"
      resize="none"
      class="chat-input"
      :disabled="disabled"
      @keydown="handleKeydown"
    />
    <el-button
      type="primary"
      :icon="Promotion"
      :loading="loading"
      :disabled="!inputMessage.trim() || disabled"
      class="send-btn"
      @click="handleSend"
    >
      发送
    </el-button>
  </div>
</template>

<style scoped>
.message-input {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
}

.chat-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  font-size: 13px;
  resize: none;
}

.send-btn {
  height: 72px;
  padding: 0 20px;
  border-radius: 8px;
  flex-shrink: 0;
}
</style>
