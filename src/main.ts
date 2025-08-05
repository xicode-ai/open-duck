import { createSSRApp } from 'vue'
import uvUI from '@climblee/uv-ui'
import App from './App.vue'
import store from './store'
import { routeInterceptor, requestInterceptor } from './interceptors'
import i18n from './locale/index'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import '@/style/index.scss'

// 导入应用路由工具
import { initAppRouter } from './utils/appRouter'

// production mock server
// 线上报错，TODO: fix me
// if (import.meta.env.PROD) {
//   import('../mock/_mockProdServer').then(({ setupProdMockServer }) => {
//     console.log('mockProdServer...')
//     setupProdMockServer()
//   })
// }

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(i18n)
  app.use(uvUI)
  app.use(routeInterceptor)
  app.use(requestInterceptor)

  // 监听应用启动，处理路由分发
  // 注意：这里只是初始化，实际的路由分发会在页面级别处理
  console.log('应用已创建，准备处理路由分发')

  return {
    app,
  }
}
