<script lang="ts" setup>
import { formatChatHistoryForAPI, parseReasoning } from '@/utils/icu'

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

const templateHTML = `
  <div class="max-w-4xl mx-auto p-4 font-sans">
    <!-- 行程标题区 -->
    <div class="text-center mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">黄梅三日精品游</h1>
      <div class="text-gray-600 mt-2">
        📅2023年12月20日 - 12月22日 (3天)
        <br>
        🌤️天气：多云转晴，适合游玩
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="font-semibold text-gray-800 mb-2">第一天</h3>
        <p class="text-gray-600 mb-3">探访禅宗祖庭<br>感受禅意生活</p>
        <div class="aspect-w-16 aspect-h-9">
          <img src="https://www.tja.gov.cn/group2/M00/03/DB/rB40zWYwpE2APe7RAAt4MkRq-uI023.png"
               alt="五祖寺" class="w-full h-full object-cover rounded">
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="font-semibold text-gray-800 mb-2">第二天</h3>
        <p class="text-gray-600 mb-3">黄梅戏发源地<br>非遗文化体验</p>
        <div class="aspect-w-16 aspect-h-9">
          <img src="https://www.tja.gov.cn/group2/M00/03/DB/rB40zWYwpE2APe7RAAt4MkRq-uI023.png"
               alt="五祖寺" class="w-full h-full object-cover rounded">
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="font-semibold text-gray-800 mb-2">第三天</h3>
        <p class="text-gray-600 mb-3">禅茶文化体验<br>湿地生态探访</p>
        <div class="aspect-w-16 aspect-h-9">
          <img src="https://www.tja.gov.cn/group2/M00/03/DB/rB40zWYwpE2APe7RAAt4MkRq-uI023.png"
               alt="五祖寺" class="w-full h-full object-cover rounded">
        </div>
      </div>
      <div class="bg-white p-5 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">交通信息</h2>
        <div class="flex items-center mb-3">
          <i class="fas fa-train text-blue-500 text-lg mr-3"></i>
          <span>火车：黄梅站（距景区15分钟车程）</span>
        </div>
        <div class="flex items-center">
          <i class="fas fa-bus text-blue-500 text-lg mr-3"></i>
          <span>公交：旅游专线1路、2路直达景区</span>
        </div>
      </div>
      <div class="bg-white p-5 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">住宿推荐</h2>
        <div class="mb-4">
          <div class="flex items-center">
            <i class="fas fa-hotel text-green-500 text-lg mr-3"></i>
            <span class="font-medium">维也纳国际酒店(黄冈师范学院店)</span>
          </div>
          <p class="text-gray-600 text-sm mt-1 pl-8">舒适型酒店 | 最低¥198起 | 0713-7819666</p>
        </div>
      </div>
      <div class="bg-white p-5 rounded-lg shadow-md">
        <h3 class="font-medium text-gray-700 mb-2">特色餐厅</h3>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-gray-100 p-2 rounded flex items-center">
            <i class="fas fa-utensils text-yellow-500 mr-2"></i>
            <span>禅意素斋馆</span>
          </div>
          <div class="bg-gray-100 p-2 rounded flex items-center">
            <i class="fas fa-mug-hot text-yellow-500 mr-2"></i>
            <span>稻田咖啡馆</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white p-5 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">实用信息</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-medium text-gray-700 mb-2 flex items-center">
            <i class="fas fa-phone-alt text-red-500 mr-2"></i>紧急联系
          </h3>
          <p class="text-gray-600">报警: 110</p>
          <p class="text-gray-600">急救: 120</p>
          <p class="text-gray-600">旅游投诉: 12301</p>
        </div>
        <div>
          <h3 class="font-medium text-gray-700 mb-2 flex items-center">
            <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>注意事项
          </h3>
          <p class="text-gray-600 flex items-start mb-1">
            <i class="fas fa-circle text-xs text-gray-400 mr-2 mt-1"></i>
            寺庙区域请保持安静，尊重宗教习俗
          </p>
          <p class="text-gray-600 flex items-start">
            <i class="fas fa-circle text-xs text-gray-400 mr-2 mt-1"></i>
            山区气候多变，建议携带雨具和外套
          </p>
        </div>
      </div>
    </div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">详细行程安排</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 text-left">时间</th>
              <th class="p-3 text-left">地点</th>
              <th class="p-3 text-left">活动</th>
              <th class="p-3 text-left">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-200">
              <td class="p-3">
                <i class="far fa-clock text-gray-500 mr-2"></i>08:00
              </td>
              <td class="p-3">
                <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>黄梅站
              </td>
              <td class="p-3">
                <i class="fas fa-train text-gray-500 mr-2"></i>抵达黄梅
              </td>
              <td class="p-3">开始美好旅程</td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="p-3">
                <i class="far fa-clock text-gray-500 mr-2"></i>09:30
              </td>
              <td class="p-3">
                <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>五祖寺
              </td>
              <td class="p-3">
                <i class="fas fa-torii-gate text-gray-500 mr-2"></i>禅宗祖庭参访
              </td>
              <td class="p-3">品尝禅宗素斋</td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="p-3">
                <i class="far fa-clock text-gray-500 mr-2"></i>14:00
              </td>
              <td class="p-3">
                <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>四祖寺
              </td>
              <td class="p-3">
                <i class="fas fa-yin-yang text-gray-500 mr-2"></i>禅修体验
              </td>
              <td class="p-3">双石塔、古井景点</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
`
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
    <MarkedParser
      style="transform: scaleY(-1);"
      :content="templateHTML"
    />
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
