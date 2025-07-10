<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  collapsed?: boolean
  reasoning?: string
}>(), {
  reasoning: '',
  collapsed: true,
})

const { collapsed } = props
const isCollapsed = ref(collapsed)

// 如果需要手动控制更新，可以使用以下方法
const reasoning = ref(props.reasoning)
watch(() => props.reasoning, (newVal) => {
  reasoning.value = newVal
})

// 在模板中直接使用 reasoning，无需 .value
</script>

<template>
  <view class="mx--2 mb-4 rounded-lg bg-white p-2 shadow-md">
    <view class="mb-2 flex items-center">
      <view class="flex items-center">
        <sar-loading type="clock" class="mr-2" />
        <text>思考中……</text>
      </view>
      <view
        i-carbon:chevron-down
        class="ml-auto cursor-pointer"
        @click="isCollapsed = !isCollapsed"
      />
    </view>
    <sar-collapse :visible="!isCollapsed">
      <blockquote class="text-gray-500">
        <p>{{ reasoning }}</p>
      </blockquote>
    </sar-collapse>
  </view>
</template>
