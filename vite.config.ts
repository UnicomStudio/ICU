import path from 'node:path'
import process from 'node:process'
import Uni from '@dcloudio/vite-plugin-uni'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import ViteRestart from 'vite-plugin-restart'
import UniPolyfill from 'vite-plugin-uni-polyfill'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default async ({ command, mode }) => {
  // @see https://unocss.dev/
  const UnoCSS = (await import('unocss/vite')).default

  // mode: 区分生产环境还是开发环境
  console.log('command, mode -> ', command, mode)

  const { UNI_PLATFORM } = process.env
  console.log('UNI_PLATFORM -> ', UNI_PLATFORM) // 得到 mp-weixin, h5, app 等

  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))
  const { VITE_APP_PORT } = env
  console.log('环境变量 env -> ', env)

  return defineConfig({
    envDir: 'env',
    plugins: [
      vueDevTools(),
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      UniHelperManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniHelperPages({
        routeBlockLang: 'json5',
        dts: 'src/uni-pages.d.ts',
      }),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniHelperLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-components
      UniHelperComponents({
        dts: 'src/components.d.ts',
        directoryAsNamespace: true,
      }),
      Uni(),
      UniPolyfill(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', '@vueuse/core', 'pinia', 'uni-app', 'vue-i18n'],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores', 'src/utils'],
        vueTemplate: true,
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      UnoCSS(),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.js'],
      }),
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === 'h5'
      && mode === 'production'
      && visualizer({
        filename: './node_modules/.cache/visualizer/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    optimizeDeps: {
      exclude: ['sard-uniapp'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          api: 'modern-compiler',
          // 关闭警告
          silenceDeprecations: ['legacy-js-api', 'import'],
        },
      },
    },
    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
        '@img': path.join(process.cwd(), './src/static/'),
      },
    },
    // @see https://cn.vite.dev/config/server-options
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 若端口已被占用则会直接退出，而不是尝试下一个可用端口。
      strictPort: true,
      proxy: {
        '/api': {
          target: 'https://maas-api.ai-yuanjing.com', // 替换为你的API地址
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''), // 重写路径
        },
      },
    },
    build: {
      sourcemap: false,
      target: 'es6',
      // 开发环境不用压缩
      minify: mode === 'development' ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: mode !== 'development',
          drop_debugger: mode !== 'development',
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        },
      },
    },
  })
}
