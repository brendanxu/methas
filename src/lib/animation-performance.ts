/**
 * 动画性能管理器
 * 监控和优化动画性能，确保60fps流畅体验
 */

// 性能指标接口
interface PerformanceMetrics {
  fps: number;
  frameDrops: number;
  averageFrameTime: number;
  animationCount: number;
  memoryUsage?: number;
}

// 动画状态管理
interface AnimationState {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  element: HTMLElement;
  isActive: boolean;
}

/**
 * 动画性能管理器
 */
export class AnimationPerformanceManager {
  private static instance: AnimationPerformanceManager;
  private frameCount = 0;
  private lastFrameTime = 0;
  private frameTimeHistory: number[] = [];
  private activeAnimations = new Map<string, AnimationState>();
  private performanceObserver?: PerformanceObserver;
  private rafId?: number;
  private isMonitoring = false;
  
  // 性能阈值
  private readonly thresholds = {
    minFPS: 45, // 最低帧率
    maxFrameTime: 22, // 最大帧时间 (ms)
    maxConcurrentAnimations: 20, // 最大并发动画数
    memoryWarning: 100 * 1024 * 1024, // 内存警告阈值 (100MB)
  };

  static getInstance(): AnimationPerformanceManager {
    if (!AnimationPerformanceManager.instance) {
      AnimationPerformanceManager.instance = new AnimationPerformanceManager();
    }
    return AnimationPerformanceManager.instance;
  }

  /**
   * 初始化性能监控
   */
  init() {
    if (typeof window === 'undefined') return;

    this.setupPerformanceObserver();
    this.startFrameMonitoring();
    this.setupDeviceSpecificOptimizations();
    this.isMonitoring = true;

    if (process.env.NODE_ENV === 'development') {
      this.setupDebugPanel();
    }
  }

  /**
   * 注册动画
   */
  registerAnimation(
    id: string,
    name: string,
    element: HTMLElement,
    duration: number = 1000
  ): boolean {
    // 检查是否超过并发限制
    if (this.activeAnimations.size >= this.thresholds.maxConcurrentAnimations) {
      console.warn(`Animation limit reached. Skipping animation: ${name}`);
      return false;
    }

    // 检查当前性能状态
    const currentMetrics = this.getCurrentMetrics();
    if (currentMetrics.fps < this.thresholds.minFPS) {
      console.warn(`Low FPS detected (${currentMetrics.fps}). Reducing animation complexity.`);
      this.optimizeExistingAnimations();
    }

    const animationState: AnimationState = {
      id,
      name,
      startTime: performance.now(),
      duration,
      element,
      isActive: true,
    };

    this.activeAnimations.set(id, animationState);
    this.trackAnimationStart(name);

    // 设置自动清理
    setTimeout(() => {
      this.unregisterAnimation(id);
    }, duration + 100);

    return true;
  }

  /**
   * 注销动画
   */
  unregisterAnimation(id: string) {
    const animation = this.activeAnimations.get(id);
    if (animation) {
      animation.isActive = false;
      this.activeAnimations.delete(id);
      this.trackAnimationEnd(animation.name, performance.now() - animation.startTime);
    }
  }

  /**
   * 获取当前性能指标
   */
  getCurrentMetrics(): PerformanceMetrics {
    const averageFrameTime = this.frameTimeHistory.length > 0
      ? this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length
      : 0;

    const fps = averageFrameTime > 0 ? 1000 / averageFrameTime : 60;
    const frameDrops = this.frameTimeHistory.filter(time => time > this.thresholds.maxFrameTime).length;

    return {
      fps: Math.round(fps),
      frameDrops,
      averageFrameTime: Math.round(averageFrameTime * 100) / 100,
      animationCount: this.activeAnimations.size,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  /**
   * 优化现有动画
   */
  private optimizeExistingAnimations() {
    // 暂停低优先级动画
    for (const [id, animation] of this.activeAnimations) {
      const element = animation.element;
      
      // 检查元素是否在视口内
      if (!this.isElementInViewport(element)) {
        this.pauseAnimation(element);
      }
      
      // 简化复杂动画
      this.simplifyAnimation(element);
    }
  }

  /**
   * 暂停动画
   */
  private pauseAnimation(element: HTMLElement) {
    element.style.animationPlayState = 'paused';
    element.style.transitionDuration = '0s';
  }

  /**
   * 恢复动画
   */
  private resumeAnimation(element: HTMLElement) {
    element.style.animationPlayState = 'running';
    element.style.transitionDuration = '';
  }

  /**
   * 简化动画
   */
  private simplifyAnimation(element: HTMLElement) {
    // 减少动画时长
    const currentDuration = parseFloat(getComputedStyle(element).animationDuration) || 1;
    element.style.animationDuration = `${Math.max(currentDuration * 0.5, 0.1)}s`;
    
    // 禁用复杂属性动画
    element.style.willChange = 'transform';
  }

  /**
   * 检查元素是否在视口内
   */
  private isElementInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const margin = 100; // 视口外边距

    return (
      rect.bottom >= -margin &&
      rect.right >= -margin &&
      rect.top <= window.innerHeight + margin &&
      rect.left <= window.innerWidth + margin
    );
  }

  /**
   * 设置性能观察器
   */
  private setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.entryType === 'measure' && entry.name.includes('animation')) {
          this.trackAnimationPerformance(entry.name, entry.duration);
        }
      });
    });

    try {
      this.performanceObserver.observe({ entryTypes: ['measure'] });
    } catch (e) {
      console.warn('Performance measurement not supported');
    }
  }

  /**
   * 开始帧监控
   */
  private startFrameMonitoring() {
    const measureFrame = (timestamp: number) => {
      if (this.lastFrameTime) {
        const frameTime = timestamp - this.lastFrameTime;
        this.frameTimeHistory.push(frameTime);
        
        // 保持历史记录在合理范围内
        if (this.frameTimeHistory.length > 60) {
          this.frameTimeHistory.shift();
        }
        
        // 检查性能警告
        this.checkPerformanceWarnings(frameTime);
      }
      
      this.lastFrameTime = timestamp;
      this.frameCount++;
      
      if (this.isMonitoring) {
        this.rafId = requestAnimationFrame(measureFrame);
      }
    };

    this.rafId = requestAnimationFrame(measureFrame);
  }

  /**
   * 检查性能警告
   */
  private checkPerformanceWarnings(frameTime: number) {
    if (frameTime > this.thresholds.maxFrameTime) {
      this.handlePerformanceIssue('frame_drop', { frameTime });
    }

    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage && memoryUsage > this.thresholds.memoryWarning) {
      this.handlePerformanceIssue('memory_warning', { memoryUsage });
    }
  }

  /**
   * 处理性能问题
   */
  private handlePerformanceIssue(type: string, data: any) {
    switch (type) {
      case 'frame_drop':
        this.optimizeForFrameDrops();
        break;
      case 'memory_warning':
        this.optimizeForMemory();
        break;
    }

    // 发送性能警告到分析服务
    this.reportPerformanceIssue(type, data);
  }

  /**
   * 针对掉帧优化
   */
  private optimizeForFrameDrops() {
    // 减少并发动画数量
    let animationsToOptimize = Math.max(1, Math.floor(this.activeAnimations.size * 0.3));
    
    for (const [id, animation] of this.activeAnimations) {
      if (animationsToOptimize <= 0) break;
      
      if (!this.isElementInViewport(animation.element)) {
        this.pauseAnimation(animation.element);
        animationsToOptimize--;
      }
    }
  }

  /**
   * 针对内存优化
   */
  private optimizeForMemory() {
    // 清理不活跃的动画
    for (const [id, animation] of this.activeAnimations) {
      if (!animation.isActive || performance.now() - animation.startTime > animation.duration) {
        this.unregisterAnimation(id);
      }
    }

    // 触发垃圾回收提示
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }

  /**
   * 设备特定优化
   */
  private setupDeviceSpecificOptimizations() {
    const deviceInfo = this.getDeviceInfo();
    
    if (deviceInfo.isMobile) {
      // 移动设备优化
      this.thresholds.maxConcurrentAnimations = 10;
      this.thresholds.minFPS = 30;
    }
    
    if (deviceInfo.isLowEnd) {
      // 低端设备优化
      this.thresholds.maxConcurrentAnimations = 5;
      this.thresholds.minFPS = 24;
      this.enableReducedMotion();
    }
  }

  /**
   * 获取设备信息
   */
  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    return {
      isMobile: /Mobile|Android|iPhone|iPad/.test(userAgent),
      isLowEnd: memory < 4 || cores < 4,
      memory,
      cores,
    };
  }

  /**
   * 启用减少动画模式
   */
  private enableReducedMotion() {
    document.documentElement.style.setProperty('--animation-duration-scale', '0.5');
    document.documentElement.classList.add('reduce-motion');
  }

  /**
   * 获取内存使用量
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * 跟踪动画开始
   */
  private trackAnimationStart(name: string) {
    if ('mark' in performance) {
      performance.mark(`animation-${name}-start`);
    }
  }

  /**
   * 跟踪动画结束
   */
  private trackAnimationEnd(name: string, duration: number) {
    if ('mark' in performance && 'measure' in performance) {
      performance.mark(`animation-${name}-end`);
      performance.measure(
        `animation-${name}`,
        `animation-${name}-start`,
        `animation-${name}-end`
      );
    }

    // 发送动画性能数据
    this.reportAnimationMetrics(name, duration);
  }

  /**
   * 跟踪动画性能
   */
  private trackAnimationPerformance(name: string, duration: number) {
    if (process.env.NODE_ENV === 'development') {
      // Debug log removed for production
    }
  }

  /**
   * 报告性能问题
   */
  private reportPerformanceIssue(type: string, data: any) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'animation_performance_issue', {
        event_category: 'Performance',
        issue_type: type,
        custom_parameter: JSON.stringify(data),
      });
    }
  }

  /**
   * 报告动画指标
   */
  private reportAnimationMetrics(name: string, duration: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'animation_completed', {
        event_category: 'Animation',
        animation_name: name,
        duration: Math.round(duration),
      });
    }
  }

  /**
   * 设置调试面板
   */
  private setupDebugPanel() {
    if (typeof window === 'undefined') return;

    // 创建调试面板
    const panel = document.createElement('div');
    panel.id = 'animation-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      min-width: 200px;
    `;

    document.body.appendChild(panel);

    // 定期更新调试信息
    setInterval(() => {
      const metrics = this.getCurrentMetrics();
      panel.innerHTML = `
        <div><strong>Animation Performance</strong></div>
        <div>FPS: ${metrics.fps}</div>
        <div>Frame Drops: ${metrics.frameDrops}</div>
        <div>Avg Frame Time: ${metrics.averageFrameTime}ms</div>
        <div>Active Animations: ${metrics.animationCount}</div>
        ${metrics.memoryUsage ? `<div>Memory: ${Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>` : ''}
      `;
    }, 1000);
  }

  /**
   * 停止监控
   */
  stop() {
    this.isMonitoring = false;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    // 清理调试面板
    const panel = document.getElementById('animation-debug-panel');
    if (panel) {
      panel.remove();
    }
  }

  /**
   * 重置性能数据
   */
  reset() {
    this.frameTimeHistory = [];
    this.frameCount = 0;
    this.lastFrameTime = 0;
    this.activeAnimations.clear();
  }
}

// 导出工具函数
export const animationPerformance = AnimationPerformanceManager.getInstance();

/**
 * 动画装饰器 - 自动性能跟踪
 */
export function withPerformanceTracking(animationName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const id = `${animationName}-${Date.now()}-${Math.random()}`;
      const element = args[0] as HTMLElement;
      const duration = args[1] as number || 1000;

      const canAnimate = animationPerformance.registerAnimation(
        id,
        animationName,
        element,
        duration
      );

      if (!canAnimate) {
        console.warn(`Animation ${animationName} skipped due to performance constraints`);
        return;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * 性能感知动画钩子
 */
export function usePerformanceAwareAnimation() {
  const metrics = animationPerformance.getCurrentMetrics();
  
  const shouldReduceMotion = 
    metrics.fps < 30 || 
    metrics.animationCount > 15 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getOptimizedDuration = (baseDuration: number) => {
    if (shouldReduceMotion) return baseDuration * 0.5;
    if (metrics.fps < 45) return baseDuration * 0.7;
    return baseDuration;
  };

  const getOptimizedEasing = (baseEasing: string) => {
    if (shouldReduceMotion) return 'linear';
    return baseEasing;
  };

  return {
    shouldReduceMotion,
    getOptimizedDuration,
    getOptimizedEasing,
    metrics,
  };
}

// 自动初始化
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      animationPerformance.init();
    });
  } else {
    animationPerformance.init();
  }
}