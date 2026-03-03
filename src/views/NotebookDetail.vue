<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { aiManualConfig, aiConceptsConfig } from '@/config/notebooks';
import type { Notebook, NotebookCategory } from '@/types/notebook';


const route = useRoute();
const categoryKey = route.params.category as string;

// 根据路由路径判断类型
const isManual = computed(() => route.path.includes('ai-manual'));
const config = computed(() => isManual.value ? aiManualConfig : aiConceptsConfig);

// 查找当前分类配置
const category = computed<NotebookCategory | undefined>(() => {
  for (const group of config.value.groups) {
    const found = group.categories.find(cat => cat.key === categoryKey);
    if (found) return found;
  }
  return undefined;
});

// 面包屑返回路径
const breadcrumbPath = computed(() =>
  isManual.value ? '/ai-knowledge/ai-manual' : '/ai-knowledge/ai-concepts'
);

// 面包屑标题
const breadcrumbTitle = computed(() =>
  isManual.value ? 'AI应用手册' : 'AI基本概念'
);

// Markdown预览相关
const id = 'notebook-preview';
const content = ref('# 请从左侧选择笔记');
const scrollElement = ref<HTMLElement | null>(null);

// 当前选中的笔记
const currentNotebook = ref<Notebook | null>(null);

// 将笔记列表转换为el-tree需要的格式
const treeData = computed(() => {
  if (!category.value) return [];
  return category.value.notebooks.map((notebook: Notebook) => ({
    id: notebook.id,
    label: notebook.name,
    data: notebook
  }));
});

// 从 public/notebooks 加载文件
const loadMarkdown = async (src: string) => {
  try {
    content.value = '# 加载中...';
    const response = await fetch(src);
    let text = await response.text();

    // 修复图片相对路径
    const baseDir = src.substring(0, src.lastIndexOf('/'));
    text = text.replace(
      /!\[(.*?)\]\((\.\/)?images\/(.*?)\)/g,
      `![$1](${baseDir}/images/$3)`
    );

    content.value = text;
  } catch (error) {
    console.error('加载文档失败:', error);
    content.value = '# 文件加载失败\n\n无法加载该笔记，请检查文件路径是否正确。';
  }
};

// 点击树节点，加载对应笔记
const handleNodeClick = (data: any) => {
  const notebook = data.data as Notebook;
  currentNotebook.value = notebook;
  loadMarkdown(notebook.path);
};

onMounted(() => {
  scrollElement.value = document.querySelector('.content-area') as HTMLElement;

  // 默认加载第一篇笔记
  const firstNotebook = category.value?.notebooks[0];
  if (firstNotebook) {
    currentNotebook.value = firstNotebook;
    loadMarkdown(firstNotebook.path);
  }
});
</script>

<template>
  <div class="notebook-detail">
    <!-- 顶部面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: breadcrumbPath }">
          {{ breadcrumbTitle }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ category?.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 主体内容区 -->
    <div class="main-container">
      <!-- 左侧目录树 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="category-info">
            <span class="category-icon">{{ category?.icon }}</span>
            <span class="category-name">{{ category?.name }}</span>
          </div>
          <p class="category-desc">{{ category?.description }}</p>
        </div>

        <div class="tree-container">
          <el-tree
            :data="treeData"
            :props="{ label: 'label' }"
            node-key="id"
            :default-expanded-keys="[treeData[0]?.id]"
            :current-node-key="currentNotebook?.id"
            :highlight-current="true"
            @node-click="handleNodeClick"
          >
            <template #default="{ node }">
              <span class="tree-node">
                <el-icon><Document /></el-icon>
                <span class="node-label">{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-wrapper">
        <div class="content-area">
          <MdPreview :editorId="id" :modelValue="content" />
        </div>

        <!-- 右侧目录 -->
        <div class="catalog-wrapper">
          <div class="catalog-title">目录</div>
          <MdCatalog
            v-if="scrollElement"
            :editorId="id"
            :scrollElement="scrollElement"
            :scrollIntoViewOptions="{ behavior: 'smooth' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notebook-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.breadcrumb {
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// 左侧边栏
.sidebar {
  width: 280px;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.category-icon {
  font-size: 24px;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.category-desc {
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
  margin: 0;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;

  .el-icon {
    color: #909399;
  }
}

:deep(.el-tree-node__content) {
  height: 36px;
  border-radius: 4px;

  &:hover {
    background-color: #f5f7fa;
  }
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #ecf5ff;
  color: #409eff;

  .el-icon {
    color: #409eff;
  }
}

// 右侧内容区
.content-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #fff;
  margin: 16px;
  margin-right: 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.catalog-wrapper {
  width: 240px;
  padding: 24px 16px;
  background-color: #fff;
  margin: 16px;
  margin-left: 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

.catalog-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
  color: #303133;
}

// 响应式设计
@media (max-width: 1200px) {
  .catalog-wrapper {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-height: 200px;
  }

  .content-area {
    margin: 8px;
  }
}
</style>
