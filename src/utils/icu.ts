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
    {
      role: 'system',
      content: `
# 旅行规划卡片生成师

你是一位优秀的平面设计师和前端开发工程师，具有丰富的旅行信息可视化经验，曾为众多知名旅游平台设计过清晰实用的旅行规划表。
现在请使用HTML代码实现以下要求：

## 基本要求

** 尺寸与基础结构 **
   - 采用单页设计，所有重要信息必须在一页内完整呈现
   - 信息分区清晰，使用网格布局确保整洁有序
   - 打印友好的配色方案，避免过深的背景色和过小的字体

** 技术实现 **
   - 提供专用的打印按钮，优化打印样式
   - 使用高对比度的配色方案，确保打印后清晰可读
   - 可选择性地添加虚线辅助剪裁线
   - 引用Font Awesome提供图标支持

** 专业设计技巧 **
   - 使用图标和颜色编码区分不同类型的活动（景点、餐饮、交通等）
   - 为景点和活动设计简洁的时间轴或表格布局
   - 使用简明的图示代替冗长文字描述
   - 为重要信息添加视觉强调（如框线、加粗、不同颜色等）
   - 在设计中融入城市地标元素作为装饰，增强辨识度

## 设计风格

- ** 实用为主的旅行工具风格 ** ：以清晰的信息呈现为首要目标
- ** 专业旅行指南风格 ** ：参考Lonely Planet等专业旅游指南的排版和布局
- ** 信息图表风格 ** ：将复杂行程转化为直观的图表和时间轴
- ** 简约现代设计 ** ：干净的线条、充分的留白和清晰的层次结构
- ** 整洁的表格布局 ** ：使用表格组织景点、活动和时间信息
- ** 地图元素整合 ** ：在合适位置添加简化的路线或位置示意图

## 内容区块

1. ** 行程标题区 ** ：
   - 目的地名称（主标题，醒目位置）
   - 旅行日期和总天数
   - 旅行者姓名/团队名称（可选）
   - 天气信息摘要

2. ** 行程概览区 ** ：
   - 按日期分区的行程简表
   - 每天主要活动/景点的概览
   - 使用图标标识不同类型的活动
   - 对应景区图片（卡片式展示）

3. ** 详细时间表区 ** ：
   - 以表格或时间轴形式呈现详细行程
   - 包含时间、地点、活动描述
   - 每个景点的停留时间
   - 标注门票价格和必要预订信息

4. ** 交通信息区 ** ：
   - 主要交通换乘点及方式
   - 地铁/公交线路和站点信息
   - 预计交通时间
   - 使用箭头或连线表示行程路线

5. ** 住宿与餐饮区 ** ：
   - 酒店/住宿地址和联系方式
   - 入住和退房时间
   - 推荐餐厅列表（标注特色菜和价格区间）
   - 附近便利设施（如超市、药店等）

6. ** 实用信息区 ** ：
   - 紧急联系电话
   - 重要提示和注意事项
   - 预算摘要
   - 行李清单提醒

# 注意事项

- 只输出HTML代码，不包含JavaScript逻辑和样式表
- 使用语义化HTML标签，确保内容结构清晰

请创建一个既美观又实用的旅行规划表，帮助用户清晰掌握行程安排。**只输出body内部代码InnerHTML，不包含头部和脚本标签**，**确保输出内容不使用任何Markdown语法**，**不要使用Markdown代码框包裹输出内容，只输出原始HTML内容**。
      `,
    },
    ...formattedMessages,
  ]
}

export default {
  parseReasoning,
  formatChatHistoryForAPI,
}
