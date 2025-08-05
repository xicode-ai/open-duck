<template>
  <!-- Stagewise 工具栏容器，仅在 H5 开发模式下显示 -->
  <!-- #ifdef H5 -->
  <div
    v-if="isDev"
    ref="stagewiseContainer"
    id="stagewise-container"
    style="pointer-events: none; position: fixed; top: 0; left: 0; z-index: 9999"
  ></div>
  <!-- #endif -->
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { ref, watch, nextTick, onMounted } from 'vue'

// 仅在 H5 平台和开发模式下导入 stagewise
// #ifdef H5
const isDev = import.meta.env.DEV
const VuePlugin = ref<any>(null)
const toolbarReady = ref(false)
const stagewiseContainer = ref<HTMLElement>()

// 获取或创建 Stagewise 容器元素
function getOrCreateContainer(): HTMLElement {
  // 尝试获取现有容器
  let container =
    stagewiseContainer.value || (document.getElementById('stagewise-container') as HTMLElement)

  if (container) {
    return container
  }

  // 创建新容器
  if (typeof document === 'undefined' || !document.body) {
    throw new Error('DOM 环境不可用')
  }

  container = document.createElement('div')
  container.id = 'stagewise-container'
  container.style.cssText = 'pointer-events: none; position: fixed; top: 0; left: 0; z-index: 9999;'

  document.body.appendChild(container)
  stagewiseContainer.value = container

  return container
}

// 等待容器元素出现
function waitForContainer(): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const container =
      stagewiseContainer.value || (document.getElementById('stagewise-container') as HTMLElement)

    if (container) {
      resolve(container)
      return
    }

    const cleanup = () => {
      if (observer) observer.disconnect()
      if (timeoutId) clearTimeout(timeoutId)
    }

    const timeoutId = setTimeout(() => {
      cleanup()
      reject(new Error('等待容器超时'))
    }, 2000)

    const observer = new MutationObserver(() => {
      const foundContainer =
        stagewiseContainer.value || (document.getElementById('stagewise-container') as HTMLElement)
      if (foundContainer) {
        cleanup()
        resolve(foundContainer)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id'],
    })
  })
}

// 挂载 Stagewise 工具栏
async function mountStagewiseToolbar(plugin: any) {
  if (toolbarReady.value) return

  try {
    const toolbarModule = await import('@stagewise/toolbar-vue')
    const StagewiseToolbar = toolbarModule.StagewiseToolbar

    let container: HTMLElement | null = null

    // 尝试等待容器元素
    try {
      container = await waitForContainer()
    } catch {
      // 轮询方式等待容器
      let retryCount = 0
      const maxRetries = 20

      while (!container && retryCount < maxRetries) {
        await nextTick()
        await new Promise((resolve) => setTimeout(resolve, 50))

        container =
          stagewiseContainer.value ||
          (document.getElementById('stagewise-container') as HTMLElement)
        retryCount++
      }
    }

    // 最后尝试创建容器
    if (!container) {
      try {
        container = getOrCreateContainer()
      } catch (error) {
        console.error('无法创建容器:', error)
        return
      }
    }

    // 挂载工具栏
    const { createApp } = await import('vue')
    const app = createApp(StagewiseToolbar, {
      config: {
        plugins: [plugin],
      },
    })

    app.mount(container)
    toolbarReady.value = true
  } catch (error) {
    console.error('加载 Stagewise 工具栏失败:', error)
  }
}

const isMounted = ref(false)

// 监听 VuePlugin 变化
watch(VuePlugin, async (newVal) => {
  if (newVal && !toolbarReady.value && isMounted.value) {
    await mountStagewiseToolbar(newVal)
  }
})

// 组件挂载后检查是否需要立即挂载工具栏
onMounted(async () => {
  isMounted.value = true
  await nextTick()

  if (isDev && VuePlugin.value && !toolbarReady.value) {
    await mountStagewiseToolbar(VuePlugin.value)
  }
})

// 加载 Stagewise 插件
if (isDev) {
  setTimeout(() => {
    import('@stagewise-plugins/vue')
      .then((module) => {
        VuePlugin.value = module.default
      })
      .catch((error) => {
        console.error('加载 Stagewise 插件失败:', error)
      })
  }, 100)
}
// #endif

onLaunch(() => {
  // 应用启动
})
onShow(() => {
  // 应用显示
})
onHide(() => {
  // 应用隐藏
})
</script>

<style lang="scss">
/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
