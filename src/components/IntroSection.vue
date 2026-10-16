<script setup>
// 拆分点 3：个人简介组件（插槽版）
// 复用 SectionCard 统一"标题 + 内容"的区块结构（标题走 title prop，内容走默认插槽）
// isOpen 只影响本组件自身的显示，属于组件内部 UI 状态，用 ref 声明，不需要提升到根组件
import { ref } from 'vue'
import SectionCard from './SectionCard.vue'

defineProps({
    user: { type: Object, required: true }
})

// 组合式 API：用 ref 声明内部状态
const isOpen = ref(false)

function changeDetail() {
    isOpen.value = !isOpen.value
}
</script>

<template>
    <SectionCard title="个人简介">
        <button type="button" @click="changeDetail">{{ isOpen ? '收起详情' : '展开详情' }}</button>
        <div v-if="isOpen" class="intro-box">{{ user.desc }}</div>
    </SectionCard>
</template>

<style scoped>
.intro-box {
    background-color: var(--box-bg);
    padding: 15px;
    border-radius: 6px;
    line-height: 1.6;
    color: var(--text-muted);
}
</style>
