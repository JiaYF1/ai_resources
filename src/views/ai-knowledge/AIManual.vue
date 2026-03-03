<script setup lang="ts">
import { useRouter } from 'vue-router';
import { aiManualConfig } from '@/config/notebooks';

const router = useRouter();

// 点击分类卡片，跳转到笔记详情页
const goToCategory = (categoryKey: string) => {
  router.push(`/ai-knowledge/ai-manual/${categoryKey}`);
};
</script>

<template>
  <div class="ai-manual">
    <h2>AI应用手册</h2>
    <p class="page-desc">学习如何在实际工作和学习中应用 AI 工具</p>

    <!-- 遍历大分类 -->
    <div v-for="group in aiManualConfig.groups" :key="group.id" class="group-section">
      <h3 class="group-title">{{ group.name }}</h3>

      <!-- 遍历小分类，用卡片展示 -->
      <div class="category-grid">
        <el-card
          v-for="category in group.categories"
          :key="category.key"
          class="category-card"
          shadow="hover"
          @click="goToCategory(category.key)"
        >
          <div class="card-content">
            <div class="card-icon">{{ category.icon }}</div>
            <h4 class="card-title">{{ category.name }}</h4>
            <p class="card-desc">{{ category.description }}</p>
            <div class="card-footer">
              <span class="notebook-count">{{ category.notebooks.length }} 篇笔记</span>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </div>
    </div>
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

.group-section {
  margin-bottom: 40px;
}

.group-title {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e4e7ed;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.category-card {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #409eff;
  }
}

.card-content {
  text-align: center;
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.card-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
  min-height: 44px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.notebook-count {
  font-size: 13px;
  color: #909399;
}

.arrow-icon {
  color: #409eff;
  font-size: 16px;
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
