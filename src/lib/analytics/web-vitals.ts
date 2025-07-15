'use client';

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { event, trackPerformance } from './google-analytics';

// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};

const vitalsUrl = '/api/analytics/vitals';

interface ConnectionInfo {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

// 获取网络连接信息
function getConnectionSpeed(): ConnectionInfo {
  const nav = navigator as any;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (!conn) return {};
  
  return {
    effectiveType: conn.effectiveType,
    downlink: conn.downlink,
    rtt: conn.rtt,
    saveData: conn.saveData,
  };
}

// 获取设备信息
function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
    },
  };
}

// 发送指标到分析服务
function sendToAnalytics(metric: Metric) {
  const body = {
    dsn: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    rating: metric.rating,
    delta: metric.delta,
    connection: getConnectionSpeed(),
    device: getDeviceInfo(),
    timestamp: Date.now(),
    navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'unknown',
  };

  // 发送到自定义分析端点
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, JSON.stringify(body));
  } else {
    fetch(vitalsUrl, {
      body: JSON.stringify(body),
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(err => {
      logError('Failed to send Web Vitals:', err);
    });
  }

  // 同时发送到Google Analytics
  trackPerformance(metric.name, metric.value);

  // 详细的GA4事件
  event({
    action: 'web_vital',
    category: 'Performance',
    label: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    custom_parameters: {
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
      connection_type: getConnectionSpeed().effectiveType || 'unknown',
    },
  });

  // 性能阈值告警
  checkPerformanceThresholds(metric);
}

// 性能阈值检查
function checkPerformanceThresholds(metric: Metric) {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[metric.name as keyof typeof thresholds];
  if (!threshold) return;

  let status: 'good' | 'needs-improvement' | 'poor';
  if (metric.value <= threshold.good) {
    status = 'good';
  } else if (metric.value <= threshold.poor) {
    status = 'needs-improvement';
  } else {
    status = 'poor';
  }

  // 发送性能状态事件
  event({
    action: 'performance_threshold',
    category: 'Performance',
    label: `${metric.name}_${status}`,
    value: Math.round(metric.value),
    custom_parameters: {
      metric_name: metric.name,
      metric_status: status,
      threshold_good: threshold.good,
      threshold_poor: threshold.poor,
    },
  });

  // 如果性能较差，记录详细信息
  if (status === 'poor') {
    console.warn(`Poor ${metric.name} detected:`, {
      value: metric.value,
      threshold: threshold.poor,
      page: window.location.pathname,
    });
  }
}

// 初始化Web Vitals监控
export function reportWebVitals() {
  try {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  } catch (err) {
    logError('[Web Vitals Error]', err);
    
    // 报告初始化错误
    event({
      action: 'web_vitals_error',
      category: 'Error',
      label: 'initialization_failed',
      custom_parameters: {
        error_message: err instanceof Error ? err.message : 'Unknown error',
      },
    });
  }
}

// 自定义性能监控
export function measureCustomMetric(name: string, startTime: number, endTime: number = performance.now()) {
  const duration = endTime - startTime;
  
  trackPerformance(name, duration);
  
  return duration;
}

// 资源加载监控
export function monitorResourceLoading() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // 监控大文件加载
          if (resourceEntry.transferSize > 1024 * 1024) { // > 1MB
            event({
              action: 'large_resource_loaded',
              category: 'Performance',
              label: resourceEntry.name,
              value: Math.round(resourceEntry.transferSize / 1024), // KB
              custom_parameters: {
                resource_type: resourceEntry.initiatorType,
                transfer_size: resourceEntry.transferSize,
                duration: Math.round(resourceEntry.duration),
              },
            });
          }
          
          // 监控缓慢的资源加载
          if (resourceEntry.duration > 3000) { // > 3s
            event({
              action: 'slow_resource_load',
              category: 'Performance',
              label: resourceEntry.name,
              value: Math.round(resourceEntry.duration),
              custom_parameters: {
                resource_type: resourceEntry.initiatorType,
                duration: resourceEntry.duration,
              },
            });
          }
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      logError('Resource monitoring failed:', e);
    }
  }
}

// 长任务监控
export function monitorLongTasks() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn('Long Task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
        });
        
        // 发送长任务事件
        event({
          action: 'long_task',
          category: 'Performance',
          label: 'main_thread_blocking',
          value: Math.round(entry.duration),
          custom_parameters: {
            duration: entry.duration,
            start_time: entry.startTime,
          },
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      logError('Long task observer error:', e);
    }
  }
}

// 内存使用监控
export function monitorMemoryUsage() {
  if ('memory' in performance) {
    const memInfo = (performance as any).memory;
    
    // 每5分钟检查一次内存使用
    setInterval(() => {
      const memoryUsage = {
        used: memInfo.usedJSHeapSize,
        total: memInfo.totalJSHeapSize,
        limit: memInfo.jsHeapSizeLimit,
      };
      
      const usagePercent = (memoryUsage.used / memoryUsage.limit) * 100;
      
      // 如果内存使用超过80%，发送警告
      if (usagePercent > 80) {
        event({
          action: 'high_memory_usage',
          category: 'Performance',
          label: 'memory_warning',
          value: Math.round(usagePercent),
          custom_parameters: {
            used_mb: Math.round(memoryUsage.used / 1024 / 1024),
            total_mb: Math.round(memoryUsage.total / 1024 / 1024),
            limit_mb: Math.round(memoryUsage.limit / 1024 / 1024),
          },
        });
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
}

// 初始化所有性能监控
export function initPerformanceMonitoring() {
  reportWebVitals();
  monitorResourceLoading();
  monitorLongTasks();
  monitorMemoryUsage();
}