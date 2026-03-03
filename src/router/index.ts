import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/ai-resources',
      children: [
        {
          path: 'model-summary',
          name: 'model-summary',
          component: () => import('@/views/ai-resources/ModelSummary.vue'),
        },
        {
          path: 'model-comparison',
          name: 'model-comparison',
          component: () => import('@/views/ai-resources/ModelComparison.vue'),
        },
      ],
    },
    {
      path: '/ai-knowledge',
      children: [
        {
          path: 'ai-concepts',
          name: 'ai-concepts',
          component: () => import('@/views/ai-knowledge/AIConcepts.vue'),
        },
        {
          path: 'ai-concepts/:category',
          name: 'ai-concepts-detail',
          component: () => import('@/views/NotebookDetail.vue'),
        },
        {
          path: 'ai-manual',
          name: 'ai-manual',
          component: () => import('@/views/ai-knowledge/AIManual.vue'),
        },
        {
          path: 'ai-manual/:category',
          name: 'ai-manual-detail',
          component: () => import('@/views/NotebookDetail.vue'),
        },
      ],
    },
  ],
})

export default router
