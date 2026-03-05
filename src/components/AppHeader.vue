<script setup lang="ts">
import { ElAvatar, ElIcon, ElButton } from 'element-plus'
import { Fold, Expand } from '@element-plus/icons-vue'

defineProps<{
  isMobile: boolean
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  'toggle-sidebar': []
}>()
</script>

<template>
<header class="app-header">
  <div class="header-left">
    <el-button class="hamburger-btn" text circle @click="emit('toggle-sidebar')">
      <el-icon :size="20">
        <component :is="isCollapsed ? Expand : Fold" />
      </el-icon>
    </el-button>
    <div class="logo-container">
      <div class="logo-icon">AI</div>
      <h1 class="site-title">AI 资源导航</h1>
    </div>
  </div>

  <div class="header-right">
    <div class="user-info">
      <span class="username">feibao</span>
      <ElAvatar :size="32" src="" class="avatar">
        <span>F</span>
      </ElAvatar>
    </div>
  </div>
</header>
</template>

<style lang="scss" scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  color: #1a1a1a;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4f8cff 0%, #3a6ffb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(58, 111, 251, 0.3);
}

.site-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #1a1a1a, #4a4a4a);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 6px 4px 12px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.03);
  transition: background 0.2s;
  cursor: pointer;
}

.user-info:hover {
  background: rgba(0, 0, 0, 0.06);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #4a4a4a;
}

.avatar {
  background: linear-gradient(135deg, #4f8cff 0%, #3a6ffb 100%);
  color: #fff;
  font-weight: 600;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.hamburger-btn {
  color: #1a1a1a;
  margin-right: -4px;
}

.hamburger-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #3a6ffb;
}

@media (max-width: 768px) {
  .app-header {
    height: 56px;
    padding: 0 16px;
  }

  .username {
    display: none;
  }

  .user-info {
    padding: 0;
    background: transparent;
  }

  .site-title {
    font-size: 16px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
}
</style>
