// 入口文件：创建 Vue 应用实例，依次注册 Pinia、路由、Element Plus，挂载到 #app
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 任务 8（实验四）：全局注册 Element Plus 组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)
// Pinia 必须先于路由注册，路由守卫内部才能安全调用 useUserStore()
app.use(createPinia())
app.use(router)
// 全局注册所有 Element Plus 组件（实验阶段使用全局注册，简单直接）
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
