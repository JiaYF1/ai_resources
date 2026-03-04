

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



// 统一的错误类
export class ChatError extends Error {
  constructor(message: string, public code?: string | number) {
    super(message)
    this.name = 'ChatError'
  }
}

// 定义流式输出的事件类型
export type ChatEvent =
  | { type: 'UPDATE'; text: string }  // 收到新的增量文本
  | { type: 'DONE' }                  // 回复结束
  | { type: 'ERROR'; error: ChatError } // 发生错误

// 发送消息的参数，新增 onEvent 回调和 signal 用于中断请求
export interface SendMessageParams {
  messages: Message[]
  apiKey: string
  modelId: string
  signal?: AbortSignal
  onEvent: (event: ChatEvent) => void
}