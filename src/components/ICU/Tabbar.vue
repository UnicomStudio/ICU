<script setup lang="ts">
import { tabBar } from '@/pages.json'
import { useTabbarStore } from '@/stores'

function current() {
  const tabbarStore = useTabbarStore()
  return tabbarStore.curIdx
}

/** tabbarList 里面的 path 从 pages.config.ts 得到 */
const tabbarList = tabBar.list.map(item => ({ ...item, path: `/${item.pagePath}` }))

function setTabbar(index: number | string) {
  const tabbarStore = useTabbarStore()
  if (typeof index === 'string') {
    index = Number(index)
  }

  const url = tabbarList[index].path
  tabbarStore.setCurIdx(index)
  useNavigate({ url })
}

onLoad(() => {
  // 解决原生 tabBar 未隐藏导致有2个 tabBar 的问题
  if (getIsTabbar()) {
    uni.hideTabBar({
      fail(err) {
        console.error('hideTabBar fail: ', err)
      },
      success(res) {
        console.warn('hideTabBar success: ', res)
      },
    })
  }
})

onMounted(() => {
  const tabbarStore = useTabbarStore()
  setTabbar(tabbarStore.curIdx)
})
</script>

<template>
  <sar-tabbar :current="current()" safe-area-inset-bottom fixed @change="setTabbar">
    <block v-for="(item, idx) in tabbarList" :key="item.path">
      <sar-tabbar-item
        v-if="item.iconType === 'wot'"
        :name="idx"
        :icon="item.icon"
        :text="item.text"
      />
      <sar-tabbar-item
        v-else-if="item.iconType === 'unocss' || item.iconType === 'iconfont'"
        :name="idx"
        :text="item.text"
      >
        <template #icon>
          <view
            h-40rpx
            w-40rpx
            :class="[item.icon]"
          />
        </template>
      </sar-tabbar-item>
      <sar-tabbar-item
        v-else-if="item.iconType === 'local'"
        :name="idx"
        :text="item.text"
      >
        <template #icon>
          <image :src="item.icon" h-40rpx w-40rpx />
        </template>
      </sar-tabbar-item>
    </block>
  </sar-tabbar>
</template>

<style lang="scss" scoped>
</style>
