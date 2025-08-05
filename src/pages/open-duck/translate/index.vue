<route lang="json5">
{
  style: {
    navigationBarTitleText: '地道翻译',
  },
}
</route>

<template>
  <view class="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
    <!-- 导航栏 -->
    <view
      class="bg-white/90 backdrop-blur-md shadow-sm"
      :style="{ paddingTop: safeAreaInsets?.top + 'px' }"
    >
      <view class="flex items-center px-4 py-3">
        <view
          class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
          @click="goBack"
        >
          <text class="text-gray-600 text-lg">‹</text>
        </view>
        <text class="ml-4 text-lg font-semibold text-gray-800">地道翻译</text>
        <view class="ml-auto flex items-center space-x-2">
          <view
            class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            @click="goToHistory"
          >
            <text class="text-gray-600 text-sm">📋</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 语言选择区域 -->
    <view class="bg-white/90 backdrop-blur-md border-b border-gray-200 p-4">
      <view class="flex items-center justify-between">
        <view
          class="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl px-4 py-3 border border-blue-200"
        >
          <text class="text-blue-600 mr-2 text-lg">🇨🇳</text>
          <text class="text-blue-600 font-medium">中文</text>
        </view>

        <view
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
          @click="swapLanguages"
        >
          <text class="text-white text-lg">⇄</text>
        </view>

        <view
          class="flex items-center bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl px-4 py-3 border border-purple-200"
        >
          <text class="text-purple-600 mr-2 text-lg">🇺🇸</text>
          <text class="text-purple-600 font-medium">English</text>
        </view>
      </view>
    </view>

    <!-- 输入区域 -->
    <view class="flex-1 p-4">
      <view
        class="bg-white/90 backdrop-blur-md rounded-2xl p-4 h-40 mb-4 shadow-lg border border-white/50"
      >
        <textarea
          v-model="sourceText"
          placeholder="请输入要翻译的文本..."
          class="w-full h-full text-gray-800 resize-none bg-transparent"
          maxlength="500"
          @input="onInput"
        />
        <view class="flex justify-between items-center mt-2">
          <text class="text-xs text-gray-400">{{ sourceText.length }}/500</text>
          <view class="flex space-x-3">
            <text class="text-blue-500 text-sm font-medium" @click="pasteText">粘贴</text>
            <text class="text-blue-500 text-sm font-medium" @click="clearText">清空</text>
          </view>
        </view>
      </view>

      <!-- 翻译结果区域 -->
      <view
        class="bg-white/90 backdrop-blur-md rounded-2xl p-4 h-40 shadow-lg border border-white/50"
      >
        <view v-if="isTranslating" class="flex items-center justify-center h-full">
          <view class="flex items-center space-x-2">
            <view class="typing-dot"></view>
            <view class="typing-dot"></view>
            <view class="typing-dot"></view>
            <text class="text-gray-400 ml-2">正在翻译...</text>
          </view>
        </view>
        <view v-else-if="translatedText" class="h-full">
          <text class="text-gray-800 leading-relaxed">{{ translatedText }}</text>
          <view class="flex justify-end mt-3 space-x-3">
            <text class="text-blue-500 text-sm font-medium" @click="copyResult">复制</text>
            <text class="text-blue-500 text-sm font-medium" @click="shareResult">分享</text>
            <text class="text-blue-500 text-sm font-medium" @click="saveToHistory">保存</text>
          </view>
        </view>
        <view v-else class="flex items-center justify-center h-full">
          <text class="text-gray-400">翻译结果将显示在这里</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="p-4 bg-white/90 backdrop-blur-md border-t border-gray-200">
      <view class="flex space-x-3">
        <button
          class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg transform transition-all duration-300 hover:scale-105"
          @click="translateText"
          :disabled="!sourceText.trim() || isTranslating"
        >
          {{ isTranslating ? '翻译中...' : '翻译' }}
        </button>
        <view
          class="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105"
          @click="openCamera"
        >
          <text class="text-white text-xl">📷</text>
        </view>
      </view>
    </view>

    <!-- 使用次数提示 -->
    <view v-if="remainingCount !== null" class="px-4 pb-4">
      <view
        class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 border border-yellow-200"
      >
        <view class="flex items-center justify-between">
          <text class="text-sm text-gray-700">今日还可翻译 {{ remainingCount }} 次</text>
          <text
            v-if="remainingCount === 0"
            class="text-orange-600 text-sm font-medium"
            @click="openMembership"
          >
            开通会员
          </text>
        </view>
        <view class="mt-2 bg-white rounded-full h-2">
          <view
            class="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
            :style="{ width: Math.max(0, (remainingCount / 10) * 100) + '%' }"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckTranslate">
import { ref, onMounted } from 'vue'
import { useOpenDuckStore } from '@/store/openDuck'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 状态管理
const openDuckStore = useOpenDuckStore()

// 响应式数据
const sourceText = ref('')
const translatedText = ref('')
const isTranslating = ref(false)
const remainingCount = ref(10)
const sourceLanguage = ref('zh')
const targetLanguage = ref('en')

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 去翻译历史页面
const goToHistory = () => {
  uni.navigateTo({ url: '/pages/open-duck/translate-history/index' })
}

// 切换语言
const swapLanguages = () => {
  const temp = sourceLanguage.value
  sourceLanguage.value = targetLanguage.value
  targetLanguage.value = temp
  // 清空翻译结果
  translatedText.value = ''
}

// 输入处理
const onInput = () => {
  // 实时翻译功能可以在这里实现
}

// 粘贴文本
const pasteText = () => {
  uni.getClipboardData({
    success: (res) => {
      sourceText.value = res.data
    },
  })
}

// 清空文本
const clearText = () => {
  sourceText.value = ''
  translatedText.value = ''
}

// 翻译文本
const translateText = async () => {
  if (!sourceText.value.trim()) return

  // 检查使用次数
  if (remainingCount.value <= 0) {
    uni.showModal({
      title: '使用次数已达上限',
      content: '今日免费翻译次数已用完，开通会员享受无限次翻译！',
      confirmText: '开通会员',
      success: (res) => {
        if (res.confirm) {
          openMembership()
        }
      },
    })
    return
  }

  isTranslating.value = true

  try {
    // 模拟翻译API调用
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 简单的翻译逻辑（实际项目中应该调用真实的翻译API）
    const translations = {
      你好: 'Hello',
      谢谢: 'Thank you',
      再见: 'Goodbye',
      早上好: 'Good morning',
      晚上好: 'Good evening',
      我爱你: 'I love you',
      学习: 'Study',
      工作: 'Work',
      朋友: 'Friend',
      家庭: 'Family',
    }

    let result = sourceText.value
    Object.keys(translations).forEach((key) => {
      result = result.replace(new RegExp(key, 'g'), translations[key])
    })

    translatedText.value = result
    remainingCount.value--

    // 增加使用次数
    openDuckStore.incrementUsage('translate')
  } catch (error) {
    uni.showToast({ title: '翻译失败，请重试', icon: 'none' })
  } finally {
    isTranslating.value = false
  }
}

// 复制结果
const copyResult = () => {
  if (translatedText.value) {
    uni.setClipboardData({
      data: translatedText.value,
      success: () => {
        uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
      },
    })
  }
}

// 分享结果
const shareResult = () => {
  if (translatedText.value) {
    uni.share({
      provider: 'weixin',
      type: 0,
      title: '开口鸭翻译结果',
      summary: translatedText.value,
    })
  }
}

// 保存到历史
const saveToHistory = () => {
  if (sourceText.value && translatedText.value) {
    // 保存翻译历史
    const history = {
      source: sourceText.value,
      target: translatedText.value,
      sourceLang: sourceLanguage.value,
      targetLang: targetLanguage.value,
      timestamp: new Date().toISOString(),
    }

    // 这里应该保存到本地存储或发送到服务器
    uni.showToast({ title: '已保存到历史', icon: 'success' })
  }
}

// 打开相机
const openCamera = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      // 处理拍照后的图片翻译
      uni.showToast({ title: '图片翻译功能开发中', icon: 'none' })
    },
  })
}

// 开通会员
const openMembership = () => {
  uni.navigateTo({ url: '/pages/open-duck/membership/index' })
}

onMounted(() => {
  // 页面加载时获取剩余使用次数
  remainingCount.value = openDuckStore.getRemainingUsage('translate')
})
</script>

<style lang="scss" scoped>
.typing-dot {
  width: 6px;
  height: 6px;
  background: #667eea;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
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
