<script lang="ts" setup>
import un from '@uni-helper/uni-network'
import AbortController from 'abort-controller/dist/abort-controller'
import { YuanJingAI } from '@/utils/yuanjing/core'

type RoleType = 'user' | 'assistant' | 'system' | 'error' | 'info' | undefined
interface ChatMessage {
  id: string
  content: string
  role?: RoleType
}

const chatList = ref<ChatMessage[]>([])
const conversationId = ref('')
const loading = ref(false)
const paging = ref<any>(null)
const controller = ref<AbortController>(new AbortController())
const signal = ref(controller.value.signal)
const modelSelectVisible = ref(false)
const curModel = ref('deepseek-r1')

function send(question: string) {
  console.warn('send', question, chatList.value)
  if (loading.value) {
    return
  }
  paging.value!.addChatRecordData({
    id: UUID(),
    role: 'user',
    content: question,
  })

  answer(question)
}

async function answer(content: string) {
  loading.value = true
  paging.value!.addChatRecordData({
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
      model: curModel.value,
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
    model: curModel.value,
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
    if (loading.value === false) {
      return
    }
    const lines = responseText.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const data = line.startsWith('data:') ? line.slice(5).trim() : line.trim()
      if (data === '[DONE]') {
        console.warn('request done')
        // 重置AbortController实例
        controller.value = new AbortController()
        signal.value = controller.value.signal
      }
      else {
        const choices = JSON.parse(data)
        chatList.value[0].content += choices.response || ''
        if (choices.finish_reason === 'stop' || choices.finish === 1) {
          loading.value = false
          // 重置AbortController实例
          controller.value = new AbortController()
          signal.value = controller.value.signal
        }
      }
    }
  }).catch((error) => {
    console.error('Fetch error:', error)
    chatList.value[0].content += '<div class="text-red">网络错误，请稍后重试~</div>'
  }).finally(() => {
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

const modelList = ref([
  { label: 'YUANJING-7B-CHAT', value: 'YUANJING-7B-CHAT', description: '中国联通元景大模型（7B），通用文本生成' },
  { label: 'YUANJING2-8B-CHAT', value: 'YUANJING2-8B-CHAT', description: '中国联通元景大模型（8B），通用文本生成' },
  { label: 'YUANJING-13B-CHAT', value: 'YUANJING-13B-CHAT', description: '中国联通元景大模型（13B），通用文本生成' },
  { label: 'YUANJING-34B-CHAT', value: 'YUANJING-34B-CHAT', description: '中国联通元景大模型（34B），通用文本生成' },
  { label: 'YUANJING-70B-CHAT', value: 'YUANJING-70B-CHAT', description: '中国联通元景大模型（70B），通用文本生成' },
  { label: 'YUANJING-C1', value: 'YUANJING-C1', description: '中国联通元景大模型（C1），通用文本生成' },
  { label: 'DEEPSEEK-V3', value: 'DEEPSEEK-V3', description: '深度求索（DeepSeek）研发的推理模型，通用任务' },
  { label: 'DEEPSEEK-R1', value: 'DEEPSEEK-R1', description: '深度求索（DeepSeek）研发的推理模型，通用任务' },
  { label: 'DEEPSEEK-R1-SAFE', value: 'DEEPSEEK-R1-SAFE', description: '深度求索（DeepSeek）研发的安全版本推理模型' },
  { label: 'DEEPSEEK-R1-DISTILL-QWEN-1.5B', value: 'DEEPSEEK-R1-DISTILL-QWEN-1.5B', description: '深度求索（DeepSeek）研发的蒸馏模型，源自Qwen-1.5B' },
  { label: 'DEEPSEEK-R1-DISTILL-QWEN-7B', value: 'DEEPSEEK-R1-DISTILL-QWEN-7B', description: '深度求索（DeepSeek）研发的蒸馏模型，源自Qwen-7B' },
  { label: 'DEEPSEEK-R1-DISTILL-QWEN-14B', value: 'DEEPSEEK-R1-DISTILL-QWEN-14B', description: '深度求索（DeepSeek）研发的蒸馏模型，源自Qwen-14B' },
  { label: 'DEEPSEEK-R1-DISTILL-QWEN-32B', value: 'DEEPSEEK-R1-DISTILL-QWEN-32B', description: '深度求索（DeepSeek）研发的蒸馏模型，源自Qwen-32B' },
  { label: 'DEEPSEEK-R1-DISTILL-LLAMA-8B', value: 'DEEPSEEK-R1-DISTILL-LLAMA-8B', description: '深度求索（DeepSeek）研发的蒸馏模型，源自Llama-8B' },
  { label: 'DEEPSEEK-R1-DISTILL-LLAMA-70B', value: 'DEEPSEEK-R1-DISTILL-LLAMA-70B', description: '深度求索（DeepSeek）研发的蒸馏模型，源自Llama-70B' },
  { label: 'QWQ-32B', value: 'QWQ-32B', description: '通义千问模型（32B），通用任务处理' },
  { label: 'QWEN2.5-32B-INSTRUCT', value: 'QWEN2.5-32B-INSTRUCT', description: '阿里巴巴达摩院研发的通义千问模型（32B），指令理解' },
  { label: 'QWEN2.5-72B-INSTRUCT', value: 'QWEN2.5-72B-INSTRUCT', description: '阿里巴巴达摩院研发的通义千问模型（72B），指令理解' },
  { label: 'QWEN3-235B-A22B', value: 'QWEN3-235B-A22B', description: '阿里巴巴达摩院研发的通义千问模型（235B A22B），通用任务' },
  { label: 'YUANJING-70B-FUNCTIONCALL', value: 'YUANJING-70B-FUNCTIONCALL', description: '中国联通元景大模型（70B），支持函数调用' },
  { label: 'DEEPSEEK-V3-FUNCTIONCALL', value: 'DEEPSEEK-V3-FUNCTIONCALL', description: '深度求索（DeepSeek）研发的推理模型，支持函数调用' },
  { label: 'YUANJING-70B-MATH', value: 'YUANJING-70B-MATH', description: '中国联通元景大模型（70B），数学推理专用' },
  { label: 'YUANJING-70B-NL2SQL', value: 'YUANJING-70B-NL2SQL', description: '中国联通元景大模型（70B），自然语言转SQL专用' },
  { label: 'LLAMA-4-SCOUT-17B-16E-INSTRUCT', value: 'LLAMA-4-SCOUT-17B-16E-INSTRUCT', description: 'Meta研发的Llama模型（17B），指令理解任务' },
  { label: 'LLAMA-4-MAVERICK-17B-128E-INSTRUCT', value: 'LLAMA-4-MAVERICK-17B-128E-INSTRUCT', description: 'Meta研发的Llama模型（17B），扩展指令理解' },
  { label: 'GLM-Z1-32B-0414', value: 'GLM-Z1-32B-0414', description: '智谱AI研发的GLM模型（32B），多模态任务支持' },
  { label: 'GLM-Z1-RUMINATION-32B-0414', value: 'GLM-Z1-RUMINATION-32B-0414', description: '智谱AI研发的GLM模型（32B），深度推理优化' },
])
function changeModel(model: any) {
  const newModel = model.toLowerCase()
  if (newModel === curModel.value) {
    return
  }
  paging.value!.addChatRecordData({
    id: UUID(),
    role: 'info',
    content: `模型由 ${curModel.value} 切换为 ${newModel}`,
  })
  curModel.value = newModel
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
      <ChatUISender :loading="loading" @send="send" @cancel="cancel">
        <template #options>
          <sar-button type="outline" round inline size="mini" @click="modelSelectVisible = true">
            <text>
              {{ curModel }}
            </text>
            <text i-carbon-caret-down />
          </sar-button>
        </template>
      </ChatUISender>
      <sar-tabbar-pit />
    </template>
  </z-paging>

  <sar-picker-popout
    v-model:visible="modelSelectVisible"
    title="请选择您需要使用的模型"
    :columns="modelList"
    @change="changeModel"
  />
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
