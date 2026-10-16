// ===== 个人资料数据（单一数据源 + localStorage 持久化）=====
// 首页 ProfileHeader / IntroSection 与后台管理页共用同一份数据：
//   管理页修改 → saveProfile() 写入 localStorage → 首页自动展示新内容
// 结构：{ avatar, name, sId, majorClass, email, desc }
import { ref } from 'vue'

const STORAGE_KEY = 'shiyan2_profile'

// 默认个人资料（实验一迁移数据：宁远 249981119）
const defaultUser = {
    avatar: "https://media.doubao.com/space/api/box/stream/download/all_by_mount_point/Sm5DbrqodoChLCxprJWcXr8Qn0b",
    name: "宁远",
    sId: "249981119",
    majorClass: "24计科2班",
    email: "ning@example.com",
    desc: "喜欢前端开发，熟悉 HTML、CSS、JavaScript 和 Vue3，爱好看书、打篮球，注重代码规范与页面体验。"
}

// 从 localStorage 读取；无记录或解析失败时回退默认数据
function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch (e) {
        console.warn('个人资料读取失败，使用默认数据', e)
    }
    return { ...defaultUser }
}

// 响应式数据源：管理页修改 user 后，首页/简介组件自动更新
export const user = ref(load())

// 保存：管理页调用，将当前 user 写入 localStorage 持久化
export function saveProfile() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
}

// 恢复默认：清空 localStorage 记录并重置为默认数据
export function resetProfile() {
    localStorage.removeItem(STORAGE_KEY)
    user.value = { ...defaultUser }
}
