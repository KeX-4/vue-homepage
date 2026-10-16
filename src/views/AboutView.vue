<script setup>
// ===== 关于页视图：/about → name: 'about' =====
// 展示个人简介、技术栈与学习历程（el-timeline 时间线 —— 实验四第二次新增）
const techList = ['Vue 3', 'Vite', 'JavaScript', 'HTML', 'CSS', 'Java', 'MySQL']
const skills = [
    { name: '前端开发', desc: '使用 Vue3 组合式 API 开发单页应用，熟悉组件通信、路由与状态管理' },
    { name: '后端基础', desc: '基于 Java + MySQL 开发 C/S 架构系统，掌握 JDBC 数据交互' },
    { name: '工程化', desc: '使用 Vite 构建工具、Vue Router 路由、Pinia 状态管理、Git 版本管理完成项目开发' }
]

// 时间线数据：学习与项目经历（el-timeline-item 渲染）
const timeline = [
    { time: '2024.09', title: '入学重庆工程学院', desc: '就读计算机科学与技术专业，开始系统学习 C 语言、数据结构与 Web 前端基础', type: 'primary' },
    { time: '2025.09', title: '大学生积分管理系统', desc: '独立完成 Java + MySQL 的 C/S 架构系统全流程开发，实现登录、学分管理、成绩录入与积分排名', type: 'success' },
    { time: '2026.03', title: '校园二手交易系统', desc: '基于 Vue 3 搭建前端页面，实现用户管理、商品搜索、结算下单与价格排序等核心模块', type: 'primary' },
    { time: '2026.09', title: 'Vue 组件化与路由学习', desc: '完成个人主页从静态 HTML 迁移到 Vue 工程，实践组件拆分、props/emit 通信与 Vue Router 路由', type: 'warning' },
    { time: '2026.10', title: 'Pinia 状态管理 + Element Plus', desc: '引入 Pinia 实现跨组件状态共享与 localStorage 持久化，使用 Element Plus 重构界面并部署 GitHub Pages', type: 'danger' }
]
</script>

<template>
    <div class="about">
        <h2 class="section-title">关于我</h2>
        <p class="about-desc">
            宁远 · 249981119 · 24计科2班。热爱前端开发，注重代码规范与页面体验，
            正在通过实验不断加深对 Vue 组件化、路由、状态管理与工程化开发的理解。
        </p>

        <h3 class="sub-title">技术方向</h3>
        <!-- el-card 卡片容器展示技能条目 -->
        <el-card v-for="s in skills" :key="s.name" class="skill-card" shadow="never">
            <strong>{{ s.name }}</strong>
            <span>{{ s.desc }}</span>
        </el-card>

        <h3 class="sub-title">技术栈</h3>
        <!-- el-tag 标签展示技术栈 -->
        <div class="tag-wrap">
            <el-tag v-for="t in techList" :key="t" effect="light" round class="tech-tag">{{ t }}</el-tag>
        </div>

        <h3 class="sub-title">学习与项目历程</h3>
        <!-- 时间线组件：按时间倒序展示学习与项目经历 -->
        <el-timeline class="exp-timeline">
            <el-timeline-item
                v-for="item in timeline"
                :key="item.time"
                :timestamp="item.time"
                :type="item.type"
                placement="top"
            >
                <h4 class="tl-title">{{ item.title }}</h4>
                <p class="tl-desc">{{ item.desc }}</p>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<style scoped>
.about-desc {
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 14px;
}

.sub-title {
    color: var(--text-primary);
    font-size: 16px;
    margin: 22px 0 10px;
}

.skill-card {
    margin-bottom: 10px;
}

.skill-card :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.skill-card strong {
    color: var(--text-primary);
    font-size: 14px;
}

.skill-card span {
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.6;
}

.tag-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.exp-timeline {
    margin-top: 10px;
    padding-left: 4px;
}

.tl-title {
    margin: 0 0 4px;
    color: var(--text-primary);
    font-size: 14px;
}

.tl-desc {
    margin: 0;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.7;
}
</style>
