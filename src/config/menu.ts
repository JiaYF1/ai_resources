import type { MenuItem } from '@/types/menu'

export const menuConfig: MenuItem[] = [
  {
    id: 'home',
    title: '首页',
    icon: 'HomeFilled',
    path: '/',
  },
  {
    id: 'ai-resources',
    title: 'AI资源',
    icon: 'Link',
    children: [
      {
        id: 'model-summary',
        title: '模型汇总',
        path: '/ai-resources/model-summary',
      },
      {
        id: 'api-resources',
        title: 'API资源库',
        externalLink: 'http://192.168.4.57:3000/login',
      },
    ],
  },
  {
    id: 'ai-knowledge',
    title: 'AI知识库',
    icon: 'Reading',
    children: [
      // {
      //   id: 'ai-concepts',
      //   title: 'AI基本概念',
      //   path: '/ai-knowledge/ai-concepts',
      // },
      {
        id: 'ai-manual',
        title: 'AI应用手册',
        path: '/ai-knowledge/ai-manual',
      },
    ],
  },
]
