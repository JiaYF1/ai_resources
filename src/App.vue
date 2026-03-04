<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'

const route = useRoute()
const MOBILE_BREAKPOINT = 768

const isMobile = ref(false)
const sidebarVisible = ref(true)

const checkMobile = () => {
  const mobile = window.innerWidth <= MOBILE_BREAKPOINT
  isMobile.value = mobile
  if (mobile) {
    sidebarVisible.value = false
  } else {
    sidebarVisible.value = true
  }
}

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    sidebarVisible.value = false
  }
}

// 路由切换时自动关闭移动端侧边栏
watch(() => route.path, () => {
  if (isMobile.value) {
    sidebarVisible.value = false
  }
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="app-layout">
    <AppHeader :is-mobile="isMobile" @toggle-sidebar="toggleSidebar" />
    <div class="app-body">
      <!-- 移动端遮罩层 -->
      <div
        v-if="isMobile && sidebarVisible"
        class="sidebar-overlay"
        @click="closeSidebar"
      />
      <aside
        class="app-aside"
        :class="{ 'mobile-hidden': isMobile && !sidebarVisible, 'mobile-visible': isMobile && sidebarVisible }"
      >
        <AppSidebar />
      </aside>
      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.app-aside {
  width: 220px;
  flex-shrink: 0;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
  position: relative;
}

/* 移动端侧边栏 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
}

@media (max-width: 768px) {
  .app-aside {
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    z-index: 999;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  }

  .app-aside.mobile-hidden {
    transform: translateX(-100%);
  }

  .app-aside.mobile-visible {
    transform: translateX(0);
  }

  .app-main {
    width: 100%;
  }
}
</style>
