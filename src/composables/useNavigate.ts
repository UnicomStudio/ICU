interface NavigateOptions {
  url: string
  events?: object
  success?: () => void
  fail?: () => void
  complete?: () => void
}

export function useNavigate(options: NavigateOptions) {
  // TODO: 增加页面类型判断

  try {
    if (isTableBar(options.url)) {
      // 如果是 tabbar 页面，直接跳转
      uni.switchTab({
        url: options.url,
        events: options.events,
        success: options.success,
        fail: options.fail,
        complete: options.complete,
      })
    }
    else {
      uni.navigateTo({
        url: options.url,
        events: options.events,
        success: options.success,
        fail: options.fail,
        complete: options.complete,
      })
    }
  }
  catch (error) {
    console.error('调用Navigate失败:', error)
  }
}
