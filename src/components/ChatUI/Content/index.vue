<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'

// 这里 props 未被使用，改为解构赋值以避免 ESLint 警告
const { content, role, showCodeLine } = withDefaults(defineProps<{
  content: string
  role?: 'user' | 'assistant' | 'system' | 'error' | 'info'
  showCodeLine?: boolean
}>(), {
  role: 'assistant',
  showCodeLine: false,
})
</script>

<template>
  <block v-if="role === 'assistant' || role === 'system' || role === 'error'">
    <view class="mx-4 my-2 flex items-center justify-start">
      <view class="w-auto rounded-xl bg-[--sar-secondary-bg] px-4 py-2">
        <MarkedParser :content="content" :show-code-line="showCodeLine" :class="[role === 'error' ? 'text-red' : '']" />
      </view>
    </view>
  </block>
  <block v-else-if="role === 'info'">
    <view class="mx-4 my-2 flex items-center justify-center">
      <view class="w-auto rounded-xl bg-[--sar-secondary-bg] px-4 py-2">
        <MarkedParser :content="content" :show-code-line="showCodeLine" />
      </view>
    </view>
  </block>
  <block v-else>
    <view class="mx-4 my-2 flex items-center justify-end">
      <text class="w-auto rounded-xl bg-[--sar-secondary-bg] px-4 py-2">
        {{ content }}
      </text>
    </view>
  </block>
</template>

<style lang="scss" scoped>
</style>
