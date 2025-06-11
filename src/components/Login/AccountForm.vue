<script lang="ts" setup>
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
import { useNavigate } from '@/composables/useNavigate'

const emit = defineEmits<{
  (e: 'switch:login', method: string): void
}>()
</script>

<template>
  <view class="flex flex-col space-y-4">
    <mp-html markdown content="> + 账号密码登录" />
    <sar-input placeholder="请输入手机号码">
      <template #prepend>
        <view i-carbon-group-account class="text-[--sar-primary-text]" />
      </template>
    </sar-input>
    <sar-input type="password" placeholder="请输入密码">
      <template #prepend>
        <view i-carbon-ibm-cloud-pak-security class="text-[--sar-primary-text]" />
      </template>
    </sar-input>
    <!-- 其他登录选项 -->
    <view class="mb-8 flex justify-between">
      <text class="text-sm text-[--sar-primary-text] hover:text-[--sar-secondary-text]" @click="emit('switch:login', '验证码登录')">
        验证码登录
      </text>
      <text class="text-sm text-[--sar-primary-text] hover:text-[--sar-secondary-text]">
        注册
      </text>
    </view>
    <sar-button type="outline" @click="useNavigate({ url: '/pages/settings/index' })">
      登录
    </sar-button>
  </view>
</template>

<style lang="scss" scoped>
</style>
