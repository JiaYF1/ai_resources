<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { NotebookGroup } from '@/types/notebook';

const props = withDefaults(defineProps<{
  groups: NotebookGroup[];
  themeColor?: string;
  routeBase: string;
}>(), {
  themeColor: '#409eff'
});

const router = useRouter();

const goToCategory = (categoryKey: string, notebookCount: number) => {
  if (notebookCount > 0) {
    router.push(`${props.routeBase}/${categoryKey}`);
  }
};
</script>

<template>
  <div class="notebook-category-grid" :style="{ '--theme-color': themeColor }">
    <div v-for="group in groups" :key="group.id" class="group-section">
      <h3 class="group-title">{{ group.name }}</h3>

      <div class="category-grid">
        <el-card
          v-for="category in group.categories"
          :key="category.key"
          class="category-card"
          shadow="hover"
          @click="goToCategory(category.key, category.notebooks.length)"
        >
          <div class="card-content">
            <div class="card-icon">
              <img v-if="category.icon && category.icon.startsWith('/')" :src="category.icon" :alt="category.name" class="card-icon-img" />
              <span v-else>{{ category.icon }}</span>
            </div>
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
.notebook-category-grid {
  --theme-color: #409eff;
}

.group-section {
  margin-bottom: 40px;
}

.group-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--theme-color);
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
    border-color: var(--theme-color);
  }
}

.category-card :deep(.el-card__body) {
  height: 100%;
}

.card-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  flex-shrink: 0;
}

.card-icon-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
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
  flex: 1;
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
  color: var(--theme-color);
  font-size: 16px;
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
