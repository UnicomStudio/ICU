<script setup lang="ts">
const loginMethod = ref('验证码登录')

onLoad(() => {
  const userInfoStore = useUserInfoStore()

  // 如果已经登录，则跳转到首页
  // TODO: 令牌过期校验
  if (userInfoStore.userInfo != null && userInfoStore.userInfo.uid != null) {
    useNavigate({ url: '/pages/settings/index' })
  }
})
</script>

<template>
  <!-- 顶部图片 - 绝对定位确保覆盖在顶部 -->
  <image
    src="@img/banner.svg"
    mode="widthFix" class="absolute left-0 top-0 h-auto w-full"
  />

  <!-- 占位空间，高度与图片相同 -->
  <view class="w-full pt-[40%]" />

  <!-- 底部白色圆角框 - flex-1确保填满剩余空间 -->
  <view class="z-10 mt-[-20rpx] w-full flex-1 rounded-t-3xl bg-[--sar-emphasis-bg]">
    <!-- 这里可自行添加表单内容 -->
    <view class="ml-4 mt-[40rpx] text-3xl font-bold">
      登录
    </view>
    <view class="mx-12 mt-8">
      <!-- 登录方式选择（验证码登录） -->
      <LoginVerificationForm v-if="loginMethod === '验证码登录'" @switch:login="loginMethod = $event" />
      <LoginAccountForm v-else-if="loginMethod === '账号密码登录'" @switch:login="loginMethod = $event" />
    </view>
    <!-- #ifndef MP-WEIXIN -->
    <!-- 其他登录方式 -->
    <view class="mx-auto mt-8 w-4/10">
      <sar-divider>
        其他登录方式
      </sar-divider>
    </view>
    <view class="flex justify-center space-x-8">
      <view text="2xl" i-simple-icons-qq text-blue />
      <view text="2xl" i-simple-icons-wechat text-green />
      <view text="2xl" i-simple-icons-sinaweibo text-red />
    </view>
    <!-- #endif -->
  </view>
</template>

<style lang="scss" scoped></style>

<route type="home" lang="json5">
{}
</route>
