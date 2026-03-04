<script setup lang="ts">
import { aiManualConfig } from '@/config/notebooks';
import NotebookCategoryGrid from '@/components/NotebookCategoryGrid.vue';
</script>

<template>
  <div class="ai-manual">
    <h2>AI应用手册</h2>
    <p class="page-desc">学习如何在实际工作和学习中应用 AI 工具</p>

    <NotebookCategoryGrid
      :groups="aiManualConfig.groups"
      theme-color="#409eff"
      route-base="/ai-knowledge/ai-manual"
    />
  </div>
</template>

<style lang="scss" scoped>
.ai-manual {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

h2 {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.page-desc {
  color: #909399;
  font-size: 14px;
  margin-bottom: 32px;
}
</style>
