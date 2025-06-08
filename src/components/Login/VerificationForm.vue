<script lang="ts" setup>
import { getCaptcha, login, sendCode } from '@/utils/sys'

const emit = defineEmits<{
  (e: 'switch:login', method: string): void
}>()

const model = reactive({
  areaCode: '86',
  phone: '',
})

const areaVisible = ref(false)

function onSelect(code: string) {
  model.areaCode = code
}

const mobile = ref('')
const captcha = ref('')
const code = ref('')

const base64Img = ref('')
const captchaId = ref('')

async function refreshCaptcha() {
  const result = await getCaptcha()
  base64Img.value = result?.b64s
  captchaId.value = result?.captchaId
}

async function getCode() {
  await sendCode(mobile.value, captchaId.value, captcha.value)
}

async function checkLogin(mobile: string, code: string) {
  const response = await login(mobile, code)
  if (response) {
    useNavigate({ url: '/pages/settings/index' })
  }
  else {
    useToast({ title: '验证码错误' })
  }
}

onLoad(async () => {
  refreshCaptcha()
})
</script>

<template>
  <view class="flex flex-col space-y-4">
    <marked-parser content="> + 验证码登录" />
    <sar-input v-model="mobile" placeholder="请输入手机号码" type="tel">
      <template #prepend>
        <view class="flex flex-row items-center text-[--sar-primary-text]" @click="areaVisible = true">
          <text>
            +{{ model.areaCode }}
          </text>
          <text i-carbon-caret-down />
        </view>
      </template>
    </sar-input>
    <view class="flex flex-row items-center justify-center space-x-4">
      <sar-input v-model="captcha" type="password" placeholder="请输入验证码" class="grow">
        <template #prepend>
          <view i-carbon-chat />
        </template>
      </sar-input>
      <view class="flex items-center justify-center">
        <image
          :src="base64Img"
          mode="aspectFit"
          class="mr-2 h-8 w-16 rounded-xl"
          @click="refreshCaptcha"
        />
      </view>
    </view>
    <sar-input v-model="code" type="password" placeholder="请输入验证码">
      <template #prepend>
        <view i-carbon-ibm-cloud-pak-security />
      </template>
      <template #append>
        <sar-button size="mini" type="pale-text" @click="getCode">
          获取验证码
        </sar-button>
      </template>
    </sar-input>
    <!-- 其他登录选项 -->
    <view class="mb-8 flex justify-between">
      <text class="text-sm text-[--sar-primary-text] hover:text-[--sar-secondary-text]" @click="emit('switch:login', '账号密码登录')">
        账号登录
      </text>
      <text class="text-sm text-[--sar-primary-text] hover:text-[--sar-secondary-text]">
        注册
      </text>
    </view>
    <sar-button type="outline" @click="checkLogin(mobile, code)">
      登录
    </sar-button>
    <AreaCode v-model:visible="areaVisible" @select="onSelect" />
  </view>
</template>

<style lang="scss" scoped>
</style>
