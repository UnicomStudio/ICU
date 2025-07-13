// 全局要用的类型放到这里

type ChatRoleType = 'user' | 'assistant' | 'system' | 'error' | 'info' | undefined

declare global {
  interface ChatMessage {
    id: string
    role: ChatRoleType
    message: string
    content: string
    reasoning?: string
    showCodeLine?: boolean
  }
  interface ChatHistory {
    id: string
    title: string
    messages: ChatMessage[]
    createdAt: string
    updatedAt: string
  }
}

export {} // 防止模块污染
