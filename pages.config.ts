import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  easycom: {
    custom: {
      '^sar-(.*)': 'sard-uniapp/components/$1/$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)': 'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  pages: [],
  globalStyle: {
    backgroundColor: '@bgColor',
    backgroundColorBottom: '@bgColorBottom',
    backgroundColorTop: '@bgColorTop',
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '#000000',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: '联通元景',
    navigationStyle: 'custom',
  },
  tabBar: {
    backgroundColor: '@tabBgColor',
    borderStyle: '@tabBorderStyle',
    color: '@tabFontColor',
    selectedColor: '@tabSelectedColor',
    list: [
      {
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home.png',
        pagePath: 'pages/index',
        text: '对话',
        // icon: 'home',
        // iconType: 'wot',
        icon: 'i-carbon-chat',
        iconType: 'unocss',
      },
      {
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home.png',
        pagePath: 'pages/settings/index',
        text: '设置',
        icon: 'i-carbon-settings',
        iconType: 'unocss',
      },
      // {
      //   iconPath: 'static/tabbar/component.png',
      //   selectedIconPath: 'static/tabbar/componentHL.png',
      //   pagePath: 'pages/component/component',
      //   text: '组件',
      //   icon: 'i-carbon-code',
      //   iconType: 'unocss',
      // },
      // {
      //   pagePath: 'pages/my/index',
      //   text: '我的',
      //   icon: '/static/logo.svg',
      //   iconType: 'local',
      // },
      // {
      //   pagePath: 'pages/my/index',
      //   text: '我的',
      //   icon: 'iconfont icon-my',
      //   iconType: 'iconfont',
      // },
    ],
  },
})
