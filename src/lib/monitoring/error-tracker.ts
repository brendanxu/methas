import * as Sentry from '@sentry/nextjs'

// 错误级别
export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal'
}

// 错误上下文
interface ErrorContext extends Record<string, any> {
  userId?: string
  sessionId?: string
  page?: string
  action?: string
  component?: string
  metadata?: Record<string, any>
}

// 错误报告
interface ErrorReport {
  id: string
  timestamp: string
  level: ErrorLevel
  message: string
  stack?: string
  context: ErrorContext
  fingerprint: string
  userAgent: string
  url: string
}

export class ErrorTracker {
  private static instance: ErrorTracker
  private errorQueue: ErrorReport[] = []
  private maxQueueSize = 50
  private flushInterval = 30000 // 30秒
  private flushTimer?: NodeJS.Timeout
  private context: ErrorContext = {}
  private enabled: boolean = true

  constructor() {
    this.initializeErrorHandlers()
    this.startFlushTimer()
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }

  // 初始化全局错误处理
  private initializeErrorHandlers() {
    if (typeof window === 'undefined') return

    // 捕获未处理的错误
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        level: ErrorLevel.ERROR,
        context: {
          ...this.context,
          component: 'window',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        }
      })
    })

    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        level: ErrorLevel.ERROR,
        context: {
          ...this.context,
          component: 'promise',
          metadata: {
            reason: event.reason,
            promise: event.promise
          }
        }
      })
    })

    // 监听页面卸载，发送剩余错误
    window.addEventListener('beforeunload', () => {
      this.flush(true)
    })
  }

  // 捕获错误
  captureError(error: Error | string, options?: {
    level?: ErrorLevel
    context?: Partial<ErrorContext>
    fingerprint?: string
  }) {
    if (!this.enabled) return

    const errorMessage = error instanceof Error ? error.message : error
    const errorStack = error instanceof Error ? error.stack : undefined
    
    const report: ErrorReport = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: options?.level || ErrorLevel.ERROR,
      message: errorMessage,
      stack: errorStack,
      context: {
        ...this.context,
        ...options?.context
      },
      fingerprint: options?.fingerprint || this.generateFingerprint(errorMessage, errorStack),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    }

    // 添加到队列
    this.errorQueue.push(report)

    // 同时发送到Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, {
        level: this.mapToSentryLevel(report.level),
        contexts: {
          custom: report.context
        },
        fingerprint: [report.fingerprint]
      })
    } else {
      Sentry.captureMessage(error, this.mapToSentryLevel(report.level))
    }

    // 检查是否需要立即发送
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flush()
    }
  }

  // 记录信息
  logInfo(message: string, context?: Partial<ErrorContext>) {
    this.captureError(message, {
      level: ErrorLevel.INFO,
      context
    })
  }

  // 记录警告
  logWarning(message: string, context?: Partial<ErrorContext>) {
    this.captureError(message, {
      level: ErrorLevel.WARNING,
      context
    })
  }

  // 记录调试信息
  logDebug(message: string, context?: Partial<ErrorContext>) {
    if (process.env.NODE_ENV === 'development') {
      this.captureError(message, {
        level: ErrorLevel.DEBUG,
        context
      })
    }
  }

  // 设置全局上下文
  setContext(context: Partial<ErrorContext>) {
    this.context = { ...this.context, ...context }
    
    // 同步到Sentry
    if (context.userId) {
      Sentry.setUser({ id: context.userId })
    }
    Sentry.setContext('custom', context as Record<string, any>)
  }

  // 清除上下文
  clearContext() {
    this.context = {}
    Sentry.setUser(null)
  }

  // 发送错误报告
  private async flush(immediate: boolean = false) {
    if (this.errorQueue.length === 0) return

    const errors = [...this.errorQueue]
    this.errorQueue = []

    try {
      const endpoint = '/api/errors'
      
      if (immediate && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        // 使用sendBeacon确保发送
        navigator.sendBeacon(endpoint, JSON.stringify({ errors }))
      } else {
        // 正常发送
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ errors }),
          keepalive: immediate
        })
      }
    } catch (error) {
      // 发送失败，放回队列
      this.errorQueue.unshift(...errors)
      console.error('Failed to send error reports:', error)
    }
  }

  // 启动定时发送
  private startFlushTimer() {
    if (typeof window === 'undefined') return
    
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.flushInterval)
  }

  // 停止定时发送
  private stopFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = undefined
    }
  }

  // 生成错误指纹
  private generateFingerprint(message: string, stack?: string): string {
    const content = `${message}${stack || ''}`
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(36)
  }

  // 生成ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // 映射到Sentry级别
  private mapToSentryLevel(level: ErrorLevel): Sentry.SeverityLevel {
    switch (level) {
      case ErrorLevel.DEBUG:
        return 'debug'
      case ErrorLevel.INFO:
        return 'info'
      case ErrorLevel.WARNING:
        return 'warning'
      case ErrorLevel.ERROR:
        return 'error'
      case ErrorLevel.FATAL:
        return 'fatal'
      default:
        return 'error'
    }
  }

  // 配置选项
  configure(options: {
    enabled?: boolean
    maxQueueSize?: number
    flushInterval?: number
  }) {
    if (options.enabled !== undefined) {
      this.enabled = options.enabled
    }
    if (options.maxQueueSize !== undefined) {
      this.maxQueueSize = options.maxQueueSize
    }
    if (options.flushInterval !== undefined) {
      this.flushInterval = options.flushInterval
      this.stopFlushTimer()
      this.startFlushTimer()
    }
  }

  // 获取错误统计
  getErrorStats() {
    const stats: Record<ErrorLevel, number> = {
      [ErrorLevel.DEBUG]: 0,
      [ErrorLevel.INFO]: 0,
      [ErrorLevel.WARNING]: 0,
      [ErrorLevel.ERROR]: 0,
      [ErrorLevel.FATAL]: 0
    }

    this.errorQueue.forEach(error => {
      stats[error.level]++
    })

    return {
      total: this.errorQueue.length,
      byLevel: stats,
      oldestError: this.errorQueue[0]?.timestamp,
      newestError: this.errorQueue[this.errorQueue.length - 1]?.timestamp
    }
  }

  // 清空错误队列
  clearQueue() {
    this.errorQueue = []
  }

  // 销毁实例
  destroy() {
    this.stopFlushTimer()
    this.flush(true)
    this.clearQueue()
    this.clearContext()
  }
}

// 导出单例实例
export const errorTracker = ErrorTracker.getInstance()