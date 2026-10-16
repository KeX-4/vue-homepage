import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import devtools from 'vite-plugin-vue-devtools'

// Vite 配置：
// 1. vue()：注册 Vue 插件，支持 .vue 单文件组件（SFC）
// 2. devtools()：Vue DevTools 面板
// 3. base: './'：GitHub Pages 部署使用相对路径；配合 hash 路由，
//    无论仓库名是什么都能正常加载资源，无需按仓库名修改 base
export default defineConfig({
  base: './',
  plugins: [vue(), devtools()]
})
