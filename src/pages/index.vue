<script lang="ts" setup>
type RoleType = 'user' | 'assistant' | 'system' | 'error' | 'info' | undefined
interface ChatMessage {
  id: string
  content: string
  role?: RoleType
}

const paging = ref<any>(null)

const loading = ref(false)
// TODO: 增加上下文记忆
// const session_id = ref('')
const chatList = ref<ChatMessage[]>([])

// #ifdef H5 || APP-PLUS
const SSEClientAppRef = ref<any>(null)

function onSSEClientOpen(event: any) {
  console.warn('SSEClientApp onOpen', event)
  loading.value = true
  paging.value!.addChatRecordData({
    id: UUID(),
    role: 'assistant',
    content: '',
  })
}

function onSSEClientError(event: any) {
  console.error('SSEClientApp onError', event)
  chatList.value[0].content += '<div class="text-red">网络错误，请稍后重试~</div>'
}

function onSSEClientMessage(event: any) {
  console.warn('SSEClientApp onMessage', event)

  const choices = JSON.parse(event.data)
  chatList.value[0].content += choices.response || ''
  if (choices.finish_reason === 'stop' || choices.finish === 1) {
    loading.value = false
  }
}

function onSSEClientFinish() {
  console.warn('SSEClientApp onFinish', event)
  loading.value = false
}
// #endif

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

  // #ifdef H5 || APP-PLUS
  SSEClientAppRef.value.start({
    url: '/api/openapi/v3/assistant/chat/completions',
    method: 'POST',
    body: {
      agent_id: '2ed5b809-fccb-45bf-9d0a-d7dc13494eb4',
      input: question,
      session_id: UUID(),
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer sk-31e3f5f74dbe435d8a1e4d04a7505669`,
    },
  })
  // #endif
}

function cancel() {
  // #ifdef H5 || APP-PLUS
  console.warn('cancel')
  SSEClientAppRef.value.stop()
  // #endif
}
</script>

<template>
  <!-- #ifdef H5 || APP-PLUS -->
  <SSEClientApp
    ref="SSEClientAppRef" @on-open="onSSEClientOpen" @on-error="onSSEClientError"
    @on-message="onSSEClientMessage" @on-finish="onSSEClientFinish"
  />
  <!-- #endif -->
  <z-paging ref="paging" v-model="chatList" safe-area-inset-bottom use-chat-record-mode>
    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <template #top>
      <ChatUINavbar title="小俏" />
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
      <!-- #ifdef H5 || APP-PLUS -->
      <ChatUISender :loading="loading" @send="send" @cancel="cancel" />
      <!-- #endif -->
    </template>
  </z-paging>
</template>

<style lang="scss" scoped>
.sender {
  bottom: calc(var(--sar-tabbar-height) + env(safe-area-inset-bottom));
}
</style>

<route type="home" lang="json5">
{}
</route>
