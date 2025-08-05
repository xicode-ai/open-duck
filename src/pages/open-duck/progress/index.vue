<route lang="json5">
{
  style: {
    navigationBarTitleText: '学习进度',
  },
}
</route>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 今日概览 -->
    <view class="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
      <text class="text-lg font-semibold text-gray-800 block mb-4">今日学习</text>

      <view class="grid grid-cols-2 gap-4 mb-4">
        <view class="text-center p-3 bg-blue-50 rounded-lg">
          <text class="text-2xl font-bold text-blue-500 block">{{ todayStats.minutes }}</text>
          <text class="text-sm text-gray-600">学习时长(分钟)</text>
        </view>
        <view class="text-center p-3 bg-green-50 rounded-lg">
          <text class="text-2xl font-bold text-green-500 block">{{ todayStats.words }}</text>
          <text class="text-sm text-gray-600">学习单词</text>
        </view>
      </view>

      <view class="grid grid-cols-2 gap-4">
        <view class="text-center p-3 bg-purple-50 rounded-lg">
          <text class="text-2xl font-bold text-purple-500 block">
            {{ todayStats.conversations }}
          </text>
          <text class="text-sm text-gray-600">对话次数</text>
        </view>
        <view class="text-center p-3 bg-orange-50 rounded-lg">
          <text class="text-2xl font-bold text-orange-500 block">{{ continuousDays }}</text>
          <text class="text-sm text-gray-600">连续天数</text>
        </view>
      </view>
    </view>

    <!-- 学习目标 -->
    <view class="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
      <view class="flex items-center justify-between mb-4">
        <text class="text-lg font-semibold text-gray-800">今日目标</text>
        <text class="text-sm text-blue-500" @click="editGoals">编辑</text>
      </view>

      <view class="space-y-4">
        <!-- 学习时长目标 -->
        <view>
          <view class="flex justify-between mb-2">
            <text class="text-gray-700">学习时长</text>
            <text class="text-sm text-gray-500">
              {{ todayStats.minutes }}/{{ goals.minutes }}分钟
            </text>
          </view>
          <view class="bg-gray-200 rounded-full h-2">
            <view
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min(100, (todayStats.minutes / goals.minutes) * 100)}%` }"
            ></view>
          </view>
        </view>

        <!-- 单词目标 -->
        <view>
          <view class="flex justify-between mb-2">
            <text class="text-gray-700">背单词</text>
            <text class="text-sm text-gray-500">{{ todayStats.words }}/{{ goals.words }}个</text>
          </view>
          <view class="bg-gray-200 rounded-full h-2">
            <view
              class="bg-green-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min(100, (todayStats.words / goals.words) * 100)}%` }"
            ></view>
          </view>
        </view>

        <!-- 对话目标 -->
        <view>
          <view class="flex justify-between mb-2">
            <text class="text-gray-700">AI对话</text>
            <text class="text-sm text-gray-500">
              {{ todayStats.conversations }}/{{ goals.conversations }}次
            </text>
          </view>
          <view class="bg-gray-200 rounded-full h-2">
            <view
              class="bg-purple-500 h-2 rounded-full transition-all duration-300"
              :style="{
                width: `${Math.min(100, (todayStats.conversations / goals.conversations) * 100)}%`,
              }"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 本周统计 -->
    <view class="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
      <text class="text-lg font-semibold text-gray-800 block mb-4">本周学习</text>

      <view class="space-y-3">
        <view
          v-for="(day, index) in weekStats"
          :key="index"
          class="flex items-center justify-between"
        >
          <view class="flex items-center space-x-3">
            <text class="text-sm text-gray-600 w-8">{{ day.name }}</text>
            <view class="bg-gray-200 rounded-full h-2 w-24">
              <view
                class="bg-blue-400 h-2 rounded-full"
                :style="{ width: `${(day.minutes / 60) * 100}%` }"
              ></view>
            </view>
          </view>
          <text class="text-sm text-gray-700">{{ day.minutes }}分钟</text>
        </view>
      </view>

      <view class="mt-4 p-3 bg-gray-50 rounded-lg">
        <text class="text-sm text-gray-600 block">本周总计: {{ weekTotal }}分钟</text>
        <text class="text-sm text-gray-600">平均每天: {{ Math.round(weekTotal / 7) }}分钟</text>
      </view>
    </view>

    <!-- 学习排行 -->
    <view class="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
      <text class="text-lg font-semibold text-gray-800 block mb-4">学习排行</text>

      <view class="space-y-3">
        <view
          v-for="(user, index) in rankingList"
          :key="index"
          class="flex items-center justify-between"
        >
          <view class="flex items-center space-x-3">
            <view
              :class="[
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                index === 0
                  ? 'bg-yellow-400 text-white'
                  : index === 1
                  ? 'bg-gray-400 text-white'
                  : index === 2
                  ? 'bg-orange-400 text-white'
                  : 'bg-gray-200 text-gray-600',
              ]"
            >
              <text>{{ index + 1 }}</text>
            </view>
            <text class="text-gray-700">{{ user.name }}</text>
            <text v-if="user.isMe" class="text-xs text-blue-500">(我)</text>
          </view>
          <text class="text-sm text-gray-600">{{ user.minutes }}分钟</text>
        </view>
      </view>
    </view>

    <!-- 成就徽章 -->
    <view class="bg-white mx-4 mt-4 mb-4 rounded-xl p-6 shadow-sm">
      <text class="text-lg font-semibold text-gray-800 block mb-4">成就徽章</text>

      <view class="grid grid-cols-4 gap-3">
        <view v-for="(badge, index) in badges" :key="index" class="text-center">
          <view
            :class="[
              'w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl',
              badge.earned ? 'bg-yellow-100' : 'bg-gray-100',
            ]"
          >
            <text :class="badge.earned ? '' : 'grayscale'">{{ badge.icon }}</text>
          </view>
          <text class="text-xs text-gray-600">{{ badge.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckProgress">
// 响应式数据
const todayStats = ref({
  minutes: 25,
  words: 12,
  conversations: 3,
})

const goals = ref({
  minutes: 30,
  words: 20,
  conversations: 5,
})

const continuousDays = ref(7)

const weekStats = ref([
  { name: '周一', minutes: 30 },
  { name: '周二', minutes: 45 },
  { name: '周三', minutes: 20 },
  { name: '周四', minutes: 35 },
  { name: '周五', minutes: 40 },
  { name: '周六', minutes: 25 },
  { name: '周日', minutes: 25 },
])

const rankingList = ref([
  { name: '学霸小明', minutes: 180, isMe: false },
  { name: '英语达人', minutes: 165, isMe: false },
  { name: '口语王者', minutes: 150, isMe: false },
  { name: '我', minutes: 120, isMe: true },
  { name: '努力学习', minutes: 100, isMe: false },
])

const badges = ref([
  { name: '初学者', icon: '🔰', earned: true },
  { name: '坚持者', icon: '💪', earned: true },
  { name: '单词达人', icon: '📚', earned: false },
  { name: '对话专家', icon: '💬', earned: false },
])

// 计算属性
const weekTotal = computed(() => {
  return weekStats.value.reduce((total, day) => total + day.minutes, 0)
})

// 编辑目标
const editGoals = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

onLoad(() => {
  // 页面加载时获取学习进度数据
})
</script>

<style lang="scss" scoped>
.space-y-3 > view:not(:first-child) {
  margin-top: 0.75rem;
}

.space-y-4 > view:not(:first-child) {
  margin-top: 1rem;
}

.grayscale {
  filter: grayscale(100%);
  opacity: 0.5;
}
</style>
