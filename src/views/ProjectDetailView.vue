<script setup>
// ===== 项目详情页（嵌套子路由：/projects/:id → name: 'project-detail'）=====
// 任务 4：动态路由参数 :id，根据 route.params.id 显示不同项目信息
// 任务 6：useRouter() 编程式跳转 ——
//         返回上一页（router.back()）、返回列表（router.push({ name })）、
//         无效详情地址处理（查不到项目时显示提示 + 提供返回）
// 实验四：项目数据来自 projectStore（getter findById 按 id 查询）
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore, statusClass } from '../stores/projectStore.js'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

// 动态路由参数：/projects/1 → params.id = '1'（字符串）
const id = computed(() => route.params.id)

// 根据 id 查找项目；无效地址时 project 为 undefined（projectStore getter）
const project = computed(() => projectStore.findById(id.value))

// 编程式跳转：返回上一页
function goBack() {
    router.back()
}

// 编程式跳转：返回项目列表（命名路由）
function goList() {
    router.push({ name: 'projects-list' })
}

// 编程式跳转：重开一个详情页（演示动态参数变化）
function goNext() {
    const next = project.value?.id === 1 ? 2 : 1
    router.push({ name: 'project-detail', params: { id: next } })
}
</script>

<template>
    <!-- 有效地址：展示该项目详情 -->
    <div v-if="project" class="detail">
        <div class="detail-head">
            <div>
                <p class="eyebrow">PROJECT DETAIL · ID {{ id }}</p>
                <h3 class="detail-name">{{ project.name }}</h3>
                <p class="detail-meta">{{ project.time }} · {{ project.role }}</p>
            </div>
            <span class="status" :class="statusClass(project.status)">{{ project.status }}</span>
        </div>

        <p class="detail-desc">{{ project.desc }}</p>

        <div class="detail-block">
            <strong>主要技术</strong>
            <ul class="tag-list">
                <li v-for="tag in project.stack" :key="tag">{{ tag }}</li>
            </ul>
        </div>

        <div class="detail-block">
            <strong>职责要点</strong>
            <ul class="point-list">
                <li v-for="(p, i) in project.points" :key="i">{{ p }}</li>
            </ul>
        </div>

        <div class="detail-block">
            <strong>项目成果</strong>
            <p class="detail-result">{{ project.result }}</p>
        </div>

        <div class="detail-actions">
            <button type="button" class="primary" @click="goList">返回项目列表</button>
            <button type="button" class="ghost" @click="goBack">返回上一页</button>
            <button type="button" class="ghost" @click="goNext">查看另一项目</button>
        </div>
    </div>

    <!-- 无效地址处理：找不到对应项目 -->
    <div v-else class="invalid">
        <p class="invalid-code">无效详情地址</p>
        <p class="invalid-desc">项目中不存在 ID 为 "{{ id }}" 的记录，请返回列表重新选择。</p>
        <div class="detail-actions">
            <button type="button" class="primary" @click="goList">返回项目列表</button>
            <button type="button" class="ghost" @click="goBack">返回上一页</button>
        </div>
    </div>
</template>

<style scoped>
.detail-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border-color);
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
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
}

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

.detail-desc {
    margin: 18px 0;
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

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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

.detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 22px;
}

.primary,
.ghost {
    padding: 9px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.primary {
    color: #fff;
    background: var(--accent);
    border: 1px solid var(--accent);
}

.primary:hover {
    background: var(--accent-hover);
}

.ghost {
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--border-color);
}

.ghost:hover {
    color: var(--accent);
    border-color: var(--accent);
}

.invalid {
    padding: 30px;
    text-align: center;
    background: var(--box-bg);
    border-radius: 10px;
}

.invalid-code {
    margin: 0 0 8px;
    color: var(--accent);
    font-size: 20px;
    font-weight: bold;
}

.invalid-desc {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 18px;
}

.invalid .detail-actions {
    justify-content: center;
}
</style>
