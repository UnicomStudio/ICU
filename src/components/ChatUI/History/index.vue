<script setup lang="ts">
import { useChatHistoriesStore } from '@/stores/chatHistory'

const emit = defineEmits(['chat'])
const histories = ref<ChatHistory[]>()

function onDelete(id: string) {
  const chatHistoryStore = useChatHistoriesStore()
  chatHistoryStore.deleteChatHistoryById(id)
  histories.value = chatHistoryStore.chatHistories
}

function onChat(id: string) {
  emit('chat', id)
}

onMounted(() => {
  // 初始化聊天记录
  const chatHistoryStore = useChatHistoriesStore()
  histories.value = chatHistoryStore.chatHistories
})
</script>

<template>
  <view class="h-[100vh] bg-[--sar-list-item-bg] text-[--sar-body-color]">
    <sar-status-bar />
    <view class="m-2 w-64">
      <view class="flex flex-row items-center justify-start rounded-xl bg-[--sar-secondary-bg] p-2">
        <sar-avatar src="https://q2.qlogo.cn/headimg_dl?dst_uin=849919718&spec=100&t=1752381966740" />
        <view class="ml-4 w-[50%] flex flex-col items-start justify-start">
          <view class="flex gap-2">
            <text class="text-xl font-bold">
              easterNday
            </text>
          </view>
          <view class="text-sm">
            <sar-tag theme="primary">
              849919718@qq.com
            </sar-tag>
          </view>
        </view>
      </view>
      <sar-divider class="text-xs">
        历史记录
      </sar-divider>
    </view>
    <sar-list inlaid>
      <sar-list-item
        v-for="history in histories" :key="history.id"
        arrow hover :title="history.title"
        :description="history.updatedAt"
      >
        <template #arrow>
          <view class="flex items-center gap-2">
            <view
              class="i-carbon-trash-can"
              @click="onDelete(history.id)"
            />
            <view
              class="i-carbon-chat"
              @click="onChat(history.id)"
            />
          </view>
        </template>
      </sar-list-item>
    </sar-list>
  </view>
</template>
