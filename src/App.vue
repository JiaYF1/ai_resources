<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'

const route = useRoute()
const MOBILE_BREAKPOINT = 768

const isMobile = ref(false)
const sidebarVisible = ref(true) // Mobile: drawer visible/hidden
const isCollapsed = ref(false) // Desktop: width 260px or 64px

const checkMobile = () => {
  const mobile = window.innerWidth <= MOBILE_BREAKPOINT
  isMobile.value = mobile
  if (mobile) {
    sidebarVisible.value = false
    isCollapsed.value = false
  } else {
    sidebarVisible.value = true
  }
}

const toggleSidebar = () => {
  if (isMobile.value) {
    sidebarVisible.value = !sidebarVisible.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
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
  <AppHeader :is-mobile="isMobile" :is-collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />
  <div class="app-body">
    <!-- 移动端遮罩层 -->
    <transition name="fade">
      <div v-if="isMobile && sidebarVisible" class="sidebar-overlay" @click="closeSidebar" />
    </transition>

    <aside class="app-aside" :class="{
      'mobile-hidden': isMobile && !sidebarVisible,
      'mobile-visible': isMobile && sidebarVisible,
      'is-collapsed': isCollapsed && !isMobile
    }">
      <AppSidebar :is-collapsed="isCollapsed && !isMobile" />
    </aside>

    <main class="app-main">
      <div class="page-container">
        <RouterView v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </main>
  </div>
</div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
  color: #1a1a1a;
  overflow: hidden;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.app-aside {
  width: 260px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  overflow-y: auto;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.app-aside.is-collapsed {
  width: 64px;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.page-container {
  width: 100%;
  height: 100%;
}

/* 移动端侧边栏 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 998;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .app-aside {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 260px !important;
    z-index: 999;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
