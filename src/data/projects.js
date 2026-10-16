// ===== 共享项目数据（单一数据源 + localStorage 持久化）=====
// 项目列表页、项目详情页、后台管理页共同引用：
//   管理页增删改 → 自动同步列表/详情 → 刷新后从 localStorage 恢复
// 结构：{ id, name, time, role, stack, points, desc, result, status }
// 数据来源：个人项目实践经历（2025.09 至今）
import { ref } from 'vue'

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

// 响应式数据源：管理页增删改后，列表页 / 详情页自动更新
export const projects = ref(load())

// 持久化：写入 localStorage
function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
}

// ===== 管理操作（后台管理页调用）=====
// 新增项目：自动分配新 id（时间戳）
export function addProject(p) {
    projects.value.push({ ...p, id: Date.now() })
    persist()
}

// 更新项目：按 id 覆盖整条记录
export function updateProject(p) {
    const i = projects.value.findIndex(x => String(x.id) === String(p.id))
    if (i >= 0) {
        projects.value[i] = p
        persist()
    }
}

// 删除项目：按 id 过滤
export function removeProject(id) {
    projects.value = projects.value.filter(x => String(x.id) !== String(id))
    persist()
}

// 恢复默认：清空 localStorage 记录并重置为两条默认项目
export function resetProjects() {
    localStorage.removeItem(STORAGE_KEY)
    projects.value = JSON.parse(JSON.stringify(defaultProjects))
}

// 项目状态 → 徽章样式类名（列表页 / 详情页共用）
export function statusClass(status) {
    const map = {
        '已完成': 'done',
        '开发中': 'doing',
        '规划中': 'plan'
    }
    return map[status] || 'plan'
}

// 按 id 查找项目；找不到返回 undefined（用于无效详情地址处理）
export function findProjectById(id) {
    return projects.value.find(p => String(p.id) === String(id))
}
