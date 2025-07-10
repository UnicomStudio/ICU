<script lang="ts" setup>
import parseReasoning from '@/utils/icu'

type RoleType = 'user' | 'assistant' | 'system' | 'error' | 'info' | undefined
interface ChatMessage {
  id: string
  content: string
  role?: RoleType
  reasoning?: string
  message: string
}

const paging = ref<any>(null)

const loading = ref(false)
const chatList = ref<ChatMessage[]>([])

const SSEClientRef = ref<any>(null)

function onSSEClientOpen(event: any) {
  console.warn('SSEClient onOpen', event)
  loading.value = true
  paging.value!.addChatRecordData({
    id: UUID(),
    role: 'assistant',
    content: '',
  })
}

function onSSEClientError(event: any) {
  console.error('SSEClient onError', event)
  chatList.value[0].content += '<div class="text-red">网络错误，请稍后重试~</div>'
}

function onSSEClientMessage(event: any) {
  // const choices = JSON.parse(event.data).choices[0]
  // chatList.value[0].content += choices.delta.content || ''
  // if (choices.finish_reason === 'stop' || choices.finish === 1) {
  //   loading.value = false
  // }
  const choices = JSON.parse(event.data)
  for (const choice of choices.choices) {
    chatList.value[0].message += choice.delta.content || ''
  }
  parseReasoning(chatList.value[0].message).map((e) => {
    console.warn('SSEClient onMessage', e)
    if (e.type === 'reasoning' && e.content) {
      chatList.value[0].reasoning = e.content || ''
    }
    else if (e.content && e.content !== 'undefined') {
      chatList.value[0].content = e.content || ''
    }
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
  paging.value!.addChatRecordData({
    id: UUID(),
    role: 'user',
    content: question,
  })

  SSEClientRef.value.start({
    url: import.meta.env.VITE_CHAT_COMPLETION_URL,
    method: 'POST',
    body: {
      model: 'deepseek-r1-distill-llama-70b',
      stream: true,
      messages: [
        ...chatList.value.map(item => ({
          role: item.role || 'user',
          content: item.content,
        })),
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
</script>

<template>
  <SSEClient
    ref="SSEClientRef" @on-open="onSSEClientOpen" @on-error="onSSEClientError"
    @on-message="onSSEClientMessage" @on-finish="onSSEClientFinish"
  />
  <z-paging ref="paging" v-model="chatList" safe-area-inset-bottom use-chat-record-mode>
    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <template #top>
      <ChatUINavbar title="联通元景" />
    </template>
    <!-- for循环渲染聊天记录列表 -->
    <view v-for="item in chatList" :key="item.id" style="position: relative;">
      <!-- 如果要给聊天item添加长按的popup，请在popup标签上写style="transform: scaleY(-1);"，注意style="transform: scaleY(-1);"不要写在最外层，否则可能导致popup被其他聊天item盖住 -->
      <!-- <view class="popup" style="transform: scaleY(-1);">popUp</view> -->

      <!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置 -->
      <!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
      <view style="transform: scaleY(-1);">
        <ChatUIContent :message="item" />
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
