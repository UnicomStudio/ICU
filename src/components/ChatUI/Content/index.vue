<script lang="ts" setup>
// 合并为单个message字典参数
const props = withDefaults(defineProps<{
  message: ChatMessage
  loading: boolean
}>(), {
  message: () => ({
    id: UUID(),
    role: 'assistant',
    message: '',
    reasoning: '',
    content: '',
    showCodeLine: false,
  }),
  loading: true,
})
const { message, loading } = props
const isLoading = ref(loading)
watch(() => props.loading, (newVal) => {
  isLoading.value = newVal
})
</script>

<template>
  <block v-if="message.role === 'assistant' || message.role === 'system' || message.role === 'error'">
    <view class="mx-4 my-2 flex items-center justify-start">
      <view class="w-auto rounded-xl bg-[--sar-secondary-bg] px-4 py-2">
        <ChatUIThinking v-if="message.reasoning" :collapsed="false" :reasoning="message.reasoning" :loading="isLoading" />
        <MarkedParser :content="message.content" :show-code-line="message.showCodeLine" :class="[message.role === 'error' ? 'text-red' : '']" />
      </view>
    </view>
  </block>
  <block v-else-if="message.role === 'info'">
    <view class="mx-4 my-2 flex items-center justify-center">
      <view class="w-auto rounded-xl bg-[--sar-secondary-bg] px-4 py-2">
        <MarkedParser :content="message.content" :show-code-line="message.showCodeLine" />
      </view>
    </view>
  </block>
  <block v-else>
    <view class="mx-4 my-2 flex items-center justify-end">
      <text class="w-auto rounded-xl bg-[--sar-secondary-bg] px-4 py-2">
        {{ message.content }}
      </text>
    </view>
  </block>
</template>

<style lang="scss" scoped>
</style>
