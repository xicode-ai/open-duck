<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <view class="bg-green-500 text-white px-4 py-3 flex items-center">
      <view
        class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4"
        @click="goBack"
      >
        <text class="text-white text-lg">‹</text>
      </view>
      <text class="text-lg font-semibold text-white flex-1">话题模式</text>
      <view class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <text class="text-white text-lg">+</text>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view scroll-y class="flex-1 px-4 py-4">
      <!-- 选择一个话题开始练习 -->
      <view class="mb-6">
        <text class="text-xl font-bold text-gray-800 block mb-2">选择一个话题开始练习</text>
        <text class="text-sm text-gray-600">每个话题都包含相关的日常对话场景</text>
      </view>

      <!-- 话题网格 -->
      <view class="grid grid-cols-2 gap-4 mb-8">
        <view
          v-for="(topic, index) in topicGrid"
          :key="index"
          class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          @click="selectTopic(topic)"
        >
          <view class="flex items-center mb-3">
            <view
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center mr-3',
                topic.iconBg,
              ]"
            >
              <text class="text-white text-lg">{{ topic.icon }}</text>
            </view>
            <view class="flex-1">
              <text class="font-semibold text-gray-800 block">{{ topic.title }}</text>
              <text class="text-xs text-gray-500">{{ topic.subtitle }}</text>
            </view>
          </view>
          <text class="text-xs text-gray-600 block mb-2">{{ topic.description }}</text>
          <text class="text-xs text-blue-600 font-medium">{{ topic.dialogues }}个对话</text>
        </view>
      </view>

      <!-- 热门话题 -->
      <view class="mb-8">
        <view class="flex items-center mb-4">
          <text class="text-red-500 mr-2">🔥</text>
          <text class="text-lg font-semibold text-gray-800">热门话题</text>
        </view>
        <view class="bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl p-4 text-white">
          <view class="flex items-center justify-between">
            <view class="flex items-center">
              <text class="text-white text-xl mr-3">💖</text>
              <view>
                <text class="font-semibold block">约会交友</text>
                <text class="text-sm opacity-90">浪漫对话、表达情感</text>
              </view>
            </view>
            <view class="bg-white/20 px-2 py-1 rounded-full">
              <text class="text-xs font-medium">新</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 话题学习进度 -->
      <view class="mb-8">
        <view class="flex items-center mb-4">
          <text class="text-blue-500 mr-2">📊</text>
          <text class="text-lg font-semibold text-gray-800">话题学习进度</text>
        </view>
        <view class="space-y-4">
          <view
            v-for="(progress, index) in learningProgress"
            :key="index"
            class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <view class="flex items-center justify-between mb-3">
              <view class="flex items-center">
                <view
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                    progress.iconBg,
                  ]"
                >
                  <text class="text-white text-sm">{{ progress.icon }}</text>
                </view>
                <view>
                  <text class="font-semibold text-gray-800 block">{{ progress.title }}</text>
                  <text class="text-xs text-gray-500">
                    已完成 {{ progress.completed }}/{{ progress.total }} 个对话
                  </text>
                </view>
              </view>
            </view>
            <view class="bg-gray-200 rounded-full h-2">
              <view
                :class="[progress.progressColor, 'h-2 rounded-full']"
                :style="{ width: (progress.completed / progress.total) * 100 + '%' }"
              ></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 学习建议 -->
      <view class="mb-8">
        <view class="flex items-center mb-4">
          <text class="text-yellow-500 mr-2">💡</text>
          <text class="text-lg font-semibold text-gray-800">学习建议</text>
        </view>
        <view class="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-4 text-white">
          <text class="text-sm leading-relaxed block mb-4">
            建议先完成咖啡话题，再挑战旅游话题。每个话题都有不同的难度等级，循序渐进效果更好！
          </text>
          <button class="bg-white text-green-600 px-6 py-2 rounded-full font-medium mx-auto block">
            开始学习
          </button>
        </view>
      </view>

      <!-- 我的自定义话题 -->
      <view class="mb-8">
        <view class="flex items-center justify-between mb-4">
          <view class="flex items-center">
            <text class="text-purple-500 mr-2">🎯</text>
            <text class="text-lg font-semibold text-gray-800">我的自定义话题</text>
          </view>
          <button
            class="bg-white border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-600"
          >
            + 添加话题
          </button>
        </view>
        <view class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <view class="flex items-center justify-between">
            <view class="flex items-center">
              <view class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <text class="text-white text-sm">🎮</text>
              </view>
              <view>
                <text class="font-semibold text-gray-800 block">游戏交流</text>
                <text class="text-xs text-gray-500">自定义话题 · 3个对话</text>
              </view>
            </view>
            <view class="flex items-center space-x-2">
              <view class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <text class="text-gray-500 text-xs">✏️</text>
              </view>
              <view class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <text class="text-gray-500 text-xs">🗑️</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckTopics">
import { ref } from 'vue'

// 话题网格数据
const topicGrid = ref([
  {
    id: 1,
    title: 'Coffee',
    subtitle: '咖啡',
    description: '点咖啡、描述口味偏好',
    dialogues: 15,
    icon: '☕',
    iconBg: 'bg-orange-500',
  },
  {
    id: 2,
    title: 'Travel',
    subtitle: '旅游',
    description: '机场、酒店、问路',
    dialogues: 20,
    icon: '✈️',
    iconBg: 'bg-blue-500',
  },
  {
    id: 3,
    title: 'Fitness',
    subtitle: '健身',
    description: '健身房、运动计划',
    dialogues: 12,
    icon: '🏋️',
    iconBg: 'bg-green-500',
  },
  {
    id: 4,
    title: 'Restaurant',
    subtitle: '餐厅',
    description: '点餐、服务、买单',
    dialogues: 18,
    icon: '🍴',
    iconBg: 'bg-red-500',
  },
  {
    id: 5,
    title: 'Shopping',
    subtitle: '购物',
    description: '选择、试穿、砍价',
    dialogues: 16,
    icon: '🛍️',
    iconBg: 'bg-purple-500',
  },
  {
    id: 6,
    title: 'Work',
    subtitle: '工作',
    description: '面试、会议、同事',
    dialogues: 22,
    icon: '💼',
    iconBg: 'bg-indigo-500',
  },
  {
    id: 7,
    title: 'Hospital',
    subtitle: '医院',
    description: '挂号、问诊、买药',
    dialogues: 14,
    icon: '🏥',
    iconBg: 'bg-cyan-500',
  },
  {
    id: 8,
    title: 'Weather',
    subtitle: '天气',
    description: '聊天、计划、感受',
    dialogues: 10,
    icon: '☀️',
    iconBg: 'bg-yellow-500',
  },
])

// 学习进度数据
const learningProgress = ref([
  {
    title: '咖啡话题',
    completed: 8,
    total: 15,
    icon: '☕',
    iconBg: 'bg-orange-500',
    progressColor: 'bg-orange-500',
  },
  {
    title: '旅游话题',
    completed: 12,
    total: 20,
    icon: '✈️',
    iconBg: 'bg-blue-500',
    progressColor: 'bg-blue-500',
  },
  {
    title: '健身话题',
    completed: 5,
    total: 12,
    icon: '🏋️',
    iconBg: 'bg-green-500',
    progressColor: 'bg-green-500',
  },
])

// 选择话题
const selectTopic = (topic: any) => {
  uni.navigateTo({
    url: `/pages/open-duck/topic-chat/index?topicId=${topic.id}&title=${encodeURIComponent(topic.title)}`,
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
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
