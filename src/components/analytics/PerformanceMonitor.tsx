'use client';

import { useEffect, useState } from 'react';
import { initPerformanceMonitoring, measureCustomMetric } from '@/lib/analytics/web-vitals';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PerformanceMonitorProps {
  children?: React.ReactNode;
  enableDetailedLogging?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  children, 
  enableDetailedLogging = false 
}) => {
  const { trackEvent } = useAnalytics();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    // 初始化性能监控
    initPerformanceMonitoring();
    setIsInitialized(true);

    // 监控DOM内容加载
    const measureDOMContentLoaded = () => {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        const domContentLoadedTime = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
        
        if (enableDetailedLogging) {
          console.log('DOM Content Loaded Time:', domContentLoadedTime);
        }
        
        trackEvent({
          action: 'dom_content_loaded',
          category: 'Performance',
          value: Math.round(domContentLoadedTime),
          custom_parameters: {
            navigation_type: nav.type,
            redirect_count: nav.redirectCount,
          },
        });
      }
    };

    // 监控资源加载完成
    const measureResourceLoading = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // 关键资源监控
            if (resourceEntry.name.includes('critical') || 
                resourceEntry.name.includes('above-fold') ||
                resourceEntry.initiatorType === 'css') {
              
              if (enableDetailedLogging) {
                console.log('Critical Resource Loaded:', {
                  name: resourceEntry.name,
                  duration: resourceEntry.duration,
                  size: resourceEntry.transferSize,
                });
              }
              
              trackEvent({
                action: 'critical_resource_loaded',
                category: 'Performance',
                label: resourceEntry.name,
                value: Math.round(resourceEntry.duration),
                custom_parameters: {
                  resource_type: resourceEntry.initiatorType,
                  transfer_size: resourceEntry.transferSize,
                  encoded_size: resourceEntry.encodedBodySize,
                  decoded_size: resourceEntry.decodedBodySize,
                },
              });
            }
          }
        });

        try {
          observer.observe({ entryTypes: ['resource'] });
        } catch (e) {
          console.error('Resource performance observer error:', e);
        }

        return () => observer.disconnect();
      }
      return undefined;
    };

    // 监控First Input Delay (FID) / Interaction to Next Paint (INP)
    const measureInteractionLatency = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'event') {
              const eventEntry = entry as PerformanceEventTiming;
              
              if (eventEntry.duration > 100) { // 超过100ms的交互
                if (enableDetailedLogging) {
                  console.warn('Slow Interaction:', {
                    type: eventEntry.name,
                    duration: eventEntry.duration,
                    startTime: eventEntry.startTime,
                  });
                }
                
                trackEvent({
                  action: 'slow_interaction',
                  category: 'Performance',
                  label: eventEntry.name,
                  value: Math.round(eventEntry.duration),
                  custom_parameters: {
                    interaction_type: eventEntry.name,
                    processing_start: eventEntry.processingStart,
                    processing_end: eventEntry.processingEnd,
                  },
                });
              }
            }
          }
        });

        try {
          observer.observe({ entryTypes: ['event'] });
        } catch (e) {
          console.error('Event timing observer error:', e);
        }

        return () => observer.disconnect();
      }
      return undefined;
    };

    // 监控自定义指标
    const measureCustomMetrics = () => {
      // 测量首屏渲染时间
      const measureATF = () => {
        const startTime = 'mark' in performance ? performance.now() : Date.now();
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const endTime = 'mark' in performance ? performance.now() : Date.now();
            const aboveFoldTime = endTime - startTime;
            
            measureCustomMetric('above_the_fold_render', startTime, endTime);
            
            trackEvent({
              action: 'above_fold_rendered',
              category: 'Performance',
              value: Math.round(aboveFoldTime),
              custom_parameters: {
                render_time: aboveFoldTime,
              },
            });
          });
        });
      };

      // 测量字体加载时间
      const measureFontLoading = () => {
        if ('fonts' in document) {
          const fontLoadStart = performance.now();
          
          document.fonts.ready.then(() => {
            const fontLoadTime = performance.now() - fontLoadStart;
            
            measureCustomMetric('font_loading', fontLoadStart);
            
            trackEvent({
              action: 'fonts_loaded',
              category: 'Performance',
              value: Math.round(fontLoadTime),
              custom_parameters: {
                font_count: document.fonts.size,
                load_time: fontLoadTime,
              },
            });
          });
        }
      };

      measureATF();
      measureFontLoading();
    };

    // 执行所有监控
    measureDOMContentLoaded();
    const resourceObserverCleanup = measureResourceLoading();
    const interactionObserverCleanup = measureInteractionLatency();
    measureCustomMetrics();

    return () => {
      if (resourceObserverCleanup) resourceObserverCleanup();
      if (interactionObserverCleanup) interactionObserverCleanup();
    };
  }, [isInitialized, enableDetailedLogging, trackEvent]);

  // 性能预算检查
  useEffect(() => {
    const checkPerformanceBudget = () => {
      const budget = {
        maxLCP: 2500, // 2.5s
        maxFID: 100,  // 100ms
        maxCLS: 0.1,  // 0.1
        maxTTFB: 800, // 800ms
        maxResourceSize: 1024 * 1024, // 1MB
        maxTotalSize: 5 * 1024 * 1024, // 5MB
      };

      // 检查资源大小
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          let totalSize = 0;
          
          for (const entry of list.getEntries()) {
            const resourceEntry = entry as PerformanceResourceTiming;
            totalSize += resourceEntry.transferSize || 0;
            
            // 检查单个资源大小
            if (resourceEntry.transferSize > budget.maxResourceSize) {
              trackEvent({
                action: 'performance_budget_exceeded',
                category: 'Performance',
                label: 'resource_size',
                value: Math.round(resourceEntry.transferSize / 1024),
                custom_parameters: {
                  resource_name: resourceEntry.name,
                  resource_size: resourceEntry.transferSize,
                  budget_limit: budget.maxResourceSize,
                },
              });
            }
          }
          
          // 检查总大小
          if (totalSize > budget.maxTotalSize) {
            trackEvent({
              action: 'performance_budget_exceeded',
              category: 'Performance',
              label: 'total_size',
              value: Math.round(totalSize / 1024),
              custom_parameters: {
                total_size: totalSize,
                budget_limit: budget.maxTotalSize,
              },
            });
          }
        });

        try {
          observer.observe({ entryTypes: ['resource'] });
          
          setTimeout(() => {
            observer.disconnect();
          }, 30000); // 30秒后停止监控
        } catch (e) {
          console.error('Performance budget observer error:', e);
        }
      }
    };

    checkPerformanceBudget();
  }, [trackEvent]);

  return <>{children}</>;
};

// 页面级性能监控组件
export const PagePerformanceTracker: React.FC<{ pageName: string }> = ({ pageName }) => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const pageLoadStart = performance.now();

    const trackPagePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp_connection: navigation.connectEnd - navigation.connectStart,
          tls_handshake: navigation.connectEnd - navigation.secureConnectionStart,
          request_response: navigation.responseEnd - navigation.requestStart,
          dom_processing: navigation.domComplete - navigation.domContentLoadedEventStart,
          page_load: performance.now() - pageLoadStart,
        };

        Object.entries(metrics).forEach(([metric, value]) => {
          if (value > 0) {
            trackEvent({
              action: 'page_performance',
              category: 'Performance',
              label: `${pageName}_${metric}`,
              value: Math.round(value),
              custom_parameters: {
                page_name: pageName,
                metric_name: metric,
                metric_value: value,
              },
            });
          }
        });
      }
    };

    // 页面加载完成后延迟500ms追踪
    const timer = setTimeout(trackPagePerformance, 500);

    return () => clearTimeout(timer);
  }, [pageName, trackEvent]);

  return null;
};