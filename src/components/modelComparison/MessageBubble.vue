<script setup lang="ts">
import type { Message } from '@/types/model-comparison'
import { ElAvatar } from 'element-plus'
import { UserFilled, Opportunity } from '@element-plus/icons-vue'

defineProps<{
  message: Message
  modelColor?: string
}>()
</script>

<template>
  <div :class="['message-wrapper', message.role]">
    <div class="avatar-container">
      <el-avatar 
        v-if="message.role === 'assistant'"
        :size="32" 
        :style="{ backgroundColor: modelColor || '#3a6ffb' }"
        class="bot-avatar"
      >
        <el-icon><Opportunity /></el-icon>
      </el-avatar>
      <el-avatar 
        v-else 
        :size="32" 
        class="user-avatar"
      >
        <el-icon><UserFilled /></el-icon>
      </el-avatar>
    </div>
    
    <div class="message-content">
      <div 
        class="bubble"
        :style="message.role === 'assistant' ? { borderLeft: `3px solid ${modelColor || '#3a6ffb'}` } : {}"
      >
        <div class="message-text">
          <pre>{{ message.content }}</pre>
        </div>
      </div>
      <div class="message-time" v-if="message.timestamp">
        {{ new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;
}

.message-wrapper.user {
  flex-direction: row-reverse;
}

.avatar-container {
  flex-shrink: 0;
  margin-top: 2px;
}

.bot-avatar {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: white;
}

.user-avatar {
  background-color: #f0f2f5;
  color: #8c8c8c;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 80px);
}

.message-wrapper.user .message-content {
  align-items: flex-end;
}

.bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.6;
  position: relative;
  transition: all 0.2s;
}

.message-wrapper.assistant .bubble {
  background-color: #fff;
  color: #1a1a1a;
  border-top-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.message-wrapper.user .bubble {
  background: linear-gradient(135deg, #4f8cff 0%, #3a6ffb 100%);
  color: #fff;
  border-top-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(58, 111, 251, 0.2);
}

.message-text pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: inherit;
}

.message-time {
  font-size: 11px;
  color: #bfbfbf;
  margin-top: 4px;
  padding: 0 4px;
}

@media (max-width: 768px) {
  .message-content {
    max-width: calc(100% - 48px);
  }
  
  .bubble {
    padding: 10px 14px;
    font-size: 13.5px;
  }
}
</style>
