'use client';

import React, { useEffect, useRef, useState } from 'react';

// ===== Animation Performance Monitor =====

interface PerformanceMetrics {
  frameRate: number;
  dropCount: number;
  memoryUsage: number;
  animationCount: number;
  lastUpdate: number;
}

interface AnimationPerformanceConfig {
  enabled?: boolean;
  targetFrameRate?: number;
  memoryThreshold?: number;
  autoOptimize?: boolean;
  debugMode?: boolean;
}

class AnimationPerformanceMonitor {
  private static instance: AnimationPerformanceMonitor | null = null;
  private config: AnimationPerformanceConfig;
  private metrics: PerformanceMetrics;
  private frameCount = 0;
  private lastTime = 0;
  private rafId: number | null = null;
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];
  private activeAnimations = new Set<Animation>();

  constructor(config: AnimationPerformanceConfig = {}) {
    this.config = {
      enabled: true,
      targetFrameRate: 60,
      memoryThreshold: 50, // MB
      autoOptimize: true,
      debugMode: false,
      ...config,
    };

    this.metrics = {
      frameRate: 0,
      dropCount: 0,
      memoryUsage: 0,
      animationCount: 0,
      lastUpdate: Date.now(),
    };

    if (this.config.enabled) {
      this.startMonitoring();
    }
  }

  static getInstance(config?: AnimationPerformanceConfig): AnimationPerformanceMonitor {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor(config);
    }
    return AnimationPerformanceMonitor.instance;
  }

  private startMonitoring() {
    if (typeof window === 'undefined') return;

    const tick = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.updateMetrics(currentTime);
        this.lastTime = currentTime;
        this.frameCount = 0;
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  private updateMetrics(currentTime: number) {
    const frameRate = this.frameCount;
    const dropCount = Math.max(0, this.config.targetFrameRate! - frameRate);
    
    // 获取内存使用情况
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }

    this.metrics = {
      frameRate,
      dropCount,
      memoryUsage,
      animationCount: this.activeAnimations.size,
      lastUpdate: currentTime,
    };

    // 通知观察者
    this.observers.forEach(observer => observer(this.metrics));

    // 自动优化
    if (this.config.autoOptimize) {
      this.autoOptimize();
    }

    // 调试模式
    if (this.config.debugMode) {
      console.log('Animation Performance:', this.metrics);
    }
  }

  private autoOptimize() {
    const { frameRate, memoryUsage, animationCount } = this.metrics;
    const { targetFrameRate, memoryThreshold } = this.config;

    // 如果帧率过低或内存使用过高，进行优化
    if (frameRate < targetFrameRate! * 0.8 || memoryUsage > memoryThreshold!) {
      this.optimizeAnimations();
    }
  }

  private optimizeAnimations() {
    // 1. 减少动画复杂度
    this.activeAnimations.forEach(animation => {
      if (animation.effect instanceof KeyframeEffect) {
        const effect = animation.effect;
        
        // 降低动画质量以提升性能
        if (effect.composite === 'replace') {
          effect.composite = 'add'; // 使用更高效的合成模式
        }
      }
    });

    // 2. 暂停非关键动画
    if (this.metrics.animationCount > 10) {
      let pauseCount = 0;
      this.activeAnimations.forEach(animation => {
        if (pauseCount < 5 && animation.playState === 'running') {
          animation.pause();
          pauseCount++;
        }
      });
    }

    // 3. 建议开发者进行优化
    if (this.config.debugMode) {
      console.warn('Performance optimization triggered:', {
        frameRate: this.metrics.frameRate,
        memoryUsage: this.metrics.memoryUsage,
        animationCount: this.metrics.animationCount,
      });
    }
  }

  registerAnimation(animation: Animation) {
    this.activeAnimations.add(animation);
    
    animation.addEventListener('finish', () => {
      this.activeAnimations.delete(animation);
    });

    animation.addEventListener('cancel', () => {
      this.activeAnimations.delete(animation);
    });
  }

  subscribe(observer: (metrics: PerformanceMetrics) => void) {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.activeAnimations.clear();
    this.observers = [];
    AnimationPerformanceMonitor.instance = null;
  }
}

// ===== Performance Hook =====

export const useAnimationPerformance = (config?: AnimationPerformanceConfig) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    frameRate: 0,
    dropCount: 0,
    memoryUsage: 0,
    animationCount: 0,
    lastUpdate: Date.now(),
  });

  const monitorRef = useRef<AnimationPerformanceMonitor | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    monitorRef.current = AnimationPerformanceMonitor.getInstance(config);
    
    const unsubscribe = monitorRef.current.subscribe(setMetrics);

    return unsubscribe;
  }, [config]);

  const registerAnimation = (animation: Animation) => {
    if (monitorRef.current) {
      monitorRef.current.registerAnimation(animation);
    }
  };

  return {
    metrics,
    registerAnimation,
    monitor: monitorRef.current,
  };
};

// ===== Performance Optimized Animation Hook =====

interface OptimizedAnimationOptions {
  reducedMotion?: boolean;
  performanceMode?: 'auto' | 'high' | 'balanced' | 'battery';
  maxConcurrent?: number;
}

export const useOptimizedAnimation = (options: OptimizedAnimationOptions = {}) => {
  const { metrics, registerAnimation } = useAnimationPerformance();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    // 检查用户偏好
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || options.reducedMotion) {
        setShouldAnimate(false);
        return;
      }
    }

    // 根据性能指标调整动画质量
    const { frameRate, memoryUsage, animationCount } = metrics;
    
    if (frameRate < 30 || memoryUsage > 100 || animationCount > 20) {
      setQuality('low');
    } else if (frameRate < 45 || memoryUsage > 75 || animationCount > 15) {
      setQuality('medium');
    } else {
      setQuality('high');
    }

    // 根据性能模式调整
    switch (options.performanceMode) {
      case 'battery':
        setQuality('low');
        break;
      case 'balanced':
        setQuality(quality === 'high' ? 'medium' : quality);
        break;
      case 'high':
        setQuality('high');
        break;
      default:
        // 'auto' - 使用上面的逻辑
        break;
    }

    // 限制并发动画数量
    if (options.maxConcurrent && animationCount > options.maxConcurrent) {
      setShouldAnimate(false);
    } else {
      setShouldAnimate(true);
    }
  }, [metrics, options, quality]);

  const getOptimizedConfig = (baseConfig: any = {}) => {
    if (!shouldAnimate) {
      return { ...baseConfig, duration: 0 };
    }

    switch (quality) {
      case 'low':
        return {
          ...baseConfig,
          duration: (baseConfig.duration || 600) * 0.5,
          easing: 'linear',
        };
      case 'medium':
        return {
          ...baseConfig,
          duration: (baseConfig.duration || 600) * 0.75,
        };
      default:
        return baseConfig;
    }
  };

  return {
    shouldAnimate,
    quality,
    getOptimizedConfig,
    registerAnimation,
    metrics,
  };
};

// ===== Performance Debug Component =====

interface PerformanceDebugProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  enabled?: boolean;
}

export const PerformanceDebug: React.FC<PerformanceDebugProps> = ({
  position = 'top-right',
  enabled = false,
}) => {
  const { metrics } = useAnimationPerformance({ debugMode: enabled });
  const [isVisible, setIsVisible] = useState(enabled);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'P' && e.ctrlKey && e.shiftKey) {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible || typeof window === 'undefined') return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getFrameRateColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-500';
    if (memory < 100) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999] bg-black/80 text-white p-3 rounded-lg text-xs font-mono backdrop-blur-sm`}>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span>FPS:</span>
          <span className={getFrameRateColor(metrics.frameRate)}>
            {metrics.frameRate.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Drops:</span>
          <span className={metrics.dropCount > 0 ? 'text-red-500' : 'text-green-500'}>
            {metrics.dropCount}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Memory:</span>
          <span className={getMemoryColor(metrics.memoryUsage)}>
            {metrics.memoryUsage.toFixed(1)}MB
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Animations:</span>
          <span className={metrics.animationCount > 10 ? 'text-yellow-500' : 'text-green-500'}>
            {metrics.animationCount}
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

// ===== Export =====

export {
  AnimationPerformanceMonitor,
  type PerformanceMetrics,
  type AnimationPerformanceConfig,
};