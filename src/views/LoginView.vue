<script setup>
// ===== 身份认证页（登录）：/login → name: 'login' =====
// 配合 beforeEach 守卫：未登录访问 /admin 或 /articles/admin 时重定向到本页（带 redirect）
// Element Plus 组件：el-card 容器、el-form/el-form-item 表单、el-input 输入框、
//                    el-button 按钮、el-alert 错误提示
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore.js'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
    if (!username.value.trim() || !password.value.trim()) {
        error.value = '请输入用户名和密码'
        return
    }
    error.value = ''
    userStore.login()
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    router.push(redirect || { name: 'admin' })
}
</script>

<template>
    <el-card class="login-card" shadow="hover">
        <h2 class="login-title">身份认证</h2>
        <p class="login-tip">登录后可访问后台管理页面（实验演示，任意非空账号密码即可）</p>

        <!-- 表单组件：label-position 垂直排列 -->
        <el-form label-position="top" @submit.prevent="handleLogin">
            <el-form-item label="用户名">
                <el-input v-model="username" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="password" type="password" placeholder="请输入密码" show-password @keyup.enter="handleLogin" />
            </el-form-item>

            <!-- 错误提示组件 -->
            <el-alert v-if="error" :title="error" type="warning" :closable="false" class="login-alert" />

            <el-button type="primary" class="login-btn" @click="handleLogin">登 录</el-button>
        </el-form>
    </el-card>
</template>

<style scoped>
.login-card {
    max-width: 380px;
    margin: 20px auto 0;
}

.login-title {
    margin: 0 0 6px;
    color: var(--text-primary);
    font-size: 20px;
}

.login-tip {
    margin: 0 0 18px;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.6;
}

.login-alert {
    margin-bottom: 14px;
}

.login-btn {
    width: 100%;
}
</style>
