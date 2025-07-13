'use client';

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
  metadata?: {
    url: string;
    userAgent: string;
    userId?: string;
    sessionId?: string;
  };
}

interface LoggerConfig {
  maxLogs: number;
  logLevel: LogLevel;
  enableRemoteLogging: boolean;
  enableLocalStorage: boolean;
  remoteEndpoint?: string;
}

class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private sessionId: string;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      maxLogs: 1000,
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
      enableRemoteLogging: process.env.NODE_ENV === 'production',
      enableLocalStorage: true,
      remoteEndpoint: '/api/logs',
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.initializeLogger();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeLogger() {
    // 从localStorage恢复日志（如果启用）
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        const storedLogs = localStorage.getItem('app_logs');
        if (storedLogs) {
          this.logs = JSON.parse(storedLogs).map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
        }
      } catch (error) {
        console.warn('Failed to restore logs from localStorage:', error);
      }
    }

    // 监听页面关闭，保存日志
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.saveToLocalStorage();
      });

      // 监听未捕获的错误
      window.addEventListener('error', (event) => {
        this.error('Uncaught Error', event.error || new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });

      // 监听未捕获的Promise错误
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled Promise Rejection', new Error(event.reason), {
          type: 'unhandled_promise_rejection',
        });
      });
    }
  }

  private saveToLocalStorage() {
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        // 只保存最近的500条日志
        const logsToSave = this.logs.slice(-500);
        localStorage.setItem('app_logs', JSON.stringify(logsToSave));
      } catch (error) {
        console.warn('Failed to save logs to localStorage:', error);
      }
    }
  }

  private getMetadata(): LogEntry['metadata'] {
    if (typeof window === 'undefined') {
      return {
        url: '',
        userAgent: '',
        sessionId: this.sessionId,
      };
    }

    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      userId: this.getUserId(),
    };
  }

  private getUserId(): string | undefined {
    // 从cookie或localStorage获取用户ID
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('user_id') || undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level];
    const context = entry.context ? JSON.stringify(entry.context) : '';
    return `[${timestamp}] ${level}: ${entry.message} ${context}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (level < this.config.logLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
      metadata: this.getMetadata(),
    };

    // 保存到内存
    this.logs.push(entry);
    if (this.logs.length > this.config.maxLogs) {
      this.logs.shift();
    }

    // 控制台输出
    this.outputToConsole(entry);

    // 发送到远程服务（异步）
    if (this.config.enableRemoteLogging && level >= LogLevel.WARN) {
      this.sendToRemote(entry);
    }

    // 保存到localStorage（定期保存）
    if (this.logs.length % 10 === 0) {
      this.saveToLocalStorage();
    }

    // 发送到监控系统
    if (level === LogLevel.ERROR && error) {
      // 避免循环引用
      setTimeout(() => {
        try {
          const { monitoring } = require('@/lib/monitoring/alerts');
          monitoring.logError(error, context);
        } catch (err) {
          console.error('Failed to send to monitoring:', err);
        }
      }, 0);
    }
  }

  private outputToConsole(entry: LogEntry) {
    const formattedMessage = this.formatMessage(entry);
    const style = this.getConsoleStyle(entry.level);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.log(`%c${formattedMessage}`, style);
        break;
      case LogLevel.INFO:
        console.info(`%c${formattedMessage}`, style);
        break;
      case LogLevel.WARN:
        console.warn(`%c${formattedMessage}`, style);
        break;
      case LogLevel.ERROR:
        console.error(`%c${formattedMessage}`, style, entry.error);
        break;
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: #6b7280; font-size: 12px;';
      case LogLevel.INFO:
        return 'color: #3b82f6; font-weight: bold;';
      case LogLevel.WARN:
        return 'color: #f59e0b; font-weight: bold;';
      case LogLevel.ERROR:
        return 'color: #ef4444; font-weight: bold; background: #fef2f2; padding: 2px 4px;';
      default:
        return '';
    }
  }

  private async sendToRemote(entry: LogEntry) {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entry,
          error: entry.error ? {
            name: entry.error.name,
            message: entry.error.message,
            stack: entry.error.stack,
          } : undefined,
        }),
      });
    } catch (err) {
      console.error('Failed to send log to remote:', err);
    }
  }

  // 公共API
  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // 性能日志
  performance(operation: string, duration: number, context?: Record<string, any>) {
    this.info(`Performance: ${operation}`, {
      duration,
      operation,
      ...context,
    });
  }

  // 用户行为日志
  userAction(action: string, context?: Record<string, any>) {
    this.info(`User Action: ${action}`, {
      action,
      ...context,
    });
  }

  // API调用日志
  apiCall(method: string, url: string, status: number, duration: number, context?: Record<string, any>) {
    const level = status >= 400 ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, `API Call: ${method} ${url}`, {
      method,
      url,
      status,
      duration,
      ...context,
    });
  }

  // 获取日志历史
  getLogs(filter?: { level?: LogLevel; timeRange?: [Date, Date] }): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (filter) {
      if (filter.level !== undefined) {
        filteredLogs = filteredLogs.filter(log => log.level >= filter.level!);
      }
      
      if (filter.timeRange) {
        const [start, end] = filter.timeRange;
        filteredLogs = filteredLogs.filter(log => 
          log.timestamp >= start && log.timestamp <= end
        );
      }
    }

    return filteredLogs;
  }

  // 清空日志
  clear() {
    this.logs = [];
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('app_logs');
      } catch (error) {
        console.warn('Failed to clear logs from localStorage:', error);
      }
    }
  }

  // 导出日志
  export(format: 'json' | 'text' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }
    
    return this.logs.map(entry => this.formatMessage(entry)).join('\n');
  }

  // 设置用户ID
  setUserId(userId: string) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('user_id', userId);
      } catch (error) {
        console.warn('Failed to save user ID:', error);
      }
    }
  }

  // 设置日志级别
  setLogLevel(level: LogLevel) {
    this.config.logLevel = level;
  }

  // 获取统计信息
  getStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    
    const recentLogs = this.logs.filter(log => now - log.timestamp.getTime() < oneHour);
    const todayLogs = this.logs.filter(log => now - log.timestamp.getTime() < oneDay);
    
    return {
      total: this.logs.length,
      lastHour: recentLogs.length,
      today: todayLogs.length,
      byLevel: {
        debug: this.logs.filter(log => log.level === LogLevel.DEBUG).length,
        info: this.logs.filter(log => log.level === LogLevel.INFO).length,
        warn: this.logs.filter(log => log.level === LogLevel.WARN).length,
        error: this.logs.filter(log => log.level === LogLevel.ERROR).length,
      },
      errors: this.logs.filter(log => log.level === LogLevel.ERROR),
    };
  }
}

// 单例实例
export const logger = new Logger();

// 导出类型和枚举
export { LogLevel, type LogEntry, type LoggerConfig };

// 便捷函数
export const log = {
  debug: (message: string, context?: Record<string, any>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, any>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, any>) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: Record<string, any>) => logger.error(message, error, context),
  performance: (operation: string, duration: number, context?: Record<string, any>) => logger.performance(operation, duration, context),
  userAction: (action: string, context?: Record<string, any>) => logger.userAction(action, context),
  apiCall: (method: string, url: string, status: number, duration: number, context?: Record<string, any>) => logger.apiCall(method, url, status, duration, context),
};