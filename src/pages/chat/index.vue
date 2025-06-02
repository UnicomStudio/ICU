<script lang="ts" setup>
import un from '@uni-helper/uni-network'

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

/**
 * 二进制解析成文本
 * @param data 二进制数据
 * @returns 文本
 */
function decodeArrayBuffer(data: ArrayBuffer | undefined) {
  if (!data) {
    return ''
  }
  return decodeUsingURIComponent(data)
}

/**
 * URIComponent解码二进制流(不用引入额外包)
 * @param data 二进制流
 * @returns 文本
 */
function decodeUsingURIComponent(data: ArrayBuffer) {
  const uint8Array = new Uint8Array(data)
  let text = String.fromCharCode(...uint8Array)
  try {
    text = decodeURIComponent(escape(text))
  }
  catch (e) {
    console.error('decodeUsingURIComponent: Can not decodeURI ', text, e)
  }
  return text
}
function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function send(content: string) {
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
    const response = await un.post('https://maas.ai-yuanjing.com/use/model/api/app/v1/assistant/conversation/create', {
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
  try {
    un.request({
      url: `https://maas.ai-yuanjing.com/use/model/api/app/v1/chatunicom/stream`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfoStore.userInfo?.token}`,
      },
      data: {
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
        request_id: getUuid(),
      },
      enableChunked: true, // 开启分块传输 transfer-encoding chunked
      success: (res) => {
        console.warn('request success', res)
      },
      fail: (error) => {
        console.error('request fail', error)
      },
      onChunkReceived: (res) => {
        const text = decodeArrayBuffer(res?.data)
        const lines = text.split(/\r?\n/)
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') {
              console.warn('request done')
            }
            else {
              const choices = JSON.parse(data)
              // console.log('request chunk', choices)
              if (choices.finish_reason === 'stop') {
                console.warn('request done')
              }
              else {
                chatList.value[0].content += choices.response || ''
              }
            }
          }
        }
      },
    })
  }
  catch (error) {
    throw new Error(`request error: ${error.message || '请求异常'}`)
  }
  // #endif
}
</script>

<template>
  <ChatUINavbar title="标题" fixed />
  <scroll-view
    scroll-y
    class="flex flex-col-reverse"
    enable-flex
    :style="{ minHeight: 0, maxHeight: `calc(100vh - ${senderHeight}px - var(--sar-tabbar-height) - var(--sar-navbar-height) - ${getWindowInfo().statusBarHeight}px` }"
  >
    <block v-for="item in chatList" :key="item.content">
      <ChatUIContent :role="item.role" :content="item.content" />
    </block>
  </scroll-view>
  <ChatUISender class="sender fixed bottom-[var(--sar-tabbar-height)] left-0 right-0" @send="send" />
</template>

<route lang="json5">
{
  "layout": "tabbar"
}
</route>
