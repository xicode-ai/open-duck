<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'Unibest首页',
  },
}
</route>
<template>
  <view
    class="bg-white overflow-hidden pt-2 px-4"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <!-- 应用切换按钮 -->
    <view class="flex justify-between items-center mb-4">
      <text class="text-blue-500 text-sm" @click="goToAppSelector">← 应用选择</text>
      <text class="text-green-500 text-sm" @click="switchToOpenDuck">切换到开口鸭</text>
    </view>

    <view class="mt-12">
      <image src="/static/logo.svg" alt="" class="w-28 h-28 block mx-auto" />
    </view>
    <view class="text-center text-4xl main-title-color mt-4 test-unocss-apply">unibest</view>
    <view class="text-center text-2xl mt-2 mb-8">最好用的 uniapp 开发模板</view>
    <view class="text-justify max-w-100 m-auto text-4 indent mb-2">{{ description }}</view>
    <view class="mt-8 text-center">
      <text class="text-green-400">在线文档：</text>
      <!-- #ifndef H5 -->
      https://unibest.tech
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <a href="https://unibest.tech" target="_blank">https://unibest.tech</a>
      <!-- #endif -->
    </view>

    <!-- Demo 页面入口 -->
    <view class="mt-8 text-center">
      <button class="bg-blue-500 text-white px-6 py-3 rounded-lg text-base" @click="goToDemo">
        查看示例页面
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { switchApp } from '@/utils/appRouter'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const author = ref('菲鸽')
const description = ref(
  'unibest 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite4 + UnoCss + UniUI + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)

// 去应用选择页面
const goToAppSelector = () => {
  uni.reLaunch({ url: '/pages/app-selector/index' })
}

// 切换到开口鸭应用
const switchToOpenDuck = () => {
  switchApp('open-duck')
}

// 去示例页面
const goToDemo = () => {
  uni.navigateTo({ url: '/pages/demo/index' })
}

onLoad(() => {
  console.log(author)
})

/** 激活"分享给好友" */
onShareAppMessage((options: Page.ShareAppMessageOption): Page.CustomShareContent => {
  console.log('options:', options)
  return {
    title: 'unibest',
    path: '/pages/index/index',
    imageUrl: '/static/logo.svg',
  }
})
</script>

<style>
.main-title-color {
  color: #d14328;
}

.test-unocss-apply {
  @apply m-4;
}
</style>
