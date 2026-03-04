<script setup lang="ts">
import type { ModelConfig } from '@/types/model-comparison'

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
<div class="chat-header" :style="{ borderBottomColor: model.color }">
  <div class="model-info">
    <span class="model-dot" :style="{ background: model.color }" />
    <span class="model-name">{{ model.name }}</span>
    <el-button title="切换模型" text size="small" class="action-btn" @click="$emit('changeModel')">
      <el-icon>
        <Switch />
      </el-icon>
    </el-button>
  </div>
  <div class="header-actions">
    <el-tag v-if="loading" size="small" type="warning" effect="plain" class="thinking-tag">
      思考中…
    </el-tag>
  </div>
</div>
</template>

<script lang="ts">
import { Switch, Close } from '@element-plus/icons-vue'
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 16px;
  border-bottom: 2px solid #e4e7ed;
  background: #fafafa;
  flex-shrink: 0;
  /* round top corners inside panel card */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.model-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.model-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.thinking-tag {
  font-size: 11px;
  margin-right: 8px;
}

.action-btn {
  padding: 4px;
  color: #909399;
}

.action-btn:hover {
  color: #409eff;
}
</style>
