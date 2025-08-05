<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '应用选择',
  },
}
</route>

<template>
  <view class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    <!-- 顶部标题 -->
    <view class="text-center pt-20 pb-12">
      <text class="text-white text-3xl font-bold block mb-4">欢迎使用</text>
      <text class="text-purple-100 text-lg">请选择要使用的应用</text>
    </view>

    <!-- 应用选择卡片 -->
    <view class="px-6 space-y-6">
      <!-- 开口鸭应用 -->
      <view
        class="bg-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300"
        @click="selectApp('open-duck')"
      >
        <view class="flex items-center space-x-4">
          <view class="duck-logo w-16 h-16 flex-shrink-0"></view>
          <view class="flex-1">
            <text class="text-2xl font-bold text-gray-800 block mb-2">开口鸭</text>
            <text class="text-gray-600 text-base mb-3">AI英语口语练习应用</text>
            <view class="flex flex-wrap gap-2">
              <view class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">AI对话</view>
              <view class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                话题练习
              </view>
              <view class="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                地道翻译
              </view>
              <view class="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                背单词
              </view>
            </view>
          </view>
          <text class="text-gray-400 text-2xl">›</text>
        </view>
      </view>

      <!-- Unibest 开发框架 -->
      <view
        class="bg-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300"
        @click="selectApp('unibest')"
      >
        <view class="flex items-center space-x-4">
          <view
            class="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0"
          >
            <text class="text-white text-2xl font-bold">U</text>
          </view>
          <view class="flex-1">
            <text class="text-2xl font-bold text-gray-800 block mb-2">Unibest</text>
            <text class="text-gray-600 text-base mb-3">最好用的 uniapp 开发模板</text>
            <view class="flex flex-wrap gap-2">
              <view class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Vue3</view>
              <view class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                TypeScript
              </view>
              <view class="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">Vite</view>
              <view class="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                UnoCSS
              </view>
            </view>
          </view>
          <text class="text-gray-400 text-2xl">›</text>
        </view>
      </view>
    </view>

    <!-- 底部说明 -->
    <view class="text-center mt-12 px-6">
      <text class="text-purple-100 text-sm">两个应用独立运行，您可以随时切换</text>
    </view>

    <!-- 快速访问按钮 -->
    <view class="px-6 mt-8 space-y-3">
      <view class="flex space-x-3">
        <button
          class="flex-1 bg-white/20 backdrop-blur text-white py-3 rounded-xl border border-white/30"
          @click="quickAccess('/pages/open-duck/index/index')"
        >
          直接进入开口鸭
        </button>
        <button
          class="flex-1 bg-white/20 backdrop-blur text-white py-3 rounded-xl border border-white/30"
          @click="quickAccess('/pages/index/index')"
        >
          直接进入Unibest
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="AppSelector">
// 选择应用
const selectApp = (appType: 'open-duck' | 'unibest') => {
  // 保存用户选择到本地存储
  uni.setStorageSync('selectedApp', appType)

  if (appType === 'open-duck') {
    // 进入开口鸭应用首页
    uni.reLaunch({ url: '/pages/open-duck/index/index' })
  } else {
    // 进入 Unibest 示例首页
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

// 快速访问
const quickAccess = (url: string) => {
  uni.reLaunch({ url })
}

onLoad(() => {
  // 检查是否已经选择过应用
  const selectedApp = uni.getStorageSync('selectedApp')
  if (selectedApp) {
    // 如果已经选择过，可以显示不同的界面或直接跳转
    console.log('已选择应用:', selectedApp)
  }
})
</script>

<style lang="scss" scoped>
.duck-logo {
  position: relative;
  background: linear-gradient(45deg, #ffd700, #ffa500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(255, 165, 0, 0.3);
}

.duck-logo::before {
  content: '';
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 25%;
  background: #ff6b35;
  border-radius: 0 0 50% 50%;
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
}

.duck-logo::after {
  content: '';
  position: absolute;
  top: 40%;
  left: 25%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #000;
  box-shadow: 16px 0 0 #000;
}

.space-y-6 > view:not(:first-child) {
  margin-top: 1.5rem;
}

.space-y-3 > view:not(:first-child) {
  margin-top: 0.75rem;
}

button:active {
  transform: scale(0.95);
}

view:active {
  transform: scale(0.98);
}
</style>
