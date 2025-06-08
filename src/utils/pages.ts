import * as pagesConfig from '@/pages.json'

const { tabBar = { list: [] } } = { ...pagesConfig }

export const tabBarList = tabBar?.list || []

export function getLastPage() {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包会报错，所以改用下面这个【虽然我加了 src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/** 判断当前页面是否是 tabbar 页  */
export function getIsTabbar() {
  try {
    const lastPage = getLastPage()
    const currPath = lastPage?.route

    return Boolean(tabBar?.list?.some((item: any) => item.pagePath === currPath))
  }
  catch {
    return false
  }
}

/**
 * 判断指定页面是否是 tabbar 页
 * @param path 页面路径
 * @returns true: 是 tabbar 页 false: 不是 tabbar 页
 */
export function isTableBar(path: string) {
  if (!tabBar) {
    return false
  }
  if (!tabBar.list.length) {
    // 通常有 tabBar 的话，list 不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  // 这里需要处理一下 path，因为 tabBar 中的 pagePath 是不带 /pages 前缀的
  if (path.startsWith('/')) {
    path = path.substring(1)
  }
  return !!tabBar.list.find((e: any) => e.pagePath === path)
}
