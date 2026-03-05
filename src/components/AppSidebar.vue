<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { HomeFilled, Link, Reading } from '@element-plus/icons-vue'
import { menuConfig } from '@/config/menu'
import type { MenuItem } from '@/types/menu'

defineProps<{
  isCollapsed?: boolean
}>()

const router = useRouter()
const route = useRoute()

const iconMap: Record<string, typeof HomeFilled> = {
  HomeFilled,
  Link,
  Reading,
}

// 根据当前路由计算应该高亮的菜单项
const activeMenu = computed(() => {
  const path = route.path;

  // 如果是笔记详情页，返回对应的父路由
  if (path.includes('/ai-knowledge/ai-manual/')) {
    return '/ai-knowledge/ai-manual';
  }
  if (path.includes('/ai-knowledge/ai-concepts/')) {
    return '/ai-knowledge/ai-concepts';
  }
  if (path.includes('/model-comparison/')) {
    return '/ai-resources/model-comparison';
  }
  // 其他情况直接返回当前路径
  return path;
})

function handleMenuSelect(index: string) {
  router.push(index)
}

function getDefaultOpeneds(): string[] {
  return menuConfig.filter((item) => item.children).map((item) => item.id)
}
</script>

<template><el-menu :default-active="activeMenu" :default-openeds="getDefaultOpeneds()" class="app-sidebar" :collapse="isCollapsed"
  :collapse-transition="false" @select="handleMenuSelect">
  <template v-for="item in menuConfig" :key="item.id">
    <!-- 有子菜单 -->
    <el-sub-menu v-if="item.children" :index="item.id">
      <template #title>
        <el-icon v-if="item.icon" class="menu-icon">
          <component :is="iconMap[item.icon]" />
        </el-icon>
        <span class="menu-title">{{ item.title }}</span>
      </template>
      <el-menu-item v-for="child in item.children" :key="child.id" :index="child.path!" class="sub-menu-item">
        <span class="dot-icon" />
        <span class="menu-title">{{ child.title }}</span>
      </el-menu-item>
    </el-sub-menu>

    <!-- 无子菜单 -->
    <el-menu-item v-else :index="item.path!" class="menu-item">
      <el-icon v-if="item.icon" class="menu-icon">
        <component :is="iconMap[item.icon]" />
      </el-icon>
      <template #title>
        <span class="menu-title">{{ item.title }}</span>
      </template>
    </el-menu-item>
  </template>
</el-menu></template>

<style lang="scss" scoped>
.app-sidebar {
  height: 100%;
  border-right: none;
  background-color: transparent;
  padding: 12px;
  transition: all 0.3s;



  &.el-menu--collapse {
    padding: 12px 4px;
    width: 64px;

    .menu-icon {
      margin-right: 0;
    }

    :deep(.el-sub-menu__icon-arrow) {
      display: none;
    }
  }

  :deep(.el-sub-menu__title) {
    height: 48px;
    line-height: 48px;
    border-radius: 10px;
    margin-bottom: 4px;
    color: #4a4a4a;
    font-weight: 500;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: #1a1a1a;
    }
  }

  .menu-icon {
    font-size: 18px;
    margin-right: 12px;
    color: #8c8c8c;
    transition: color 0.3s;
  }

  .menu-title {
    font-size: 14px;
    transition: opacity 0.3s;
  }

  .el-menu-item {
    height: 44px;
    line-height: 44px;
    border-radius: 10px;
    margin-bottom: 4px;
    color: #4a4a4a;
    padding-left: 44px !important;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: #1a1a1a;

      .menu-icon {
        color: #3a6ffb;
      }
    }

    &.is-active {
      background: linear-gradient(135deg, rgba(79, 140, 255, 0.1) 0%, rgba(58, 111, 251, 0.1) 100%);
      color: #3a6ffb;
      font-weight: 600;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 12px;
        bottom: 12px;
        width: 4px;
        background: #3a6ffb;
        border-radius: 0 4px 4px 0;
      }

      .menu-icon {
        color: #3a6ffb;
      }

      .dot-icon {
        background-color: #3a6ffb;
        transform: scale(1.2);
      }
    }
  }

  .menu-item {
    padding-left: 16px !important;
  }

  &.el-menu--collapse {
    .el-menu-item {
      padding-left: 18px !important;
      justify-content: center;
    }

    .menu-item {
      padding-left: 18px !important;
    }
  }

  .dot-icon {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #bfbfbf;
    border-radius: 50%;
    margin-right: 12px;
    transition: all 0.3s;
  }

  :deep(.el-sub-menu.is-active) {
    .el-sub-menu__title {
      color: #3a6ffb;

      .menu-icon {
        color: #3a6ffb;
      }
    }
  }
}

// 适配 Element Plus 的一些内置样式
:deep(.el-menu) {
  border-right: none;
  background-color: transparent;
}
</style>
