<template>
  <view class="h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex flex-col">
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
        <view class="ml-4 flex items-center space-x-2">
          <view class="duck-avatar w-8 h-8"></view>
          <view>
            <text class="text-lg font-semibold text-gray-800">AI外教</text>
            <text class="text-xs text-green-500 block">● 在线</text>
          </view>
        </view>
        <view class="ml-auto flex items-center space-x-2">
          <view class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <text class="text-gray-600 text-sm">⚙️</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 聊天区域 -->
    <scroll-view
      scroll-y
      class="flex-1 px-4 py-4"
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
      style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px)"
    >
      <view v-for="(message, index) in messages" :key="index" :id="`msg-${index}`">
        <!-- AI消息 -->
        <view v-if="message.type === 'ai'" class="flex items-start mb-4">
          <view class="duck-avatar w-8 h-8 mr-3"></view>
          <view class="flex-1 max-w-xs">
            <view
              class="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100"
            >
              <text class="text-gray-800 text-sm leading-relaxed">{{ message.content }}</text>
            </view>
            <text class="text-xs text-gray-400 ml-2 mt-1 block">{{ message.time }}</text>
          </view>
        </view>

        <!-- 用户消息 -->
        <view v-else class="flex items-start mb-4 justify-end">
          <view class="flex-1 flex justify-end max-w-xs">
            <view
              class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl rounded-tr-md px-4 py-3 shadow-lg"
            >
              <text class="text-white text-sm leading-relaxed">{{ message.content }}</text>
            </view>
          </view>
          <view
            class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center ml-3"
          >
            <text class="text-white text-sm">👤</text>
          </view>
        </view>

        <!-- 语音消息 -->
        <view
          v-if="message.type === 'voice'"
          class="flex items-start mb-4"
          :class="message.isUser ? 'justify-end' : ''"
        >
          <view v-if="!message.isUser" class="duck-avatar w-8 h-8 mr-3"></view>
          <view
            class="voice-message-container"
            :class="message.isUser ? 'items-end' : 'items-start'"
          >
            <view class="voice-message" :class="message.isUser ? 'sent' : ''">
              <view class="play-btn" @click="playVoice(message)">
                <text class="text-xs">▶</text>
              </view>
              <view class="voice-waves">
                <view
                  v-for="i in 20"
                  :key="i"
                  class="wave-bar"
                  :style="{ height: Math.random() * 20 + 4 + 'px' }"
                ></view>
              </view>
              <text class="text-xs text-gray-500">{{ message.duration }}″</text>
            </view>
            <text class="text-xs text-gray-400 mt-1">{{ message.time }}</text>
          </view>
          <view
            v-if="message.isUser"
            class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center ml-3"
          >
            <text class="text-white text-sm">👤</text>
          </view>
        </view>
      </view>

      <!-- 输入中提示 -->
      <view v-if="isTyping" class="flex items-start mb-4">
        <view class="duck-avatar w-8 h-8 mr-3"></view>
        <view class="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
          <view class="flex items-center space-x-1">
            <view class="typing-dot"></view>
            <view class="typing-dot"></view>
            <view class="typing-dot"></view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="bg-white/90 backdrop-blur-md border-t border-gray-200 p-4">
      <view class="flex items-center space-x-3">
        <view
          class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          @click="toggleVoiceInput"
        >
          <text class="text-gray-600 text-lg">{{ isVoiceMode ? '⌨️' : '🎤' }}</text>
        </view>
        <view class="flex-1 bg-gray-100 rounded-full px-4 py-2">
          <input
            v-model="inputText"
            placeholder="输入你想说的话..."
            confirm-type="send"
            @confirm="sendMessage"
            class="w-full text-gray-800"
            :disabled="isVoiceMode"
          />
        </view>
        <view
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
          @click="isVoiceMode ? startRecording() : sendMessage()"
        >
          <text class="text-white text-lg">{{ isVoiceMode ? '●' : '↑' }}</text>
        </view>
      </view>

      <!-- 语音录制提示 -->
      <view v-if="isRecording" class="mt-3 text-center">
        <text class="text-sm text-red-500">正在录音... 点击停止</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckChat">
import { ref, nextTick, onMounted } from 'vue'
import { useOpenDuckStore } from '@/store/openDuck'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 状态管理
const openDuckStore = useOpenDuckStore()

// 响应式数据
const inputText = ref('')
const isTyping = ref(false)
const isVoiceMode = ref(false)
const isRecording = ref(false)
const scrollIntoView = ref('')

// 消息列表
const messages = ref([
  {
    type: 'ai',
    content: '你好！我是你的AI外教，很高兴见到你！我们可以用英语聊天，我会帮你提高口语水平。',
    time: '09:30',
  },
  {
    type: 'user',
    content: '你好！我想练习日常对话。',
    time: '09:31',
  },
  {
    type: 'ai',
    content: '太好了！让我们从简单的日常对话开始。你可以问我任何问题，比如天气、爱好、工作等等。',
    time: '09:31',
  },
  {
    type: 'voice',
    isUser: false,
    duration: 15,
    time: '09:32',
  },
])

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 发送消息
const sendMessage = async () => {
  if (!inputText.value.trim()) return

  const userMessage = {
    type: 'user',
    content: inputText.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  }

  messages.value.push(userMessage)
  inputText.value = ''

  // 滚动到底部
  await nextTick()
  scrollToBottom()

  // 模拟AI回复
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    const aiMessage = {
      type: 'ai',
      content: '我理解你的想法！让我们继续练习吧。',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  }, 2000)
}

// 切换语音输入模式
const toggleVoiceInput = () => {
  isVoiceMode.value = !isVoiceMode.value
}

// 开始录音
const startRecording = () => {
  if (isRecording.value) {
    // 停止录音
    isRecording.value = false
    const voiceMessage = {
      type: 'voice',
      isUser: true,
      duration: Math.floor(Math.random() * 20) + 5,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    messages.value.push(voiceMessage)
    scrollToBottom()
  } else {
    // 开始录音
    isRecording.value = true
    uni.showToast({ title: '开始录音', icon: 'none' })
  }
}

// 播放语音
const playVoice = (message: any) => {
  uni.showToast({ title: '播放语音', icon: 'none' })
}

// 滚动到底部
const scrollToBottom = () => {
  const lastIndex = messages.value.length - 1
  scrollIntoView.value = `msg-${lastIndex}`
}

onMounted(() => {
  scrollToBottom()
})
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
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #000;
  box-shadow: 10px 0 0 #000;
}

.voice-message-container {
  display: flex;
  flex-direction: column;
  max-width: 220px;
}

.voice-message {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 18px;
  padding: 8px 12px;
  min-width: 120px;
  max-width: 180px;
  height: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.voice-message:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.voice-message.sent {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.voice-message .play-btn {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.voice-message.sent .play-btn {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
}

.voice-message .play-btn:hover {
  transform: scale(1.1);
}

.voice-waves {
  display: flex;
  align-items: center;
  gap: 1px;
  margin-right: 8px;
  flex: 1;
  min-width: 0;
}

.wave-bar {
  width: 2px;
  background: #667eea;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.voice-message.sent .wave-bar {
  background: rgba(255, 255, 255, 0.8);
}

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

/* 滚动条样式 */
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
