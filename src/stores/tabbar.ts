import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabbarStore = defineStore(
  'tarbar-index',
  () => {
    // 定义用户信息
    const curIdx = ref<number>(0)
    const setCurIdx = (val: number) => {
      curIdx.value = val
    }

    return {
      curIdx,
      setCurIdx,
    }
  },
  {
    persist: true,
  },
)
