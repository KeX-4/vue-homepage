<script setup>
// ===== 根组件：Element Plus 布局组件重构整体结构（实验四第二次）=====
// 使用组件：
//   el-container / el-header / el-main / el-footer —— 整体布局（顶栏 / 主内容 / 页脚）
//   el-menu / el-menu-item —— 顶部导航（mode="horizontal" 横向菜单）
//   RouterView —— 路由出口（首页/项目/文章/关于/登录/后台/404）
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()
const router = useRouter()

// ===== 顶部导航配置（命名路由组织导航数据）=====
const navItems = [
    { text: '首页', name: 'home' },
    { text: '项目展示', name: 'projects' },
    { text: '文章', name: 'articles' },
    { text: '关于', name: 'about' },
    { text: '登录', name: 'login' },
    { text: '后台管理', name: 'admin' }
]

// el-menu 当前激活项：项目详情页（project-detail）也高亮"项目展示"
const activeMenu = computed(() => {
    if (route.name === 'project-detail') return 'projects'
    return route.name
})

// el-menu select 事件：按 name 编程式跳转（命名路由）
function onSelect(name) {
    router.push({ name })
}

// ===== 主题状态：false 亮色 / true 暗色 =====
const isDark = ref(false)
watch(isDark, (val) => {
    document.body.classList.toggle('dark', val)
})
onMounted(() => {
    document.body.classList.toggle('dark', isDark.value)
})
</script>

<template>
    <!-- 布局组件：纵向容器（顶栏 + 主内容 + 页脚） -->
    <el-container class="app-container">
        <!-- 顶栏：Logo + 横向菜单导航 + 主题切换 -->
        <el-header class="app-header" height="auto">
            <RouterLink class="logo" :to="{ name: 'home' }">个人信息主页</RouterLink>

            <!-- 菜单组件：横向导航，select 事件触发命名路由跳转 -->
            <el-menu
                class="app-menu"
                mode="horizontal"
                :default-active="activeMenu"
                :ellipsis="false"
                @select="onSelect"
            >
                <el-menu-item v-for="item in navItems" :key="item.name" :index="item.name">
                    {{ item.text }}
                </el-menu-item>
            </el-menu>

            <ThemeToggle v-model="isDark" class="header-toggle" />
        </el-header>

        <!-- 主内容区：路由出口渲染当前页面 -->
        <el-main class="app-main">
            <div class="page-container">
                <RouterView />
            </div>
        </el-main>

        <!-- 页脚（默认插槽定制内容） -->
        <el-footer class="app-footer" height="auto">
            <SiteFooter>
                <p class="copyright">© 2026 宁远 · 学号 249981119 · 前端开发学习之路</p>
                <p class="footer-note">Vue 3 + Vite · Vue Router · Pinia · Element Plus</p>
            </SiteFooter>
        </el-footer>
    </el-container>
</template>

<style>
/* ===== 全局样式：主题变量 + 页面基础布局 ===== */
:root {
    --page-bg: #f5f7fa;
    --card-bg: #ffffff;
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-muted: #555555;
    --accent: #409eff;
    --accent-hover: #66b1ff;
    --border-color: #dcdfe6;
    --box-bg: #f0f7ff;
    --skill-bg: #ecf5ff;
    --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

body.dark {
    --page-bg: #12161c;
    --card-bg: #1c222b;
    --text-primary: #e8ebf0;
    --text-secondary: #a9b3c1;
    --text-muted: #97a2b1;
    --accent: #5ca6f2;
    --accent-hover: #78b6f5;
    --border-color: #37404c;
    --box-bg: #222b36;
    --skill-bg: #202b39;
    --shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
}

body {
    font-family: "Microsoft YaHei", Arial, sans-serif;
    background-color: var(--page-bg);
    margin: 0;
    transition: background-color 0.3s ease;
}

#app {
    min-height: 100vh;
}

/* Element Plus 布局组件样式覆盖 */
.app-container {
    min-height: 100vh;
    flex-direction: column;
}

.app-header {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 0 24px;
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.logo {
    font-size: 18px;
    font-weight: bold;
    color: var(--accent);
    text-decoration: none;
    white-space: nowrap;
}

/* el-menu 适配主题：去掉默认底边与背景，文字色跟随变量 */
.app-menu {
    flex: 1;
    border-bottom: none !important;
    background: transparent !important;
}

.app-menu :deep(.el-menu-item) {
    color: var(--text-secondary);
    border-bottom: none !important;
}

.app-menu :deep(.el-menu-item.is-active) {
    color: var(--accent);
    background: transparent !important;
    border-bottom: 2px solid var(--accent) !important;
}

.header-toggle {
    margin-left: auto;
}

.app-main {
    flex: 1;
    padding: 32px 0;
    background: var(--page-bg);
}

.page-container {
    width: 760px;
    margin: 0 auto;
    background-color: var(--card-bg);
    padding: 28px 40px 40px;
    box-shadow: var(--shadow);
    border-radius: 10px;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.app-footer {
    padding: 18px 24px;
    background-color: var(--card-bg);
    border-top: 1px solid var(--border-color);
}

section {
    margin-bottom: 25px;
}

/* 共享样式：.section-title 被多个页面/组件共用 */
.section-title {
    font-size: 18px;
    font-weight: bold;
    color: var(--text-primary);
    padding-left: 10px;
    border-left: 5px solid var(--accent);
    margin-bottom: 15px;
}

ul {
    padding-left: 0;
    list-style: none;
}

.copyright {
    margin: 0 0 4px;
    font-size: 14px;
    color: var(--text-secondary);
    text-align: center;
}

.footer-note {
    margin: 0;
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
}

/* 窄屏适配 */
@media (max-width: 760px) {
    .app-header {
        flex-wrap: wrap;
        padding: 10px 14px;
    }

    .app-main {
        padding: 20px 0;
    }

    .page-container {
        width: auto;
        margin: 0 12px;
        padding: 20px 18px 28px;
    }
}
</style>
