/// <reference types="vite/client" />

/** 扩展环境变量import.meta.env */
interface ImportMetaEnv {
  /** 这里增加自定义的声明 */
  VITE_APP_TITLE: string
  VITE_APP_PORT: number
  VITE_UNI_APPID: string
  VITE_WX_APPID: string

  VITE_CONVERSATION_CREATE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line ts/no-empty-object-type
  const component: DefineComponent<{}, {}, any>
  export default component
}
