// ===== 用户 Store：登录状态 + 个人资料（实验四）=====
// state  ：token 登录态、user 个人资料
// getters：isLogin 是否已登录、displayName 显示名
// actions：login / logout / saveProfile / resetProfile
// 持久化 ：token 与 user 均写入 localStorage，刷新页面后状态恢复
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const TOKEN_KEY = 'shiyan2_token'
const PROFILE_KEY = 'shiyan2_profile'

// 默认个人资料（实验一迁移数据：宁远 249981119）
const defaultUser = {
    avatar: "https://media.doubao.com/space/api/box/stream/download/all_by_mount_point/Sm5DbrqodoChLCxprJWcXr8Qn0b",
    name: "宁远",
    sId: "249981119",
    majorClass: "24计科2班",
    email: "ning@example.com",
    desc: "喜欢前端开发，熟悉 HTML、CSS、JavaScript 和 Vue3，爱好看书、打篮球，注重代码规范与页面体验。"
}

function loadProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_KEY)
        if (raw) return JSON.parse(raw)
    } catch (e) {
        console.warn('个人资料读取失败，使用默认数据', e)
    }
    return { ...defaultUser }
}

export const useUserStore = defineStore('user', () => {
    // ===== state =====
    // 登录态：从 localStorage 恢复（登录/退出状态跨页面、跨刷新共享）
    const token = ref(localStorage.getItem(TOKEN_KEY) === 'true')
    // 个人资料：首页与后台管理页共用的数据源
    const user = ref(loadProfile())

    // ===== getters =====
    const isLogin = computed(() => token.value)
    const displayName = computed(() => user.value.name)

    // ===== actions =====
    function login() {
        token.value = true
        localStorage.setItem(TOKEN_KEY, 'true')
    }

    function logout() {
        token.value = false
        localStorage.setItem(TOKEN_KEY, 'false')
    }

    // 保存个人资料：写回 state 并持久化
    function saveProfile() {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(user.value))
    }

    // 恢复默认资料
    function resetProfile() {
        localStorage.removeItem(PROFILE_KEY)
        user.value = { ...defaultUser }
    }

    return { token, user, isLogin, displayName, login, logout, saveProfile, resetProfile }
})
