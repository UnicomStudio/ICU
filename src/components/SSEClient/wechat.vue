<script>
import { un } from '@uni-helper/uni-network'

export default {
  props: {},
  emits: ['onConnectionOpen', 'onMessageReceived', 'onConnectionError', 'onConnectionFinish'],
  data() {
    return { }
  },
  methods: {
    /**
     * 发送中止请求信号
     * 通过递增计数器触发renderjs中的中止逻辑
     */
    abortRequest() {
      this.signal += 1
    },

    /**
     * 初始化并开始聊天请求
     * @param {object} config - 请求配置对象
     * @param {string} config.url - 请求URL
     * @param {object} [config.body] - 请求体数据
     * @param {string} [config.method] - HTTP方法
     * @param {object} [config.headers] - 请求头
     */
    initRequest(config) {
      this.$emit('onConnectionOpen', config)
      const { url, body, method, headers } = config

      un({
        method: (method || 'POST').toUpperCase(),
        url,
        data: body ? JSON.stringify(body) : null,
        timeout: Number.POSITIVE_INFINITY,
        headers: {
          ...headers,
        },
        enableChunked: true,
        onChunkReceived: (response) => {
          let data = response.data || response
          if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data)
            data = uni.arrayBufferToBase64(data)
            data = decodeURIComponent(escape(atob(data)))
            const lines = data.split('\n')
            lines.forEach((line) => {
              if (line.trim().startsWith('data:')) {
                line = line.slice(5).trim() // 去除前缀 'data:'
                if (line === '[DONE]') {
                  this.$emit('onConnectionFinish')
                }
                else {
                  this.$emit('onMessageReceived', {
                    data: line,
                  })
                }
              }
            })
          }
        },
      }).catch((error) => {
        this.$emit('onConnectionError', error)
        this.abortRequest() // 出错时自动中止请求
      })
    },

    abortCurrentRequest() {
      this.abortRequest()
    },
  },
}
</script>

<template>
  <!--
    通过数据变化触发renderjs中的方法
    config变化时触发新请求
    signal变化时触发请求中止
  -->
  <view />
</template>
