import { AbstractBot } from '../abstract-bot'
import type { SendMessageParams } from '@/types/model-comparison'
import { ChatError } from '@/types/model-comparison'
import { parseSSEResponse } from '@/utils/sse'

export class GeminiBot extends AbstractBot {
  protected async doSendMessage(params: SendMessageParams): Promise<void> {
    const { messages, apiKey, modelId, signal, onEvent } = params

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    )

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      if (res.status === 401 || res.status === 403) {
        throw new ChatError('API Key 无效或未授权', res.status)
      } else if (res.status === 429) {
        throw new ChatError('请求频率超限，请稍后再试', 429)
      }
      throw new ChatError(errData.error?.message || `Gemini 请求失败 (${res.status})`, res.status)
    }

    await parseSSEResponse(res, (data) => {
      try {
        const parsed = JSON.parse(data)
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          onEvent({ type: 'UPDATE', text })
        }
      } catch (e) {
        console.warn('Failed to parse Gemini SSE chunk', data)
      }
    })

    onEvent({ type: 'DONE' })
  }
}
