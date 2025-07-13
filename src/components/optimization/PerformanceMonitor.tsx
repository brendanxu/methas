'use client';

import { useEffect, useRef } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Web Vitals 性能监控组件
 */
export const PerformanceMonitor: React.FC = () => {
  const metricsRef = useRef<Map<string, VitalMetric>>(new Map());

  useEffect(() => {
    // 监控核心 Web Vitals
    const reportMetric = (metric: VitalMetric) => {
      metricsRef.current.set(metric.name, metric);
      
      // 发送到 Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.value),
          custom_parameter: metric.rating,
        });
      }

      // 发送到自定义分析端点
      sendToAnalytics(metric);
      
      // 开发环境下的控制台输出
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
        });
      }
    };

    // 监控各项指标
    onCLS(reportMetric);
    onFCP(reportMetric);
    onINP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);

    // 页面卸载时发送最终数据
    const handleBeforeUnload = () => {
      const metrics = Array.from(metricsRef.current.values());
      if (metrics.length > 0) {
        sendBatchMetrics(metrics);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null; // 这个组件不渲染任何内容
};

/**
 * 发送单个指标到分析服务
 */
function sendToAnalytics(metric: VitalMetric) {
  if (typeof window === 'undefined') return;

  // 使用 sendBeacon API 确保数据发送
  if ('sendBeacon' in navigator) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });

    navigator.sendBeacon('/api/analytics/web-vitals', body);
  }
}

/**
 * 批量发送指标
 */
function sendBatchMetrics(metrics: VitalMetric[]) {
  if (typeof window === 'undefined' || !metrics.length) return;

  const body = JSON.stringify({
    metrics: metrics.map(metric => ({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    })),
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  });

  if ('sendBeacon' in navigator) {
    navigator.sendBeacon('/api/analytics/web-vitals-batch', body);
  } else {
    // Fallback for older browsers
    fetch('/api/analytics/web-vitals-batch', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
    }).catch(() => {
      // 静默处理错误
    });
  }
}

/**
 * 性能预算监控
 */
export class PerformanceBudget {
  private static budgets = {
    LCP: 2500, // Largest Contentful Paint (ms)
    INP: 200,  // Interaction to Next Paint (ms)
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 800, // Time to First Byte (ms)
  };

  private static violations: string[] = [];

  static checkBudget(metric: VitalMetric): boolean {
    const budget = this.budgets[metric.name as keyof typeof this.budgets];
    if (!budget) return true;

    const isWithinBudget = metric.value <= budget;
    
    if (!isWithinBudget) {
      const violation = `${metric.name} exceeded budget: ${metric.value}ms > ${budget}ms`;
      this.violations.push(violation);
      
      // 发送预算违规警告
      this.reportBudgetViolation(metric, budget);
    }

    return isWithinBudget;
  }

  private static reportBudgetViolation(metric: VitalMetric, budget: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_budget_violation', {
        event_category: 'Performance',
        metric_name: metric.name,
        actual_value: Math.round(metric.value),
        budget_value: budget,
        overage: Math.round(metric.value - budget),
      });
    }

    // 开发环境下显示警告
    if (process.env.NODE_ENV === 'development') {
      console.warn(`🚨 Performance Budget Violation: ${metric.name}`, {
        actual: metric.value,
        budget: budget,
        overage: metric.value - budget,
      });
    }
  }

  static getViolations(): string[] {
    return [...this.violations];
  }

  static setBudget(metric: keyof typeof PerformanceBudget.budgets, value: number) {
    this.budgets[metric] = value;
  }
}

/**
 * 资源加载监控
 */
export class ResourceMonitor {
  private static observer?: PerformanceObserver;

  static init() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          this.analyzeResourceTiming(entry as PerformanceResourceTiming);
        } else if (entry.entryType === 'navigation') {
          this.analyzeNavigationTiming(entry as PerformanceNavigationTiming);
        }
      });
    });

    // 监控资源和导航时间
    try {
      this.observer.observe({ entryTypes: ['resource', 'navigation'] });
    } catch (e) {
      console.warn('Performance monitoring not supported');
    }
  }

  private static analyzeResourceTiming(entry: PerformanceResourceTiming) {
    const duration = entry.responseEnd - entry.startTime;
    const size = entry.transferSize || 0;
    
    // 检查大文件加载
    if (size > 500 * 1024) { // 500KB
      console.warn(`Large resource detected: ${entry.name} (${Math.round(size / 1024)}KB)`);
      
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'large_resource_detected', {
          event_category: 'Performance',
          resource_name: entry.name,
          resource_size: Math.round(size / 1024),
          load_time: Math.round(duration),
        });
      }
    }

    // 检查慢加载资源
    if (duration > 3000) { // 3秒
      console.warn(`Slow resource detected: ${entry.name} (${Math.round(duration)}ms)`);
      
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'slow_resource_detected', {
          event_category: 'Performance',
          resource_name: entry.name,
          load_time: Math.round(duration),
        });
      }
    }
  }

  private static analyzeNavigationTiming(entry: PerformanceNavigationTiming) {
    const metrics = {
      DNS: entry.domainLookupEnd - entry.domainLookupStart,
      TCP: entry.connectEnd - entry.connectStart,
      SSL: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
      TTFB: entry.responseStart - entry.requestStart,
      Download: entry.responseEnd - entry.responseStart,
      DOMParse: entry.domComplete - entry.responseEnd,
      DOMReady: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      LoadComplete: entry.loadEventEnd - entry.loadEventStart,
    };

    // 发送导航时间指标
    Object.entries(metrics).forEach(([name, value]) => {
      if (value > 0 && typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', `navigation_${name.toLowerCase()}`, {
          event_category: 'Navigation Timing',
          value: Math.round(value),
        });
      }
    });

    // 开发环境下显示详细信息
    if (process.env.NODE_ENV === 'development') {
      console.table(metrics);
    }
  }

  static disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// 自动初始化资源监控
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ResourceMonitor.init());
  } else {
    ResourceMonitor.init();
  }
}

export default PerformanceMonitor;