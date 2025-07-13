/** 解析后的文本片段 */
type ParsedSegment =
  | { type: 'text', content: string }
  | { type: 'reasoning', content: string }

/**
 * 解析文本中的推理部分（用特定标签标记的内容）
 * @param text - 待解析的文本
 * @param tags - 标签标识（可选，可以是单个字符串或字符串数组）
 * @returns 返回分割后的文本片段数组，识别为推理的部分标记为 'reasoning'
 */
export function parseReasoning(text: string, tags?: string | string[]): ParsedSegment[] {
  try {
    const defaultTags = ['think', 'reason', 'reasoning', 'thought']
    const usedTags = tags
      ? Array.isArray(tags) ? tags : [tags]
      : defaultTags

    // 构建正则表达式时转义特殊字符
    const escapeRegExp = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const escapedTags = usedTags.map(escapeRegExp)
    const tagPattern = new RegExp(`<(${escapedTags.join('|')})>`, 'i')
    const closeTagPattern = new RegExp(`</(${escapedTags.join('|')})>`, 'i')

    const result: ParsedSegment[] = []
    let currentIndex = 0
    let isReasoning = false

    while (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex)

      // 优先查找匹配当前状态的标签
      const matchPattern = isReasoning ? closeTagPattern : tagPattern
      const tagMatch = remainingText.match(matchPattern)

      if (!tagMatch) {
        // 无匹配标签时添加剩余文本
        const segment = remainingText.trim()
        if (segment) {
          result.push({
            type: isReasoning ? 'reasoning' : 'text',
            content: segment,
          })
        }
        break
      }

      // 处理标签前的内容
      const segment = remainingText.substring(0, tagMatch.index).trim()
      if (segment) {
        result.push({
          type: isReasoning ? 'reasoning' : 'text',
          content: segment,
        })
      }

      // 更新状态（开标签进入推理模式，闭标签退出）
      isReasoning = !isReasoning
      currentIndex += tagMatch.index! + tagMatch[0].length
    }

    return result
  }
  catch (e) {
    console.error(`Error parsing reasoning: ${e}`)
    return text ? [{ type: 'text', content: text }] : []
  }
}

/**
 * 将聊天历史转换为API所需的消息格式
 * @param {Array} chatHistory 聊天历史记录
 * @param {number} maxMessages 最大消息数量限制
 * @returns {Array} 格式化后的消息数组
 */
export function formatChatHistoryForAPI(chatHistory: ChatMessage[], maxMessages = 10) {
  // 过滤掉非用户和助手的消息（如模型变更通知等）
  const validMessages = chatHistory.filter(msg => msg.role === 'user' || msg.role === 'assistant')

  // 限制消息数量，并反转顺序（从旧到新）
  const limitedMessages = validMessages.slice(0, maxMessages).reverse()

  // 转换为API所需格式，并在开头添加提示词
  const formattedMessages = limitedMessages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }))

  // 在开头添加提示词
  return [
    // {
    //   role: 'system',
    //   content: ``,
    // },
    ...formattedMessages,
  ]
}

export default {
  parseReasoning,
  formatChatHistoryForAPI,
}
