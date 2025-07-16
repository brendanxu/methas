import { onCLS, onINP, onLCP, onTTFB, onFCP } from 'web-vitals'
import type { Metric } from 'web-vitals'

// 性能指标接口
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number  // Largest Contentful Paint
  inp?: number  // Interaction to Next Paint (替代FID)
  cls?: number  // Cumulative Layout Shift
  
  // 其他指标
  fcp?: number  // First Contentful Paint
  ttfb?: number // Time to First Byte
  
  // 自定义指标
  loadTime?: number
  domReady?: number
  resourceLoadTime?: number
  
  // 元数据
  url: string
  userAgent: string
  timestamp: string
  sessionId?: string
}

// 性能阈值配置
export const PERFORMANCE_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },      // 毫秒
  inp: { good: 200, poor: 500 },        // 毫秒 (INP替代FID)
  cls: { good: 0.1, poor: 0.25 },       // 分数
  fcp: { good: 1800, poor: 3000 },      // 毫秒
  ttfb: { good: 800, poor: 1800 },      // 毫秒
  loadTime: { good: 3000, poor: 5000 }  // 毫秒
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Partial<PerformanceMetrics> = {}
  private reportCallback?: (metrics: PerformanceMetrics) => void
  private sessionId: string
  private reportingEnabled: boolean = true
  private debugMode: boolean = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeMetrics()
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 初始化Web Vitals监控
  private initializeMetrics() {
    if (typeof window === 'undefined') return

    // Core Web Vitals
    onCLS(this.handleCLS.bind(this))
    onINP(this.handleINP.bind(this))
    onLCP(this.handleLCP.bind(this))
    
    // 其他性能指标
    onFCP(this.handleFCP.bind(this))
    onTTFB(this.handleTTFB.bind(this))
    
    // 自定义指标
    this.measureCustomMetrics()
    
    // 监听页面卸载事件，发送最终报告
    window.addEventListener('beforeunload', () => {
      this.sendReport(true)
    })
  }

  // 处理各种Web Vitals指标
  private handleCLS(metric: Metric) {
    this.metrics.cls = metric.value
    if (this.debugMode) console.log('CLS:', metric.value)
    this.checkAndReport()
  }

  private handleINP(metric: Metric) {
    this.metrics.inp = metric.value
    if (this.debugMode) console.log('INP:', metric.value)
    this.checkAndReport()
  }

  private handleLCP(metric: Metric) {
    this.metrics.lcp = metric.value
    if (this.debugMode) console.log('LCP:', metric.value)
    this.checkAndReport()
  }

  private handleFCP(metric: Metric) {
    this.metrics.fcp = metric.value
    if (this.debugMode) console.log('FCP:', metric.value)
  }

  private handleTTFB(metric: Metric) {
    this.metrics.ttfb = metric.value
    if (this.debugMode) console.log('TTFB:', metric.value)
  }

  // 测量自定义指标
  private measureCustomMetrics() {
    if (typeof window === 'undefined' || !window.performance) return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      // 页面加载时间
      this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart
      
      // DOM Ready时间
      this.metrics.domReady = navigation.domContentLoadedEventEnd - navigation.fetchStart
      
      // 资源加载时间
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      if (resources.length > 0) {
        const totalResourceTime = resources.reduce((total, resource) => {
          return total + (resource.responseEnd - resource.startTime)
        }, 0)
        this.metrics.resourceLoadTime = totalResourceTime / resources.length
      }
    }
  }

  // 检查是否需要发送报告
  private checkAndReport() {
    // 当收集到所有Core Web Vitals时发送报告
    if (this.metrics.cls !== undefined && 
        this.metrics.inp !== undefined && 
        this.metrics.lcp !== undefined) {
      this.sendReport()
    }
  }

  // 发送性能报告
  private async sendReport(immediate: boolean = false) {
    if (!this.reportingEnabled) return

    const report: PerformanceMetrics = {
      ...this.metrics,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    } as PerformanceMetrics

    // 调用回调函数
    if (this.reportCallback) {
      this.reportCallback(report)
    }

    // 发送到服务器
    try {
      const endpoint = '/api/analytics/performance'
      
      if (immediate) {
        // 使用sendBeacon确保数据发送
        if (navigator.sendBeacon) {
          navigator.sendBeacon(endpoint, JSON.stringify(report))
        } else {
          // 降级方案
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(report),
            keepalive: true
          })
        }
      } else {
        // 正常发送
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report)
        })
      }
      
      if (this.debugMode) {
        console.log('Performance report sent:', report)
      }
    } catch (error) {
      console.error('Failed to send performance report:', error)
    }
  }

  // 公共方法
  
  // 设置报告回调
  setReportCallback(callback: (metrics: PerformanceMetrics) => void) {
    this.reportCallback = callback
  }

  // 手动记录自定义指标
  recordCustomMetric(name: keyof PerformanceMetrics, value: number) {
    (this.metrics as any)[name] = value
  }

  // 获取当前指标
  getCurrentMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  // 评估性能等级
  evaluatePerformance(metric: keyof typeof PERFORMANCE_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = PERFORMANCE_THRESHOLDS[metric]
    if (!threshold) return 'needs-improvement'
    
    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  // 获取性能摘要
  getPerformanceSummary() {
    const summary = {
      overall: 'good' as 'good' | 'needs-improvement' | 'poor',
      metrics: {} as Record<string, { value: number; rating: string }>
    }

    let poorCount = 0
    let needsImprovementCount = 0

    Object.entries(this.metrics).forEach(([key, value]) => {
      if (typeof value === 'number' && key in PERFORMANCE_THRESHOLDS) {
        const rating = this.evaluatePerformance(key as keyof typeof PERFORMANCE_THRESHOLDS, value)
        summary.metrics[key] = { value, rating }
        
        if (rating === 'poor') poorCount++
        else if (rating === 'needs-improvement') needsImprovementCount++
      }
    })

    // 确定整体评级
    if (poorCount > 0) {
      summary.overall = 'poor'
    } else if (needsImprovementCount > 1) {
      summary.overall = 'needs-improvement'
    }

    return summary
  }

  // 配置选项
  configure(options: {
    reportingEnabled?: boolean
    debugMode?: boolean
    sessionId?: string
  }) {
    if (options.reportingEnabled !== undefined) {
      this.reportingEnabled = options.reportingEnabled
    }
    if (options.debugMode !== undefined) {
      this.debugMode = options.debugMode
    }
    if (options.sessionId) {
      this.sessionId = options.sessionId
    }
  }

  // 生成会话ID
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // 重置指标
  reset() {
    this.metrics = {}
    this.sessionId = this.generateSessionId()
  }
}

// 导出单例实例
export const performanceMonitor = PerformanceMonitor.getInstance()