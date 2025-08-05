<template>
  <view class="select-stage-page">
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
      <!-- 标题描述 -->
      <view class="title-section">
        <text class="title">选择你的学习阶段</text>
        <text class="subtitle">语境学习法，大脑善于记忆有联系、有故事的信息</text>
      </view>

      <!-- 学习阶段选择 -->
      <view class="stages-grid">
        <view
          v-for="stage in stages"
          :key="stage.name"
          class="stage-card"
          :class="{ 'requires-membership': stage.requiresMembership }"
          @click="selectStage(stage)"
        >
          <view class="stage-icon" :class="stage.color">
            <text class="emoji">{{ stage.emoji }}</text>
          </view>
          <text class="stage-name">{{ stage.name }}</text>
          <text class="stage-age">{{ stage.age }}</text>
          <view v-if="stage.requiresMembership" class="membership-badge">
            <text class="icon">&#xe6ca;</text>
          </view>
        </view>
      </view>

      <!-- 学习说明 -->
      <view class="instruction-section">
        <text class="instruction-title">学习说明</text>
        <view class="instruction-list">
          <view class="instruction-item">
            <view class="instruction-icon free">
              <text class="icon">&#xe6cb;</text>
            </view>
            <text class="instruction-text">萌芽期和基础期免费开放，适合初学者</text>
          </view>
          <view class="instruction-item">
            <view class="instruction-icon membership">
              <text class="icon">&#xe6ca;</text>
            </view>
            <text class="instruction-text">其他阶段需要开通会员，解锁更多高级功能</text>
          </view>
          <view class="instruction-item">
            <view class="instruction-icon book">
              <text class="icon">&#xe6cc;</text>
            </view>
            <text class="instruction-text">每个阶段都有针对性的词汇和例句</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 会员提示弹窗 -->
    <view v-if="showMembershipModal" class="modal-overlay" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-icon">
          <text class="icon">&#xe6ca;</text>
        </view>
        <text class="modal-title">开通会员</text>
        <text class="modal-desc">该学习阶段需要开通会员才能使用，解锁更多高级功能</text>
        <view class="modal-actions">
          <button class="modal-btn cancel" @click="closeModal">取消</button>
          <button class="modal-btn confirm" @click="openMembership">立即开通</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 阶段数据
const stages = ref([
  {
    name: '萌芽期',
    age: '3-6岁',
    emoji: '🌱',
    color: 'green',
    requiresMembership: false,
  },
  {
    name: '基础期',
    age: '6-12岁',
    emoji: '📚',
    color: 'blue',
    requiresMembership: false,
  },
  {
    name: '发展期',
    age: '12-15岁',
    emoji: '🚀',
    color: 'purple',
    requiresMembership: true,
  },
  {
    name: '加速期',
    age: '15-18岁',
    emoji: '⚡️',
    color: 'orange',
    requiresMembership: true,
  },
  {
    name: '精通期',
    age: '18-30岁',
    emoji: '🏆',
    color: 'yellow',
    requiresMembership: true,
  },
  {
    name: '大师期',
    age: '30岁+',
    emoji: '🧘',
    color: 'indigo',
    requiresMembership: true,
  },
])

// 响应式数据
const showMembershipModal = ref(false)
const selectedStage = ref(null)

// 模拟用户会员状态
const isUserMember = ref(false)

// 方法
const goBack = () => {
  uni.navigateBack()
}

const selectStage = (stage: any) => {
  selectedStage.value = stage

  // 检查是否需要会员
  if (stage.requiresMembership && !isUserMember.value) {
    showMembershipModal.value = true
    return
  }

  // 跳转到背单词页面
  uni.navigateTo({
    url: `/pages/open-duck/vocabulary/index?stage=${encodeURIComponent(stage.name)}`,
  })
}

const closeModal = () => {
  showMembershipModal.value = false
}

const openMembership = () => {
  // 这里应该跳转到会员购买页面
  console.log('跳转到会员购买页面')

  // 模拟开通会员成功
  isUserMember.value = true
  showMembershipModal.value = false

  // 跳转到背单词页面
  if (selectedStage.value) {
    uni.navigateTo({
      url: `/pages/open-duck/vocabulary/index?stage=${encodeURIComponent(selectedStage.value.name)}`,
    })
  }
}
</script>

<style lang="scss" scoped>
.select-stage-page {
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

.title-section {
  margin-bottom: 24px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.subtitle {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.stages-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stage-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  position: relative;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }

  &.requires-membership {
    opacity: 0.8;
  }
}

.stage-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;

  .emoji {
    font-size: 24px;
  }

  &.green {
    background: #f0fdf4;
  }

  &.blue {
    background: #eff6ff;
  }

  &.purple {
    background: #faf5ff;
  }

  &.orange {
    background: #fff7ed;
  }

  &.yellow {
    background: #fefce8;
  }

  &.indigo {
    background: #eef2ff;
  }
}

.stage-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: block;
}

.stage-age {
  font-size: 12px;
  color: #666;
}

.membership-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    font-size: 12px;
    color: #f59e0b;
  }
}

.instruction-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.instruction-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: block;
}

.instruction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.instruction-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;

  .icon {
    font-size: 12px;
  }

  &.free {
    background: #f0fdf4;
    color: #22c55e;
  }

  &.membership {
    background: #fffbeb;
    color: #f59e0b;
  }

  &.book {
    background: #eff6ff;
    color: #3b82f6;
  }
}

.instruction-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  flex: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin: 20px;
  max-width: 320px;
  text-align: center;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-icon {
  width: 64px;
  height: 64px;
  background: #fffbeb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;

  .icon {
    font-size: 32px;
    color: #f59e0b;
  }
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.modal-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  display: block;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  border: none;

  &.cancel {
    background: #f5f5f5;
    color: #666;
  }

  &.confirm {
    background: #ef4444;
    color: white;
  }
}
</style>
