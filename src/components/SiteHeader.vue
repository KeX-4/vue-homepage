<script setup>
// 公共组件：顶部导航（Vue Router 版）
// props：navItems —— 命名路由导航数组，由根组件传入：
//   [{ text: '首页', name: 'home' }, ...]
// 跳转：使用 <RouterLink :to="{ name }"> 实现页面切换（任务 2）
// 高亮：Vue Router 自动为 RouterLink 添加类（任务 3）
//   · router-link-exact-active —— 当前路由与目标完全一致时（如 /projects/1 不会命中 /projects）
//   · router-link-active        —— 当前路由是目标路由或其子路由时（如 /projects/1 会命中 /projects）
// 说明：接入路由后，不再需要 defineEmits 手动抛事件跳转，改由路由统一管理
defineProps({
    navItems: {
        type: Array,
        default: () => [
            { text: '首页', name: 'home' },
            { text: '项目展示', name: 'projects' },
            { text: '关于', name: 'about' }
        ]
    }
})
</script>

<template>
    <header class="site-header">
        <div class="header-inner">
            <!-- Logo：RouterLink 命名路由跳转首页 -->
            <RouterLink class="logo" :to="{ name: 'home' }">个人信息主页</RouterLink>

            <nav class="nav">
                <!-- 命名路由跳转：:to="{ name: item.name }" -->
                <RouterLink
                    v-for="item in navItems"
                    :key="item.name"
                    class="nav-item"
                    :to="{ name: item.name }"
                >{{ item.text }}</RouterLink>
            </nav>
        </div>
    </header>
</template>

<style scoped>
/* 顶栏：吸顶 + 主题变量配色（亮/暗自动适配） */
.site-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.header-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.logo {
    font-size: 18px;
    font-weight: bold;
    color: var(--accent);
    text-decoration: none;
    white-space: nowrap;
}

.nav {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.nav-item {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 20px;
    transition: color 0.2s ease, background-color 0.2s ease;
}

.nav-item:hover {
    color: var(--accent);
    background-color: var(--skill-bg);
}

/* ===== 导航高亮（任务 3）=====
   router-link-exact-active：当前页精确匹配时高亮（实心蓝）
   router-link-active：包含匹配（如进入 /projects/1 时"项目展示"仍高亮，浅蓝） */
.nav-item.router-link-exact-active {
    color: #fff;
    background-color: var(--accent);
}

.nav-item.router-link-active {
    color: var(--accent);
    background-color: var(--skill-bg);
}

/* 精确匹配优先：父路由子页面时不用实心色 */
.nav-item.router-link-active:not(.router-link-exact-active) {
    color: var(--accent);
    background-color: var(--skill-bg);
}

/* 窄屏适配：Logo 与导航纵向排列 */
@media (max-width: 720px) {
    .header-inner {
        flex-direction: column;
        gap: 10px;
        padding: 12px 16px;
    }

    .nav-item {
        min-height: 36px;
        display: inline-flex;
        align-items: center;
    }
}
</style>
