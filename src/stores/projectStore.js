// ===== 项目 Store：项目信息共享状态（实验四）=====
// 由原 src/data/projects.js 迁移而来：
//   state   ：projects 项目数组
//   getters ：projectCount 总数、completedCount 已完成数、findById 按 id 查询
//   actions ：addProject / updateProject / removeProject / resetProjects
// 持久化 ：localStorage（键 shiyan2_projects），列表页、详情页、管理页共享同一份数据
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'shiyan2_projects'

// 默认项目数据（两条真实项目经历）
const defaultProjects = [
    {
        id: 1,
        name: '大学生积分管理系统',
        time: '2025.09 - 2026.01',
        role: '独立开发者',
        stack: ['Java', 'MySQL', 'JDBC'],
        points: ['需求分析', '数据库设计', '编码实现', '测试优化'],
        desc: '基于 Java + MySQL 的 C/S 架构积分管理系统：运用面向对象思想搭建系统架构，通过 JDBC 实现 Java 程序与 MySQL 数据库的数据交互；实现用户登录、课程学分管理、学生成绩录入、积分核算与排名等核心功能；编写完整的需求文档、数据库设计与详细设计报告，修复运行漏洞，保障程序稳定运行。',
        result: '成功完成设计报告撰写与项目答辩。',
        status: '已完成'
    },
    {
        id: 2,
        name: '校园二手交易系统',
        time: '2026.03 - 至今',
        role: '独立开发者',
        stack: ['Vue 3', 'HTML', 'CSS', 'JavaScript'],
        points: ['页面设计', '功能实现', '项目文档撰写'],
        desc: '基于 Vue 的校园二手交易前端系统：运用 HTML、CSS、JavaScript 及 Vue 框架搭建前端页面与交互逻辑，实现用户管理、商品搜索、结算下单、价格排序等核心功能模块；完成需求分析、数据库设计与详细设计文档编写，严格遵循编码规范，按进度完成开发、测试与优化。',
        result: '成功完成设计报告撰写与项目答辩。',
        status: '已完成'
    }
]

// 从 localStorage 读取；无记录或解析失败时回退默认数据
function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch (e) {
        console.warn('项目数据读取失败，使用默认数据', e)
    }
    return JSON.parse(JSON.stringify(defaultProjects))
}

export const useProjectStore = defineStore('project', () => {
    // ===== state =====
    const projects = ref(load())

    // ===== getters =====
    const projectCount = computed(() => projects.value.length)
    const completedCount = computed(() => projects.value.filter(p => p.status === '已完成').length)

    // 按 id 查询项目（详情页使用；查不到返回 undefined）
    const findById = (id) => projects.value.find(p => String(p.id) === String(id))

    // ===== actions =====
    // 新增项目：自动分配新 id（时间戳）
    function addProject(p) {
        projects.value.push({ ...p, id: Date.now() })
        persist()
    }

    // 更新项目：按 id 覆盖整条记录
    function updateProject(p) {
        const i = projects.value.findIndex(x => String(x.id) === String(p.id))
        if (i >= 0) {
            projects.value[i] = p
            persist()
        }
    }

    // 删除项目：按 id 过滤
    function removeProject(id) {
        projects.value = projects.value.filter(x => String(x.id) !== String(id))
        persist()
    }

    // 恢复默认：清空 localStorage 记录并重置为两条默认项目
    function resetProjects() {
        localStorage.removeItem(STORAGE_KEY)
        projects.value = JSON.parse(JSON.stringify(defaultProjects))
    }

    // 持久化：写入 localStorage
    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
    }

    return { projects, projectCount, completedCount, findById, addProject, updateProject, removeProject, resetProjects }
})

// 项目状态 → 徽章样式类名（列表页 / 详情页共用，非响应式工具函数）
export function statusClass(status) {
    const map = {
        '已完成': 'done',
        '开发中': 'doing',
        '规划中': 'plan'
    }
    return map[status] || 'plan'
}
