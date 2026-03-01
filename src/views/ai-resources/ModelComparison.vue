<script setup lang="ts">
const comparisonData = [
  {
    name: 'ChatGPT (GPT-4o)',
    contextWindow: '128K',
    multimodal: '支持',
    codeAbility: '优秀',
    chineseSupport: '良好',
    openSource: '否',
    price: '付费/免费版',
  },
  {
    name: 'Claude (Opus 4)',
    contextWindow: '200K',
    multimodal: '支持',
    codeAbility: '优秀',
    chineseSupport: '良好',
    openSource: '否',
    price: '付费/免费版',
  },
  {
    name: 'Gemini Pro',
    contextWindow: '1M',
    multimodal: '支持',
    codeAbility: '良好',
    chineseSupport: '良好',
    openSource: '否',
    price: '付费/免费版',
  },
  {
    name: 'DeepSeek V3',
    contextWindow: '128K',
    multimodal: '支持',
    codeAbility: '优秀',
    chineseSupport: '优秀',
    openSource: '是',
    price: '免费/API付费',
  },
  {
    name: '通义千问',
    contextWindow: '128K',
    multimodal: '支持',
    codeAbility: '良好',
    chineseSupport: '优秀',
    openSource: '部分开源',
    price: '免费/API付费',
  },
]
</script>

<template>
  <div class="model-comparison">
    <h2>模型对比</h2>
    <p class="page-desc">对比主流 AI 大模型的核心能力与特性</p>
    <el-table :data="comparisonData" stripe border style="width: 100%">
      <el-table-column prop="name" label="模型名称" width="180" fixed />
      <el-table-column prop="contextWindow" label="上下文窗口" width="130" align="center" />
      <el-table-column prop="multimodal" label="多模态" width="100" align="center" />
      <el-table-column prop="codeAbility" label="代码能力" width="110" align="center" />
      <el-table-column prop="chineseSupport" label="中文支持" width="110" align="center" />
      <el-table-column prop="openSource" label="开源" width="110" align="center" />
      <el-table-column prop="price" label="定价" min-width="130" align="center" />
    </el-table>
  </div>
</template>

<style scoped>
.model-comparison {
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
</style>
