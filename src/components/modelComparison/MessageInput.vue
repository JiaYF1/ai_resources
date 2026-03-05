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
<div class="message-input-wrapper">
  <div class="input-container">
    <el-input v-model="inputMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }"
      placeholder="输入消息，Enter 发送..." resize="none" class="chat-input" :disabled="disabled" @keydown="handleKeydown" />
    <div class="input-actions">
      <span class="tip-text">Shift + Enter 换行</span>
      <el-button type="primary" :loading="loading" :disabled="!inputMessage.trim() || disabled" class="send-btn"
        @click="handleSend">
        <template #icon>
          <el-icon :size="18">
            <Promotion />
          </el-icon>
        </template>
      </el-button>
    </div>
  </div>
</div>
</template>

<style scoped>
.message-input-wrapper {
  padding: 16px 24px 24px;
  background-color: transparent;
  flex-shrink: 0;
}

.input-container {
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: border-color 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.input-container:focus-within {
  border-color: #3a6ffb;
  box-shadow: 0 4px 20px rgba(58, 111, 251, 0.1);
}

.chat-input :deep(.el-textarea__inner) {
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 8px 4px;
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.6;
}

.chat-input :deep(.el-textarea__inner::placeholder) {
  color: #bfbfbf;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-bottom: 4px;
}

.tip-text {
  font-size: 11px;
  color: #bfbfbf;
  margin-left: 4px;
}

.send-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f8cff 0%, #3a6ffb 100%);
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(58, 111, 251, 0.3);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

.send-btn:disabled {
  background: #f5f5f5;
  color: #bfbfbf;
}

@media (max-width: 768px) {
  .message-input-wrapper {
    padding: 12px 16px 16px;
  }

  .input-container {
    border-radius: 12px;
  }

  .tip-text {
    display: none;
  }
}
</style>
