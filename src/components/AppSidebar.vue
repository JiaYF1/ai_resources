<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { HomeFilled, Link, Reading } from '@element-plus/icons-vue'
import { menuConfig } from '@/config/menu'
import type { MenuItem } from '@/types/menu'

const router = useRouter()
const route = useRoute()

const iconMap: Record<string, typeof HomeFilled> = {
  HomeFilled,
  Link,
  Reading,
}

const activeMenu = computed(() => route.path)

function handleMenuSelect(index: string) {
  router.push(index)
}

function getDefaultOpeneds(): string[] {
  return menuConfig.filter((item) => item.children).map((item) => item.id)
}
</script>

<template>
  <el-menu
    :default-active="activeMenu"
    :default-openeds="getDefaultOpeneds()"
    class="app-sidebar"
    @select="handleMenuSelect"
  >
    <template v-for="item in menuConfig" :key="item.id">
      <!-- 有子菜单 -->
      <el-sub-menu v-if="item.children" :index="item.id">
        <template #title>
          <el-icon v-if="item.icon">
            <component :is="iconMap[item.icon]" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.id"
          :index="child.path!"
        >
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>

      <!-- 无子菜单 -->
      <el-menu-item v-else :index="item.path!">
        <el-icon v-if="item.icon">
          <component :is="iconMap[item.icon]" />
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped>
.app-sidebar {
  height: 100%;
  border-right: none;
}
</style>
