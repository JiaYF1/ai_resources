<script setup lang="ts">
import type { ModelConfig } from '@/types/model-comparison'
import { Switch, Opportunity } from '@element-plus/icons-vue'

defineProps<{
  model: ModelConfig
  loading?: boolean
}>()

defineEmits<{
  changeModel: []
  close: []
}>()
</script>

<template>
  <div class="chat-header">
    <div class="model-info" @click="$emit('changeModel')">
      <div class="model-icon-wrapper" :style="{ backgroundColor: model.color }">
        <el-icon :size="14"><Opportunity /></el-icon>
      </div>
      <div class="model-details">
        <span class="model-name">{{ model.name }}</span>
        <span class="model-provider">{{ model.provider }}</span>
      </div>
      <el-icon class="switch-icon"><Switch /></el-icon>
    </div>
    
    <div class="header-actions">
      <transition name="fade">
        <div v-if="loading" class="status-indicator">
          <span class="pulse-dot" :style="{ backgroundColor: model.color }"></span>
          <span class="status-text">正在响应...</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  border-radius: 12px 12px 0 0;
}

@media (max-width: 768px) {
  .chat-header {
    padding: 8px 12px;
  }
}

.model-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

@media (max-width: 768px) {
  .model-info {
    gap: 8px;
    padding: 2px 4px;
  }
}

.model-info:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.model-icon-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .model-icon-wrapper {
    width: 24px;
    height: 24px;
  }
}

.model-details {
  display: flex;
  flex-direction: column;
}

.model-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .model-name {
    font-size: 13px;
  }
}

.model-provider {
  font-size: 11px;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .model-provider {
    font-size: 10px;
  }
}

.switch-icon {
  font-size: 14px;
  color: #bfbfbf;
  margin-left: 4px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

@media (max-width: 768px) {
  .status-indicator {
    padding: 2px 8px;
    gap: 4px;
  }
  
  .status-text {
    font-size: 10px;
  }
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.status-text {
  font-size: 12px;
  color: #595959;
  font-weight: 500;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.5; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>