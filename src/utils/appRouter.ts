/**
 * 应用路由分发工具
 * 实现通过不同路径访问不同应用
 */

// 应用类型
export type AppType = 'open-duck' | 'unibest' | 'selector'

// 路由映射配置
export const APP_ROUTES = {
  // 开口鸭应用路由
  'open-duck': {
    home: '/pages/open-duck/index/index',
    chat: '/pages/open-duck/chat/index',
    topics: '/pages/open-duck/topics/index',
    translate: '/pages/open-duck/translate/index',
    vocabulary: '/pages/open-duck/vocabulary/index',
    membership: '/pages/open-duck/membership/index',
    profile: '/pages/open-duck/profile/index',
    progress: '/pages/open-duck/progress/index',
  },
  // Unibest 示例应用路由
  unibest: {
    home: '/pages/index/index',
    demo: '/pages/demo/index',
    login: '/pages/login/index',
    my: '/pages/my/index',
  },
  // 应用选择器
  selector: {
    home: '/pages/app-selector/index',
  },
} as const

/**
 * 获取当前选中的应用
 */
export function getCurrentApp(): AppType {
  try {
    const selectedApp = uni.getStorageSync('selectedApp')
    return selectedApp || 'selector'
  } catch (error) {
    console.error('获取当前应用失败:', error)
    return 'selector'
  }
}

/**
 * 设置当前应用
 */
export function setCurrentApp(appType: AppType) {
  try {
    uni.setStorageSync('selectedApp', appType)
  } catch (error) {
    console.error('设置当前应用失败:', error)
  }
}

/**
 * 路由分发 - 根据路径判断并跳转到对应应用
 */
export function routeDispatch(path: string) {
  console.log('路由分发:', path)

  // 根据路径判断应用类型
  if (path.includes('/open-duck')) {
    setCurrentApp('open-duck')
    return navigateToApp('open-duck', path)
  } else if (path.includes('/unibest')) {
    setCurrentApp('unibest')
    return navigateToApp('unibest', '/pages/index/index')
  } else {
    // 默认到应用选择器
    return navigateToApp('selector', APP_ROUTES.selector.home)
  }
}

/**
 * 导航到指定应用
 */
export function navigateToApp(appType: AppType, targetPath?: string) {
  const routes = APP_ROUTES[appType]
  const path = targetPath || routes.home

  console.log(`导航到${appType}应用:`, path)

  try {
    uni.reLaunch({ url: path })
  } catch (error) {
    console.error('导航失败:', error)
    // 失败时跳转到应用选择器
    uni.reLaunch({ url: APP_ROUTES.selector.home })
  }
}

/**
 * 切换应用
 */
export function switchApp(targetApp: AppType) {
  const currentApp = getCurrentApp()

  if (currentApp === targetApp) {
    console.log('已经在当前应用中')
    return
  }

  setCurrentApp(targetApp)
  navigateToApp(targetApp)
}

/**
 * 初始化应用路由
 * 在应用启动时调用，根据启动参数或存储的应用选择进行路由
 */
export function initAppRouter(launchOptions?: any) {
  console.log('初始化应用路由:', launchOptions)

  // 检查启动参数中的路径
  if (launchOptions?.path) {
    return routeDispatch(launchOptions.path)
  }

  // 检查启动参数中的查询参数
  if (launchOptions?.query?.app) {
    const appType = launchOptions.query.app as AppType
    if (APP_ROUTES[appType]) {
      return navigateToApp(appType)
    }
  }

  // 根据存储的应用选择进行路由
  const selectedApp = getCurrentApp()
  if (selectedApp && selectedApp !== 'selector') {
    return navigateToApp(selectedApp)
  }

  // 默认显示应用选择器
  return navigateToApp('selector')
}

/**
 * 获取应用首页路径
 */
export function getAppHomePath(appType: AppType): string {
  return APP_ROUTES[appType]?.home || APP_ROUTES.selector.home
}

/**
 * 检查路径是否属于指定应用
 */
export function isAppPath(path: string, appType: AppType): boolean {
  const routes = APP_ROUTES[appType]
  return Object.values(routes).some((route) => path.includes(route))
}

/**
 * 生成带应用标识的分享链接
 */
export function generateShareLink(appType: AppType, path?: string): string {
  const targetPath = path || getAppHomePath(appType)
  const baseUrl = 'https://your-domain.com' // 替换为实际域名

  return `${baseUrl}${targetPath}?app=${appType}`
}

/**
 * 处理外部链接访问
 * 用于处理从分享链接或外部访问的情况
 */
export function handleExternalAccess(url: string) {
  try {
    const urlObj = new URL(url)
    const app = urlObj.searchParams.get('app') as AppType
    const path = urlObj.pathname

    if (app && APP_ROUTES[app]) {
      setCurrentApp(app)
      navigateToApp(app, path)
    } else {
      routeDispatch(path)
    }
  } catch (error) {
    console.error('处理外部访问失败:', error)
    navigateToApp('selector')
  }
}
