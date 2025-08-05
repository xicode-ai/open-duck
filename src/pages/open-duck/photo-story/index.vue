<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
        <text class="ml-4 text-lg font-semibold text-gray-800">拍照短文</text>
        <view class="ml-auto flex items-center space-x-2">
          <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <text class="text-gray-600 text-sm">ℹ️</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view scroll-y class="flex-1 px-4 py-4">
      <!-- 拍照区域 -->
      <view
        class="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 mb-4"
      >
        <view class="text-center mb-4">
          <text class="text-lg font-semibold text-gray-800">拍照识别</text>
          <text class="text-sm text-gray-500 block mt-1">AI将为你生成英文描述</text>
        </view>

        <view class="photo-container bg-gray-100 rounded-2xl overflow-hidden mb-4">
          <image
            v-if="photoUrl"
            :src="photoUrl"
            class="w-full h-64 object-cover"
            mode="aspectFill"
          />
          <view v-else class="w-full h-64 flex flex-col items-center justify-center">
            <view
              class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-3"
            >
              <text class="text-white text-2xl">📷</text>
            </view>
            <text class="text-gray-600 font-medium mb-1">拍一张照片</text>
            <text class="text-gray-400 text-sm">AI将为你生成英文描述</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="flex space-x-3">
          <button
            class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg transform transition-all duration-300 hover:scale-105"
            @click="takePhoto"
          >
            <text class="mr-2">📷</text>
            {{ photoUrl ? '重新拍照' : '开始拍照' }}
          </button>
          <button
            class="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-xl font-medium shadow-lg transform transition-all duration-300 hover:scale-105"
            @click="selectFromAlbum"
          >
            <text class="mr-2">🖼️</text>
            相册选择
          </button>
        </view>
      </view>

      <!-- AI生成的短文 -->
      <view
        v-if="generatedStory"
        class="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 mb-4"
      >
        <view class="flex items-center mb-4">
          <view
            class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3"
          >
            <text class="text-white text-lg">🤖</text>
          </view>
          <view class="flex-1">
            <text class="text-lg font-semibold text-gray-800">AI生成描述</text>
            <text class="text-sm text-green-500">已生成</text>
          </view>
        </view>

        <!-- 英文描述 -->
        <view class="mb-4">
          <text class="text-sm text-gray-500 mb-2 block">英文描述:</text>
          <view
            class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
          >
            <text class="text-gray-800 leading-relaxed">{{ generatedStory.english }}</text>
          </view>
        </view>

        <!-- 中文对照 -->
        <view class="mb-4">
          <text class="text-sm text-gray-500 mb-2 block">中文对照:</text>
          <view
            class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
          >
            <text class="text-gray-800 leading-relaxed">{{ generatedStory.chinese }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="flex items-center justify-between">
          <view class="flex space-x-3">
            <button
              class="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg transform transition-all duration-300 hover:scale-105"
              @click="playAudio"
            >
              <text class="mr-1">🔊</text>
              播放
            </button>
            <button
              class="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg transform transition-all duration-300 hover:scale-105"
              @click="copyText"
            >
              <text class="mr-1">📋</text>
              复制
            </button>
          </view>
          <view class="text-right">
            <text class="text-xs text-gray-500 block">词汇难度: 中级</text>
            <text class="text-xs text-gray-500">时长: 15秒</text>
          </view>
        </view>
      </view>

      <!-- 生成按钮 -->
      <view
        v-if="photoUrl && !generatedStory"
        class="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50"
      >
        <button
          class="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-medium shadow-lg transform transition-all duration-300 hover:scale-105"
          @click="generateStory"
          :disabled="isGenerating"
        >
          <text class="mr-2">✨</text>
          {{ isGenerating ? '正在生成...' : '生成描述' }}
        </button>
      </view>

      <!-- 使用次数提示 -->
      <view
        v-if="remainingCount !== null"
        class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200"
      >
        <view class="flex items-center justify-between">
          <text class="text-sm text-gray-700">今日还可生成 {{ remainingCount }} 次</text>
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
            :style="{ width: Math.max(0, (remainingCount / 5) * 100) + '%' }"
          ></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckPhotoStory">
import { ref, onMounted } from 'vue'
import { useOpenDuckStore } from '@/store/openDuck'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 状态管理
const openDuckStore = useOpenDuckStore()

// 响应式数据
const photoUrl = ref('')
const generatedStory = ref(null)
const isGenerating = ref(false)
const remainingCount = ref(5)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 拍照
const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      photoUrl.value = res.tempFilePaths[0]
      // 清空之前的生成结果
      generatedStory.value = null
    },
    fail: () => {
      uni.showToast({ title: '拍照失败', icon: 'none' })
    },
  })
}

// 从相册选择
const selectFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success: (res) => {
      photoUrl.value = res.tempFilePaths[0]
      // 清空之前的生成结果
      generatedStory.value = null
    },
    fail: () => {
      uni.showToast({ title: '选择图片失败', icon: 'none' })
    },
  })
}

// 生成描述
const generateStory = async () => {
  if (!photoUrl.value) {
    uni.showToast({ title: '请先拍照或选择图片', icon: 'none' })
    return
  }

  // 检查使用次数
  if (remainingCount.value <= 0) {
    uni.showModal({
      title: '使用次数已达上限',
      content: '今日免费生成次数已用完，开通会员享受无限次生成！',
      confirmText: '开通会员',
      success: (res) => {
        if (res.confirm) {
          openMembership()
        }
      },
    })
    return
  }

  isGenerating.value = true

  try {
    // 模拟AI生成过程
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // 模拟生成的描述
    const stories = [
      {
        english:
          'This is a beautiful landscape photograph showing a serene mountain lake surrounded by lush green trees. The crystal clear water reflects the blue sky above, creating a perfect mirror image. The scene captures the tranquility of nature and the harmony between earth and sky.',
        chinese:
          '这是一张美丽的风景照片，展示了一个宁静的山间湖泊，周围环绕着茂密的绿树。清澈的湖水倒映着上方的蓝天，形成了完美的镜像。这个场景捕捉了大自然的宁静以及天地之间的和谐。',
      },
      {
        english:
          'A modern cityscape featuring towering skyscrapers reaching into the clouds. The glass and steel structures reflect the golden light of sunset, creating a stunning urban panorama. The city appears alive with energy and progress.',
        chinese:
          '一个现代城市景观，高耸的摩天大楼直插云霄。玻璃和钢铁结构反射着夕阳的金色光芒，创造出一幅令人惊叹的城市全景。这座城市充满了活力和进步的气息。',
      },
      {
        english:
          'A cozy coffee shop interior with warm lighting and comfortable seating arrangements. The aroma of freshly brewed coffee fills the air, creating an inviting atmosphere for conversation and relaxation.',
        chinese:
          '一个温馨的咖啡店内部，温暖的灯光和舒适的座位安排。新鲜煮制的咖啡香气弥漫在空气中，为交谈和放松创造了诱人的氛围。',
      },
    ]

    generatedStory.value = stories[Math.floor(Math.random() * stories.length)]
    remainingCount.value--

    // 增加使用次数
    openDuckStore.incrementUsage('photo')

    uni.showToast({ title: '生成成功', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: '生成失败，请重试', icon: 'none' })
  } finally {
    isGenerating.value = false
  }
}

// 播放音频
const playAudio = () => {
  if (generatedStory.value) {
    uni.showToast({ title: '播放功能开发中', icon: 'none' })
  }
}

// 复制文本
const copyText = () => {
  if (generatedStory.value) {
    const text = `${generatedStory.value.english}\n\n${generatedStory.value.chinese}`
    uni.setClipboardData({
      data: text,
      success: () => {
        uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
      },
    })
  }
}

// 开通会员
const openMembership = () => {
  uni.navigateTo({ url: '/pages/open-duck/membership/index' })
}

onMounted(() => {
  // 页面加载时获取剩余使用次数
  remainingCount.value = openDuckStore.getRemainingUsage('photo')
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
