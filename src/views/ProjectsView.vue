<script setup>
// ===== 项目页父布局：/projects → name: 'projects' =====
// 任务 5：项目列表、项目详情作为本路由的嵌套子路由，
// 父组件只负责统一样式与标题，用 <RouterView> 渲染当前子路由组件
import SectionCard from '../components/SectionCard.vue'
</script>

<template>
    <SectionCard title="项目展示">
        <!-- 具名插槽 #title：富标题 -->
        <template #title>
            <span>项目展示</span>
            <span class="sub">个人实践项目 · 嵌套子路由</span>
        </template>

        <!-- 嵌套子路由出口：/projects → 列表；/projects/:id → 详情 -->
        <RouterView />
    </SectionCard>
</template>

<style scoped>
.sub {
    font-size: 13px;
    font-weight: normal;
    color: var(--text-muted);
    margin-left: 8px;
}
</style>
