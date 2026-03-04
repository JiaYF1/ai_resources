// ─── Message Types ───────────────────────────────────────────────────────────

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// ─── Model Types ─────────────────────────────────────────────────────────────

export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'deepseek'

export interface ModelConfig {
  id: string
  name: string
  shortName: string
  provider: ProviderType
  modelId: string
  color: string
  logo: string
}

// ─── Conversation Types ──────────────────────────────────────────────────────

export interface Conversation {
  id: string
  title: string
  modelId: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface ChatSession {
  id: string
  title: string
  panelCount: number
  panels: ChatPanel[]
  createdAt: number
  updatedAt: number
}

export interface ChatPanel {
  id: string
  modelId: string
  messages: Message[]
}

// ─── Sidebar Types ───────────────────────────────────────────────────────────

export interface SidebarMenuItem {
  id: string
  name: string
  icon: string
  route?: string
  children?: SidebarMenuChild[]
}

export interface SidebarMenuChild {
  id: string
  name: string
  icon?: string
  route?: string
  panelCount?: number
}

// ─── API Types ───────────────────────────────────────────────────────────────

export interface ApiKeys {
  openai: string
  anthropic: string
  gemini: string
  deepseek: string
}

export const PROVIDER_LABELS: Record<ProviderType, string> = {
  openai: 'OpenAI API Key',
  anthropic: 'Anthropic API Key',
  gemini: 'Google Gemini API Key',
  deepseek: 'DeepSeek API Key',
}
