'use client';

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import dynamic from 'next/dynamic';

/**
 * 动态导入工具函数
 * 支持组件懒加载和代码分割
 */

// 类型定义
export interface DynamicImportOptions {
  loading?: () => React.ReactNode;
  ssr?: boolean;
}

export interface LazyLoadOptions {
  fallback?: ComponentType<any>;
  preload?: boolean;
  retry?: number;
}

/**
 * 创建动态导入的组件
 */
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
) {
  const {
    loading = undefined, // Use default Next.js loading component
    ssr = false,
  } = options;

  return dynamic(importFn, {
    loading,
    ssr,
  });
}

/**
 * 懒加载组件工厂
 */
export function createLazyComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<ComponentType<T>> {
  const { preload = false, retry = 3 } = options;

  // 创建带重试机制的导入函数
  const importWithRetry = async (retryCount = 0): Promise<{ default: ComponentType<T> }> => {
    try {
      return await importFn();
    } catch (error) {
      if (retryCount < retry) {
        // 指数退避重试
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return importWithRetry(retryCount + 1);
      }
      throw error;
    }
  };

  const LazyComponent = lazy(importWithRetry);

  // 预加载功能
  if (preload) {
    // 在空闲时预加载组件
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFn().catch(() => {
          // 静默处理预加载错误
        });
      });
    }
  }

  return LazyComponent;
}

/**
 * 路由级别的代码分割
 */
export const RouteComponents = {
  // 首页组件
  Home: createDynamicComponent(
    () => import('@/app/page'),
    { ssr: true }
  ),
  
  // 新闻页面
  News: createDynamicComponent(
    () => import('@/app/news/page'),
    { ssr: false }
  ),
  
  // 搜索页面
  Search: createDynamicComponent(
    () => import('@/app/search/page'),
    { ssr: false }
  ),
  
  // 按钮演示页
  ButtonDemo: createDynamicComponent(
    () => import('@/app/button-demo/page'),
    { ssr: false }
  ),
};

/**
 * 组件级别的懒加载
 */
export const LazyComponents = {
  // 表单组件
  ContactForm: createLazyComponent(
    () => import('@/components/forms/ContactForm'),
    { preload: true }
  ),
  
  NewsletterForm: createLazyComponent(
    () => import('@/components/forms/NewsletterForm')
  ),
  
  // UI 组件
  SearchModal: createLazyComponent(
    () => import('@/components/ui/SearchModal')
  ),
};

/**
 * 预加载关键路由
 */
export function preloadCriticalRoutes() {
  if (typeof window === 'undefined') return;

  const criticalRoutes = [
    '/services',
    '/case-studies',
    '/contact',
  ];

  // 在用户空闲时预加载关键路由
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
}

/**
 * 智能预加载 - 基于用户行为
 */
export class SmartPreloader {
  private static instance: SmartPreloader;
  private preloadedComponents = new Set<string>();
  private intersectionObserver?: IntersectionObserver;

  static getInstance(): SmartPreloader {
    if (!SmartPreloader.instance) {
      SmartPreloader.instance = new SmartPreloader();
    }
    return SmartPreloader.instance;
  }

  init() {
    if (typeof window === 'undefined') return;

    // 监听用户交互
    this.setupInteractionListeners();
    
    // 监听视口交集
    this.setupIntersectionObserver();
    
    // 预加载关键资源
    preloadCriticalRoutes();
  }

  private setupInteractionListeners() {
    // 鼠标悬停预加载
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.hostname === window.location.hostname) {
        this.preloadRoute(link.href);
      }
    });

    // 触摸开始预加载（移动端）
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.hostname === window.location.hostname) {
        this.preloadRoute(link.href);
      }
    });
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const preloadComponent = element.dataset.preload;
            
            if (preloadComponent && !this.preloadedComponents.has(preloadComponent)) {
              this.preloadComponent(preloadComponent);
              this.preloadedComponents.add(preloadComponent);
            }
          }
        });
      },
      { rootMargin: '100px' }
    );
  }

  observeElement(element: HTMLElement, componentName: string) {
    if (this.intersectionObserver) {
      element.dataset.preload = componentName;
      this.intersectionObserver.observe(element);
    }
  }

  private preloadRoute(href: string) {
    if (this.preloadedComponents.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    this.preloadedComponents.add(href);
  }

  private async preloadComponent(componentName: string) {
    try {
      const component = (LazyComponents as any)[componentName];
      if (component && component._payload) {
        await component._payload._result;
      }
    } catch (error) {
      console.warn(`Failed to preload component: ${componentName}`, error);
    }
  }

  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

/**
 * 性能监控工具
 */
export class BundlePerformanceMonitor {
  private static metrics = {
    bundleLoadTimes: new Map<string, number>(),
    componentLoadTimes: new Map<string, number>(),
    chunkLoadErrors: new Map<string, number>(),
  };

  static trackBundleLoad(bundleName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    this.metrics.bundleLoadTimes.set(bundleName, loadTime);
    
    // 发送到分析服务
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'bundle_load', {
        bundle_name: bundleName,
        load_time: Math.round(loadTime),
      });
    }
  }

  static trackComponentLoad(componentName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    this.metrics.componentLoadTimes.set(componentName, loadTime);
  }

  static trackChunkError(chunkName: string) {
    const errorCount = this.metrics.chunkLoadErrors.get(chunkName) || 0;
    this.metrics.chunkLoadErrors.set(chunkName, errorCount + 1);
    
    // 发送错误到监控服务
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'chunk_load_error', {
        chunk_name: chunkName,
        error_count: errorCount + 1,
      });
    }
  }

  static getMetrics() {
    return {
      bundleLoadTimes: Object.fromEntries(this.metrics.bundleLoadTimes),
      componentLoadTimes: Object.fromEntries(this.metrics.componentLoadTimes),
      chunkLoadErrors: Object.fromEntries(this.metrics.chunkLoadErrors),
    };
  }
}

// 初始化智能预加载器
if (typeof window !== 'undefined') {
  const preloader = SmartPreloader.getInstance();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => preloader.init());
  } else {
    preloader.init();
  }
}