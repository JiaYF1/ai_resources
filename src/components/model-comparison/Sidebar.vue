<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Fold,
  Expand,
  Grid,
  Monitor,
  CopyDocument,
  Menu,
  Picture,
  Clock,
  ChatDotRound,
} from '@element-plus/icons-vue'
import { SIDEBAR_MENU } from '@/config/models'

const props = defineProps<{
  collapsed: boolean
  panelCount: number
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  'update:panelCount': [value: number]
}>()

const router = useRouter()
const route = useRoute()

const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed)
}

// Icon mapping
const iconMap: Record<string, any> = {
  Grid,
  Monitor,
  CopyDocument,
  Menu,
  Picture,
  Clock,
  ChatDotRound,
  Tools: Grid,
}

const getIcon = (iconName: string) => iconMap[iconName] || Grid

const handleMenuClick = (item: any) => {
  if (item.panelCount !== undefined) {
    emit('update:panelCount', item.panelCount)
    // Navigate to chat view
    router.push('/ai-resources/model-comparison/chat')
  } else if (item.route) {
    router.push(item.route)
  }
}

const isActive = (item: any) => {
  if (item.panelCount !== undefined) {
    return route.path.includes('/chat') && props.panelCount === item.panelCount
  }
  return item.route && route.path === item.route
}
</script>

<template>
  <div class="sidebar" :class="{ collapsed }">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="title" v-show="!collapsed">
        <el-icon :size="20"><ChatDotRound /></el-icon>
        <span>模型工具箱</span>
      </div>
      <el-button class="collapse-btn" text @click="toggleCollapse">
        <el-icon :size="18">
          <Fold v-if="!collapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>
    </div>

    <!-- Menu -->
    <div class="sidebar-menu">
      <template v-for="section in SIDEBAR_MENU" :key="section.id">
        <!-- Section Title -->
        <div class="menu-section" v-if="!collapsed">
          <el-icon :size="14"><component :is="getIcon(section.icon)" /></el-icon>
          <span>{{ section.name }}</span>
        </div>
        <el-divider v-else class="section-divider" />

        <!-- Section Items -->
        <template v-if="section.children">
          <div
            v-for="child in section.children"
            :key="child.id"
            class="menu-item"
            :class="{ active: isActive(child) }"
            @click="handleMenuClick(child)"
          >
            <el-icon :size="18"><component :is="getIcon(child.icon || section.icon)" /></el-icon>
            <span v-show="!collapsed">{{ child.name }}</span>
            <!-- <span v-if="!collapsed && child.panelCount" class="panel-badge">{{ child.panelCount }}</span> -->
          </div>
        </template>

        <!-- Direct link item -->
        <div
          v-else
          class="menu-item"
          :class="{ active: isActive(section) }"
          @click="handleMenuClick(section)"
        >
          <el-icon :size="18"><component :is="getIcon(section.icon)" /></el-icon>
          <span v-show="!collapsed">{{ section.name }}</span>
        </div>
      </template>
    </div>

    <!-- Footer -->
    <!-- <div class="sidebar-footer">
      <div class="menu-item" @click="$router.push('/ai-resources/model-comparison/settings')">
        <el-icon :size="18"><Setting /></el-icon>
        <span v-show="!collapsed">设置</span>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Setting } from '@element-plus/icons-vue'
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: 100%;
  /* use semantic background color so sidebar is slightly lighter than the global sidebar */
  background: var(--color-background-soft);
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease, background-color 0.3s;
  overflow: hidden;
  border-right: 1px solid var(--color-border);
}

.sidebar.collapsed {
  width: 60px;
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  /* inherit main text color for theme consistency */
  color: var(--color-text);
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.collapse-btn {
  color: var(--color-text);
  opacity: 0.7;
  padding: 8px;
}

.collapse-btn:hover {
  opacity: 1;
  background: var(--color-background-soft);
}

.collapsed .sidebar-header {
  justify-content: center;
  padding: 16px 8px;
}

/* Menu */
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.menu-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px 6px;
  /* adapt to theme text color */
  color: var(--color-text);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-divider {
  margin: 8px 0;
  border-color: rgba(255, 255, 255, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin: 2px 0;
  border-radius: 8px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.menu-item:hover {
  background: var(--color-background-soft);
  color: var(--color-text);
}

.menu-item.active {
  background: rgba(121, 187, 255, 0.2);
  color: var(--el-color-primary);
}

.collapsed .menu-item {
  justify-content: center;
  padding: 12px;
}

.panel-badge {
  margin-left: auto;
  background: var(--el-color-primary);
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* Footer */
.sidebar-footer {
  padding: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
