<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  collapsed?: boolean
  reasoning?: string
  loading: boolean
}>(), {
  reasoning: '',
  collapsed: true,
  loading: false,
})

const { collapsed } = props
const isCollapsed = ref(collapsed)

// 如果需要手动控制更新，可以使用以下方法
const reasoning = ref(props.reasoning)
const isLoading = ref(props.loading)
watch(() => props.reasoning, (newVal) => {
  reasoning.value = newVal
})

watch(() => props.loading, (newVal) => {
  isLoading.value = newVal
})
</script>

<template>
  <view class="mx--2 mb-4 rounded-lg bg-[--sar-body-bg] p-2 shadow-md">
    <view class="flex items-center">
      <view v-if="isLoading" class="flex items-center">
        <ChatUIThinkingIndicator />
        <text class="ml-1">
          思考中……
        </text>
      </view>
      <view v-else class="flex items-center">
        <view i-carbon-checkmark-filled bg-green />
        <text class="ml-1">
          已深度思考
        </text>
      </view>
      <view
        i-carbon:chevron-down
        class="ml-auto mt--1 cursor-pointer"
        @click="isCollapsed = !isCollapsed"
      />
    </view>
    <sar-collapse :visible="!isCollapsed" :class=" isCollapsed ? '' : 'mt-2'">
      <blockquote class="text-gray-500">
        <p>{{ reasoning }}</p>
      </blockquote>
    </sar-collapse>
  </view>
</template>
