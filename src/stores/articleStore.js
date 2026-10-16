// ===== 文章 Store：文章信息共享状态（实验四）=====
// state   ：articles 文章数组
// getters ：articleCount 总数、publishedCount 已发布数、publishedArticles 已发布列表
// actions ：addArticle / updateArticle / removeArticle / resetArticles / findById
// 持久化 ：localStorage（键 shiyan2_articles），文章列表页与管理页共享同一份数据
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'shiyan2_articles'

// 默认文章数据（围绕本课程实践的三篇学习笔记）
const defaultArticles = [
    {
        id: 1,
        title: 'Vue 组件化开发实践',
        category: '技术笔记',
        time: '2026.09',
        summary: '个人主页迁移到 Vue 工程并改用组合式 API，完成组件拆分、defineProps/defineEmits/defineModel 通信与插槽定制。',
        content: '将实验一的静态页面迁移到 Vue 工程：按职责拆分 SiteHeader、ProfileHeader、SkillSection、ProjectSection 等组件；使用 defineProps 接收父级数据、defineEmits 上报事件、defineModel 实现双向绑定；通过插槽定制可复用组件内容。',
        status: '已发布'
    },
    {
        id: 2,
        title: 'Vue Router 路由配置详解',
        category: '学习心得',
        time: '2026.10',
        summary: '配置命名路由、嵌套路由、动态路由与 404 通配路由，使用编程式导航与路由守卫控制页面访问。',
        content: '为个人主页接入 Vue Router：路由表配置首页、项目页、关于页及 404 页面；项目页通过嵌套子路由组织列表与详情；详情页使用动态参数 :id 展示不同项目；beforeEach 守卫根据 meta 更新页面标题并控制后台访问。',
        status: '已发布'
    },
    {
        id: 3,
        title: 'Pinia 状态管理入门',
        category: '技术笔记',
        time: '2026.10',
        summary: '安装注册 Pinia，使用 state、getters、actions 组织共享状态，配合 localStorage 实现跨组件状态持久化。',
        content: '在实验三基础上引入 Pinia：创建用户、项目、文章三个 Store；使用 storeToRefs 在组件中解构数据保持响应式；登录状态与业务数据写入 localStorage，刷新后状态自动恢复。',
        status: '草稿'
    }
]

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch (e) {
        console.warn('文章数据读取失败，使用默认数据', e)
    }
    return JSON.parse(JSON.stringify(defaultArticles))
}

export const useArticleStore = defineStore('article', () => {
    // ===== state =====
    const articles = ref(load())

    // ===== getters =====
    const articleCount = computed(() => articles.value.length)
    const publishedCount = computed(() => articles.value.filter(a => a.status === '已发布').length)
    const publishedArticles = computed(() => articles.value.filter(a => a.status === '已发布'))

    // 按 id 查询文章
    const findById = (id) => articles.value.find(a => String(a.id) === String(id))

    // ===== actions =====
    // 新增文章：自动分配新 id（时间戳）
    function addArticle(a) {
        articles.value.push({ ...a, id: Date.now() })
        persist()
    }

    // 更新文章：按 id 覆盖整条记录
    function updateArticle(a) {
        const i = articles.value.findIndex(x => String(x.id) === String(a.id))
        if (i >= 0) {
            articles.value[i] = a
            persist()
        }
    }

    // 删除文章：按 id 过滤
    function removeArticle(id) {
        articles.value = articles.value.filter(x => String(x.id) !== String(id))
        persist()
    }

    // 恢复默认文章
    function resetArticles() {
        localStorage.removeItem(STORAGE_KEY)
        articles.value = JSON.parse(JSON.stringify(defaultArticles))
    }

    // 持久化：写入 localStorage
    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles.value))
    }

    return { articles, articleCount, publishedCount, publishedArticles, findById, addArticle, updateArticle, removeArticle, resetArticles }
})
