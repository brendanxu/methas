/**
 * Performance optimization utilities for South Pole theme system
 * 性能优化工具集
 */

// 缓存管理器
class ColorCache {
  private cache = new Map<string, string>();
  private maxSize = 1000; // 最大缓存条目数

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    // 如果缓存已满，删除最老的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// 全局颜色缓存实例
export const colorCache = new ColorCache();

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 批量样式更新
export class StyleBatcher {
  private updates: Array<() => void> = [];
  private scheduled = false;

  add(update: () => void): void {
    this.updates.push(update);
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => {
        this.flush();
      });
    }
  }

  flush(): void {
    this.updates.forEach(update => update());
    this.updates = [];
    this.scheduled = false;
  }
}

export const styleBatcher = new StyleBatcher();

// CSS变量优化器
export class CSSVariableOptimizer {
  private documentElement: HTMLElement;
  private appliedVariables = new Set<string>();

  constructor() {
    this.documentElement = typeof document !== 'undefined' 
      ? document.documentElement 
      : {} as HTMLElement;
  }

  // 批量设置CSS变量
  setBatchVariables(variables: Record<string, string>): void {
    styleBatcher.add(() => {
      Object.entries(variables).forEach(([property, value]) => {
        if (this.documentElement.style) {
          this.documentElement.style.setProperty(property, value);
          this.appliedVariables.add(property);
        }
      });
    });
  }

  // 移除未使用的CSS变量
  cleanupUnusedVariables(activeVariables: string[]): void {
    const activeSet = new Set(activeVariables);
    
    styleBatcher.add(() => {
      this.appliedVariables.forEach(variable => {
        if (!activeSet.has(variable) && this.documentElement.style) {
          this.documentElement.style.removeProperty(variable);
          this.appliedVariables.delete(variable);
        }
      });
    });
  }

  // 获取已应用的变量列表
  getAppliedVariables(): string[] {
    return Array.from(this.appliedVariables);
  }
}

export const cssOptimizer = new CSSVariableOptimizer();

// 懒加载工具
export function createLazyLoader<T>(loader: () => Promise<T>) {
  let promise: Promise<T> | null = null;
  
  return (): Promise<T> => {
    if (!promise) {
      promise = loader();
    }
    return promise;
  };
}

// 内存使用监控
export class MemoryMonitor {
  private checkInterval: NodeJS.Timeout | null = null;
  private thresholds = {
    warning: 50, // MB
    critical: 100, // MB
  };

  start(intervalMs = 30000): void {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      this.checkInterval = setInterval(() => {
        const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
        if (!memory) return;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        
        if (usedMB > this.thresholds.critical) {
          console.warn('Critical memory usage detected:', usedMB.toFixed(2), 'MB');
          this.cleanup();
        } else if (usedMB > this.thresholds.warning) {
          console.warn('High memory usage detected:', usedMB.toFixed(2), 'MB');
        }
      }, intervalMs);
    }
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private cleanup(): void {
    // 清理缓存
    colorCache.clear();
    
    // 触发垃圾回收（如果可用）
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as { gc?: () => void }).gc?.();
    }
  }
}

export const memoryMonitor = new MemoryMonitor();

// 性能测量工具
export class PerformanceProfiler {
  private marks = new Map<string, number>();

  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  end(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`Performance mark '${name}' not found`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.marks.delete(name);
    
    if (duration > 16) { // 超过一帧的时间
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  measure(name: string, fn: () => void): number {
    this.start(name);
    fn();
    return this.end(name);
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    const result = await fn();
    this.end(name);
    return result;
  }
}

export const profiler = new PerformanceProfiler();

// 资源预加载
export function preloadCSS(href: string): void {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
    
    // 实际加载样式表
    setTimeout(() => {
      link.rel = 'stylesheet';
    }, 0);
  }
}

// 关键CSS内联
export function inlineCSS(css: string): void {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

const performanceUtils = {
  colorCache,
  debounce,
  throttle,
  styleBatcher,
  cssOptimizer,
  createLazyLoader,
  memoryMonitor,
  profiler,
  preloadCSS,
  inlineCSS,
};

export default performanceUtils;