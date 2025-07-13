<script lang="ts" setup>
const nickname = ref('easterNday')
const apiKey = ref('您还没有设置API Key')
const appId = ref('您还没有设置App ID')

onMounted(() => {
  nickname.value = 'easterNday'
  apiKey.value = '您还没有设置API Key'
  appId.value = '您还没有设置App ID'
})
</script>

<template>
  <!-- 顶部图片 - 绝对定位确保覆盖在顶部 -->
  <view class="absolute left-0 top-0 h-64 w-full items-center justify-center bg-[--sar-secondary-bg]">
    <view class="h-full flex flex-row items-center justify-center">
      <sar-avatar src="https://fastly.jsdelivr.net/npm/@sard/assets/pic1.jpg" />
      <view class="ml-4 w-[50%] flex flex-col items-start justify-start">
        <view class="flex gap-2">
          <text i-simple-icons:adobeillustrator class="text-xl text-yellow" />
          <text class="text-xl font-bold">
            {{ nickname }}
          </text>
        </view>
        <view class="text-sm">
          <sar-tag theme="primary">
            {{ apiKey }}
          </sar-tag>
          <sar-tag theme="secondary">
            {{ appId }}
          </sar-tag>
        </view>
      </view>
    </view>
  </view>

  <!-- 占位空间，高度与图片相同 -->
  <view class="w-full pt-48" />
  <!-- 组件列表导航 -->
  <view
    class="z-10 mt-[-32rpx] w-full flex-1 rounded-t-3xl bg-[--sar-emphasis-bg]"
  >
    <view class="mt-[64rpx]">
      <sar-list inlaid>
        <sar-list-item arrow hover title="ChatUI 组件列表">
          <template #icon>
            <text i-simple-icons-chromatic class="text-red-500" />
          </template>
        </sar-list-item>
        <sar-list-item arrow hover title="MarkedParser 组件列表">
          <template #icon>
            <text i-simple-icons-markdown class="text-blue-500" />
          </template>
        </sar-list-item>
        <sar-list-item arrow hover title="账号设置">
          <template #icon>
            <text i-carbon-user-profile class="text-green-500" />
          </template>
        </sar-list-item>
        <sar-list-item arrow hover title="通用设置">
          <template #icon>
            <text i-carbon-settings-edit class="text-yellow-500" />
          </template>
        </sar-list-item>
        <sar-list-item arrow hover title="帮助与反馈">
          <template #icon>
            <text i-carbon-ibm-event-processing class="text-pink-500" />
          </template>
        </sar-list-item>
      </sar-list>
    </view>
  </view>
  <sar-tabbar-pit safe-area-inset-bottom />
</template>

<route lang="json5">
{
  "layout": "tabbar"
}
</route>
