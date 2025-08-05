import { defineStore } from 'pinia'

// 用户学习数据接口
interface UserData {
  currentStreak: number
  todayMinutes: number
  todayWords: number
  todayConversations: number
  totalWords: number
  remainingWords: number
}

// 用户状态接口
interface UserState {
  isMember: boolean
  membershipExpiry: string | null
  dailyUsage: {
    date: string
    help: number
    translate: number
    photo: number
  }
}

// 使用次数检查结果
interface UsageResult {
  canUse: boolean
  remaining: number
}

export const useOpenDuckStore = defineStore('openDuck', {
  state: () => ({
    // 用户学习数据
    userData: {
      currentStreak: 0,
      todayMinutes: 0,
      todayWords: 0,
      todayConversations: 0,
      totalWords: 0,
      remainingWords: 0,
    } as UserData,

    // 用户状态
    userState: {
      isMember: false,
      membershipExpiry: null,
      dailyUsage: {
        date: new Date().toISOString().slice(0, 10),
        help: 0,
        translate: 0,
        photo: 0,
      },
    } as UserState,

    // 使用限制配置
    usageLimits: {
      help: 3,
      translate: 3,
      photo: 3,
    },
  }),

  getters: {
    // 是否是会员
    isMember: (state) => {
      if (state.userState.isMember && state.userState.membershipExpiry) {
        const expiry = new Date(state.userState.membershipExpiry)
        return expiry > new Date()
      }
      return false
    },

    // 获取今日剩余使用次数
    getRemainingUsage: (state) => (featureType: keyof typeof state.usageLimits) => {
      if (state.userState.isMember) return Infinity

      const used = state.userState.dailyUsage[featureType] || 0
      const limit = state.usageLimits[featureType]
      return Math.max(0, limit - used)
    },
  },

  actions: {
    // 加载用户数据
    loadUserData() {
      try {
        // 从本地存储加载用户学习数据
        const storedUserData = uni.getStorageSync('openDuck_userData')
        if (storedUserData) {
          this.userData = { ...this.userData, ...storedUserData }
        }

        // 从本地存储加载用户状态
        const storedUserState = uni.getStorageSync('openDuck_userState')
        if (storedUserState) {
          this.userState = { ...this.userState, ...storedUserState }

          // 检查是否需要重置每日使用次数
          const today = new Date().toISOString().slice(0, 10)
          if (this.userState.dailyUsage.date !== today) {
            this.userState.dailyUsage = {
              date: today,
              help: 0,
              translate: 0,
              photo: 0,
            }
            this.saveUserState()
          }
        }
      } catch (error) {
        console.error('加载用户数据失败:', error)
      }
    },

    // 保存用户数据
    saveUserData() {
      try {
        uni.setStorageSync('openDuck_userData', this.userData)
      } catch (error) {
        console.error('保存用户数据失败:', error)
      }
    },

    // 保存用户状态
    saveUserState() {
      try {
        uni.setStorageSync('openDuck_userState', this.userState)
      } catch (error) {
        console.error('保存用户状态失败:', error)
      }
    },

    // 检查使用次数
    async checkUsage(featureType: keyof typeof this.usageLimits): Promise<UsageResult> {
      if (this.isMember) {
        return { canUse: true, remaining: Infinity }
      }

      const currentUsage = this.userState.dailyUsage[featureType] || 0
      const limit = this.usageLimits[featureType]

      return {
        canUse: currentUsage < limit,
        remaining: limit - currentUsage,
      }
    },

    // 增加使用次数
    incrementUsage(featureType: keyof typeof this.usageLimits) {
      if (this.isMember) return

      this.userState.dailyUsage[featureType] = (this.userState.dailyUsage[featureType] || 0) + 1
      this.saveUserState()
    },

    // 开通会员
    becomeMember() {
      this.userState.isMember = true
      const expiryDate = new Date()
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      this.userState.membershipExpiry = expiryDate.toISOString().slice(0, 10)
      this.saveUserState()
    },

    // 更新学习数据
    updateLearningData(data: Partial<UserData>) {
      this.userData = { ...this.userData, ...data }
      this.saveUserData()
    },

    // 增加学习时间
    addStudyTime(minutes: number) {
      this.userData.todayMinutes += minutes
      this.saveUserData()
    },

    // 增加学习单词数
    addWordsLearned(count: number) {
      this.userData.todayWords += count
      this.userData.remainingWords = Math.max(0, this.userData.remainingWords - count)
      this.saveUserData()
    },

    // 增加对话次数
    addConversation() {
      this.userData.todayConversations += 1
      this.saveUserData()
    },

    // 重置用户状态（测试用）
    resetUserState() {
      this.userState = {
        isMember: false,
        membershipExpiry: null,
        dailyUsage: {
          date: new Date().toISOString().slice(0, 10),
          help: 0,
          translate: 0,
          photo: 0,
        },
      }
      this.saveUserState()
    },
  },

  persist: true,
})
