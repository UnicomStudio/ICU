import un from '@uni-helper/uni-network'
import { useUserInfoStore } from '@/stores/userInfo'

export interface IUserInfo {
  uid: string
  username: string
  nickname: string
  appId: string
  apiKey: string
  secretKey: string
  token: string
  refreshToken: string
  expiresAt: number
  expireIn: string
}

export async function getCaptcha() {
  const response = await un.get('https://maas.ai-yuanjing.com/bffservice/v2/base/app/captcha')
  if (response.status === 200) {
    return {
      b64s: (response.data as any).data.b64s,
      captchaId: (response.data as any).data.captchaId,
    }
  }
}

export async function sendCode(mobile: string, captchaId: string, captchaCode: string) {
  const response = await un.post('https://maas.ai-yuanjing.com/bffservice/v2/base/app/sendCode', { phone: mobile, captchaId, captchaCode })
  if (response.status === 200) {
    useToast({ title: (response.data as any).data || (response.data as any).data.msg || '发送失败' })
  }
}

export async function login(mobile: string, smsCode: string) {
  const response = await un.post('https://maas.ai-yuanjing.com/user/api/v1/base/app/login', { phone: mobile, smsCode, loginType: 0 })

  if (response.status === 200) {
    const userInfo = (response.data as any).data as IUserInfo
    const userInfoStore = useUserInfoStore()
    userInfoStore.setUserInfo(userInfo)
    return userInfo
  }
  return null
}
