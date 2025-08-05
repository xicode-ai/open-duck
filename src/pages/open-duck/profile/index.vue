<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>

<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- 个人信息区域 -->
    <view class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-8">
      <view class="flex items-center space-x-4">
        <view class="duck-avatar w-16 h-16"></view>
        <view class="flex-1">
          <view class="flex items-center space-x-2 mb-2">
            <text class="text-xl font-bold">小明同学</text>
            <!-- 会员专属图标 -->
            <view
              v-if="isMember"
              class="bg-gradient-to-r from-yellow-400 to-orange-500 p-1 rounded-full text-white shadow-lg"
            >
              <text class="text-xs">👑</text>
            </view>
          </view>
          <text class="text-blue-100 text-sm mb-2" v-if="isMember">会员到期日: 2025-12-31</text>
          <text class="text-blue-100 text-sm mb-2" v-else>普通用户</text>

          <view class="flex items-center space-x-4 text-sm">
            <view class="flex items-center space-x-1">
              <text class="text-yellow-300">⭐</text>
              <text>等级 Lv.{{ userLevel }}</text>
            </view>
            <view class="flex items-center space-x-1">
              <text class="text-orange-300">🔥</text>
              <text>经验 {{ userExp }}/{{ nextLevelExp }}</text>
            </view>
          </view>

          <!-- 经验进度条 -->
          <view class="mt-2 bg-white bg-opacity-20 rounded-full h-2">
            <view
              class="bg-gradient-to-r from-yellow-300 to-orange-400 h-2 rounded-full"
              :style="{ width: (userExp / nextLevelExp) * 100 + '%' }"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 学习统计 -->
    <view
      class="bg-white/90 backdrop-blur-md mx-4 my-4 rounded-2xl p-6 shadow-lg border border-white/50"
    >
      <text class="text-lg font-semibold text-gray-800 block mb-4">学习统计</text>
      <view class="grid grid-cols-3 gap-4">
        <view class="text-center">
          <text class="text-2xl font-bold text-blue-500 block">{{ totalMinutes }}</text>
          <text class="text-xs text-gray-500">总学习时长(分钟)</text>
        </view>
        <view class="text-center">
          <text class="text-2xl font-bold text-green-500 block">{{ totalWords }}</text>
          <text class="text-xs text-gray-500">累计单词</text>
        </view>
        <view class="text-center">
          <text class="text-2xl font-bold text-purple-500 block">{{ totalConversations }}</text>
          <text class="text-xs text-gray-500">对话次数</text>
        </view>
      </view>

      <!-- 连续学习天数 -->
      <view
        class="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
      >
        <view class="flex items-center justify-between">
          <text class="text-sm text-gray-700">连续学习</text>
          <text class="text-sm font-semibold text-orange-600">{{ continuousDays }}天</text>
        </view>
        <view class="mt-2 bg-white rounded-full h-2">
          <view
            class="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
            :style="{ width: Math.min(continuousDays * 5, 100) + '%' }"
          ></view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="mx-4 space-y-3">
      <!-- 会员相关 -->
      <view
        class="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/50"
      >
        <view
          class="flex items-center justify-between p-4 border-b border-gray-100 transform transition-all duration-300 hover:scale-105"
          @click="goToMembership"
        >
          <view class="flex items-center space-x-3">
            <view
              class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
            >
              <text class="text-white text-lg">👑</text>
            </view>
            <view>
              <text class="text-gray-800 font-medium">
                {{ isMember ? '会员中心' : '开通会员' }}
              </text>
              <text class="text-xs text-gray-500 block">
                {{ isMember ? '管理会员权益' : '解锁更多功能' }}
              </text>
            </view>
          </view>
          <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <text class="text-gray-400 text-lg">›</text>
          </view>
        </view>

        <view
          class="flex items-center justify-between p-4 transform transition-all duration-300 hover:scale-105"
          @click="goToProgress"
        >
          <view class="flex items-center space-x-3">
            <view
              class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center"
            >
              <text class="text-white text-lg">📊</text>
            </view>
            <view>
              <text class="text-gray-800 font-medium">学习进度</text>
              <text class="text-xs text-gray-500 block">查看详细学习数据</text>
            </view>
          </view>
          <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <text class="text-gray-400 text-lg">›</text>
          </view>
        </view>
      </view>

      <!-- 学习工具 -->
      <view
        class="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/50"
      >
        <view
          class="flex items-center justify-between p-4 border-b border-gray-100 transform transition-all duration-300 hover:scale-105"
          @click="goToHistory"
        >
          <view class="flex items-center space-x-3">
            <view
              class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
            >
              <text class="text-white text-lg">📚</text>
            </view>
            <view>
              <text class="text-gray-800 font-medium">学习记录</text>
              <text class="text-xs text-gray-500 block">查看历史学习内容</text>
            </view>
          </view>
          <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <text class="text-gray-400 text-lg">›</text>
          </view>
        </view>

        <view
          class="flex items-center justify-between p-4 border-b border-gray-100 transform transition-all duration-300 hover:scale-105"
          @click="goToSettings"
        >
          <view class="flex items-center space-x-3">
            <view
              class="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center"
            >
              <text class="text-white text-lg">⚙️</text>
            </view>
            <view>
              <text class="text-gray-800 font-medium">设置</text>
              <text class="text-xs text-gray-500 block">应用设置与偏好</text>
            </view>
          </view>
          <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <text class="text-gray-400 text-lg">›</text>
          </view>
        </view>

        <view
          class="flex items-center justify-between p-4 transform transition-all duration-300 hover:scale-105"
          @click="goToHelp"
        >
          <view class="flex items-center space-x-3">
            <view
              class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center"
            >
              <text class="text-white text-lg">❓</text>
            </view>
            <view>
              <text class="text-gray-800 font-medium">帮助反馈</text>
              <text class="text-xs text-gray-500 block">问题反馈与帮助</text>
            </view>
          </view>
          <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <text class="text-gray-400 text-lg">›</text>
          </view>
        </view>
      </view>

      <!-- 关于我们 -->
      <view
        class="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/50"
      >
        <view
          class="flex items-center justify-between p-4 transform transition-all duration-300 hover:scale-105"
          @click="goToAbout"
        >
          <view class="flex items-center space-x-3">
            <view
              class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center"
            >
              <text class="text-white text-lg">ℹ️</text>
            </view>
            <view>
              <text class="text-gray-800 font-medium">关于我们</text>
              <text class="text-xs text-gray-500 block">版本信息与团队介绍</text>
            </view>
          </view>
          <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <text class="text-gray-400 text-lg">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部间距 -->
    <view class="h-4"></view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckProfile">
import { ref } from 'vue'

// 响应式数据
const isMember = ref(false)
const userLevel = ref(5)
const userExp = ref(1250)
const nextLevelExp = ref(2000)
const continuousDays = ref(7)
const totalMinutes = ref(1250)
const totalWords = ref(850)
const totalConversations = ref(156)

// 导航方法
const goToMembership = () => {
  uni.navigateTo({ url: '/pages/open-duck/membership/index' })
}

const goToProgress = () => {
  uni.navigateTo({ url: '/pages/open-duck/progress/index' })
}

const goToHistory = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToSettings = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToHelp = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToAbout = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.duck-avatar {
  position: relative;
  background: linear-gradient(45deg, #ffd700, #ffa500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}

.duck-avatar::before {
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

.duck-avatar::after {
  content: '';
  position: absolute;
  top: 40%;
  left: 25%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #000;
  box-shadow: 16px 0 0 #000;
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
