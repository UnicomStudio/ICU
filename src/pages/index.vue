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
      agent_id: '1df55e77-d22b-4f86-83c8-28916bc5e3ee',
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

// 推荐问题数据
const allQuestions = [
  { id: '1', title: '黄梅三日精品旅游路线', answer: `` },
  { id: '2', title: '黄冈的特色美食有哪些？', answer: `` },
  { id: '3', title: '黄冈的特色美食有哪些？', answer: `` },
  { id: '4', title: '黄冈的历史文化介绍', answer: `` },
  { id: '5', title: '黄梅自驾游线路规划', answer: `` },
  // { id: '6', title: '黄冈的交通指南', answer: `` },
  // { id: '7', title: '黄冈的住宿推荐', answer: `` },
  // { id: '8', title: '黄冈的天气情况', answer: `` },
  // { id: '9', title: '黄冈的民俗文化', answer: `` },
]

// 当前显示的问题列表，默认显示4个问题
const questionData = ref<any[]>([])

// 初始化问题列表
onMounted(async () => {
  refreshQuestion()
})

// 刷新推荐问题
function refreshQuestion() {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random())
  questionData.value = shuffled.slice(0, 4)
}

// 提交用户点击的问题
function questionSubmit(item: any) {
  if (item && item.title) {
    if (item.answer) {
      // 添加用户问题
      paging.value!.addChatRecordData({
        id: UUID(),
        role: 'user',
        content: item.title,
      })

      // 添加空的助手回复，然后模拟流式输出
      loading.value = true
      paging.value!.addChatRecordData({
        id: UUID(),
        role: 'assistant',
        content: '',
      })

      // 模拟流式输出
      simulateStreamResponse(item.answer)
    }
    else {
      send(item.title)
    }
  }
}

// 模拟流式输出效果
function simulateStreamResponse(answer: string) {
  const chunkSize = 1 // 每次添加的字符数
  const delay = 20 // 每次添加的延迟时间(毫秒)
  let currentIndex = 0

  const outputInterval = setInterval(() => {
    if (currentIndex >= answer.length) {
      clearInterval(outputInterval)
      loading.value = false
      return
    }

    // 获取当前要添加的文本块
    const nextChunk = answer.substring(currentIndex, currentIndex + chunkSize)
    currentIndex += chunkSize

    // 更新聊天内容
    chatList.value[0].content += nextChunk
  }, delay)
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
      <ChatUINavbar title="东坡先生" />
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
    <!-- 默认智能助手图标 -->
    <div class="mx-4 my-8 flex flex-row" style="transform: scaleY(-1);">
      <sar-avatar src="https://app.ihuanggang.cn/h5pages/iHgApp/intelligentAssistant/images/service.png" />
      <!-- 默认推荐 -->
      <sar-card style="background:rgba(120,78,35,0.06)" class="ml-4 w-60 flex-1 rounded-lg">
        <div class="mb-3 flex items-center justify-between">
          <div class="text-xs">
            我是东坡先生，您可以试着问我：
          </div>
          <div class="flex cursor-pointer items-center text-xs text-[#999]" @tap="refreshQuestion()">
            <view i-carbon-update-now />
            <span>换一换</span>
          </div>
        </div>
        <div class="space-y-2">
          <div
            v-for="item in questionData"
            :key="item.id"
            class="cursor-pointer rounded bg-white bg-opacity-70 p-2 text-xs text-[#333] transition-all hover:bg-opacity-100"
            @tap="questionSubmit(item)"
          >
            {{ item.title }}
          </div>
        </div>
      </sar-card>
    </div>
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
