<script setup>
// 公共组件：区块容器（插槽版）
// 用于消除各内容区"标题 + 内容"的重复结构（原 IntroSection / SkillSection / ProjectSection 各自重复写 <section> + <h2 class="section-title">）
// 插槽与 props 的分工（合理选择）：
//   · title prop   —— 简单标题：内容只是一个字符串时用 prop 传入最省事
//   · #title 插槽   —— 富标题：需要加图标、说明文字、按钮等定制结构时用具名插槽（优先级高于 title prop）
//   · 默认插槽      —— 区块内容：由父组件自由定制
defineProps({
    id: { type: String, default: '' },
    title: { type: String, default: '' }
})
</script>

<template>
    <section :id="id || undefined">
        <h2 class="section-title">
            <!-- 具名插槽 #title：定制富标题；未提供时回退显示 title prop 的简单标题 -->
            <slot name="title">{{ title }}</slot>
        </h2>
        <!-- 默认插槽：区块内容 -->
        <slot></slot>
    </section>
</template>
