<script lang="ts" setup>
import { parseReasoning } from '@/utils/icu'

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
  chatList.value[0].message += choices.response || ''
  parseReasoning(chatList.value[0].message).map((e) => {
    console.warn('SSEClient onMessage', e)
    if (e.type === 'reasoning' && e.content && e.content !== 'undefined') {
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
      agent_id: '1df55e77-d22b-4f86-83c8-28916bc5e3ee',
      input: `
# 旅行规划卡片生成师

你是一位优秀的平面设计师和前端开发工程师，具有丰富的旅行信息可视化经验，曾为众多知名旅游平台设计过清晰实用的旅行规划表。
现在请使用HTML代码实现以下要求：

## 基本要求

** 基础结构 **
   - 采用单页设计，所有重要信息必须在一页内完整呈现
   - 信息分区清晰，使用网格布局确保整洁有序
   - 打印友好的配色方案，避免过深的背景色和过小的字体

** 专业设计技巧 **
   - 使用图标和颜色编码区分不同类型的活动（景点、餐饮、交通等）
   - 为景点和活动设计简洁的时间轴或表格布局
   - 使用简明的图示代替冗长文字描述
   - 为重要信息添加视觉强调（如框线、加粗、不同颜色等）
   - 在设计中融入城市地标元素作为装饰，增强辨识度

## 设计风格

- ** 实用为主的旅行工具风格 ** ：以清晰的信息呈现为首要目标
- ** 专业旅行指南风格 ** ：参考Lonely Planet等专业旅游指南的排版和布局
- ** 信息图表风格 ** ：将复杂行程转化为直观的图表和时间轴
- ** 简约现代设计 ** ：干净的线条、充分的留白和清晰的层次结构
- ** 整洁的表格布局 ** ：使用表格组织景点、活动和时间信息
- ** 地图元素整合 ** ：在合适位置添加简化的路线或位置示意图

## 内容区块

1. ** 行程标题区 ** ：
   - 目的地名称（主标题，醒目位置）
   - 旅行日期和总天数
   - 旅行者姓名/团队名称（可选）
   - 天气信息摘要

2. ** 行程概览区 ** ：
   - 按日期分区的行程简表
   - 每天主要活动/景点的概览
   - 使用图标标识不同类型的活动
   - 对应景区图片（卡片式展示）

3. ** 详细时间表区 ** ：
   - 以表格或时间轴形式呈现详细行程
   - 包含时间、地点、活动描述
   - 每个景点的停留时间
   - 标注门票价格和必要预订信息

4. ** 交通信息区 ** ：
   - 主要交通换乘点及方式
   - 地铁/公交线路和站点信息
   - 预计交通时间
   - 使用箭头或连线表示行程路线

5. ** 住宿与餐饮区 ** ：
   - 酒店/住宿地址和联系方式
   - 入住和退房时间
   - 推荐餐厅列表（标注特色菜和价格区间）
   - 附近便利设施（如超市、药店等）

6. ** 实用信息区 ** ：
   - 紧急联系电话
   - 重要提示和注意事项
   - 预算摘要
   - 行李清单提醒

# 模板示例

\`\`\`html
  <div>
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
\`\`\`

# 注意事项

- 只输出HTML代码，不包含JavaScript逻辑和样式表
- 使用语义化HTML标签，确保内容结构清晰
- **只输出body内部代码，不包含头部和脚本标签**
- **确保输出内容不使用任何Markdown语法**
- **不要使用Markdown代码框包裹输出内容，只输出原始HTML内容**
- **代码中不需要任何注释**

请创建一个既美观又实用的旅行规划表，帮助用户清晰掌握行程安排。**只输出body内部代码，不包含头部和脚本标签**，**确保输出内容不使用任何Markdown语法**，**不要使用Markdown代码框包裹输出内容，只输出原始HTML内容**，不包含\`\`\`html和<body>。

现在请你帮我规划： ${question}`,
      session_id: UUID(),
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
{}
</route>
