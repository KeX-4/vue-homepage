<script setup>
// ===== 404 页面：匹配所有未定义路径（/:pathMatch(.*)*）=====
// 使用 useRouter() 编程式跳转返回首页
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
    router.push({ name: 'home' })
}
</script>

<template>
    <div class="not-found">
        <p class="code">404</p>
        <h2 class="title">页面不存在</h2>
        <p class="desc">你访问的地址不存在或已被移动，请检查链接后重试。</p>
        <button type="button" class="primary" @click="goHome">返回首页</button>
    </div>
</template>

<style scoped>
.not-found {
    text-align: center;
    padding: 60px 0;
}

.code {
    margin: 0;
    font-size: 64px;
    font-weight: bold;
    color: var(--accent);
    line-height: 1;
}

.title {
    color: var(--text-primary);
    font-size: 22px;
    margin: 12px 0 8px;
}

.desc {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 18px;
}

.primary {
    padding: 9px 18px;
    color: #fff;
    background: var(--accent);
    border: 0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.primary:hover {
    background: var(--accent-hover);
}
</style>
