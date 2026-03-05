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
  Setting,
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
  <div class="model-sidebar" :class="{ collapsed }">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="title-area" v-show="!collapsed">
        <div class="icon-box">
          <el-icon :size="16"><ChatDotRound /></el-icon>
        </div>
        <span>模型对比</span>
      </div>
      <el-button class="collapse-btn" text circle @click="toggleCollapse">
        <el-icon :size="16">
          <component :is="collapsed ? Expand : Fold" />
        </el-icon>
      </el-button>
    </div>

    <!-- Menu Scroll Area -->
    <div class="menu-scroll-area">
      <div class="sidebar-menu">
        <template v-for="section in SIDEBAR_MENU" :key="section.id">
          <!-- Section Title -->
          <div class="menu-section-label" v-if="!collapsed">
            {{ section.name }}
          </div>
          <div v-else class="section-divider-mini" />

          <!-- Section Items -->
          <div class="section-items">
            <template v-if="section.children">
              <div
                v-for="child in section.children"
                :key="child.id"
                class="menu-item"
                :class="{ active: isActive(child) }"
                @click="handleMenuClick(child)"
                :title="collapsed ? child.name : ''"
              >
                <div class="item-icon">
                  <el-icon :size="18"><component :is="getIcon(child.icon || section.icon)" /></el-icon>
                </div>
                <span v-show="!collapsed" class="item-name">{{ child.name }}</span>
                <div v-if="!collapsed && child.panelCount" class="count-badge">{{ child.panelCount }}</div>
              </div>
            </template>

            <!-- Direct link item -->
            <div
              v-else
              class="menu-item"
              :class="{ active: isActive(section) }"
              @click="handleMenuClick(section)"
              :title="collapsed ? section.name : ''"
            >
              <div class="item-icon">
                <el-icon :size="18"><component :is="getIcon(section.icon)" /></el-icon>
              </div>
              <span v-show="!collapsed" class="item-name">{{ section.name }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.model-sidebar {
  width: 200px;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  z-index: 5;
}

.model-sidebar.collapsed {
  width: 64px;
}

/* Header */
.sidebar-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  flex-shrink: 0;
}

.collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.icon-box {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, rgba(79, 140, 255, 0.1) 0%, rgba(58, 111, 251, 0.1) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3a6ffb;
}

.collapse-btn {
  color: #8c8c8c;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    color: #1a1a1a;
  }
}

/* Menu */
.menu-scroll-area {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none; // Firefox
  
  &::-webkit-scrollbar {
    display: none; // Chrome/Safari
  }
}

.sidebar-menu {
  padding: 12px 8px;
}

.menu-section-label {
  padding: 16px 12px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #bfbfbf;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-divider-mini {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.04);
  margin: 12px 8px;
}

.section-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
    color: #1a1a1a;
    
    .item-icon {
      color: #3a6ffb;
    }
  }

  &.active {
    background-color: rgba(58, 111, 251, 0.08);
    color: #3a6ffb;
    font-weight: 600;

    .item-icon {
      color: #3a6ffb;
    }
    
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 10px;
      bottom: 10px;
      width: 3px;
      background-color: #3a6ffb;
      border-radius: 4px 0 0 4px;
    }
  }
}

.collapsed .menu-item {
  justify-content: center;
  padding: 12px;
  
  .item-icon {
    margin: 0;
  }
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  transition: color 0.2s;
}

.item-name {
  font-size: 13.5px;
}

.count-badge {
  margin-left: auto;
  font-size: 10px;
  background-color: rgba(0, 0, 0, 0.04);
  color: #8c8c8c;
  padding: 1px 6px;
  border-radius: 6px;
  font-weight: 700;
}

.active .count-badge {
  background-color: rgba(58, 111, 251, 0.2);
  color: #3a6ffb;
}
</style>