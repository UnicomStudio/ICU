<p align="center">
  <img align="center" src="./src/static/logo.svg" height="128" alt="logo"/>
</p>

<h1 align="center">
⚡️ ICU ⚡️
</h1>

<h3 align="center">
🚀 Intelligence4ChinaUnicom 🚀
</h3>

<p align="center" style="font-size:1.2em; font-weight:bold; color:#ff0099;">
  💥 连药费都付不起，怀念已经利叠利 💥
</p>

<p align="center" style="font-size:1em; color:#999999; margin-top:-10px;">
  一个专注于中国联通智能化解决方案的前沿项目，融合最新技术栈，助力高效开发与极致性能。
</p>

>

## 待办

- [x] 对接元景接口
  - [ ] 用户过期无感刷新接口对接
- [ ] 流式输出功能
  - [ ] 微信小程序流式输出函数封装
  - [ ] 网页版本流式输出函数封装
  - [ ] APP 版本流式输出函数封装
  - [ ] 流输出状态判断
- [x] MarkedParser 宽屏样式修改

## 特性

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [esbuild](https://github.com/evanw/esbuild) - 就是快！

- 🗂 [基于文件的路由](./src/pages)

- 📦 [组件自动化加载](./src/components)

- 📑 [布局系统](./src/layouts)

- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎

- 😃 [各种图标集为你所用](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)

- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 无需引入

- 🦾 [TypeScript](https://www.typescriptlang.org/) & [ESLint](https://eslint.org/) - 保证代码质量

## 请求

```sh
# 获取验证码
curl -H 'accept: application/json' -H 'Content-Type: application/json' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' https://maas.ai-yuanjing.com/bffservice/v2/base/app/captcha
```

```sh
# 发送验证码
curl -H 'Content-Type: application/json; charset=utf-8' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' -X POST https://maas.ai-yuanjing.com/bffservice/v2/base/app/sendCode -d '{"phone":"17771357633","captchaId":"DRkvJTkoTE6aZfcx62Kf","captchaCode":"n5at"}'
```

```sh
# 登录
curl -H 'Content-Type: application/json; charset=utf-8' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' -X POST https://maas.ai-yuanjing.com/user/api/v1/base/app/login -d '{"phone":"17771357633","smsCode":"758964","loginType":0}'
```

```sh
# 获取Token
curl -H 'Content-Type: application/json; charset=utf-8' -H 'Host: maas-api.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' -X POST https://maas-api.ai-yuanjing.com/openapi/service/v1/oauth/97990974a34b407b914d86898a529604/token -d '{"grant_type":"client_credentials","client_id":"eaabe11e93534f4fac1c6f691d4cfe51","client_secret":"96aafd6f5d5946a1846c6c22041a5e8d","token_type":1}'
```

```sh
# 获取助手列表
curl -H 'accept: application/json' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0ZDYyZjZlLWY4ZGYtNDJmNy1hNzQyLTQ1MGU5OTY1ZDlkNCIsInRlbmFudElEcyI6bnVsbCwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoiMTc3NzEzNTc2MzMiLCJuaWNrbmFtZSI6IjE3NzcxMzU3NjMzIiwiYnVmZmVyVGltZSI6MTc0OTEzNTY5NCwiZXhwIjoxNzU0MzEyNDk0LCJpYXQiOjE3NDkxMjgzNzQsImlzcyI6ImQ0ZDYyZjZlLWY4ZGYtNDJmNy1hNzQyLTQ1MGU5OTY1ZDlkNCIsIm5iZiI6MTc0OTEyODM3NCwic3ViIjoid2ViIn0.NCZUnULE4RhvPseoM4n_mNHcuQ_pGMfCrymk-uYfkzI' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' 'https://maas.ai-yuanjing.com/use/model/api/app/v1/assistant/list?pageNo=1&pageSize=20'
```

```sh
# 获取对话列表
curl -H 'accept: application/json' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0ZDYyZjZlLWY4ZGYtNDJmNy1hNzQyLTQ1MGU5OTY1ZDlkNCIsInRlbmFudElEcyI6bnVsbCwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoiMTc3NzEzNTc2MzMiLCJuaWNrbmFtZSI6IjE3NzcxMzU3NjMzIiwiYnVmZmVyVGltZSI6MTc0OTEzNTY5NCwiZXhwIjoxNzU0MzEyNDk0LCJpYXQiOjE3NDkxMjgzNzQsImlzcyI6ImQ0ZDYyZjZlLWY4ZGYtNDJmNy1hNzQyLTQ1MGU5OTY1ZDlkNCIsIm5iZiI6MTc0OTEyODM3NCwic3ViIjoid2ViIn0.NCZUnULE4RhvPseoM4n_mNHcuQ_pGMfCrymk-uYfkzI' -H 'Host: maas.ai-yuanjing.com' -H 'Connection: Keep-Alive' --compressed -H 'User-Agent: okhttp/4.12.0' 'https://maas.ai-yuanjing.com/use/model/api/app/v1/assistant/conversation/list?pageNo=1&pageSize=20'
```
```sh
# 创建新对话
curl -H 'Connection: keep-alive' -H 'sec-ch-ua-platform: "Android"' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlY2Y0ZGQwLTYyYzgtNDhhZS1hMjU3LThjYTE1NThjNjA3YSIsInRlbmFudElEcyI6bnVsbCwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoiMTg2MDcyNTE3MzIiLCJuaWNrbmFtZSI6IjE4NjA3MjUxNzMyIiwiYnVmZmVyVGltZSI6MTc0OTE0OTYzMCwiZXhwIjoxNzU0MzI2NDMwLCJpYXQiOjE3NDkxNDIzMTAsImlzcyI6IjNlY2Y0ZGQwLTYyYzgtNDhhZS1hMjU3LThjYTE1NThjNjA3YSIsIm5iZiI6MTc0OTE0MjMxMCwic3ViIjoid2ViIn0.RYO0N8yjH02aVy_VP5E6hBR5QBqJaF858U3n-voUZQA' -H 'User-Agent: Mozilla/5.0 (Linux; Android 11; WayDroid x86_64 Device Build/RQ3A.211001.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.100 Mobile Safari/537.36' -H 'Accept: application/json, text/plain, */*' -H 'sec-ch-ua: "Android WebView";v="135", "Not-A.Brand";v="8", "Chromium";v="135"' -H 'Content-Type: application/json' -H 'sec-ch-ua-mobile: ?1' -H 'Origin: null' -H 'X-Requested-With: com.unicom.yuanjing.dpseek' -H 'Sec-Fetch-Site: cross-site' -H 'Sec-Fetch-Mode: cors' -H 'Sec-Fetch-Dest: empty' --compressed -H 'Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7' -X POST https://maas.ai-yuanjing.com/use/model/api/app/v1/assistant/conversation/create -d '{"assistantId":"3ecf4dd0-62c8-48ae-a257-8ca1558c607a","prompt":"hello","from":"ChatUnicom","iconColor":"#E3EFFA","model":"deepseek-r1","useSearch":true}'
```

```sh
# 获取流式输出
curl -H 'Connection: keep-alive' -H 'x-logid: e6933a64-858b-47c4-84e9-ccdd0c3b5722' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlY2Y0ZGQwLTYyYzgtNDhhZS1hMjU3LThjYTE1NThjNjA3YSIsInRlbmFudElEcyI6bnVsbCwidXNlclR5cGUiOjAsInVzZXJuYW1lIjoiMTg2MDcyNTE3MzIiLCJuaWNrbmFtZSI6IjE4NjA3MjUxNzMyIiwiYnVmZmVyVGltZSI6MTc0OTE0OTYzMCwiZXhwIjoxNzU0MzI2NDMwLCJpYXQiOjE3NDkxNDIzMTAsImlzcyI6IjNlY2Y0ZGQwLTYyYzgtNDhhZS1hMjU3LThjYTE1NThjNjA3YSIsIm5iZiI6MTc0OTE0MjMxMCwic3ViIjoid2ViIn0.RYO0N8yjH02aVy_VP5E6hBR5QBqJaF858U3n-voUZQA' -H 'sec-ch-ua-platform: "Android"' -H 'sec-ch-ua: "Android WebView";v="135", "Not-A.Brand";v="8", "Chromium";v="135"' -H 'sec-ch-ua-mobile: ?1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 11; WayDroid x86_64 Device Build/RQ3A.211001.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.100 Mobile Safari/537.36' -H 'Accept: text/event-stream, text/event-stream' -H 'Content-Type: application/json' -H 'Origin: null' -H 'X-Requested-With: com.unicom.yuanjing.dpseek' -H 'Sec-Fetch-Site: cross-site' -H 'Sec-Fetch-Mode: cors' -H 'Sec-Fetch-Dest: empty' --compressed -H 'Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7' -X POST https://maas.ai-yuanjing.com/use/model/api/app/v1/chatunicom/stream -d '{"input":"hello","model":"deepseek-r1","stream":true,"auto_citation":false,"conversationId":"33a033c1-b20e-48cd-82af-946390439167","use_lvm":true,"use_code":true,"use_speech":true,"use_search":true,"assistantId":"3ecf4dd0-62c8-48ae-a257-8ca1558c607a","extend_params":{},"need_search_list":true,"request_id":"e6933a64-858b-47c4-84e9-ccdd0c3b5722"}'
```

## Credits

- [JS生成uuid(唯一标识符)](https://blog.csdn.net/pipizhou16/article/details/123691053)
