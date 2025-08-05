<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '开口鸭',
  },
}
</route>

<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- 自定义导航栏 -->
    <view
      class="bg-white/80 backdrop-blur-md shadow-sm"
      :style="{ paddingTop: safeAreaInsets?.top + 'px' }"
    >
      <view class="flex items-center justify-between px-4 py-3">
        <view class="flex items-center space-x-3">
          <view class="duck-logo w-10 h-10"></view>
          <text class="text-xl font-bold text-gray-800">开口鸭</text>
        </view>
        <view class="flex items-center space-x-2">
          <text class="text-sm text-gray-600">{{ greeting }}</text>
          <text
            class="text-xs text-blue-500 px-2 py-1 bg-blue-50 rounded-full"
            @click="goToAppSelector"
          >
            切换应用
          </text>
        </view>
      </view>
    </view>

    <!-- 滚动内容区域 -->
    <scroll-view scroll-y class="flex-1" style="height: calc(100vh - 160px)">
      <!-- 用户状态卡片 -->
      <view class="p-4">
        <view class="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
          <view class="flex items-center justify-between mb-4">
            <text class="text-lg font-semibold text-gray-800">今日使用情况</text>
            <view class="flex items-center space-x-2">
              <text
                class="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium"
              >
                普通用户
              </text>
            </view>
          </view>

          <view class="grid grid-cols-3 gap-4">
            <view class="text-center">
              <text class="text-2xl font-bold text-blue-500 block">{{ todayMinutes }}</text>
              <text class="text-xs text-gray-500">分钟</text>
            </view>
            <view class="text-center">
              <text class="text-2xl font-bold text-green-500 block">{{ todayWords }}</text>
              <text class="text-xs text-gray-500">单词</text>
            </view>
            <view class="text-center">
              <text class="text-2xl font-bold text-purple-500 block">{{ todayConversations }}</text>
              <text class="text-xs text-gray-500">对话</text>
            </view>
          </view>

          <!-- 连续学习天数 -->
          <view
            class="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
          >
            <view class="flex items-center justify-between">
              <text class="text-sm text-gray-700">连续学习</text>
              <text class="text-sm font-semibold text-orange-600">{{ currentStreak }}天</text>
            </view>
            <view class="mt-2 bg-white rounded-full h-2">
              <view
                class="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                :style="{ width: Math.min(currentStreak * 10, 100) + '%' }"
              ></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 功能区域 -->
      <view class="px-4 pb-4">
        <view class="grid grid-cols-2 gap-4">
          <!-- 对话模式 -->
          <view
            class="feature-card bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105"
            @click="navigateTo('/pages/open-duck/chat/index')"
          >
            <view class="flex items-center justify-between">
              <view>
                <text class="text-white text-lg font-semibold block">对话模式</text>
                <text class="text-blue-100 text-sm">AI智能对话</text>
              </view>
              <view class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <text class="text-white text-xl">💬</text>
              </view>
            </view>
          </view>

          <!-- 话题练习 -->
          <view
            class="feature-card bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105"
            @click="navigateTo('/pages/open-duck/topics/index')"
          >
            <view class="flex items-center justify-between">
              <view>
                <text class="text-white text-lg font-semibold block">话题练习</text>
                <text class="text-green-100 text-sm">热门话题</text>
              </view>
              <view class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <text class="text-white text-xl">📚</text>
              </view>
            </view>
          </view>

          <!-- 地道翻译 -->
          <view
            class="feature-card bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105"
            @click="navigateTo('/pages/open-duck/translate/index')"
          >
            <view class="flex items-center justify-between">
              <view>
                <text class="text-white text-lg font-semibold block">地道翻译</text>
                <text class="text-purple-100 text-sm">智能翻译</text>
              </view>
              <view class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <text class="text-white text-xl">🌏</text>
              </view>
            </view>
          </view>

          <!-- 拍照短文 -->
          <view
            class="feature-card bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105"
            @click="navigateTo('/pages/open-duck/photo-story/index')"
          >
            <view class="flex items-center justify-between">
              <view>
                <text class="text-white text-lg font-semibold block">拍照短文</text>
                <text class="text-orange-100 text-sm">图片理解</text>
              </view>
              <view class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <text class="text-white text-xl">📸</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 背单词区域 -->
      <view class="px-4 pb-4">
        <view
          class="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-105"
          @click="navigateTo('/pages/open-duck/vocabulary/index')"
        >
          <view class="flex items-center justify-between">
            <view class="flex items-center space-x-3">
              <view
                class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              >
                <text class="text-white text-xl">📖</text>
              </view>
              <view>
                <text class="text-lg font-semibold text-gray-800 block">背单词</text>
                <text class="text-sm text-gray-500">今日还需学习 {{ remainingWords }} 个单词</text>
              </view>
            </view>
            <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <text class="text-gray-400 text-lg">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 会员提示 -->
      <view class="px-4 pb-4">
        <view
          class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200"
        >
          <view class="flex items-center justify-between">
            <view class="flex items-center space-x-3">
              <view
                class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              >
                <text class="text-white text-lg">👑</text>
              </view>
              <view>
                <text class="text-sm font-semibold text-gray-800">升级会员</text>
                <text class="text-xs text-gray-600">解锁更多功能</text>
              </view>
            </view>
            <text class="text-xs text-orange-600 font-medium">立即升级</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckHome">
import { ref, onMounted } from 'vue'
import { useOpenDuckStore } from '@/store/openDuck'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 状态管理
const openDuckStore = useOpenDuckStore()

// 响应式数据
const greeting = ref('')
const currentStreak = ref(7)
const todayMinutes = ref(25)
const todayWords = ref(12)
const todayConversations = ref(3)
const remainingWords = ref(8)

// 设置问候语
const setGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) {
    greeting.value = '早上好'
  } else if (hour < 18) {
    greeting.value = '下午好'
  } else {
    greeting.value = '晚上好'
  }
}

// 导航方法
const navigateTo = (url: string) => {
  uni.navigateTo({ url })
}

// 去应用选择页面
const goToAppSelector = () => {
  uni.reLaunch({ url: '/pages/app-selector/index' })
}

// 显示即将推出
const showComingSoon = () => {
  uni.showToast({ title: '功能即将推出', icon: 'none' })
}

onLoad(() => {
  setGreeting()
  // 加载用户学习数据
  openDuckStore.loadUserData()
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
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
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
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #000;
  box-shadow: 10px 0 0 #000;
}

.feature-card {
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.feature-card:active::before {
  left: 100%;
}

/* 添加滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
