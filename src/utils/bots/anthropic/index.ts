import { AbstractBot } from '../abstract-bot'
import type { SendMessageParams } from '@/types/model-comparison'
import { ChatError } from '@/types/model-comparison'
import { parseSSEResponse } from '@/utils/sse'

export class AnthropicBot extends AbstractBot {
  protected async doSendMessage(params: SendMessageParams): Promise<void> {
    const { messages, apiKey, modelId, signal, onEvent } = params

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: 8096,
        stream: true,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      if (res.status === 401) {
        throw new ChatError('API Key 无效或未授权', 401)
      } else if (res.status === 429) {
        throw new ChatError('请求频率超限，请稍后再试', 429)
      }
      throw new ChatError(errData.error?.message || `Anthropic 请求失败 (${res.status})`, res.status)
    }

    await parseSSEResponse(res, (data) => {
      try {
        const parsed = JSON.parse(data)
        if (parsed.type === 'content_block_delta') {
          const text = parsed.delta?.text
          if (text) {
            onEvent({ type: 'UPDATE', text })
          }
        }
      } catch (e) {
        console.warn('Failed to parse Anthropic SSE chunk', data)
      }
    })

    onEvent({ type: 'DONE' })
  }
}
