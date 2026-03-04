import type { ModelConfig, SidebarMenuItem } from '@/types/model-comparison'

// ─── Available Models ────────────────────────────────────────────────────────

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    shortName: 'GPT-4o',
    provider: 'openai',
    modelId: 'gpt-4o',
    color: '#10a37f',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    shortName: 'GPT-4o Mini',
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    color: '#10a37f',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    shortName: 'Claude',
    provider: 'anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    color: '#cc8b3c',
    logo: 'https://www.anthropic.com/favicon.ico',
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    shortName: 'Opus',
    provider: 'anthropic',
    modelId: 'claude-3-opus-20240229',
    color: '#cc8b3c',
    logo: 'https://www.anthropic.com/favicon.ico',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    shortName: 'Gemini',
    provider: 'gemini',
    modelId: 'gemini-1.5-pro',
    color: '#4285f4',
    logo: 'https://www.google.com/favicon.ico',
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    shortName: 'Gemini 2',
    provider: 'gemini',
    modelId: 'gemini-2.0-flash',
    color: '#4285f4',
    logo: 'https://www.google.com/favicon.ico',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    shortName: 'DeepSeek',
    provider: 'deepseek',
    modelId: 'deepseek-chat',
    color: '#6366f1',
    logo: 'https://www.deepseek.com/favicon.ico',
  },
]

// ─── Sidebar Menu Config ─────────────────────────────────────────────────────

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  {
    id: 'model-compare',
    name: '模型对比',
    icon: 'Grid',
    children: [
      { id: 'compare-1', name: '单模型', icon: 'Monitor', panelCount: 1 },
      { id: 'compare-2', name: '双模型', icon: 'CopyDocument', panelCount: 2 },
      { id: 'compare-3', name: '三模型', icon: 'Menu', panelCount: 3 },
      { id: 'compare-4', name: '四模型', icon: 'Grid', panelCount: 4 },
    ],
  },
  {
    id: 'tools',
    name: '工具',
    icon: 'Tools',
    children: [
      { id: 'image-gen', name: '图像生成', icon: 'Picture', route: '/ai-resources/model-comparison/image-generator' },
    ],
  },
  {
    id: 'history',
    name: '历史记录',
    icon: 'Clock',
    route: '/ai-resources/model-comparison/history',
  },
]

// ─── Default Models for Panels ───────────────────────────────────────────────

export const DEFAULT_PANEL_MODELS = ['deepseek-v3', 'gpt-4o', 'claude-3-5-sonnet', 'gemini-1-5-pro']

// ─── Helper Functions ────────────────────────────────────────────────────────

export function getModelById(id: string): ModelConfig | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === id)
}

export function getModelsByProvider(provider: string): ModelConfig[] {
  return AVAILABLE_MODELS.filter((m) => m.provider === provider)
}
