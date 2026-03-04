<script setup lang="ts">
import { ElAvatar } from 'element-plus'
import { Fold } from '@element-plus/icons-vue'

defineProps<{
  isMobile: boolean
}>()

const emit = defineEmits<{
  'toggle-sidebar': []
}>()
</script>

<template>
<div class="app-header">
  <div class="header-left">
    <el-button
      v-if="isMobile"
      class="hamburger-btn"
      text
      @click="emit('toggle-sidebar')"
    >
      <el-icon :size="22"><Fold /></el-icon>
    </el-button>
    <h1 class="site-title">AI 资源导航</h1>
  </div>
  <div class="header-right">
    <span class="username">feibao</span>
    <ElAvatar :size="36" src="" class="avatar">
      <span>F</span>
    </ElAvatar>
  </div>
</div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  background-color: #1d1e1f;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.site-title {
  font-size: var(--font-size-h2, 20px);
  font-weight: 600;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-size: var(--font-size-small, 14px);
  color: #cfd3dc;
}

.avatar {
  background-color: #409eff;
  color: #fff;
}

.hamburger-btn {
  color: #fff;
  padding: 4px;
  margin-right: 4px;
}

.hamburger-btn:hover {
  color: #409eff;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
  }

  .username {
    display: none;
  }

  .site-title {
    font-size: 16px;
  }
}
</style>
