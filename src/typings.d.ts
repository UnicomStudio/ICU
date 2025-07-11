// 全局要用的类型放到这里

type ChatRoleType = 'user' | 'assistant' | 'system' | 'error' | 'info' | undefined

declare global {
  interface ChatMessage {
    role?: ChatRoleType
    message: string
    content: string
    reasoning?: string
    showCodeLine?: boolean
  }
}

export {} // 防止模块污染
