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
})
