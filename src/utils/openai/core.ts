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

  constructor(config: {
    baseUrl: string
    timeout?: number
    defaultHeaders?: Record<string, string>
    apiKey: string
  }) {
    this.instance = un.create({
      baseUrl: config.baseUrl,
      timeout: config.timeout || 1000,
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
    // #ifdef MP-WEIXIN
    const onHeadersReceived = (response?: { headers?: UnHeaders }) => {
      console.warn('调用 onHeadersReceived: ', response?.headers)
    }
    const onChunkReceived = (response?: { data?: ArrayBuffer }) => {
      const text = decodeArrayBuffer(response?.data)
      listener?.(text)
    }
    return this.instance.post('/chatunicom/stream', config, {
      enableChunked: true,
      responseType: 'arraybuffer',
      onHeadersReceived,
      onChunkReceived,
      signal,
    })
    // #endif
  }
}
