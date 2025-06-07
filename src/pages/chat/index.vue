<script lang="ts" setup>
import un from '@uni-helper/uni-network'
import AbortController from 'abort-controller/dist/abort-controller'
import { YuanJingAI } from '@/utils/openai/core'

const instance = getCurrentInstance()
const senderHeight = ref(0)

onMounted(() => {
  if (!instance || !instance.proxy)
    return
  const query = uni.createSelectorQuery().in(instance.proxy)
  query
    .select('.sender')
    .boundingClientRect((data) => {
      if (Array.isArray(data)) {
        senderHeight.value = data[0]?.height ?? 0
      }
      else {
        senderHeight.value = data?.height ?? 0
      }
    })
    .exec()
})

// 倒序渲染
type RoleType = 'user' | 'assistant' | 'system' | 'error' | 'info' | undefined

interface ChatMessage {
  content: string
  role?: RoleType
}

const chatList = ref<ChatMessage[]>([
  {
    content: `模型由<span>YuanJing</span>变为<span>DeepSeek-R1</span>`,
    role: 'info',
  },
  {
    content: '你好！我是`元景`，你的全能智能助手。让元景助你：轻松工作，自在生活。​',
    role: 'system',
  },
])

const conversationId = ref('')
const loading = ref(false)
const controller = new AbortController()

async function send(content: string) {
  loading.value = true
  chatList.value.unshift({
    content,
    role: 'user',
  })

  chatList.value.unshift({
    content: '',
    role: 'assistant',
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
  // #ifdef MP-WEIXIN
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
  }, controller.signal, async (responseText: string) => {
    const lines = responseText.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim()
        if (data === '[DONE]') {
          console.warn('request done')
        }
        else {
          const choices = JSON.parse(data)
          if (choices.finish_reason === 'stop' || choices.finish === 1) {
            loading.value = false
          }
          else {
            chatList.value[0].content += choices.response || ''
          }
        }
      }
    }
  })
  // #endif
}

const signal = controller.signal

signal.addEventListener('abort', () => {
  console.error('aborted!')
})

function cancel() {
  console.warn('cancel')
  controller.abort()
  loading.value = false
}
</script>

<template>
  <ChatUINavbar title="联通元景" fixed />
  <scroll-view
    scroll-y class="flex flex-col-reverse" enable-flex
    :style="{ minHeight: 0, maxHeight: `calc(100vh - ${senderHeight}px - var(--sar-tabbar-height) - var(--sar-navbar-height) - ${getWindowInfo().statusBarHeight}px` }"
  >
    <block v-for="item in chatList" :key="item.content">
      <ChatUIContent :role="item.role" :content="item.content" />
    </block>
  </scroll-view>
  <ChatUISender
    class="sender fixed bottom-[var(--sar-tabbar-height)] left-0 right-0" :loading="loading" @send="send"
    @cancel="cancel"
  />
</template>

<route lang="json5">
{
  "layout": "tabbar"
}
</route>
