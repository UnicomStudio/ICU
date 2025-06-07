import { un, type UnGenericAbortSignal, type UnHeaders } from '@uni-helper/uni-network'

type onStreamReceivedListener = (text: string) => void

/**
 * 二进制解析成文本
 * @param data 二进制数据
 * @returns 文本
 */
function decodeArrayBuffer(data: ArrayBuffer | undefined) {
  if (!data) {
    return ''
  }
  return decodeUsingURIComponent(data)
}

/**
 * URIComponent解码二进制流(不用引入额外包)
 * @param data 二进制流
 * @returns 文本
 */
function decodeUsingURIComponent(data: ArrayBuffer) {
  const uint8Array = new Uint8Array(data)
  let text = String.fromCharCode(...uint8Array)
  try {
    text = decodeURIComponent(escape(text))
  }
  catch (e) {
    console.error('decodeUsingURIComponent: Can not decodeURI ', text, e)
  }
  return text
}

export class YuanJingAI {
  private instance: ReturnType<typeof un.create>
  private apiKey: string

  constructor(config: {
    baseUrl: string
    timeout?: number
    defaultHeaders?: Record<string, string>
    apiKey: string
  }) {
    this.apiKey = config.apiKey
    this.instance = un.create({
      baseUrl: config.baseUrl,
      timeout: config.timeout || 10000,
      headers: {
        ...config.defaultHeaders,
        'Accept': 'text/event-stream',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
    })
    return this
  }

  Completion(config: Record<string, any>, signal?: UnGenericAbortSignal, listener?: onStreamReceivedListener) {
    const onHeadersReceived = (response?: { headers?: UnHeaders }) => {
      console.warn('调用 onHeadersReceived: ', response?.headers)
    }
    const onChunkReceived = (response?: { data?: ArrayBuffer }) => {
      const text = decodeArrayBuffer(response?.data)
      listener?.(text)
    }
    // #ifdef MP-WEIXIN
    return this.instance.post('/chatunicom/stream', config, {
      enableChunked: true,
      responseType: 'arraybuffer',
      onHeadersReceived,
      onChunkReceived,
      signal,
    })
    // #endif

    // #ifdef H5 || APP-PLUS
    return fetch('https://maas.ai-yuanjing.com/use/model/api/app/v1/chatunicom/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(config),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.body
    }).then((stream) => {
      const reader = stream.getReader()

      async function readChunk() {
        try {
          const { value, done } = await reader.read()
          if (done) {
            console.warn('Stream reading completed')
            await reader.releaseLock()
            return
          }
          onChunkReceived({ data: value })
          await readChunk()
        }
        catch (error) {
          console.error('Error reading stream chunk:', error)
          await reader.releaseLock()
        }
      }

      return readChunk()
    }).catch((error) => {
      console.error('Fetch error:', error)
    })
    // #endif
  }
}
