<script setup>
// ===== 文章管理页：/articles/admin → name: 'articles-admin'（requiresAuth）=====
// Element Plus 组件：el-table/el-table-column 管理列表、el-dialog 新增编辑对话框、
//                    el-form/el-form-item/el-input/el-select 表单、el-button 操作按钮
// 提示与确认：ElMessage 操作提示、ElMessageBox.confirm 删除二次确认
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../stores/articleStore.js'
import { useUserStore } from '../stores/userStore.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const articleStore = useArticleStore()
const userStore = useUserStore()
const { articles, articleCount } = storeToRefs(articleStore)

// 退出登录
function handleLogout() {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push({ name: 'home' })
}

// ===== 对话框表单状态 =====
const dialogVisible = ref(false)   // el-dialog 显隐
const formMode = ref('')            // add / edit
const editingId = ref(null)
const formRef = ref(null)

// 表单模型 + 校验规则
const form = reactive({
    title: '',
    category: '技术笔记',
    time: '',
    summary: '',
    content: '',
    status: '草稿'
})

const rules = {
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    summary: [
        { required: true, message: '请输入文章摘要', trigger: 'blur' },
        { min: 10, message: '摘要至少 10 个字', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入文章正文', trigger: 'blur' },
        { min: 20, message: '正文至少 20 个字', trigger: 'blur' }
    ]
}

function resetForm() {
    Object.assign(form, {
        title: '', category: '技术笔记', time: '', summary: '', content: '', status: '草稿'
    })
    editingId.value = null
}

function startAdd() {
    resetForm()
    formMode.value = 'add'
    dialogVisible.value = true
}

function startEdit(row) {
    Object.assign(form, {
        title: row.title, category: row.category, time: row.time,
        summary: row.summary, content: row.content, status: row.status
    })
    editingId.value = row.id
    formMode.value = 'edit'
    dialogVisible.value = true
}

// 保存：表单校验通过后调用 store action
async function onSave() {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
    } catch {
        return // 校验未通过
    }
    const payload = {
        title: form.title.trim(),
        category: form.category,
        time: form.time.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        status: form.status
    }
    if (formMode.value === 'add') {
        articleStore.addArticle(payload)
        ElMessage.success('文章已新增')
    } else {
        articleStore.updateArticle({ ...payload, id: editingId.value })
        ElMessage.success('文章已更新')
    }
    dialogVisible.value = false
}

// 删除：ElMessageBox 弹出确认框
function onDelete(row) {
    ElMessageBox.confirm(`确认删除文章《${row.title}》吗？`, '删除确认', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        articleStore.removeArticle(row.id)
        ElMessage.success('文章已删除')
    }).catch(() => {})
}
</script>

<template>
    <div>
        <div class="admin-head">
            <h2 class="section-title" style="margin-bottom:0;">文章管理</h2>
            <el-button type="primary" @click="startAdd">新增文章</el-button>
        </div>

        <p class="meta-line">
            当前登录：{{ userStore.displayName }}（学号 {{ userStore.user.sId }}）· 共 {{ articleCount }} 篇
            <el-button link type="primary" @click="handleLogout" style="margin-left:10px;">退出登录</el-button>
        </p>

        <!-- el-table 文章管理列表 -->
        <el-table :data="articles" stripe>
            <el-table-column prop="title" label="标题" min-width="180" />
            <el-table-column prop="category" label="分类" width="100" />
            <el-table-column prop="time" label="时间" width="110" />
            <el-table-column label="状态" width="90">
                <template #default="{ row }">
                    <el-tag :type="row.status === '已发布' ? 'success' : 'info'" size="small">
                        {{ row.status }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template #default="{ row }">
                    <el-button size="small" @click="startEdit(row)">编辑</el-button>
                    <el-button size="small" type="danger" plain @click="onDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- el-dialog 新增/编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="formMode === 'add' ? '新增文章' : '编辑文章'" width="560px">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入文章标题" />
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="form.category" style="width: 100%">
                        <el-option label="技术笔记" value="技术笔记" />
                        <el-option label="学习心得" value="学习心得" />
                        <el-option label="项目总结" value="项目总结" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-input v-model="form.time" placeholder="如：2026.10" />
                </el-form-item>
                <el-form-item label="文章摘要" prop="summary">
                    <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="一句话概括文章内容" />
                </el-form-item>
                <el-form-item label="文章正文" prop="content">
                    <el-input v-model="form.content" type="textarea" :rows="4" placeholder="文章正文内容" />
                </el-form-item>
                <el-form-item label="发布状态">
                    <el-radio-group v-model="form.status">
                        <el-radio value="草稿">草稿</el-radio>
                        <el-radio value="已发布">已发布</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消修改</el-button>
                <el-button type="primary" @click="onSave">保存文章</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.admin-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

.meta-line {
    margin: 0 0 16px;
    color: var(--text-secondary);
    font-size: 13px;
}
</style>
