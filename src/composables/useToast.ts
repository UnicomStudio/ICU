interface ToastOptions {
  title: string
  duration?: number
  success?: () => void
  fail?: () => void
  complete?: () => void
}

/**
 * 显示消息提示框（已排除兼容性问题的参数）
 * @example
 * // 基本用法
 * useToast({ title: '操作成功' })
 *
 * // 自定义图标
 * useToast({
 *   title: '加载中',
 *   icon: 'loading'
 * })
 *
 * // 自定义图片
 * useToast({
 *   title: '自定义图标',
 *   image: '/static/icon.png'
 * })
 *
 * // 设置持续时间
 * useToast({
 *   title: '稍等片刻',
 *   duration: 2000
 * })
 */
export function useToast(options: ToastOptions) {
  if (!options.title || options.title.length > 30) {
    console.warn('Toast标题不能为空且长度应小于30字符')
    return
  }

  try {
    uni.showToast({
      title: options.title,
      duration: options.duration || 1500,
      success: options.success,
      fail: options.fail,
      complete: options.complete,
    })
  }
  catch (error) {
    console.error('调用Toast失败:', error)
  }
}
