import type { ProviderType } from '@/types/model-comparison'
import { AbstractBot } from './abstract-bot'
import { OpenAIBot } from './openai'
import { AnthropicBot } from './anthropic'
import { GeminiBot } from './gemini'
import { DeepSeekBot } from './deepseek'

export * from './abstract-bot'

// 通过单例或者按需实例化，这里采用每次调用/按需返回实例的方式
export function getBot(provider: ProviderType): AbstractBot {
  switch (provider) {
    case 'openai':
      return new OpenAIBot()
    case 'anthropic':
      return new AnthropicBot()
    case 'gemini':
      return new GeminiBot()
    case 'deepseek':
      return new DeepSeekBot()
    default:
      throw new Error(`尚不支持的 Provider: ${provider}`)
  }
}