<script setup lang="ts">
</script>

<template>
  <div class="ai-manual">
    <h2>AI应用手册</h2>
    <p class="page-desc">学习如何在实际工作和学习中应用 AI 工具</p>
    <div class="content-placeholder">
      <el-empty description="学习笔记加载中，请添加 Markdown 文档" />
    </div>
  </div>
</template>

<style scoped>
.ai-manual {
  padding: 24px;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.page-desc {
  color: #909399;
  font-size: 14px;
  margin-bottom: 24px;
}

.content-placeholder {
  padding: 60px 0;
}
</style>
