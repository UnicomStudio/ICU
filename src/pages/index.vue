<script lang="ts" setup>
import { useChatHistoriesStore } from '@/stores/chatHistory'

const id = ref<string>(UUID())
const chatList = ref<ChatMessage[]>([])
const paging = ref<any>(null)

function updateChatHistory() {
  // 更新对话历史
  const chatHistoryStore = useChatHistoriesStore()
  chatHistoryStore.updateChatHistoryById(id.value, chatList.value)
}

function refreshHistoryById(newId: string) {
  id.value = newId
  const chatHistoryStore = useChatHistoriesStore()
  const history = chatHistoryStore.chatHistories.find(h => h.id === id.value)
  if (history) {
    chatList.value = history.messages
    // paging.value.addChatRecordData(chatList.value)
  }
  else {
    chatList.value = []
  }
}

onMounted(() => {
  // 初始化聊天记录
  // 添加延时，确保z-paging组件已完全初始化
  setTimeout(() => {
    const chatHistoryStore = useChatHistoriesStore()
    if (chatHistoryStore.chatHistories.length !== 0) {
      refreshHistoryById(chatHistoryStore.chatHistories[0].id)
    }
    else {
      refreshHistoryById(id.value)
    }
  }, 300)
})

const loading = ref(false)

const SSEClientRef = ref<any>(null)

function onSSEClientOpen(event: any) {
  console.warn('SSEClient onOpen', event)
  loading.value = true
}

function onSSEClientError(event: any) {
  console.error('SSEClient onError', event)
  chatList.value[0].content += '<div class="text-red">网络错误，请稍后重试~</div>'
}

function onSSEClientMessage(event: any) {
  const choices = JSON.parse(event.data)
  for (const choice of choices.choices) {
    chatList.value[0].message += choice.delta.content || ''
  }
  parseReasoning(chatList.value[0].message).map((e: { type: string, content: string }) => {
    if (e.type === 'reasoning' && e.content) {
      chatList.value[0].reasoning = e.content || ''
    }
    else if (e.content && e.content !== 'undefined') {
      chatList.value[0].content = e.content || ''
    }
    updateChatHistory()
    return e
  })
}

function onSSEClientFinish() {
  console.warn('SSEClient onFinish')
  loading.value = false
}

async function send(question: string) {
  console.warn('send', question, chatList.value)
  if (loading.value) {
    return
  }
  // 如果没有历史，则为新建对话内容，则新建一条历史记录
  if (chatList.value.length === 0) {
    // 如果没有聊天记录，则添加一条空的助手消息
    const chatHistoryStore = useChatHistoriesStore()
    chatHistoryStore.addChatHistory({
      id: id.value,
      title: question,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  paging.value!.addChatRecordData({
    id: UUID(),
    role: 'user',
    content: question,
  })
  paging.value!.addChatRecordData({
    id: UUID(),
    role: 'assistant',
    content: '',
  })

  SSEClientRef.value.start({
    url: import.meta.env.VITE_CHAT_COMPLETION_URL,
    method: 'POST',
    body: {
      model: 'deepseek-r1-distill-llama-70b',
      stream: true,
      messages: [
        ...formatChatHistoryForAPI(chatList.value),
        {
          role: 'user',
          content: question,
        },
      ],
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_CHAT_API_KEY}`,
    },
  })
}

function cancel() {
  SSEClientRef.value.cancel()
}

const popupVisible = ref(false)
</script>

<template>
  <SSEClient
    ref="SSEClientRef" @on-open="onSSEClientOpen" @on-error="onSSEClientError"
    @on-message="onSSEClientMessage" @on-finish="onSSEClientFinish"
  />
  <sar-popup
    :visible="popupVisible"
    effect="slide-left"
    class="h-[100vh] bg-[--sar-list-item-bg]"
    @overlay-click="popupVisible = false"
  >
    <ChatUIHistory @chat="(newId) => refreshHistoryById(newId)" />
  </sar-popup>
  <z-paging ref="paging" v-model="chatList" safe-area-inset-bottom use-chat-record-mode>
    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <template #top>
      <ChatUINavbar title="联通元景">
        <template #left>
          <view class="h-full flex items-center">
            <sar-navbar-item @click="popupVisible = true">
              <text i-carbon-list class="text-xl text-gray-500" />
            </sar-navbar-item>
            <sar-navbar-item @click="refreshHistoryById(UUID())">
              <text i-carbon-add-alt class="text-xl text-gray-500" />
            </sar-navbar-item>
          </view>
        </template>
      </ChatUINavbar>
    </template>
    <!-- for循环渲染聊天记录列表 -->
    <view v-for="item in chatList" :key="item.id" style="position: relative;">
      <!-- 如果要给聊天item添加长按的popup，请在popup标签上写style="transform: scaleY(-1);"，注意style="transform: scaleY(-1);"不要写在最外层，否则可能导致popup被其他聊天item盖住 -->
      <!-- <view class="popup" style="transform: scaleY(-1);">popUp</view> -->

      <!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置 -->
      <!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
      <view style="transform: scaleY(-1);">
        <ChatUIContent :message="item" :loading="item.id === chatList[0].id ? loading : false" />
      </view>
    </view>
    <template #bottom>
      <ChatUISender :loading="loading" @send="send" @cancel="cancel" />
      <sar-tabbar-pit />
    </template>
  </z-paging>
</template>

<style lang="scss" scoped>
.sender {
  bottom: calc(var(--sar-tabbar-height) + env(safe-area-inset-bottom));
}
</style>

<route type="home" lang="json5">
{
  "layout": "tabbar"
}
</route>
