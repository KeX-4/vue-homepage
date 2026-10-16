<script setup>
// 拆分点 5：项目展示组件（参考 01-project-page 案例设计重构）
// props：projects（项目数组，每项 { name, time, role, stack, points, desc, result, status }）
// 交互：点击"查看详情"弹出详情面板（遮罩 + 对话框），展示时间/角色/技术/职责要点/成果
// 插槽（保留定制能力）：
//   · #card 作用域插槽 —— 定制每张项目卡片，暴露 { item, index, statusClass, showDetails }
//     showDetails：点击查看详情的方法（父组件定制卡片时可直接复用）
//     未传 #card 时走 fallback 默认卡片渲染（序号 + 名称 + 状态 + 描述 + 技术标签 + 查看详情）
// 复用 SectionCard 统一区块结构（title prop + #title 具名插槽 + 默认插槽）
import { ref } from 'vue'
import SectionCard from './SectionCard.vue'

defineProps({
    projects: {
        type: Array,
        default: () => []
    }
})

// 项目状态 → 徽章样式类名（默认渲染与作用域插槽共用）
function statusClass(status) {
    const map = {
        '已完成': 'done',
        '开发中': 'doing',
        '规划中': 'plan'
    }
    return map[status] || 'plan'
}

// ===== 详情弹窗状态：选中项目（null 表示未打开）=====
const selectedProject = ref(null)

// 打开详情
function showDetails(project) {
    selectedProject.value = project
}

// 关闭详情
function closeDetails() {
    selectedProject.value = null
}
</script>

<template>
    <SectionCard title="项目展示">
        <!-- 具名插槽 #title：富标题（标题 + 项目数量） -->
        <template #title>
            <span>项目展示</span>
            <span class="title-count">共 {{ projects.length }} 个项目</span>
        </template>

        <div class="project-grid">
            <template v-for="(item, index) in projects" :key="item.id">
                <!-- 作用域插槽 #card：父组件可定制卡片内容（item/index/statusClass/showDetails）；
                     未提供时渲染 fallback 默认卡片 -->
                <slot name="card" :item="item" :index="index" :status-class="statusClass" :show-details="showDetails">
                    <article class="project-card">
                        <header class="card-header">
                            <div>
                                <span class="project-number">PROJECT {{ String(index + 1).padStart(2, '0') }}</span>
                                <h3 class="project-name">{{ item.name }}</h3>
                                <p class="project-meta">{{ item.time }} · {{ item.role }}</p>
                            </div>
                            <span class="status" :class="statusClass(item.status)">{{ item.status }}</span>
                        </header>
                        <div class="card-body">
                            <p class="description">{{ item.desc }}</p>
                            <ul class="tag-list">
                                <li v-for="tag in item.stack" :key="tag">{{ tag }}</li>
                            </ul>
                        </div>
                        <footer class="card-actions">
                            <button type="button" class="primary" @click="showDetails(item)">查看详情</button>
                        </footer>
                    </article>
                </slot>
            </template>
        </div>

        <!-- 详情弹窗：点击"查看详情"后显示 -->
        <div v-if="selectedProject" class="detail-panel" role="dialog" aria-modal="true">
            <div class="detail-content">
                <button type="button" class="close" aria-label="关闭详情" @click="closeDetails">×</button>
                <p class="eyebrow">PROJECT DETAIL</p>
                <h3 class="detail-name">{{ selectedProject.name }}</h3>
                <p class="detail-meta">{{ selectedProject.time }} · {{ selectedProject.role }}</p>
                <p class="detail-desc">{{ selectedProject.desc }}</p>

                <div class="detail-block">
                    <strong>主要技术</strong>
                    <ul class="tag-list">
                        <li v-for="tag in selectedProject.stack" :key="tag">{{ tag }}</li>
                    </ul>
                </div>
                <div class="detail-block">
                    <strong>职责要点</strong>
                    <ul class="point-list">
                        <li v-for="(p, i) in selectedProject.points" :key="i">{{ p }}</li>
                    </ul>
                </div>
                <div class="detail-block">
                    <strong>项目成果</strong>
                    <p class="detail-result">{{ selectedProject.result }}</p>
                </div>
            </div>
        </div>
    </SectionCard>
</template>

<style scoped>
/* 卡片网格：桌面两列，窄屏单列 */
.project-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
}

/* 标题计数（#title 插槽内的补充文字） */
.title-count {
    font-size: 13px;
    font-weight: normal;
    color: var(--text-muted);
    margin-left: 8px;
}

/* ===== 项目卡片 ===== */
.project-card {
    display: flex;
    flex-direction: column;
    min-height: 250px;
    overflow: hidden;
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    box-shadow: 0 7px 20px rgba(53, 73, 94, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow);
}

.card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 20px 20px 14px;
    border-bottom: 1px solid var(--border-color);
}

.project-number {
    display: block;
    margin-bottom: 5px;
    color: var(--accent);
    font-size: 13px;
    font-weight: 700;
}

.project-name {
    margin: 0;
    color: var(--text-primary);
    font-size: 20px;
}

.project-meta {
    margin: 6px 0 0;
    color: var(--text-secondary);
    font-size: 13px;
}

/* 状态徽章：已完成绿 / 开发中蓝 / 规划中橙 */
.status {
    flex: 0 0 auto;
    padding: 5px 9px;
    color: #e6a23c;
    background: rgba(230, 162, 60, 0.14);
    border-radius: 999px;
    font-size: 13px;
}

.status.done {
    color: #217251;
    background: #e3f5ed;
}

.status.doing {
    color: var(--accent);
    background: var(--skill-bg);
}

.card-body {
    flex: 1;
    padding: 18px 20px;
}

.description {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.75;
    font-size: 14px;
}

/* 技术标签 */
.tag-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 16px 0 0;
    padding: 0;
    list-style: none;
}

.tag-list li {
    padding: 5px 9px;
    color: var(--accent);
    background: var(--skill-bg);
    border-radius: 6px;
    font-size: 13px;
}

.card-actions {
    display: flex;
    gap: 10px;
    padding: 0 20px 20px;
}

.primary {
    padding: 9px 15px;
    color: #fff;
    background: var(--accent);
    border: 0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;
}

.primary:hover {
    background: var(--accent-hover);
}

/* ===== 详情弹窗 ===== */
.detail-panel {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    padding: 20px;
    place-items: center;
    background: rgba(24, 39, 48, 0.62);
}

.detail-content {
    position: relative;
    width: min(560px, 100%);
    max-height: 86vh;
    overflow-y: auto;
    padding: 28px;
    background: var(--card-bg);
    border-radius: 14px;
    box-shadow: var(--shadow);
}

.close {
    position: absolute;
    top: 12px;
    right: 14px;
    width: 34px;
    height: 34px;
    color: var(--text-secondary);
    background: var(--skill-bg);
    border: 0;
    border-radius: 50%;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
}

.eyebrow {
    margin: 0 0 8px;
    color: var(--accent);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.4px;
}

.detail-name {
    margin: 0 0 6px;
    color: var(--text-primary);
    font-size: 24px;
}

.detail-meta {
    margin: 0 0 14px;
    color: var(--text-secondary);
    font-size: 14px;
}

.detail-desc {
    margin: 0 0 18px;
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 14px;
}

.detail-block {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--border-color);
}

.detail-block strong {
    display: block;
    margin-bottom: 8px;
    color: var(--text-primary);
    font-size: 14px;
}

.point-list {
    margin: 0;
    padding-left: 18px;
    color: var(--text-secondary);
    line-height: 1.9;
    font-size: 14px;
}

.detail-result {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 14px;
}

/* 窄屏适配：卡片单列 */
@media (max-width: 760px) {
    .project-grid {
        grid-template-columns: 1fr;
    }
}
</style>
