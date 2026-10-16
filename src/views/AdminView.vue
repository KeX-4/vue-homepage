<script setup>
// ===== 后台管理页：/admin → name: 'admin'（requiresAuth: true）=====
// Element Plus 组件：el-card 分区容器、el-form/el-input 个人资料表单、
//                    el-table/el-table-column 项目列表、el-dialog 项目编辑对话框、
//                    el-button/el-tag 操作按钮与状态标签
// 反馈：ElMessage 操作提示、ElMessageBox.confirm 删除二次确认
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/userStore.js'
import { useProjectStore } from '../stores/projectStore.js'
import ProjectForm from '../components/ProjectForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const projectStore = useProjectStore()
const { user } = storeToRefs(userStore)
const { projects } = storeToRefs(projectStore)

function handleLogout() {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push({ name: 'home' })
}

// ===== 个人资料表单（副本，保存时写回 Store）=====
const profileForm = reactive({
    name: userStore.user.name,
    majorClass: userStore.user.majorClass,
    email: userStore.user.email,
    desc: userStore.user.desc
})

function saveProfileForm() {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
        ElMessage.error('姓名和邮箱不能为空')
        return
    }
    Object.assign(userStore.user, {
        name: profileForm.name.trim(),
        majorClass: profileForm.majorClass.trim(),
        email: profileForm.email.trim(),
        desc: profileForm.desc.trim()
    })
    userStore.saveProfile()
    ElMessage.success('个人简介已保存')
}

function cancelProfileForm() {
    Object.assign(profileForm, {
        name: userStore.user.name,
        majorClass: userStore.user.majorClass,
        email: userStore.user.email,
        desc: userStore.user.desc
    })
    ElMessage.info('已取消修改')
}

// ===== 项目管理：el-dialog + ProjectForm =====
const dialogVisible = ref(false)
const formMode = ref('')
const editingId = ref(null)
const projectFormRef = ref(null)

function startAdd() {
    formMode.value = 'add'
    editingId.value = null
    dialogVisible.value = true
}

function startEdit(row) {
    formMode.value = 'edit'
    editingId.value = row.id
    dialogVisible.value = true
}

// dialog footer 保存：调用 ProjectForm 暴露的 submit()，校验通过再写 Store
function onDialogSave() {
    const payload = projectFormRef.value?.submit()
    if (!payload) return // 校验未通过，ProjectForm 内部已显示错误
    if (formMode.value === 'add') {
        projectStore.addProject(payload)
        ElMessage.success('项目已新增')
    } else {
        projectStore.updateProject({ ...payload, id: editingId.value })
        ElMessage.success('项目信息已更新')
    }
    dialogVisible.value = false
}

function onDelete(row) {
    ElMessageBox.confirm(`确认删除项目《${row.name}》吗？`, '删除确认', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        projectStore.removeProject(row.id)
        ElMessage.success('项目已删除')
    }).catch(() => {})
}

function handleReset() {
    userStore.resetProfile()
    projectStore.resetProjects()
    Object.assign(profileForm, {
        name: userStore.user.name,
        majorClass: userStore.user.majorClass,
        email: userStore.user.email,
        desc: userStore.user.desc
    })
    ElMessage.success('已恢复默认数据')
}

function tagType(status) {
    return { '已完成': 'success', '开发中': 'primary', '规划中': 'warning' }[status] || 'info'
}
</script>

<template>
    <div>
        <div class="admin-head">
            <div>
                <p class="eyebrow">ADMIN CONSOLE</p>
                <h2 class="section-title" style="margin-bottom:0;">后台管理</h2>
            </div>
            <div class="head-actions">
                <el-tag type="success" effect="plain">已登录</el-tag>
                <el-button size="small" @click="handleLogout">退出登录</el-button>
            </div>
        </div>

        <!-- ===== 个人资料管理 ===== -->
        <el-card class="block-card" shadow="never">
            <template #header><strong>个人资料管理</strong></template>
            <el-form :model="profileForm" label-width="90px">
                <el-form-item label="姓名">
                    <el-input v-model="profileForm.name" />
                </el-form-item>
                <el-form-item label="专业班级">
                    <el-input v-model="profileForm.majorClass" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="profileForm.email" />
                </el-form-item>
                <el-form-item label="学号">
                    <el-input :model-value="user.sId" disabled />
                </el-form-item>
                <el-form-item label="个人简介">
                    <el-input v-model="profileForm.desc" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveProfileForm">保存修改</el-button>
                    <el-button @click="cancelProfileForm">取消修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- ===== 项目信息管理 ===== -->
        <el-card class="block-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <strong>项目信息管理</strong>
                    <div>
                        <el-button type="primary" size="small" @click="startAdd">新增项目</el-button>
                        <el-button size="small" @click="handleReset">恢复默认数据</el-button>
                    </div>
                </div>
            </template>

            <!-- el-table 项目列表 -->
            <el-table :data="projects" stripe>
                <el-table-column prop="name" label="项目名称" min-width="160" />
                <el-table-column prop="time" label="时间" width="150" />
                <el-table-column prop="role" label="角色" width="110" />
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-tag :type="tagType(row.status)" size="small">{{ row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template #default="{ row }">
                        <el-button size="small" @click="startEdit(row)">编辑</el-button>
                        <el-button size="small" type="danger" plain @click="onDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- el-dialog 项目新增/编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="formMode === 'add' ? '新增项目' : '编辑项目'" width="600px">
            <ProjectForm
                ref="projectFormRef"
                :initial="formMode === 'edit' ? projects.find(x => x.id === editingId) : null"
            />
            <template #footer>
                <el-button @click="dialogVisible = false">取消修改</el-button>
                <el-button type="primary" @click="onDialogSave">保存项目</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.admin-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
}

.eyebrow {
    margin: 0 0 6px;
    color: var(--accent);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.4px;
}

.head-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.block-card {
    margin-bottom: 16px;
}

.card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
