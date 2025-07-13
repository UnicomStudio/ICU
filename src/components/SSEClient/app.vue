<script>
export default {
  props: {},
  emits: ['onConnectionOpen', 'onMessageReceived', 'onConnectionError', 'onConnectionFinish'],
  data() {
    return {
      signal: 0, // 用于触发停止请求的计数器
      config: { // 请求配置数据
        url: '', // 请求URL
        key: 0, // 请求唯一标识，用于强制重新请求
        body: '', // 请求体
        method: '', // 请求方法
      },
    }
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
      const { body } = config
      this.config = Object.assign({}, this.config, {
        key: this.config.key + 1, // 递增key强制重新请求
        ...config,
        body: body ? JSON.stringify(body) : null, // 序列化请求体
      })
    },

    /**
     * 触发连接打开事件
     * @param {...any} args - 事件参数
     */
    emitOpenEvent(...args) {
      this.$emit('onConnectionOpen', ...args)
    },

    /**
     * 触发消息接收事件
     * @param {object} message - 接收到的消息
     */
    emitMessageEvent(message) {
      this.$emit('onMessageReceived', message)
    },

    /**
     * 触发错误事件
     * @param {...any} args - 错误参数
     */
    emitErrorEvent(...args) {
      this.$emit('onConnectionError', ...args)
      this.abortRequest() // 出错时自动中止请求
    },

    /**
     * 触发连接完成事件
     */
    emitFinishEvent() {
      this.$emit('onConnectionFinish')
    },
  },
}
</script>

<script module="eventSource" lang="renderjs" src="./eventSource.js"></script>

<template>
  <!--
    通过数据变化触发renderjs中的方法
    config变化时触发新请求
    signal变化时触发请求中止
  -->
  <view
    :config="config"
    :change:config="eventSource.initiateEventSourceRequest"
    :signal="signal"
    :change:signal="eventSource.abortCurrentRequest"
  />
</template>
