<p align="center">
  <img align="center" src="./src/static/logo.svg" height="128" alt="logo"/>
</p>

<h1 align="center">
⚡️ ICU - <em>Intelligent form China Unicom</em> ⚡️
</h1>

<p align="center" style="font-size:1.2em; font-weight:bold; color:#ff0099;">
  💥 连药费都付不起，怀念已经利叠利 💥
</p>

## 📌 项目概述

✨ 大模型体系：算网为基、自主可控、集约赋能、百花齐放

🌙 打造大模型开发应用范式，成为大模型技术规模化落地应用的引领者

## 🛠 技术栈

- ⚡️ [Vue 3](https://github.com/vuejs/core) - 渐进式JavaScript框架
- 🚀 [Uni-app](https://uniapp.dcloud.io/) - 跨平台开发框架
- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 高性能原子化CSS引擎
- 📦 [Pinia](https://pinia.vuejs.org/) - Vue状态管理
- 🌐 [Vue-i18n](https://kazupon.github.io/vue-i18n/) - 国际化解决方案
- 🔧 [Vite](https://vitejs.dev/) - 下一代前端工具链
- 🛡 [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - 代码质量和风格

## 📂 项目结构

```
├── src/
│   ├── App.vue          # 🏠 主应用组件
│   ├── main.ts          # ⚙️ 应用入口
│   ├── components/      # 🧩 公共组件
│   ├── composables/     # 🧰 组合式函数
│   ├── layouts/         # 🖼 布局组件
│   ├── pages/           # 📄 页面组件
│   ├── stores/          # 🗄 状态管理
│   ├── utils/           # 🔧 工具函数
│   └── static/          # 🖼 静态资源
├── scripts/
│   ├── minimize.js      # ➖ 精简依赖脚本
│   └── restore.js       # 🔄 恢复依赖脚本
└── package.json         # 📦 项目配置
```

## 🚀 开发指南

### 📥 安装依赖

```bash
pnpm install
```

### 🔨 开发模式

```bash
# 🖥️ H5开发
pnpm dev:h5

# 💬 微信小程序开发
pnpm dev:mp-weixin

# 📱 App开发
pnpm dev:app
```

### 🏗 构建生产版本

```bash
# 🖥️ H5构建
pnpm build:h5

# 💬 微信小程序构建
pnpm build:mp-weixin

# 📱 App构建
pnpm build:app
```

## 🔄 依赖精简与恢复说明

🔧 项目提供了 `minimize.js` 和 `restore.js` 两个脚本，用于动态删除非目标平台依赖以减小体积。

### ➖ 精简依赖

```bash
# 精简微信小程序平台依赖
pnpm minimize mp-weixin
# 其他平台以此类推
pnpm minimize <UNI_PLATFORM>
```

### 🔄 恢复依赖

```bash
pnpm restore
```

## ✅ 待办事项

- [ ] 📋️ MCP读取（示例提问：今天天气怎么样）
- [ ] 💭 AI 对话
  - [ ] 💬 语音识别功能
  - [ ] 🤲 语音合成功能
  - [ ] 🔏 临时对话功能
  - [ ] ☝️ 提示词预选显示
  - [ ] 📻️ 智能体广场

## 🙏 致谢

- ⚕️ [JS生成uuid(唯一标识符)](https://blog.csdn.net/pipizhou16/article/details/123691053)
- 📑 [z-paging](https://z-paging.zxlee.cn/) : 一个uni-app (opens new window)分页组件。

---

<p align="center" style="font-size:1.2em; font-weight:bold; color:#d33a3a;">
<img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" style="max-width: 16px;max-height:16px;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" style="max-width: 16px;max-height:16px;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" style="max-width: 16px;max-height:16px;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nd.svg" style="max-width: 16px;max-height:16px;margin-left: .2em;">
<br/>
<a href="https://github.com/UnicomStudio/ICU">ICU</a> © 2025 by <a href="https://github.com/easterNday">easterNday</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a>
</p>
