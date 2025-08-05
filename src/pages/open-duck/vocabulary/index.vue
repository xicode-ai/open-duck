<route lang="json5">
{
  style: {
    navigationBarTitleText: '背单词',
  },
}
</route>

<template>
  <view class="vocabulary-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <text class="icon">&#xe6b8;</text>
      </view>
      <view class="navbar-title">背单词</view>
      <view class="navbar-right">
        <text class="icon">&#xe6c5;</text>
      </view>
    </view>

    <!-- 主内容区域 -->
    <scroll-view class="main-content" scroll-y>
      <!-- 当前阶段显示 -->
      <view class="stage-display">
        <view class="stage-badge">
          <text class="stage-icon">{{ stageConfig.icon }}</text>
          <text class="stage-name">{{ stageConfig.name }}</text>
          <text class="stage-age">{{ stageConfig.age }}</text>
        </view>
      </view>

      <!-- 单词卡片 -->
      <view class="word-card">
        <view class="word-header">
          <view class="word-info">
            <text class="word-text">{{ currentWord.word }}</text>
            <text class="word-meaning">{{ currentWord.meaning }}</text>
          </view>
          <view class="favorite-btn" @click="toggleFavorite">
            <text class="icon" :class="{ favorited: currentWord.isFavorite }">&#xe6c6;</text>
          </view>
        </view>

        <!-- 音标发音 -->
        <view class="phonetic-section">
          <view class="phonetic-item">
            <text class="phonetic-label">英</text>
            <text class="phonetic-text">{{ currentWord.ukPhonetic }}</text>
            <view class="play-btn" @click="playAudio('uk')">
              <text class="icon">&#xe6be;</text>
            </view>
          </view>
          <view class="phonetic-item">
            <text class="phonetic-label">美</text>
            <text class="phonetic-text">{{ currentWord.usPhonetic }}</text>
            <view class="play-btn" @click="playAudio('us')">
              <text class="icon">&#xe6be;</text>
            </view>
          </view>
        </view>

        <!-- 例句 -->
        <view class="example-section">
          <view class="example-content">
            <text class="example-text">{{ currentWord.example }}</text>
            <text class="example-translation">{{ currentWord.translation }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn" @click="markAsUnknown">
          <view class="action-icon unknown">
            <text class="icon">&#xe6c7;</text>
          </view>
          <text class="action-text">不认识</text>
        </view>

        <view class="action-btn" @click="markAsVague">
          <view class="action-icon vague">
            <text class="icon">&#xe6c8;</text>
          </view>
          <text class="action-text">模糊</text>
        </view>

        <view class="action-btn" @click="markAsKnown">
          <view class="action-icon known">
            <text class="icon">&#xe6c9;</text>
          </view>
          <text class="action-text">认识</text>
        </view>
      </view>

      <!-- 学习统计 -->
      <view class="stats-section">
        <text class="stats-title">今日学习进度</text>
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-number">{{ totalWords }}</text>
            <text class="stat-label">已学单词</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ masteredWords }}</text>
            <text class="stat-label">掌握单词</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ streakDays }}</text>
            <text class="stat-label">连续天数</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts" name="OpenDuckVocabulary">
import { ref, computed } from 'vue'

// 单词数据接口
interface Word {
  word: string
  meaning: string
  ukPhonetic: string
  usPhonetic: string
  example: string
  translation: string
  isFavorite: boolean
}

// 阶段配置
const stageConfig = ref({
  icon: '🌱',
  name: '萌芽期',
  age: '3-6岁',
})

// 响应式数据
const currentWordIndex = ref(0)
const totalWords = ref(12)
const masteredWords = ref(8)
const streakDays = ref(5)

// 模拟单词数据
const words = ref<Word[]>([
  {
    word: 'immense',
    meaning: 'adj. 极大的，巨大的',
    ukPhonetic: '/ɪˈmens/',
    usPhonetic: '/ɪˈmens/',
    example: 'He inherited an immense fortune.',
    translation: '他继承了巨额财富。',
    isFavorite: false,
  },
  {
    word: 'brilliant',
    meaning: 'adj. 杰出的，辉煌的',
    ukPhonetic: '/ˈbrɪljənt/',
    usPhonetic: '/ˈbrɪljənt/',
    example: 'She has a brilliant mind.',
    translation: '她有一个聪明的头脑。',
    isFavorite: true,
  },
  {
    word: 'magnificent',
    meaning: 'adj. 壮丽的，宏伟的',
    ukPhonetic: '/mæɡˈnɪfɪsnt/',
    usPhonetic: '/mæɡˈnɪfɪsnt/',
    example: 'The palace is magnificent.',
    translation: '这座宫殿很宏伟。',
    isFavorite: false,
  },
])

// 计算属性
const currentWord = computed(() => words.value[currentWordIndex.value])

// 方法
const goBack = () => {
  uni.navigateBack()
}

const toggleFavorite = () => {
  currentWord.value.isFavorite = !currentWord.value.isFavorite
}

const playAudio = (type: 'uk' | 'us') => {
  console.log(`播放${type === 'uk' ? '英式' : '美式'}发音`)
  // 实际应用中应该调用TTS API
}

const markAsUnknown = () => {
  console.log('标记为不认识')
  nextWord()
}

const markAsVague = () => {
  console.log('标记为模糊')
  nextWord()
}

const markAsKnown = () => {
  console.log('标记为认识')
  masteredWords.value++
  nextWord()
}

const nextWord = () => {
  if (currentWordIndex.value < words.value.length - 1) {
    currentWordIndex.value++
  } else {
    // 完成学习
    uni.showModal({
      title: '学习完成！',
      content: '恭喜你完成了今日的学习目标！',
      confirmText: '继续学习',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          // 重新开始
          currentWordIndex.value = 0
          masteredWords.value = 8
        } else {
          uni.navigateBack()
        }
      },
    })
  }
}

onLoad((options) => {
  // 获取URL参数中的阶段信息
  const stage = options?.stage || '萌芽期'

  // 更新阶段配置
  const stageConfigs = {
    萌芽期: { icon: '🌱', name: '萌芽期', age: '3-6岁' },
    基础期: { icon: '📚', name: '基础期', age: '6-12岁' },
    发展期: { icon: '🚀', name: '发展期', age: '12-15岁' },
    加速期: { icon: '⚡️', name: '加速期', age: '15-18岁' },
    精通期: { icon: '🏆', name: '精通期', age: '18-30岁' },
    大师期: { icon: '🧘', name: '大师期', age: '30岁+' },
  }

  stageConfig.value = stageConfigs[stage] || stageConfigs['萌芽期']
})
</script>

<style lang="scss" scoped>
.vocabulary-page {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  .navbar-left {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .navbar-title {
    font-size: 18px;
    font-weight: 600;
    flex: 1;
    text-align: center;
  }

  .navbar-right {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    font-size: 20px;
  }
}

.main-content {
  flex: 1;
  padding: 24px 16px 80px;
  overflow-y: auto;
}

.stage-display {
  margin-bottom: 24px;
}

.stage-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.stage-icon {
  font-size: 18px;
}

.stage-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.stage-age {
  font-size: 12px;
  color: #666;
}

.word-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.word-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.word-info {
  flex: 1;
}

.word-text {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.word-meaning {
  font-size: 16px;
  color: #666;
}

.favorite-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  transition: color 0.2s ease;

  .icon {
    font-size: 20px;
  }

  .favorited {
    color: #ef4444;
  }
}

.phonetic-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.phonetic-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.phonetic-label {
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.phonetic-text {
  font-size: 14px;
  font-family: monospace;
  color: #333;
}

.play-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  transition: color 0.2s ease;

  .icon {
    font-size: 14px;
  }
}

.example-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.example-content {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
}

.example-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: block;
  line-height: 1.5;
}

.example-translation {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.action-btn {
  background: white;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;

  .icon {
    font-size: 24px;
  }

  &.unknown {
    background: #fef2f2;
    color: #ef4444;
  }

  &.vague {
    background: #fffbeb;
    color: #f59e0b;
  }

  &.known {
    background: #f0fdf4;
    color: #22c55e;
  }
}

.action-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.stats-section {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.stats-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: block;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.stat-number:nth-child(1) {
  color: #ef4444;
}

.stat-number:nth-child(2) {
  color: #22c55e;
}

.stat-number:nth-child(3) {
  color: #3b82f6;
}
</style>
