<script setup>
// 拆分点 4：技能列表组件（插槽版）
// 复用 SectionCard 统一区块结构；标题走 title prop，内容走默认插槽
// 搜索关键词 searchWord 是组件内部状态；过滤结果 filterSkill 用 computed() 派生
import { ref, computed, watch } from 'vue'
import SectionCard from './SectionCard.vue'

const props = defineProps({
    skillArr: { type: Array, required: true }
})

// 搜索关键词：组件内部状态
const searchWord = ref('')

// 过滤后的技能列表：组合式 API 用 computed()
const filterSkill = computed(() => {
    if (searchWord.value.trim() === '') {
        return props.skillArr
    }
    return props.skillArr.filter(s =>
        s.toLowerCase().includes(searchWord.value.toLowerCase())
    )
})

// 监听搜索词变化
watch(searchWord, (newVal, oldVal) => {
    console.log(`搜索词变化：旧值=${oldVal}，新值=${newVal}`)
})
</script>

<template>
    <SectionCard title="专业技能">
        <div class="search-box">
            <input type="text" v-model="searchWord" placeholder="输入技能名称搜索">
        </div>
        <ul>
            <li class="skill-item" v-for="(item, index) in filterSkill" :key="index">{{ item }}</li>
        </ul>
    </SectionCard>
</template>

<style scoped>
.search-box {
    margin-bottom: 15px;
}

input {
    padding: 8px 12px;
    width: 240px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    background-color: var(--card-bg);
    color: var(--text-primary);
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

input:focus {
    border-color: var(--accent);
}

.skill-item {
    background-color: var(--skill-bg);
    color: var(--accent);
    padding: 8px 14px;
    border-radius: 20px;
    margin: 6px 8px 6px 0;
    display: inline-block;
    font-size: 14px;
}

/* 窄屏适配：输入框占满整行，字号不小于 16px（防止 iOS 聚焦自动缩放） */
@media (max-width: 720px) {
    input {
        width: 100%;
        box-sizing: border-box;
        font-size: 16px;
    }
}
</style>
