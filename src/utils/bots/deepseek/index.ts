import { AbstractBot } from '../abstract-bot'
import type { SendMessageParams } from '@/types/model-comparison'
import { ChatError } from '@/types/model-comparison'
import { parseSSEResponse } from '@/utils/sse'

export class DeepSeekBot extends AbstractBot {
  protected async doSendMessage(params: SendMessageParams): Promise<void> {
    const { messages, apiKey, modelId, signal, onEvent } = params

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      if (res.status === 401) {
        throw new ChatError('API Key 无效或未授权', 401)
      } else if (res.status === 429) {
        throw new ChatError('请求频率超限，请稍后再试', 429)
      }
      throw new ChatError(errData.error?.message || `DeepSeek 请求失败 (${res.status})`, res.status)
    }

    await parseSSEResponse(res, (data) => {
      try {
        const parsed = JSON.parse(data)
        const text = parsed.choices?.[0]?.delta?.content
        if (text) {
          onEvent({ type: 'UPDATE', text })
        }
      } catch (e) {
        console.warn('Failed to parse DeepSeek SSE chunk', data)
      }
    })

    onEvent({ type: 'DONE' })
  }
}
