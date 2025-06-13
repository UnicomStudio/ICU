import { fetchEventSource } from '@microsoft/fetch-event-source'
import AbortController from 'abort-controller/dist/abort-controller'

export default {
  data() {
    return {
      abortController: null, // 用于控制请求中止的AbortController实例
    }
  },
  methods: {
    /**
     * 过滤对象，只保留基本类型属性
     * @param {object} obj - 原始对象
     * @return {object} 只包含基本类型属性的新对象
     */
    filterBasicTypes(obj) {
      const result = {}
      for (const key in obj) {
        const value = obj[key]
        // 只保留字符串、数字和布尔值
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          result[key] = value
        }
      }
      return result
    },

    /**
     * 中止当前正在进行的请求
     */
    abortCurrentRequest() {
      this.abortController?.abort()
    },

    /**
     * 发起EventSource请求
     * @param {object} config - 请求配置
     * @param {string} config.url - 请求URL
     * @param {string} [config.body] - 请求体(已序列化)
     * @param {object} [config.headers] - 请求头
     * @param {string} [config.method] - HTTP方法
     */
    initiateEventSourceRequest({ url, body, headers, method }) {
      if (!url)
        return

      try {
        // 创建新的AbortController实例
        this.abortController = new AbortController()

        fetchEventSource(
          url,
          {
            readJson: true,
            method,
            openWhenHidden: true, // 页面隐藏时保持连接
            signal: this.abortController.signal, // 中止信号
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: body || undefined,

            // 连接建立回调
            onopen: (response) => {
              this.$ownerInstance.callMethod('emitOpenEvent', this.filterBasicTypes(response))
            },

            // 消息接收回调
            onmessage: (data) => {
              this.$ownerInstance.callMethod('emitMessageEvent', data)
            },

            // 错误处理回调
            onerror: (err) => {
              console.error('EventSource error:', err)
              this.$ownerInstance.callMethod('emitErrorEvent', JSON.stringify(err))
            },
          },
        ).then(() => {
          // 请求完成回调
          this.$ownerInstance.callMethod('emitFinishEvent')
        }).catch((err) => {
          console.error('EventSource request failed:', err)
          this.$ownerInstance.callMethod('emitErrorEvent', err)
        })
      }
      catch (error) {
        console.error('EventSource initialization error:', error)
      }
    },
  },
}
