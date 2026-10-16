<script setup>
// 拆分点 1：主题切换组件
// defineModel：实现 isDark 双向绑定（v-model）
// 父组件用 <ThemeToggle v-model="isDark" /> 绑定后：
//   · 读取 isDark.value 即父组件状态
//   · 修改 isDark.value 自动同步回父组件
const isDark = defineModel({ type: Boolean, default: false })

// 点击按钮：直接翻转 isDark，双向绑定自动通知父组件更新
function handleToggle() {
    isDark.value = !isDark.value
}
</script>

<template>
    <button class="theme-toggle" type="button" @click="handleToggle">
        <span class="switch-track" :class="{ dark: isDark }">
            <span class="switch-knob"></span>
        </span>
        <span>{{ isDark ? '白天' : '夜间' }}</span>
    </button>
</template>

<style scoped>
/* 右上角开关按钮 */
.theme-toggle {
    position: absolute;
    top: 16px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 0;
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    background-color: var(--box-bg);
    color: var(--text-primary);
}

.theme-toggle:hover {
    background-color: var(--skill-bg);
}

.switch-track {
    width: 34px;
    height: 18px;
    border-radius: 9px;
    background-color: var(--border-color);
    position: relative;
    display: inline-block;
    transition: background-color 0.3s ease;
}

.switch-track.dark {
    background-color: var(--accent);
}

.switch-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #fff;
    transition: left 0.3s ease;
}

.switch-track.dark .switch-knob {
    left: 18px;
}

/* 窄屏适配：主题按钮回到文档流并居中 */
@media (max-width: 720px) {
    .theme-toggle {
        position: static;
        width: fit-content;
        min-height: 44px;
        margin: 0 auto 20px;
    }
}
</style>
