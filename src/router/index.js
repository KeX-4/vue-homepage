// ===== 路由配置：路由实例 + 路由表 + 全局守卫 =====
// 任务 1：安装并注册 Vue Router，创建路由实例和路由表
//         配置首页、项目页、关于页及 404 页面
// 任务 5：项目列表、项目详情配置为 /projects 的嵌套子路由
// 任务 7：meta 标记页面标题与后台管理权限；beforeEach 更新标题并实现路由守卫
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectsListView from '../views/ProjectsListView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'
import ArticleListView from '../views/ArticleListView.vue'
import ArticleAdminView from '../views/ArticleAdminView.vue'
// 实验四：路由守卫使用用户 Store 判断登录状态
import { useUserStore } from '../stores/userStore.js'

// ===== 路由表 =====
// 命名路由：每条路由都设置 name，供 RouterLink :to="{ name }" 与 router.push({ name }) 使用
const routes = [
    // 首页（根路径）
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { title: '首页' }
    },
    // 关于页
    {
        path: '/about',
        name: 'about',
        component: AboutView,
        meta: { title: '关于' }
    },
    // 项目页：父路由只负责布局（<RouterView> 渲染子路由）
    // 嵌套子路由：'' 项目列表 / ':id' 项目详情
    // redirect：用命名路由跳转到父路由 name:'projects' 时，
    //           会自动重定向到默认子路由（'' 列表页），否则嵌套 RouterView 会空白
    {
        path: '/projects',
        name: 'projects',
        component: ProjectsView,
        redirect: { name: 'projects-list' },
        meta: { title: '项目展示' },
        children: [
            {
                path: '',
                name: 'projects-list',
                component: ProjectsListView,
                meta: { title: '项目展示' }
            },
            {
                path: ':id',
                name: 'project-detail',
                component: ProjectDetailView,
                meta: { title: '项目详情' }
            }
        ]
    },
    // 身份认证页（登录）
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { title: '登录' }
    },
    // 后台管理页：requiresAuth 标记需要登录权限，由守卫拦截
    {
        path: '/admin',
        name: 'admin',
        component: AdminView,
        meta: { title: '后台管理', requiresAuth: true }
    },
    // 文章列表页（实验四：文章 Store 跨页面共享）
    {
        path: '/articles',
        name: 'articles',
        component: ArticleListView,
        meta: { title: '文章列表' }
    },
    // 文章管理页：requiresAuth 需要登录，由守卫结合 userStore 控制
    {
        path: '/articles/admin',
        name: 'articles-admin',
        component: ArticleAdminView,
        meta: { title: '文章管理', requiresAuth: true }
    },
    // 404 兜底：匹配所有未定义路径
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView,
        meta: { title: '页面不存在' }
    }
]

// ===== 创建路由实例（Hash 模式）=====
// 部署到 GitHub Pages 使用 createWebHashHistory：路由带 # 前缀，
// 刷新子路由不会向服务器发请求，避免 Pages 静态托管的 404 问题
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// ===== 全局前置守卫 beforeEach =====
// 职责 1：根据 to.meta.title 更新浏览器标签页标题
// 职责 2：requiresAuth 权限守卫 —— 结合用户 Store（userStore.isLogin）判断登录状态，
//         未登录访问后台页 / 文章管理页时重定向到登录页，并记录来源
router.beforeEach((to) => {
    // 更新页面标题（任务 7）
    document.title = to.meta.title ? `${to.meta.title} - 实验二 Vue` : '实验二 Vue'

    // 权限守卫：从 userStore 读取登录态（跨组件共享，localStorage 持久化）
    const userStore = useUserStore()
    if (to.meta.requiresAuth && !userStore.isLogin) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }
    return true
})

export default router
