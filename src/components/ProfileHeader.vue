<script setup>
// 拆分点 2：头部信息组件（纯展示，无内部状态，props 在模板中可直接使用）
defineProps({
    user: { type: Object, required: true }
})
</script>

<template>
    <div class="header">
        <img :src="user.avatar" alt="头像" class="avatar">
        <div>
            <h1 class="name">{{ user.name }}</h1>
            <p class="id">学号：{{ user.sId }}</p>
            <p class="info-text">专业班级：{{ user.majorClass }}</p>
            <p class="info-text">邮箱：{{ user.email }}</p>
        </div>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    border-bottom: 3px solid var(--accent);
    padding-bottom: 20px;
    margin-bottom: 25px;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid var(--accent);
    margin-right: 25px;
    object-fit: cover;
}

.name {
    font-size: 28px;
    font-weight: bold;
    color: var(--text-primary);
    margin: 0 0 8px 0;
}

.id {
    font-size: 16px;
    color: var(--accent);
    margin-bottom: 8px;
}

.info-text {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 4px 0;
}

/* 窄屏适配：头部改为纵向居中排列 */
@media (max-width: 720px) {
    .header {
        flex-direction: column;
        text-align: center;
    }

    .avatar {
        margin: 0 0 14px;
    }
}
</style>
