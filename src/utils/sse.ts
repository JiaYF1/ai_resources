// src/utils/sse.ts
export async function parseSSEResponse(
  response: Response,
  onMessage: (message: string) => void
) {
  if (!response.body) throw new Error('No response body')

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    // 保留最后一行未完整的行
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.trim() === '') continue
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') {
          return // 结束
        }
        onMessage(data)
      }
    }
  }
}