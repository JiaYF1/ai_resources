<script setup lang="ts">
import { aiConceptsConfig } from '@/config/notebooks';
import NotebookCategoryGrid from '@/components/NotebookCategoryGrid.vue';
</script>

<template>
  <div class="ai-concepts">
    <h2>AI基本概念</h2>
    <p class="page-desc">了解人工智能领域的核心概念与基础知识</p>

    <NotebookCategoryGrid
      :groups="aiConceptsConfig.groups"
      theme-color="#67c23a"
      route-base="/ai-knowledge/ai-concepts"
    />
  </div>
</template>

<style lang="scss" scoped>
.ai-concepts {
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
