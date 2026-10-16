<script setup>
// ===== 首页视图：个人主页（原 App.vue 主体内容迁移）=====
// 通过路由渲染：/  →  name: 'home'
// 组件复用：ProfileHeader（头部信息）+ IntroSection（个人简介）+ SkillSection（专业技能）
// 主题切换 ThemeToggle 已上移到 App.vue 全局布局，全站可切换
// 个人信息来源：userStore（后台管理页修改后首页自动同步，localStorage 持久化）
// 实验四：storeToRefs 解构 Store 数据，保持响应式
import ProfileHeader from '../components/ProfileHeader.vue'
import IntroSection from '../components/IntroSection.vue'
import SkillSection from '../components/SkillSection.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore.js'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const skillArr = ["HTML", "CSS", "JavaScript", "Vue3", "C++", "MySQL", "Java"]
</script>

<template>
    <div class="home">
        <!-- 头部信息组件（props 接收 user） -->
        <ProfileHeader :user="user" />

        <!-- 个人简介组件 -->
        <IntroSection :user="user" />

        <!-- 技能列表组件 -->
        <SkillSection :skill-arr="skillArr" />
    </div>
</template>

<style scoped>
.home {
    /* 各区块由组件自带样式，此处仅留间距 */
    display: flex;
    flex-direction: column;
}
</style>
