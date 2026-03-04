// src/utils/bots/abstract-bot.ts
import type { Message, SendMessageParams } from '@/types/model-comparison'
import { ChatError } from '@/types/model-comparison'


export abstract class AbstractBot {
  /**
   * 子类需要实现具体的请求和流式解析逻辑
   */
  protected abstract doSendMessage(params: SendMessageParams): Promise<void>

  /**
   * 暴露给外部调用的方法，在这里做统一的错误捕获封装
   */
  public async sendMessage(params: SendMessageParams): Promise<void> {
    try {
      await this.doSendMessage(params)
    } catch (err: any) {
      console.error('Bot request failed:', err)
      // 如果是手动中止请求，可以忽略或发送特定错误
      if (params.signal?.aborted) {
        return
      }

      // 包装为统一的 ChatError
      const chatError = err instanceof ChatError
        ? err
        : new ChatError(err.message || '未知错误', 'UNKNOWN')

      params.onEvent({ type: 'ERROR', error: chatError })
    }
  }
}