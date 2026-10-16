<script setup>
// ===== 文章列表页：/articles → name: 'articles' =====
// Element Plus 组件：el-card 文章卡片、el-tag 分类/状态标签、el-button 筛选按钮组
// 数据来自 articleStore（storeToRefs 解构保持响应式）
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../stores/articleStore.js'

const articleStore = useArticleStore()
const { articles, articleCount, publishedCount } = storeToRefs(articleStore)

const category = ref('全部')
const categories = computed(() => ['全部', ...new Set(articles.value.map(a => a.category))])
const filterArticles = computed(() =>
    category.value === '全部' ? articles.value : articles.value.filter(a => a.category === category.value)
)

function statusType(s) {
    return s === '已发布' ? 'success' : 'info'
}
</script>

<template>
    <div>
        <h2 class="section-title">文章列表</h2>
        <p class="meta-line">共 {{ articleCount }} 篇 · 已发布 {{ publishedCount }} 篇</p>

        <!-- 分类筛选按钮组 -->
        <div class="filter-bar">
            <el-button
                v-for="c in categories"
                :key="c"
                :type="category === c ? 'primary' : 'default'"
                size="small"
                round
                @click="category = c"
            >{{ c }}</el-button>
        </div>

        <!-- el-card 文章列表 -->
        <el-card v-for="a in filterArticles" :key="a.id" class="article-item" shadow="never">
            <div class="article-head">
                <h3 class="article-title">{{ a.title }}</h3>
                <el-tag :type="statusType(a.status)" size="small">{{ a.status }}</el-tag>
            </div>
            <p class="article-meta">{{ a.category }} · {{ a.time }}</p>
            <p class="article-summary">{{ a.summary }}</p>
        </el-card>
    </div>
</template>

<style scoped>
.meta-line {
    margin: 0 0 14px;
    color: var(--text-secondary);
    font-size: 13px;
}

.filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.article-item {
    margin-bottom: 12px;
    border-left: 4px solid var(--accent);
}

.article-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.article-title {
    margin: 0;
    color: var(--text-primary);
    font-size: 16px;
}

.article-meta {
    margin: 6px 0;
    color: var(--text-muted);
    font-size: 12px;
}

.article-summary {
    margin: 0;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.7;
}
</style>
