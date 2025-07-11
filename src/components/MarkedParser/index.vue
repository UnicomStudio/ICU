<script lang="ts" setup>
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  showCodeLine: {
    type: Boolean,
    default: false,
  },
})

const componentClass = 'chat-content'

// 用于存储所有代码块的原始代码，方便复制功能使用
const copyCodeData: string[] = []

// 配置marked解析器
const marked = new MarkdownIt({
  html: true,
  highlight(code, lang) {
    let result = ''
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    try {
      result = hljs.highlight(code, { language }).value
    }
    catch {
      result = hljs.highlightAuto(code).value
    }

    // 将高亮后的代码按行拆分，去除最后空行
    const lines = result.split(/\n/).slice(0, -1)
    // 为每行代码添加自定义行号
    let html = lines
      .map((item, index) => {
        if (item === '') {
          return ''
        }
        // 每行包裹 <li>，行号放在 <span> 中，data-line 属性存储行号
        return (
          `<li><span class="line-num" data-line="${index + 1}"></span>${item}</li>`
        )
      })
      .join('')
    if (props.showCodeLine) {
      html = `<ol style="padding: 0px 30px;">${html}</ol>`
    }
    else {
      html = `<ol style="padding: 0px 7px;list-style:none;">${html}</ol>`
    }

    // 将原始代码存入 copyCodeData，供复制按钮使用
    copyCodeData.push(code)

    let codeHTML = `<div class="code-block">`
    codeHTML += `<div style="color: #aaa;padding:8px; background-color: #282c34; border: 1px solid #282c34; border-radius: 6px 6px 0 0; display: flex; flex-direction: row;">`
    // 显示代码语言及复制按钮，复制按钮绑定 code-data-index 方便查找对应代码
    codeHTML += `<span style="color:#e6c07b;margin-left: 8px; flex: 1;">${lang}</span>`
    codeHTML += `</div>`
    codeHTML += `<pre class="hljs" style="word-wrap: break-word;white-space: pre-wrap;width:auto;padding:10px 8px 0;margin-bottom:5px;overflow: auto;display: block; border-radius: 0 0 6px 6px;"><code class="hljs language-${lang}">${html}</code></pre>`
    codeHTML += '</div>'

    return codeHTML
  },
})

const parsedContent = computed(() => {
  try {
    console.warn('Markdown内容:', marked.parse(props.content))
    return marked.render(props.content) as any
  }
  catch (e) {
    console.error('Markdown解析错误:', e)
    return props.content
  }
})

// 处理 rich-text 中节点点击事件，主要用于代码复制按钮
function handleItemClick(e: any) {
  const { name, attrs } = e.detail.node
  const { 'code-data-index': codeDataIndex, class: className } = attrs
  // 判断点击的是否为复制按钮
  if (className === 'copy-btn') {
    uni.setClipboardData({
      data: copyCodeData[codeDataIndex],
    })
  }
  else if (name === 'a') {
    const url = attrs.href
    // #ifdef APP-PLUS
    plus.runtime.openURL(url)
    // #endif

    // #ifdef H5
    window.open(url)
    // #endif

    // #ifdef MP
    uni.setClipboardData({
      data: url,
    })
    uni.showToast({ title: '复制成功', icon: 'none' })
    // #endif
  }
}
</script>

<template>
  <view :class="[`${componentClass}`]">
    <rich-text space="nbsp" :nodes="parsedContent" @itemclick="handleItemClick" />
  </view>
</template>

<style lang="scss" scoped>
.chat-content {
  line-height: 1.5;
  word-break: break-all;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
  }

  h1,
  h2,
  h3 {
    margin-top: 20px;
  }

  h4,
  h5,
  h6 {
    margin-top: 10px;
  }

  a {
    background-color: transparent;
    color: #2196f3;
    text-decoration: none;
  }

  hr,
  ::v-deep .hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid grey;
  }

  img {
    max-width: 35%;
  }

  em {
    font-style: italic;
    font-weight: inherit;
  }

  ol,
  ul {
    margin-top: 0;

    padding-left: 40px;
  }

  ol ol,
  ol ul,
  ul ol,
  ul ul {
    margin-bottom: 0;
  }

  ol ol,
  ul ol {
    list-style-type: lower-roman;
  }

  ol ol ol,
  ul ul ol {
    list-style-type: lower-alpha;
  }

  dl {
    margin-top: 0;
  }

  dt {
    font-weight: 600;
  }

  dt,
  dd {
    line-height: 1.4;
  }

  .task-list-item {
    list-style-type: none;
  }

  .task-list-item input {
    margin: 0 0.2em 0.25em -1.6em;
    vertical-align: middle;
  }

  pre {
    position: relative;
    z-index: 11;
  }

  code,
  kbd,
  pre,
  samp {
    font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  code:not(.hljs) {
    padding: 2px 4px;
    color: #c7254e;
    background-color: #ffe7ee;
    border-radius: 4px;
  }

  code:empty {
    display: none;
  }

  pre code.hljs {
    color: var(--vg__text-1);
    border-radius: 16px;
    background: var(--vg__bg-1);
  }

  pre.code-block-wrapper {
    background: #2b2b2b;
    color: #f8f8f2;
    border-radius: 4px;
    overflow-x: auto;
    padding: 1em;
    position: relative;
  }

  pre.code-block-wrapper code {
    padding: auto;
    color: inherit;
    background-color: inherit;
    border-radius: 0;
  }

  .code-block-header__copy {
    margin-left: 5px;
  }

  abbr[data-original-title],
  abbr[title] {
    cursor: help;
    border-bottom: 1px dotted #777;
  }

  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    border-left: 5px solid #e5e5e5;
  }

  blockquote ol:last-child,
  blockquote p:last-child,
  blockquote ul:last-child {
    margin-bottom: 0;
  }

  blockquote .small,
  blockquote footer,
  blockquote small {
    display: block;
    line-height: 1.42857143;
    color: #777;
  }

  blockquote .small:before,
  blockquote footer:before,
  blockquote small:before {
    content: '\2014 \00A0';
  }

  .blockquote-reverse,
  blockquote.pull-right {
    padding-right: 15px;
    padding-left: 0;
    text-align: right;
    border-right: 5px solid #eee;
    border-left: 0;
  }

  .blockquote-reverse .small:before,
  .blockquote-reverse footer:before,
  .blockquote-reverse small:before,
  blockquote.pull-right .small:before,
  blockquote.pull-right footer:before,
  blockquote.pull-right small:before {
    content: '';
  }

  .blockquote-reverse .small:after,
  .blockquote-reverse footer:after,
  .blockquote-reverse small:after,
  blockquote.pull-right .small:after,
  blockquote.pull-right footer:after,
  blockquote.pull-right small:after {
    content: '\00A0 \2014';
  }

  .footnotes {
    -moz-column-count: 2;
    -webkit-column-count: 2;
    column-count: 2;
  }

  .footnotes-list {
    padding-left: 2em;
  }

  table,
  ::v-deep .table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
    max-width: 65em;
    overflow: auto;
    margin-top: 0;
  }

  table tr,
  ::v-deep .table .tr {
    border-top: 1px solid #e5e5e5;
  }

  table th,
  table td,
  ::v-deep .table .th,
  ::v-deep .table .td {
    padding: 6px 13px;
    border: 1px solid #e5e5e5;
  }

  table th,
  ::v-deep .table .th {
    font-weight: 600;
  }

  .hljs[class*='language-']:before {
    position: absolute;
    z-index: 3;
    top: 0.8em;
    right: 1em;
    color: #999;
  }

  .hljs[class~='language-js']:before {
    content: 'js';
  }

  .hljs[class~='language-ts']:before {
    content: 'ts';
  }

  .hljs[class~='language-html']:before {
    content: 'html';
  }

  .hljs[class~='language-md']:before {
    content: 'md';
  }

  .hljs[class~='language-vue']:before {
    content: 'vue';
  }

  .hljs[class~='language-css']:before {
    content: 'css';
  }

  .hljs[class~='language-sass']:before {
    content: 'sass';
  }

  .hljs[class~='language-scss']:before {
    content: 'scss';
  }

  .hljs[class~='language-less']:before {
    content: 'less';
  }

  .hljs[class~='language-stylus']:before {
    content: 'stylus';
  }

  .hljs[class~='language-go']:before {
    content: 'go';
  }

  .hljs[class~='language-java']:before {
    content: 'java';
  }

  .hljs[class~='language-c']:before {
    content: 'c';
  }

  .hljs[class~='language-sh']:before {
    content: 'sh';
  }

  .hljs[class~='language-yaml']:before {
    content: 'yaml';
  }

  .hljs[class~='language-py']:before {
    content: 'py';
  }

  .hljs[class~='language-docker']:before {
    content: 'docker';
  }

  .hljs[class~='language-dockerfile']:before {
    content: 'dockerfile';
  }

  .hljs[class~='language-makefile']:before {
    content: 'makefile';
  }

  .hljs[class~='language-javascript']:before {
    content: 'js';
  }

  .hljs[class~='language-typescript']:before {
    content: 'ts';
  }

  .hljs[class~='language-markup']:before {
    content: 'html';
  }

  .hljs[class~='language-markdown']:before {
    content: 'md';
  }

  .hljs[class~='language-json']:before {
    content: 'json';
  }

  .hljs[class~='language-ruby']:before {
    content: 'rb';
  }

  .hljs[class~='language-python']:before {
    content: 'py';
  }

  .hljs[class~='language-bash']:before {
    content: 'sh';
  }

  .hljs[class~='language-php']:before {
    content: 'php';
  }
}
</style>
