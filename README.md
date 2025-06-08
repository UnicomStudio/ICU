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

## 🌐 API接口文档

### 🔑 用户认证

- 📩 获取验证码

```sh
# 获取验证码
curl -H 'accept: application/json' -H 'Content-Type: application/json' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' https://maas.ai-yuanjing.com/bffservice/v2/base/app/captcha
```

- 📲 发送验证码

```sh
# 发送验证码
curl -H 'Content-Type: application/json; charset=utf-8' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' -X POST https://maas.ai-yuanjing.com/bffservice/v2/base/app/sendCode -d '{"phone":"17771357633","captchaId":"DRkvJTkoTE6aZfcx62Kf","captchaCode":"n5at"}'
```

- 👤 用户登录

```sh
# 登录
curl -H 'Content-Type: application/json; charset=utf-8' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' -X POST https://maas.ai-yuanjing.com/user/api/v1/base/app/login -d '{"phone":"17771357633","smsCode":"758964","loginType":0}'
```

- 🔐 获取Token

```sh
# 获取Token
curl -H 'Content-Type: application/json; charset=utf-8' -H 'Host: maas-api.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' -X POST https://maas-api.ai-yuanjing.com/openapi/service/v1/oauth/97990974a34b407b914d86898a529604/token -d '{"grant_type":"client_credentials","client_id":"eaabe11e93534f4fac1c6f691d4cfe51","client_secret":"96aafd6f5d5946a1846c6c22041a5e8d","token_type":1}'
```

### 🤖 助手功能

- 📋 获取助手列表

```sh
# 获取助手列表
curl -H 'accept: application/json' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0ZDYyZjZlLWY4ZGYtNDJmNy1hNzQyLTQ1MGU5OTY1ZDlkNCIsInRlbmFudElEcyI6bnVsbCwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoiMTc3NzEzNTc2MzMiLCJuaWNrbmFtZSI6IjE3NzcxMzU3NjMzIiwiYnVmZmVyVGltZSI6MTc0OTEzNTY5NCwiZXhwIjoxNzU0MzEyNDk0LCJpYXQiOjE3NDkxMjgzNzQsImlzcyI6ImQ0ZDYyZjZlLWY4ZGYtNDJmNy1hNzQyLTQ1MGU5OTY1ZDlkNCIsIm5iZiI6MTc0OTEyODM3NCwic3ViIjoid2ViIn0.NCZUnULE4RhvPseoM4n_mNHcuQ_pGMfCrymk-uYfkzI' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' 'https://maas.ai-yuanjing.com/use/model/api/app/v1/assistant/list?pageNo=1&pageSize=20'
```

- 💬 获取对话列表

```sh
# 获取对话列表
curl -H 'accept: application/json' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0ZDYyZjZlLWY4ZGYtNDJmNy1hNzQyLTQ1MGU5OTY1ZDlkNCIsInRlbmFudElEcyI6bnVsbCwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoiMTc3NzEzNTc2MzMiLCJuaWNrbmFtZSI6IjE3NzcxMzU3NjMzIiwiYnVmZmVyVGltZSI6MTc0OTEzNTY5NCwiZXhwIjoxNzU0MzEyNDk0LCJpYXQiOjE3NDkxMjgzNzQsImlzcyI6ImQ0ZDYyZjZlLWY4ZGYtNDJmNy1hNzQyLTQ1MGU5OTY1ZDlkNCIsIm5iZiI6MTc0OTEyODM3NCwic3ViIjoid2ViIn0.NCZUnULE4RhvPseoM4n_mNHcuQ_pGMfCrymk-uYfkzI' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' 'https://maas.ai-yuanjing.com/use/model/api/app/v1/assistant/conversation/list?pageNo=1&pageSize=20'
```

- ➕ 创建新对话

```sh
# 创建新对话
curl -H 'Connection: keep-alive' -H 'sec-ch-ua-platform: "Android"' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlY2Y0ZGQwLTYyYzgtNDhhZS1hMjU3LThjYTE1NThjNjA3YSIsInRlbmFudElEcyI6bnVsbCwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoiMTg2MDcyNTE3MzIiLCJuaWNrbmFtZSI6IjE4NjA3MjUxNzMyIiwiYnVmZmVyVGltZSI6MTc0OTE0OTYzMCwiZXhwIjoxNzU0MzI2NDMwLCJpYXQiOjE3NDkxNDIzMTAsImlzcyI6IjNlY2Y0ZGQwLTYyYzgtNDhhZS1hMjU3LThjYTE1NThjNjA3YSIsIm5iZiI6MTc0OTE0MjMxMCwic3ViIjoid2ViIn0.RYO0N8yjH02aVy_VP5E6hBR5QBqJaF858U3n-voUZQA' -H 'User-Agent: Mozilla/5.0 (Linux; Android 11; WayDroid x86_64 Device Build/RQ3A.211001.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.100 Mobile Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'sec-ch-ua: "Android WebView";v="135", "Not-A.Brand";v="8", "Chromium";v="135"' -H 'Content-Type: application/json' -H 'sec-ch-ua-mobile: ?1' -H 'Origin: null' -H 'X-Requested-With: com.unicom.yuanjing.dpseek' -H 'Sec-Fetch-Site: cross-site' -H 'Sec-Fetch-Mode: cors' -H 'Sec-Fetch-Dest: empty' --compressed -H 'Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7' -X POST https://maas.ai-yuanjing.com/use/model/api/app/v1/assistant/conversation/create -d '{"assistantId":"3ecf4dd0-62c8-48ae-a257-8ca1558c607a","prompt":"hello","from":"ChatUnicom","iconColor":"#E3EFFA","model":"deepseek-r1","useSearch":true}'
```

- 🌀 获取流式输出

```sh
# 获取流式输出
curl -H 'Connection: keep-alive' -H 'x-logid: e6933a64-858b-47c4-84e9-ccdd0c3b5722' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlY2Y0ZGQwLTYyYzgtNDhhZS1hMjU3LThjYTE1NThjNjA3YSIsInRlbmFudElEcyI6bnVsbCwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoiMTg2MDcyNTE3MzIiLCJuaWNrbmFtZSI6IjE4NjA3MjUxNzMyIiwiYnVmZmVyVGltZSI6MTc0OTE0OTYzMCwiZXhwIjoxNzU0MzI2NDMwLCJpYXQiOjE3NDkxNDIzMTAsImlzcyI6IjNlY2Y0ZGQwLTYyYzgtNDhhZS1hMjU3LThjYTE1NThjNjA3YSIsIm5iZiI6MTc0OTE0MjMxMCwic3ViIjoid2ViIn0.RYO0N8yjH02aVy_VP5E6hBR5QBqJaF858U3n-voUZQA' -H 'sec-ch-ua-platform: "Android"' -H 'sec-ch-ua: "Android WebView";v="135", "Not-A.Brand";v="8", "Chromium";v="135"' -H 'sec-ch-ua-mobile: ?1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 11; WayDroid x86_64 Device Build/RQ3A.211001.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.100 Mobile Safari/537.36' -H 'Accept: text/event-stream, text/event-stream' -H 'Content-Type: application/json' -H 'Origin: null' -H 'X-Requested-With: com.unicom.yuanjing.dpseek' -H 'Sec-Fetch-Site: cross-site' -H 'Sec-Fetch-Mode: cors' -H 'Sec-Fetch-Dest: empty' --compressed -H 'Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7' -X POST https://maas.ai-yuanjing.com/use/model/api/app/v1/chatunicom/stream -d '{"input":"hello","model":"deepseek-r1","stream":true,"auto_citation":false,"conversationId":"33a033c1-b20e-48cd-82af-946390439167","use_lvm":true,"use_code":true,"use_speech":true,"use_search":true,"assistantId":"3ecf4dd0-62c8-48ae-a257-8ca1558c607a","extend_params":{},"need_search_list":true,"request_id":"e6933a64-858b-47c4-84e9-ccdd0c3b5722"}'
```

## ✅ 待办事项

- [x] ✅ 对接元景接口
  - [ ] 🔄 用户过期无感刷新接口对接
- [ ] 🌊 流式输出功能
  - [ ] 💬 微信小程序流式输出函数封装
  - [ ] 🌐 网页版本流式输出函数封装
  - [ ] 📱 APP 版本流式输出函数封装
  - [ ] ⚡️ 流输出状态判断
- [x] ✅ MarkedParser 宽屏样式修改

## 🙏 致谢

- 📚 [JS生成uuid(唯一标识符)](https://blog.csdn.net/pipizhou16/article/details/123691053)

---

<p align="center" style="font-size:1.2em; font-weight:bold; color:#d33a3a;">
<a href="https://github.com/UnicomStudio/ICU">ICU</a> © 2025 by <a href="https://github.com/easterNday">easterNday</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nd.svg" style="max-width: 1em;max-height:1em;margin-left: .2em;">
</p>
