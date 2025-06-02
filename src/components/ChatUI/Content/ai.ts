/**
 * 将聊天历史转换为API所需的消息格式
 * @param {Array} chatHistory 聊天历史记录
 * @param {number} maxMessages 最大消息数量限制
 * @returns {Array} 格式化后的消息数组
 */
export function formatChatHistoryForAPI(chatHistory: any[], maxMessages = 10) {
  // 过滤掉非用户和助手的消息（如模型变更通知等）
  const validMessages = chatHistory.filter((msg: { role: any, content: any }) => msg.role === 'user' || msg.role === 'assistant')

  // 限制消息数量，并反转顺序（从旧到新）
  const limitedMessages = validMessages.slice(0, maxMessages).reverse()

  // 转换为API所需格式，并在开头添加提示词
  const formattedMessages = limitedMessages.map((msg: { role: any, content: any }) => ({
    role: msg.role,
    content: msg.content,
  }))

  // 在开头添加提示词
  return [
    {
      role: 'system',
      content: '你是一个有用的助手。请记住我们之前的对话内容，保持对话的连贯性。',
    },
    ...formattedMessages,
  ]
}
