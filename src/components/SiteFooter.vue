<script setup>
// 公共组件：底部页脚（插槽版）
// 默认插槽：由父组件定制页脚内容（如版权、备案、友情链接、联系方式）；
//           未传插槽时显示 fallback 默认版权信息
// 根元素通过 attribute fallthrough 接收 id="contact"，供顶部导航锚点跳转
</script>

<template>
    <footer class="site-footer">
        <div class="footer-inner">
            <!-- 默认插槽：父组件定制内容；无插槽时回退显示默认版权文案 -->
            <slot>
                <p class="copyright">© 2026 宁远 · 学号 249981119 · 前端开发学习之路</p>
                <p class="footer-note">Vue 3 + Vite 构建 · 组合式 API（&lt;script setup&gt;）</p>
            </slot>
        </div>
    </footer>
</template>

<style scoped>
.site-footer {
    background-color: var(--card-bg);
    border-top: 1px solid var(--border-color);
}

.footer-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 18px 20px;
    text-align: center;
}
</style>
