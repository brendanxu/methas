'use client';

interface Alert {
  id: string;
  type: 'error' | 'performance' | 'threshold' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  acknowledged?: boolean;
  resolved?: boolean;
}

interface AlertRule {
  id: string;
  name: string;
  condition: (value: any) => boolean;
  severity: Alert['severity'];
  type: Alert['type'];
  cooldown?: number; // 冷却时间（毫秒）
}

class MonitoringService {
  private alerts: Alert[] = [];
  private subscribers: ((alert: Alert) => void)[] = [];
  private rules: Map<string, AlertRule> = new Map();
  private cooldowns: Map<string, number> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  // 初始化默认告警规则
  private initializeDefaultRules() {
    const defaultRules: AlertRule[] = [
      {
        id: 'lcp_threshold',
        name: 'LCP性能告警',
        condition: (value: number) => value > 2500,
        severity: 'medium',
        type: 'performance',
        cooldown: 60000, // 1分钟
      },
      {
        id: 'cls_threshold',
        name: 'CLS布局偏移告警',
        condition: (value: number) => value > 0.1,
        severity: 'medium',
        type: 'performance',
        cooldown: 60000,
      },
      {
        id: 'inp_threshold',
        name: 'INP交互延迟告警',
        condition: (value: number) => value > 200,
        severity: 'high',
        type: 'performance',
        cooldown: 30000, // 30秒
      },
      {
        id: 'error_rate',
        name: '错误率告警',
        condition: (value: number) => value > 5, // 5%
        severity: 'high',
        type: 'error',
        cooldown: 300000, // 5分钟
      },
      {
        id: 'memory_usage',
        name: '内存使用告警',
        condition: (value: number) => value > 80, // 80%
        severity: 'medium',
        type: 'threshold',
        cooldown: 600000, // 10分钟
      },
      {
        id: 'api_response_time',
        name: 'API响应时间告警',
        condition: (value: number) => value > 5000, // 5秒
        severity: 'high',
        type: 'performance',
        cooldown: 120000, // 2分钟
      },
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  // 订阅告警
  subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // 发送告警
  private notify(alert: Alert) {
    this.alerts.push(alert);
    
    // 通知所有订阅者
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });
    
    // 发送到后端
    this.sendToBackend(alert);
    
    // 发送到第三方服务
    this.sendToThirdParty(alert);
    
    // 浏览器通知（如果权限允许）
    this.showBrowserNotification(alert);
  }

  // 发送到后端
  private async sendToBackend(alert: Alert) {
    try {
      await fetch('/api/monitoring/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alert,
          userAgent: navigator.userAgent,
          url: window.location.href,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        }),
      });
    } catch (error) {
      console.error('Failed to send alert to backend:', error);
    }
  }

  // 发送到第三方服务（Slack, Discord等）
  private async sendToThirdParty(alert: Alert) {
    if (alert.severity === 'critical' || alert.severity === 'high') {
      try {
        // Slack Webhook示例
        const slackWebhookUrl = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;
        if (slackWebhookUrl) {
          await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `🚨 ${alert.severity.toUpperCase()} Alert: ${alert.message}`,
              attachments: [{
                color: alert.severity === 'critical' ? 'danger' : 'warning',
                fields: [
                  { title: 'Type', value: alert.type, short: true },
                  { title: 'Severity', value: alert.severity, short: true },
                  { title: 'Time', value: alert.timestamp.toISOString(), short: false },
                  { title: 'URL', value: window.location.href, short: false },
                ],
              }],
            }),
          });
        }
      } catch (error) {
        console.error('Failed to send alert to third party:', error);
      }
    }
  }

  // 浏览器通知
  private showBrowserNotification(alert: Alert) {
    if (alert.severity === 'critical' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`${alert.type.toUpperCase()} Alert`, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: alert.id,
      });
    }
  }

  // 检查冷却时间
  private isInCooldown(ruleId: string): boolean {
    const lastTriggerTime = this.cooldowns.get(ruleId);
    if (!lastTriggerTime) return false;
    
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.cooldown) return false;
    
    return Date.now() - lastTriggerTime < rule.cooldown;
  }

  // 设置冷却时间
  private setCooldown(ruleId: string) {
    this.cooldowns.set(ruleId, Date.now());
  }

  // 性能告警
  checkPerformance(metric: string, value: number) {
    const ruleId = `${metric.toLowerCase()}_threshold`;
    const rule = this.rules.get(ruleId);
    
    if (rule && rule.condition(value) && !this.isInCooldown(ruleId)) {
      this.setCooldown(ruleId);
      
      const alert: Alert = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: rule.type,
        severity: rule.severity,
        message: `${metric} 性能指标超出阈值: ${value}${metric === 'CLS' ? '' : 'ms'}`,
        timestamp: new Date(),
        metadata: { 
          metric, 
          value, 
          rule: rule.name,
          page: window.location.pathname,
        },
      };
      
      this.notify(alert);
    }
  }

  // 错误告警
  logError(error: Error, context?: Record<string, any>) {
    const alert: Alert = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      severity: this.getErrorSeverity(error),
      message: error.message,
      timestamp: new Date(),
      metadata: {
        stack: error.stack,
        context,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
      },
    };
    
    this.notify(alert);
  }

  // 根据错误类型判断严重程度
  private getErrorSeverity(error: Error): Alert['severity'] {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'medium';
    }
    
    if (errorMessage.includes('syntax') || errorMessage.includes('reference')) {
      return 'high';
    }
    
    if (errorMessage.includes('security') || errorMessage.includes('unauthorized')) {
      return 'critical';
    }
    
    return 'medium';
  }

  // 业务指标告警
  checkThreshold(metric: string, value: number, min?: number, max?: number) {
    let triggered = false;
    let message = '';
    
    if (min !== undefined && value < min) {
      triggered = true;
      message = `${metric} 低于最小阈值: ${value} (最小值: ${min})`;
    } else if (max !== undefined && value > max) {
      triggered = true;
      message = `${metric} 超过最大阈值: ${value} (最大值: ${max})`;
    }
    
    if (triggered) {
      const alert: Alert = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'threshold',
        severity: 'medium',
        message,
        timestamp: new Date(),
        metadata: { metric, value, min, max },
      };
      
      this.notify(alert);
    }
  }

  // 安全告警
  securityAlert(type: string, details: Record<string, any>) {
    const alert: Alert = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'security',
      severity: 'high',
      message: `安全事件检测: ${type}`,
      timestamp: new Date(),
      metadata: {
        securityType: type,
        details,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
      },
    };
    
    this.notify(alert);
  }

  // 获取所有告警
  getAlerts(filter?: { type?: Alert['type']; severity?: Alert['severity'] }): Alert[] {
    if (!filter) return [...this.alerts];
    
    return this.alerts.filter(alert => {
      if (filter.type && alert.type !== filter.type) return false;
      if (filter.severity && alert.severity !== filter.severity) return false;
      return true;
    });
  }

  // 确认告警
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // 解决告警
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // 清理旧告警
  cleanupAlerts(maxAge: number = 24 * 60 * 60 * 1000) { // 默认24小时
    const cutoffTime = Date.now() - maxAge;
    this.alerts = this.alerts.filter(alert => 
      alert.timestamp.getTime() > cutoffTime || !alert.resolved
    );
  }

  // 添加自定义规则
  addRule(rule: AlertRule) {
    this.rules.set(rule.id, rule);
  }

  // 移除规则
  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  // 获取统计信息
  getStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    
    const recentAlerts = this.alerts.filter(a => now - a.timestamp.getTime() < oneHour);
    const todayAlerts = this.alerts.filter(a => now - a.timestamp.getTime() < oneDay);
    
    return {
      total: this.alerts.length,
      lastHour: recentAlerts.length,
      today: todayAlerts.length,
      unresolved: this.alerts.filter(a => !a.resolved).length,
      bySeverity: {
        critical: this.alerts.filter(a => a.severity === 'critical').length,
        high: this.alerts.filter(a => a.severity === 'high').length,
        medium: this.alerts.filter(a => a.severity === 'medium').length,
        low: this.alerts.filter(a => a.severity === 'low').length,
      },
      byType: {
        error: this.alerts.filter(a => a.type === 'error').length,
        performance: this.alerts.filter(a => a.type === 'performance').length,
        threshold: this.alerts.filter(a => a.type === 'threshold').length,
        security: this.alerts.filter(a => a.type === 'security').length,
      },
    };
  }
}

// 单例实例
export const monitoring = new MonitoringService();

// 初始化监控
export function initMonitoring() {
  // 请求浏览器通知权限
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // 监听未捕获的错误
  window.addEventListener('error', (event) => {
    monitoring.logError(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // 监听未捕获的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    monitoring.logError(new Error(event.reason), {
      type: 'unhandled_promise_rejection',
    });
  });

  // 定期清理旧告警
  setInterval(() => {
    monitoring.cleanupAlerts();
  }, 60 * 60 * 1000); // 每小时清理一次

  return monitoring;
}

// 使用示例
// monitoring.checkPerformance('LCP', 3000);
// monitoring.logError(new Error('API request failed'), { endpoint: '/api/data' });
// monitoring.checkThreshold('Conversion Rate', 0.5, 1.0, 5.0);
// monitoring.securityAlert('XSS Attempt', { payload: '<script>alert("xss")</script>' });