<script setup>
// ===== 项目表单组件（新增 / 编辑复用，Element Plus 版）=====
// props.initial：编辑模式传入项目对象；新增模式不传（null）
// 接口：defineExpose({ submit }) —— 父组件（AdminView）在对话框 footer 调用，
//       返回 null 表示校验未通过；返回项目对象表示校验通过
// Element Plus：el-form/el-form-item/el-input/el-select/el-radio-group
import { reactive, ref } from 'vue'

const props = defineProps({
    initial: { type: Object, default: null }
})

const form = reactive({
    name: props.initial?.name || '',
    time: props.initial?.time || '',
    role: props.initial?.role || '独立开发者',
    stackText: (props.initial?.stack || []).join(', '),
    pointsText: (props.initial?.points || []).join('、'),
    desc: props.initial?.desc || '',
    result: props.initial?.result || '',
    status: props.initial?.status || '开发中'
})

const errors = ref({})

function validate() {
    const e = {}
    if (!form.name.trim()) e.name = '项目名称不能为空'
    if (!form.time.trim()) e.time = '项目时间不能为空（如 2026.09 - 2026.12）'
    if (!form.stackText.trim()) e.stack = '至少填写一个技术标签，逗号分隔'
    if (!form.desc.trim()) e.desc = '项目简介不能为空'
    if (form.desc.trim().length < 10) e.desc = '项目简介至少 10 个字'
    errors.value = e
    return Object.keys(e).length === 0
}

// 父组件调用：校验通过返回 payload，失败返回 null
function submit() {
    if (!validate()) return null
    return {
        name: form.name.trim(),
        time: form.time.trim(),
        role: form.role.trim() || '独立开发者',
        stack: form.stackText.split(/[,，]/).map(s => s.trim()).filter(Boolean),
        points: form.pointsText.split(/[、,，]/).map(s => s.trim()).filter(Boolean),
        desc: form.desc.trim(),
        result: form.result.trim(),
        status: form.status
    }
}

defineExpose({ submit })
</script>

<template>
    <el-form label-position="top">
        <el-form-item label="项目名称" :error="errors.name">
            <el-input v-model="form.name" placeholder="如：校园二手交易系统" />
        </el-form-item>
        <el-form-item label="项目时间" :error="errors.time">
            <el-input v-model="form.time" placeholder="如：2026.03 - 至今" />
        </el-form-item>
        <el-form-item label="担任角色">
            <el-input v-model="form.role" placeholder="如：独立开发者" />
        </el-form-item>
        <el-form-item label="项目状态">
            <el-radio-group v-model="form.status">
                <el-radio value="已完成">已完成</el-radio>
                <el-radio value="开发中">开发中</el-radio>
                <el-radio value="规划中">规划中</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="技术栈（逗号分隔）" :error="errors.stack">
            <el-input v-model="form.stackText" placeholder="如：Vue 3, HTML, CSS" />
        </el-form-item>
        <el-form-item label="职责要点（顿号或逗号分隔）">
            <el-input v-model="form.pointsText" placeholder="如：需求分析、数据库设计、编码实现" />
        </el-form-item>
        <el-form-item label="项目简介" :error="errors.desc">
            <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="简要描述项目功能与职责" />
        </el-form-item>
        <el-form-item label="项目成果">
            <el-input v-model="form.result" type="textarea" :rows="2" placeholder="如：成功完成设计报告撰写与项目答辩" />
        </el-form-item>
    </el-form>
</template>
