<template>
  <view class="h-screen bg-gray-50 flex flex-col">
    <!-- 顶部固定区域 -->
    <view class="flex-shrink-0">
      <!-- 导航栏 -->
      <view class="bg-orange-500 text-white px-4 py-3 flex items-center">
        <view
          class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4"
          @click="goBack"
        >
          <text class="text-white text-lg">‹</text>
        </view>
        <view class="flex items-center flex-1">
          <text class="text-white text-xl mr-2">☕</text>
          <view>
            <text class="text-lg font-semibold text-white block">{{ topicTitle }}</text>
            <text class="text-xs text-white/80">
              对话 {{ currentDialogue }}/{{ totalDialogues }}
            </text>
          </view>
        </view>
        <view class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <text class="text-white text-lg">🔖</text>
        </view>
      </view>

      <!-- 进度条 -->
      <view class="bg-white px-4 py-2">
        <view class="flex items-center space-x-3">
          <text class="text-sm text-gray-600">进度</text>
          <view class="flex-1 bg-gray-200 rounded-full h-2">
            <view
              class="bg-orange-500 h-2 rounded-full"
              :style="{ width: progressPercentage + '%' }"
            ></view>
          </view>
          <text class="text-sm text-orange-500 font-medium">{{ progressPercentage }}%</text>
        </view>
      </view>
    </view>

    <!-- 滚动主内容区域 -->
    <scroll-view scroll-y class="flex-1 px-4 py-4 space-y-4 pb-32">
      <!-- 场景描述 -->
      <view class="bg-orange-50 rounded-2xl p-4 border border-orange-100">
        <view class="flex items-center space-x-2 mb-2">
          <text class="text-orange-500 text-lg">📍</text>
          <text class="text-orange-700 font-medium text-sm">场景：星巴克咖啡店</text>
        </view>
        <text class="text-gray-700 text-sm">
          你想要点一杯咖啡，向服务员询问推荐并描述你的口味偏好。
        </text>
      </view>

      <!-- 服务员对话 -->
      <view class="bg-white rounded-2xl p-4 shadow-sm">
        <view class="flex items-center space-x-3 mb-3">
          <view class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <text class="text-white text-sm">👤</text>
          </view>
          <text class="font-medium text-gray-800">服务员</text>
          <button
            class="ml-auto bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs"
            @click="playStaffAudio"
          >
            <text class="mr-1">▶</text>
            播放
          </button>
        </view>
        <view class="bg-gray-50 rounded-lg p-3">
          <text class="text-gray-800 font-medium mb-2 block">
            "Good morning! What can I get for you today?"
          </text>
          <text class="text-gray-600 text-sm">"早上好！今天我能为您做些什么？"</text>
        </view>
      </view>

      <!-- 用户回答区域 -->
      <view class="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 border-dashed">
        <view class="flex items-center space-x-3 mb-3">
          <view class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <text class="text-sm">🦆</text>
          </view>
          <text class="font-medium text-gray-800">你的回答</text>
        </view>

        <!-- 参考答案 -->
        <view class="bg-white rounded-lg p-3 mb-3">
          <view class="flex items-center justify-between mb-2">
            <text class="text-sm font-medium text-blue-600">参考答案</text>
            <button
              class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
              @click="toggleReferenceAnswer"
            >
              <text class="mr-1">👁️</text>
              查看
            </button>
          </view>
          <view v-if="showReferenceAnswer" class="space-y-2">
            <text class="text-gray-800 font-medium block">
              "Hi! I'd like a coffee, please. What do you recommend for someone who likes mild
              flavors?"
            </text>
            <text class="text-gray-600 text-sm">
              "你好！我想要一杯咖啡。对于喜欢温和口味的人，你推荐什么？"
            </text>
          </view>
        </view>

        <!-- 跟读按钮 -->
        <view class="text-center">
          <button
            class="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 mx-auto active:scale-95 transition-transform"
            @touchstart="startRecording"
            @touchend="stopRecording"
            @touchcancel="stopRecording"
          >
            <text class="text-lg">🎤</text>
            <text class="font-medium">{{ isRecording ? '录音中...' : '开始跟读' }}</text>
          </button>
          <text class="text-xs text-gray-500 mt-2">长按录音，松开结束</text>
        </view>
      </view>

      <!-- 语音评分结果 -->
      <view v-if="showVoiceScore" class="bg-green-50 rounded-2xl p-4 border border-green-200">
        <view class="flex items-center space-x-3 mb-3">
          <text class="text-green-500 text-lg">📈</text>
          <text class="font-medium text-gray-800">语音评分</text>
        </view>

        <view class="space-y-3">
          <!-- 总分 -->
          <view class="flex items-center justify-between">
            <text class="text-gray-700">总体评分</text>
            <view class="flex items-center space-x-2">
              <view class="flex space-x-1">
                <text v-for="i in 5" :key="i" class="text-yellow-400 text-sm">
                  {{ i <= 4 ? '★' : '☆' }}
                </text>
              </view>
              <text class="text-green-600 font-bold text-lg">85分</text>
            </view>
          </view>

          <!-- 详细评分 -->
          <view class="space-y-2">
            <view class="flex items-center justify-between text-sm">
              <text class="text-gray-600">发音准确度</text>
              <view class="flex items-center space-x-2">
                <view class="w-16 bg-gray-200 rounded-full h-2">
                  <view class="bg-green-500 h-2 rounded-full w-4/5"></view>
                </view>
                <text class="text-green-600 font-medium">80%</text>
              </view>
            </view>
            <view class="flex items-center justify-between text-sm">
              <text class="text-gray-600">语音流畅度</text>
              <view class="flex items-center space-x-2">
                <view class="w-16 bg-gray-200 rounded-full h-2">
                  <view class="bg-blue-500 h-2 rounded-full w-full"></view>
                </view>
                <text class="text-blue-600 font-medium">90%</text>
              </view>
            </view>
            <view class="flex items-center justify-between text-sm">
              <text class="text-gray-600">语调自然度</text>
              <view class="flex items-center space-x-2">
                <view class="w-16 bg-gray-200 rounded-full h-2">
                  <view class="bg-orange-500 h-2 rounded-full w-3/4"></view>
                </view>
                <text class="text-orange-600 font-medium">75%</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 固定底部操作区域 -->
    <view class="fixed bottom-0 left-0 right-0 z-10 flex-shrink-0 bg-white">
      <view class="px-4 py-3 border-t border-gray-200">
        <view class="flex justify-center space-x-4 max-w-md mx-auto">
          <button
            class="bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium flex items-center"
            @click="restartPractice"
          >
            <text class="mr-2">↻</text>
            重新练习
          </button>
          <button
            class="bg-orange-500 text-white py-3 px-6 rounded-xl font-medium flex items-center"
            @click="nextDialogue"
          >
            <text class="mr-2">→</text>
            下一个对话
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckTopicChat">
import { ref, onMounted } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 响应式数据
const topicTitle = ref('咖啡话题')
const currentDialogue = ref(3)
const totalDialogues = ref(15)
const progressPercentage = ref(20)
const showReferenceAnswer = ref(false)
const showVoiceScore = ref(false)
const isRecording = ref(false)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 播放服务员音频
const playStaffAudio = () => {
  uni.showToast({ title: '播放音频', icon: 'none' })
}

// 切换参考答案显示
const toggleReferenceAnswer = () => {
  showReferenceAnswer.value = !showReferenceAnswer.value
}

// 开始录音
const startRecording = () => {
  isRecording.value = true
  uni.showToast({ title: '开始录音', icon: 'none' })
}

// 停止录音
const stopRecording = () => {
  if (isRecording.value) {
    isRecording.value = false
    showVoiceScore.value = true
    uni.showToast({ title: '录音完成', icon: 'success' })
  }
}

// 重新练习
const restartPractice = () => {
  showVoiceScore.value = false
  showReferenceAnswer.value = false
  uni.showToast({ title: '重新开始练习', icon: 'none' })
}

// 下一个对话
const nextDialogue = () => {
  if (currentDialogue.value < totalDialogues.value) {
    currentDialogue.value++
    progressPercentage.value = Math.round((currentDialogue.value / totalDialogues.value) * 100)
    showVoiceScore.value = false
    showReferenceAnswer.value = false
    uni.showToast({ title: '进入下一个对话', icon: 'none' })
  } else {
    uni.showToast({ title: '已完成所有对话', icon: 'success' })
  }
}

onMounted(() => {
  // 获取路由参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage.options?.title) {
    topicTitle.value = decodeURIComponent(currentPage.options.title)
  }
})
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
