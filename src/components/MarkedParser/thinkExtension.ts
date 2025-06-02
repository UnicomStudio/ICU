import type { Token, TokensList } from 'marked'

export const thinkExtension = {
  name: 'think',
  level: 'block', // block-level tokenizer
  start(src: string) {
    // Use regex to match <think> with optional spaces
    const match = src.match(/<think\s*>/)
    return match ? match.index ?? -1 : -1
  },
  tokenizer(this: any, src: string, _tokens: TokensList): Token | undefined {
    const rule = /^<think\s*>([\s\S]*?)(?:<\/think>|$)/
    const match = rule.exec(src)
    if (match) {
      const token: any = {
        type: 'think',
        raw: match[0],
        text: match[1],
        tokens: [],
      }
      // Use this.lexer to tokenize inline content
      this.lexer.inline(token.text, token.tokens)
      return token
    }
  },
  renderer(this: any, token: any) {
    // Use this.parser to parse inline tokens
    return `<div>${this.parser.parseInline(token.tokens)}</div>`
  },
}

// 调用示例（示范如何在Marked中使用该扩展）
// import { marked } from 'marked';
// import { thinkExtension } from './thinkExtension';

// marked.use({ extensions: [thinkExtension] });

// const markdown = '<think>Hello World</think>';
// const html = marked.parse(markdown);
// console.log(html); // <div>Hello World</div>
