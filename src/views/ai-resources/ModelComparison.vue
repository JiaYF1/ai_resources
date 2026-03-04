<script setup lang="ts">
import { ref, provide, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/modelComparison/Sidebar.vue'

const route = useRoute()
const router = useRouter()

const sidebarCollapsed = ref(false)
const panelCount = ref(1)

// 移动端自动折叠侧边栏
const checkMobile = () => {
  if (window.innerWidth <= 768) {
    sidebarCollapsed.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Provide panel count to child routes
provide('panelCount', panelCount)

// Navigate to chat on mount if at root
watch(
  () => route.path,
  (path) => {
    if (path === '/ai-resources/model-comparison' || path === '/ai-resources/model-comparison/') {
      router.replace('/ai-resources/model-comparison/chat')
    }
  },
  { immediate: true }
)
</script>

<template>
<div class="model-comparison-layout">
  <Sidebar v-model:collapsed="sidebarCollapsed" v-model:panel-count="panelCount" />
  <div class="main-content">
    <router-view :panel-count="panelCount" />
  </div>
</div>
</template>

<style scoped>
.model-comparison-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
