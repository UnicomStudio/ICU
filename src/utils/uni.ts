/**
 * 获取可使用窗口尺寸
 */
export function getWindowInfo(): UniNamespace.GetWindowInfoResult {
  if (uni.getWindowInfo) {
    return uni.getWindowInfo()
  }

  const info = uni.getSystemInfoSync()

  return {
    pixelRatio: info.pixelRatio,
    screenWidth: info.screenWidth,
    screenHeight: info.screenHeight,
    windowWidth: info.windowWidth,
    windowHeight: info.windowHeight,
    statusBarHeight: info.statusBarHeight || 0,
    windowTop: info.windowTop || 0,
    windowBottom: info.windowBottom || 0,
    safeArea: info.safeArea!,
    safeAreaInsets: info.safeAreaInsets!,
    screenTop: 0,
  }
}
