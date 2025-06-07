<script lang="ts" setup>
import un from '@uni-helper/uni-network'
import AbortController from 'abort-controller/dist/abort-controller'
import { YuanJingAI } from '@/utils/openai/core'

type RoleType = 'user' | 'assistant' | 'system' | 'error' | 'info' | undefined
interface ChatMessage {
  content: string
  role?: RoleType
}

const chatList = ref<ChatMessage[]>([])
const conversationId = ref('')
const loading = ref(false)
const paging = ref(null)
const controller = ref<AbortController>(new AbortController())
const signal = ref(controller.value.signal)

function send(question: string) {
  console.warn('send', question, chatList.value)
  if (loading.value) {
    return
  }
  paging.value.addChatRecordData({
    id: UUID(),
    role: 'user',
    content: question,
  })

  answer(question)
}

async function answer(content: string) {
  loading.value = true
  paging.value.addChatRecordData({
    id: UUID(),
    role: 'assistant',
    content: '',
  })

  const userInfoStore = useUserInfoStore()

  if (conversationId.value === '') {
    // 创建新会话
    const response = await un.post(import.meta.env.VITE_CONVERSATION_CREATE_URL, {
      assistantId: '3ecf4dd0-62c8-48ae-a257-8ca1558c607a',
      prompt: content,
      from: 'ChatUnicom',
      iconColor: '#D9E3C3',
      model: 'deepseek-r1',
      useSearch: true,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfoStore.userInfo?.token}`,
      },
    })
    conversationId.value = (response.data as any).data.conversationId
  }

  const client = new YuanJingAI({
    baseUrl: `https://maas.ai-yuanjing.com/use/model/api/app/v1/`,
    apiKey: userInfoStore.userInfo?.token,
  })

  await client.Completion({
    input: content,
    model: 'deepseek-r1',
    stream: true,
    auto_citation: false,
    conversationId: conversationId.value,
    use_lvm: true,
    use_code: true,
    use_speech: true,
    use_search: true,
    assistantId: '3ecf4dd0-62c8-48ae-a257-8ca1558c607a',
    extend_params: {},
    need_search_list: true,
    request_id: UUID(),
  }, controller.value.signal, async (responseText: string) => {
    const lines = responseText.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim()
        if (data === '[DONE]') {
          console.warn('request done')
          // 重置AbortController实例
          controller.value = new AbortController()
          signal.value = controller.value.signal
        }
        else {
          const choices = JSON.parse(data)
          if (choices.finish_reason === 'stop' || choices.finish === 1) {
            loading.value = false
            // 重置AbortController实例
            controller.value = new AbortController()
            signal.value = controller.value.signal
          }
          else {
            chatList.value[0].content += choices.response || ''
          }
        }
      }
    }
  }).catch((error) => {
    console.error('Fetch error:', error)
    loading.value = false
    // 重置AbortController实例
    controller.value = new AbortController()
    signal.value = controller.value.signal
  })
}

signal.value.addEventListener('abort', () => {
  console.error('aborted!')
  // 重置AbortController实例
  controller.value = new AbortController()
  signal.value = controller.value.signal
})

function cancel() {
  console.warn('cancel')
  controller.value.abort()
  loading.value = false
  // 重置AbortController实例
  controller.value = new AbortController()
  signal.value = controller.value.signal
}
</script>

<template>
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

<route lang="json5">
{
  "layout": "tabbar"
}
</route>
