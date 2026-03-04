<script setup lang="ts">
</script>

<template>
  <div class="home-view">
    <h2>欢迎来到 AI 资源导航</h2>
    <p class="desc">在这里你可以浏览各类 AI 网站资源、查阅学习笔记，快速找到你需要的 AI 工具和知识。</p>
    <div class="quick-cards">
      <router-link to="/ai-resources/model-summary" class="card">
        <h3>模型汇总</h3>
        <p>收录主流 AI 模型，一键直达官网</p>
      </router-link>
      <router-link to="/ai-resources/model-comparison" class="card">
        <h3>模型对比</h3>
        <p>对比不同 AI 模型的特性与能力</p>
      </router-link>
      <router-link to="/ai-knowledge/ai-concepts" class="card">
        <h3>AI基本概念</h3>
        <p>了解 AI 领域的核心概念和术语</p>
      </router-link>
      <router-link to="/ai-knowledge/ai-manual" class="card">
        <h3>AI应用手册</h3>
        <p>学习如何在实际场景中应用 AI</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: var(--spacing-page, 40px);
}

h2 {
  font-size: var(--font-size-h1, 28px);
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.desc {
  color: #909399;
  font-size: var(--font-size-body, 15px);
  margin-bottom: 32px;
}

.quick-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-card, 20px);
}

.card {
  display: block;
  padding: var(--spacing-card, 24px);
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.card h3 {
  font-size: var(--font-size-h3, 18px);
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.card p {
  font-size: var(--font-size-small, 14px);
  color: #909399;
  margin: 0;
}

@media (max-width: 768px) {
  .quick-cards {
    grid-template-columns: 1fr;
  }
}
</style>
