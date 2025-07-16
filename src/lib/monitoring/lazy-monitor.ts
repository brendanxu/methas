/**
 * 懒加载性能监控系统
 * 只在需要时加载监控组件，减少初始bundle大小
 */

import { ComponentType, lazy } from 'react'

// 懒加载的监控组件类型
export type LazyMonitorComponent = ComponentType<any>

// 监控组件配置
interface MonitorConfig {
  enabled: boolean
  priority: 'high' | 'medium' | 'low'
  loadOnCondition?: () => boolean
  loadDelay?: number
}

// 全局监控配置
export const MONITOR_CONFIG: Record<string, MonitorConfig> = {
  performance: {
    enabled: true,
    priority: 'high',
    loadOnCondition: () => {
      // 仅在生产环境或开发环境启用性能监控
      return process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_DEBUG_PERF === 'true'
    },
    loadDelay: 0
  },
  errors: {
    enabled: true,
    priority: 'high',
    loadOnCondition: () => true,
    loadDelay: 0
  },
  resources: {
    enabled: true,
    priority: 'medium',
    loadOnCondition: () => {
      // 仅在需要详细资源监控时加载
      return window.performance && 'PerformanceObserver' in window
    },
    loadDelay: 2000 // 2秒后加载
  },
  analytics: {
    enabled: true,
    priority: 'low',
    loadOnCondition: () => {
      // 仅在有GA或其他分析工具时加载
      return typeof window !== 'undefined' && 
        ((window as any).gtag || (window as any).ga || (window as any).dataLayer)
    },
    loadDelay: 5000 // 5秒后加载
  },
  widget: {
    enabled: false, // 默认不加载UI组件
    priority: 'low',
    loadOnCondition: () => {
      // 仅在管理员界面或调试模式下加载
      return process.env.NODE_ENV === 'development' || 
        window.location.pathname.startsWith('/admin')
    },
    loadDelay: 1000
  }
}

// 懒加载的监控组件
export const LazyMonitorComponents = {
  PerformanceWidget: lazy(() => 
    import('@/components/monitoring/PerformanceWidget').then(module => ({
      default: module.default
    }))
  ),
  
  PerformanceMonitor: lazy(() => 
    import('@/components/optimization/PerformanceMonitor').then(module => ({
      default: module.PerformanceMonitor
    }))
  ),
  
  ErrorBoundary: lazy(() => 
    import('@/components/error/ErrorBoundary').then(module => ({
      default: module.ErrorBoundary
    }))
  )
}

// 监控管理器
export class LazyMonitorManager {
  private static instance: LazyMonitorManager
  private loadedComponents: Set<string> = new Set()
  private loadingComponents: Set<string> = new Set()
  private componentPromises: Map<string, Promise<any>> = new Map()

  static getInstance(): LazyMonitorManager {
    if (!LazyMonitorManager.instance) {
      LazyMonitorManager.instance = new LazyMonitorManager()
    }
    return LazyMonitorManager.instance
  }

  /**
   * 根据条件动态加载监控组件
   */
  async loadMonitorComponent(name: keyof typeof LazyMonitorComponents): Promise<LazyMonitorComponent | null> {
    const config = MONITOR_CONFIG[name]
    
    // 检查是否已禁用
    if (!config || !config.enabled) {
      return null
    }

    // 检查加载条件
    if (config.loadOnCondition && !config.loadOnCondition()) {
      return null
    }

    // 检查是否已加载
    if (this.loadedComponents.has(name)) {
      return LazyMonitorComponents[name]
    }

    // 检查是否正在加载
    if (this.loadingComponents.has(name)) {
      return this.componentPromises.get(name) || null
    }

    // 开始加载
    this.loadingComponents.add(name)
    
    try {
      const loadPromise = this.loadWithDelay(name, config.loadDelay || 0)
      this.componentPromises.set(name, loadPromise)
      
      const component = await loadPromise
      
      this.loadedComponents.add(name)
      this.loadingComponents.delete(name)
      
      return component
    } catch (error) {
      console.error(`Failed to load monitor component ${name}:`, error)
      this.loadingComponents.delete(name)
      return null
    }
  }

  /**
   * 延迟加载组件
   */
  private async loadWithDelay(name: keyof typeof LazyMonitorComponents, delay: number): Promise<LazyMonitorComponent> {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    
    return LazyMonitorComponents[name]
  }

  /**
   * 批量加载高优先级组件
   */
  async loadHighPriorityComponents(): Promise<void> {
    const highPriorityComponents = Object.entries(MONITOR_CONFIG)
      .filter(([_, config]) => config.priority === 'high' && config.enabled)
      .map(([name]) => name as keyof typeof LazyMonitorComponents)

    const loadPromises = highPriorityComponents.map(name => 
      this.loadMonitorComponent(name).catch(error => {
        console.warn(`Failed to load high priority component ${name}:`, error)
        return null
      })
    )

    await Promise.all(loadPromises)
  }

  /**
   * 根据页面路径加载相关组件
   */
  loadForRoute(pathname: string): void {
    // 管理员页面加载所有监控组件
    if (pathname.startsWith('/admin')) {
      this.loadMonitorComponent('PerformanceWidget')
      this.loadMonitorComponent('PerformanceMonitor')
    }
    
    // 生产环境页面加载基础监控
    if (process.env.NODE_ENV === 'production') {
      this.loadMonitorComponent('PerformanceMonitor')
    }
  }

  /**
   * 获取已加载的组件列表
   */
  getLoadedComponents(): string[] {
    return Array.from(this.loadedComponents)
  }

  /**
   * 重置管理器状态
   */
  reset(): void {
    this.loadedComponents.clear()
    this.loadingComponents.clear()
    this.componentPromises.clear()
  }
}

// 导出单例
export const lazyMonitorManager = LazyMonitorManager.getInstance()

// 性能监控核心类 - 轻量级版本
export class CorePerformanceMonitor {
  private static instance: CorePerformanceMonitor
  private initialized = false
  private metrics: Map<string, any> = new Map()

  static getInstance(): CorePerformanceMonitor {
    if (!CorePerformanceMonitor.instance) {
      CorePerformanceMonitor.instance = new CorePerformanceMonitor()
    }
    return CorePerformanceMonitor.instance
  }

  /**
   * 初始化核心监控 - 仅包含必要功能
   */
  init(): void {
    if (this.initialized || typeof window === 'undefined') return

    // 仅加载最基本的Web Vitals监控
    this.loadCoreWebVitals()
    this.initialized = true
  }

  /**
   * 动态加载Web Vitals
   */
  private async loadCoreWebVitals(): Promise<void> {
    try {
      // 动态导入web-vitals库
      const webVitalsModule = await import('web-vitals')
      const { onLCP, onINP, onCLS } = webVitalsModule

      // 仅监控核心指标
      onLCP(this.handleMetric.bind(this))
      onINP(this.handleMetric.bind(this))
      onCLS(this.handleMetric.bind(this))

    } catch (error) {
      console.warn('Failed to load web-vitals:', error)
    }
  }

  /**
   * 处理指标数据
   */
  private handleMetric(metric: any): void {
    this.metrics.set(metric.name, metric)
    
    // 仅发送到必要的端点
    this.sendToEndpoint(metric)
  }

  /**
   * 发送到分析端点
   */
  private sendToEndpoint(metric: any): void {
    if (typeof window === 'undefined') return

    // 使用fetch API发送数据
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: window.location.href,
        timestamp: Date.now()
      })
    }).catch(() => {
      // 静默处理错误
    })
  }

  /**
   * 获取当前指标
   */
  getMetrics(): Map<string, any> {
    return new Map(this.metrics)
  }

  /**
   * 重置监控器
   */
  reset(): void {
    this.metrics.clear()
    this.initialized = false
  }
}

// 导出核心监控实例
export const corePerformanceMonitor = CorePerformanceMonitor.getInstance()

// 初始化钩子
export function useMonitorInitialization() {
  if (typeof window !== 'undefined') {
    // 初始化核心监控
    corePerformanceMonitor.init()
    
    // 根据当前路径加载相关组件
    lazyMonitorManager.loadForRoute(window.location.pathname)
  }
}

// 监控配置更新函数
export function updateMonitorConfig(component: string, config: Partial<MonitorConfig>): void {
  if (MONITOR_CONFIG[component]) {
    MONITOR_CONFIG[component] = { ...MONITOR_CONFIG[component], ...config }
  }
}