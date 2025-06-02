import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './stores'
import 'sard-uniapp/global.d.ts'
import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app,
  }
}
