<script>
// #ifdef APP-PLUS || H5
import SSEClient from './index.vue'
// #endif

export default {
  components: {
    // #ifdef APP-PLUS || H5
    SSEClient,
    // #endif
  },
  emits: ['onOpen', 'onMessage', 'onError', 'onFinish'],

  methods: {
    start(config) {
      config.method = (config.method || 'post').toUpperCase()
      config.headers = config.headers || {}
      this.$refs.SSEClientRef.initRequest(config)
    },

    cancel(...args) {
      this.$refs.SSEClientRef.abortRequest(...args)
    },

    open(...args) {
      this.$emit('onOpen', ...args)
    },
    message(msg) {
      this.$emit('onMessage', msg)
    },
    error(...args) {
      this.$emit('onError', ...args)
    },
    finish() {
      this.$emit('onFinish')
    },
  },
}
</script>

<template>
  <!--  #ifdef APP-PLUS || H5 -->
  <SSEClient
    ref="SSEClientRef"
    @on-connection-open="open"
    @on-message-received="message"
    @on-connection-error="error"
    @on-connection-finish="finish"
  />
  <!--  #endif -->
</template>
