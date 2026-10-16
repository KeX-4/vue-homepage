<script setup>
// ===== 项目列表页（嵌套子路由：/projects → name: 'projects-list'）=====
// Element Plus 组件：el-card 项目卡片、el-tag 技术栈/状态标签、el-button 查看详情
// 数据来自 projectStore（与详情页/管理页跨页面共享）
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores/projectStore.js'

const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

// 状态 → el-tag 类型映射
function tagType(status) {
    return { '已完成': 'success', '开发中': 'primary', '规划中': 'warning' }[status] || 'info'
}
</script>

<template>
    <div>
        <h2 class="section-title">项目展示</h2>
        <!-- el-card 卡片网格 -->
        <div class="project-grid">
            <el-card
                v-for="(item, index) in projects"
                :key="item.id"
                class="project-card"
                shadow="hover"
            >
                <template #header>
                    <div class="card-head">
                        <div>
                            <span class="project-number">PROJECT {{ String(index + 1).padStart(2, '0') }}</span>
                            <h3 class="project-name">{{ item.name }}</h3>
                            <p class="project-meta">{{ item.time }} · {{ item.role }}</p>
                        </div>
                        <el-tag :type="tagType(item.status)" effect="light">{{ item.status }}</el-tag>
                    </div>
                </template>

                <p class="description">{{ item.desc }}</p>

                <!-- 技术栈标签 -->
                <div class="tag-list">
                    <el-tag v-for="tag in item.stack" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                </div>

                <div class="card-actions">
                    <el-button type="primary" :router="{ name: 'project-detail', params: { id: item.id } }">
                        查看详情
                    </el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.project-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
}

.card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
}

.project-number {
    display: block;
    margin-bottom: 5px;
    color: var(--accent);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
}

.project-name {
    margin: 0;
    color: var(--text-primary);
    font-size: 18px;
}

.project-meta {
    margin: 6px 0 0;
    color: var(--text-secondary);
    font-size: 13px;
}

.description {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.7;
    font-size: 13px;
}

.tag-list {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin: 14px 0;
}

.card-actions {
    margin-top: 4px;
}

@media (max-width: 760px) {
    .project-grid {
        grid-template-columns: 1fr;
    }
}
</style>
