export const useChatHistoriesStore = defineStore(
  'chat-histories',
  () => {
    // 定义聊天记录
    const chatHistories = ref<ChatHistory[]>([])

    const addChatHistory = (history: ChatHistory) => {
      chatHistories.value.unshift(history)
    }

    const deleteChatHistoryById = (id: string) => {
      chatHistories.value = chatHistories.value.filter(msg => msg.id !== id)
    }

    const updateChatHistoryById = (id: string, content: ChatMessage[]) => {
      const history = chatHistories.value.find(msg => msg.id === id)
      if (history) {
        history.messages = content
      }
      else {
        addChatHistory({
          id,
          title: content[content.length - 1].message,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    }

    const getChatHistoryById = (id: string) => {
      return chatHistories.value.find(msg => msg.id === id)
    }

    return {
      chatHistories,
      addChatHistory,
      updateChatHistoryById,
      getChatHistoryById,
      deleteChatHistoryById,
    }
  },
  {
    persist: true,
  },
)
