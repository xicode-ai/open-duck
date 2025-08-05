<route lang="json5">
{
  style: {
    navigationBarTitleText: '开通会员',
  },
}
</route>

<template>
  <view class="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
    <!-- 头部区域 -->
    <view class="text-center pt-12 pb-8 px-4">
      <view class="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
        <text class="text-3xl">👑</text>
      </view>
      <text class="text-white text-2xl font-bold block mb-2">开口鸭会员</text>
      <text class="text-purple-100 text-base">解锁全部功能，提升学习效率</text>
    </view>

    <!-- 会员特权 -->
    <view class="px-4 mb-8">
      <view class="bg-white rounded-2xl p-6 shadow-lg">
        <text class="text-lg font-semibold text-gray-800 block mb-4">会员专享特权</text>

        <view class="space-y-3">
          <view class="flex items-center">
            <text class="text-green-500 mr-3">✓</text>
            <text class="text-gray-700">无限次AI对话练习</text>
          </view>
          <view class="flex items-center">
            <text class="text-green-500 mr-3">✓</text>
            <text class="text-gray-700">无限次地道翻译</text>
          </view>
          <view class="flex items-center">
            <text class="text-green-500 mr-3">✓</text>
            <text class="text-gray-700">无限次拍照短文</text>
          </view>
          <view class="flex items-center">
            <text class="text-green-500 mr-3">✓</text>
            <text class="text-gray-700">专业发音纠错</text>
          </view>
          <view class="flex items-center">
            <text class="text-green-500 mr-3">✓</text>
            <text class="text-gray-700">个性化学习计划</text>
          </view>
          <view class="flex items-center">
            <text class="text-green-500 mr-3">✓</text>
            <text class="text-gray-700">学习数据分析报告</text>
          </view>
          <view class="flex items-center">
            <text class="text-green-500 mr-3">✓</text>
            <text class="text-gray-700">优先客服支持</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 套餐选择 -->
    <view class="px-4 mb-8">
      <view class="space-y-3">
        <!-- 月卡 -->
        <view
          :class="[
            'bg-white rounded-xl p-4 border-2 transition-all',
            selectedPlan === 'monthly' ? 'border-purple-500 bg-purple-50' : 'border-gray-200',
          ]"
          @click="selectPlan('monthly')"
        >
          <view class="flex items-center justify-between">
            <view class="flex-1">
              <text class="text-lg font-semibold text-gray-800 block">月卡会员</text>
              <text class="text-sm text-gray-500">1个月无限使用</text>
            </view>
            <view class="text-right">
              <text class="text-2xl font-bold text-purple-600">¥29</text>
              <text class="text-sm text-gray-500 block">原价 ¥39</text>
            </view>
            <view
              :class="[
                'w-5 h-5 rounded-full border-2 ml-3',
                selectedPlan === 'monthly' ? 'border-purple-500 bg-purple-500' : 'border-gray-300',
              ]"
            >
              <text v-if="selectedPlan === 'monthly'" class="text-white text-xs">✓</text>
            </view>
          </view>
        </view>

        <!-- 年卡 -->
        <view
          :class="[
            'bg-white rounded-xl p-4 border-2 transition-all relative',
            selectedPlan === 'yearly' ? 'border-purple-500 bg-purple-50' : 'border-gray-200',
          ]"
          @click="selectPlan('yearly')"
        >
          <!-- 推荐标签 -->
          <view class="absolute -top-2 left-4">
            <text class="bg-orange-500 text-white text-xs px-2 py-1 rounded">最划算</text>
          </view>

          <view class="flex items-center justify-between">
            <view class="flex-1">
              <text class="text-lg font-semibold text-gray-800 block">年卡会员</text>
              <text class="text-sm text-gray-500">12个月无限使用</text>
            </view>
            <view class="text-right">
              <text class="text-2xl font-bold text-purple-600">¥199</text>
              <text class="text-sm text-gray-500 block">原价 ¥468</text>
            </view>
            <view
              :class="[
                'w-5 h-5 rounded-full border-2 ml-3',
                selectedPlan === 'yearly' ? 'border-purple-500 bg-purple-500' : 'border-gray-300',
              ]"
            >
              <text v-if="selectedPlan === 'yearly'" class="text-white text-xs">✓</text>
            </view>
          </view>
        </view>

        <!-- 终身卡 -->
        <view
          :class="[
            'bg-white rounded-xl p-4 border-2 transition-all relative',
            selectedPlan === 'lifetime' ? 'border-purple-500 bg-purple-50' : 'border-gray-200',
          ]"
          @click="selectPlan('lifetime')"
        >
          <!-- 限时标签 -->
          <view class="absolute -top-2 left-4">
            <text class="bg-red-500 text-white text-xs px-2 py-1 rounded">限时特惠</text>
          </view>

          <view class="flex items-center justify-between">
            <view class="flex-1">
              <text class="text-lg font-semibold text-gray-800 block">终身会员</text>
              <text class="text-sm text-gray-500">一次购买，终身享用</text>
            </view>
            <view class="text-right">
              <text class="text-2xl font-bold text-purple-600">¥399</text>
              <text class="text-sm text-gray-500 block">原价 ¥999</text>
            </view>
            <view
              :class="[
                'w-5 h-5 rounded-full border-2 ml-3',
                selectedPlan === 'lifetime' ? 'border-purple-500 bg-purple-500' : 'border-gray-300',
              ]"
            >
              <text v-if="selectedPlan === 'lifetime'" class="text-white text-xs">✓</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 立即开通按钮 -->
    <view class="px-4 pb-8">
      <button
        class="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg shadow-lg"
        @click="purchaseMembership"
      >
        立即开通会员
      </button>

      <!-- 服务协议 -->
      <view class="text-center mt-4">
        <text class="text-purple-100 text-sm">
          开通即代表同意
          <text class="underline" @click="showAgreement">《会员服务协议》</text>
        </text>
      </view>
    </view>

    <!-- 当前使用情况 -->
    <view class="px-4 pb-safe">
      <view class="bg-white/20 rounded-xl p-4">
        <text class="text-white font-semibold block mb-3">今日使用情况</text>
        <view class="space-y-2">
          <view class="flex justify-between">
            <text class="text-purple-100">AI对话</text>
            <text class="text-white">{{ usageStats.help }}/3</text>
          </view>
          <view class="flex justify-between">
            <text class="text-purple-100">地道翻译</text>
            <text class="text-white">{{ usageStats.translate }}/3</text>
          </view>
          <view class="flex justify-between">
            <text class="text-purple-100">拍照短文</text>
            <text class="text-white">{{ usageStats.photo }}/3</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckMembership">
// 响应式数据
const selectedPlan = ref('yearly')

// 使用统计
const usageStats = ref({
  help: 2,
  translate: 1,
  photo: 0,
})

// 选择套餐
const selectPlan = (plan: string) => {
  selectedPlan.value = plan
}

// 购买会员
const purchaseMembership = () => {
  const planNames = {
    monthly: '月卡会员',
    yearly: '年卡会员',
    lifetime: '终身会员',
  }

  const prices = {
    monthly: 29,
    yearly: 199,
    lifetime: 399,
  }

  uni.showModal({
    title: '确认购买',
    content: `确认购买${planNames[selectedPlan.value]}（¥${prices[selectedPlan.value]}）吗？`,
    success: (res) => {
      if (res.confirm) {
        // 模拟支付流程
        simulatePayment()
      }
    },
  })
}

// 模拟支付流程
const simulatePayment = () => {
  uni.showLoading({ title: '支付中...' })

  setTimeout(() => {
    uni.hideLoading()
    uni.showModal({
      title: '支付成功',
      content: '恭喜您成功开通会员！所有功能已解锁。',
      showCancel: false,
      success: () => {
        // 返回上一页或首页
        uni.navigateBack()
      },
    })
  }, 2000)
}

// 显示服务协议
const showAgreement = () => {
  uni.showModal({
    title: '会员服务协议',
    content: '这里是会员服务协议的内容...',
    showCancel: false,
  })
}

onLoad(() => {
  // 页面加载时获取当前使用情况
})
</script>

<style lang="scss" scoped>
.space-y-3 > view:not(:first-child) {
  margin-top: 0.75rem;
}

.space-y-2 > view:not(:first-child) {
  margin-top: 0.5rem;
}

button:active {
  transform: scale(0.98);
}
</style>
