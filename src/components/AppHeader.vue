<script setup lang="ts">
import { ElAvatar } from 'element-plus'
</script>

<template>
  <div class="app-header">
    <div class="header-left">
      <h1 class="site-title">AI 资源导航</h1>
    </div>
    <div class="header-right">
      <span class="username">探索者</span>
      <ElAvatar :size="36" src="" class="avatar">
        <span>U</span>
      </ElAvatar>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #1d1e1f;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.site-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-size: 14px;
  color: #cfd3dc;
}

.avatar {
  background-color: #409eff;
  color: #fff;
}
</style>
