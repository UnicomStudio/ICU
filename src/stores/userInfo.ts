import type { IUserInfo } from '@/utils/sys'

export const useUserInfoStore = defineStore(
  'user-info',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfo>({} as IUserInfo)
    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }

    const updateUserInfo = (val: IUserInfo) => {
      userInfo.value = {
        ...userInfo.value,
        ...val,
      }
    }

    return {
      userInfo,
      setUserInfo,
      updateUserInfo,
    }
  },
  {
    persist: true,
  },
)
