/**
 * 增强版轻量级动画系统
 * 替代Framer Motion，提供流畅的用户体验
 */

import { useEffect, useRef, useState, useCallback } from 'react'

// 动画类型定义
export type AnimationType = 
  | 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown' 
  | 'slideLeft' | 'slideRight' | 'scaleIn' | 'scaleOut'
  | 'bounce' | 'shake' | 'pulse' | 'rotate'
  | 'flipX' | 'flipY' | 'zoomIn' | 'zoomOut'

// 动画配置
export interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: string
  iterations?: number
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
}

// 默认配置
const defaultConfig: Required<AnimationConfig> = {
  duration: 300,
  delay: 0,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  iterations: 1,
  fillMode: 'both',
  direction: 'normal'
}

// 动画关键帧定义
const animationKeyframes: Record<AnimationType, Keyframe[]> = {
  fadeIn: [
    { opacity: 0 },
    { opacity: 1 }
  ],
  fadeOut: [
    { opacity: 1 },
    { opacity: 0 }
  ],
  slideUp: [
    { transform: 'translateY(20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  slideDown: [
    { transform: 'translateY(-20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  slideLeft: [
    { transform: 'translateX(20px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ],
  slideRight: [
    { transform: 'translateX(-20px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ],
  scaleIn: [
    { transform: 'scale(0.8)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 }
  ],
  scaleOut: [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(0.8)', opacity: 0 }
  ],
  bounce: [
    { transform: 'translateY(0)' },
    { transform: 'translateY(-10px)', offset: 0.5 },
    { transform: 'translateY(0)' }
  ],
  shake: [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-5px)', offset: 0.25 },
    { transform: 'translateX(5px)', offset: 0.75 },
    { transform: 'translateX(0)' }
  ],
  pulse: [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(1.05)', opacity: 0.8, offset: 0.5 },
    { transform: 'scale(1)', opacity: 1 }
  ],
  rotate: [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ],
  flipX: [
    { transform: 'rotateX(0deg)' },
    { transform: 'rotateX(180deg)' }
  ],
  flipY: [
    { transform: 'rotateY(0deg)' },
    { transform: 'rotateY(180deg)' }
  ],
  zoomIn: [
    { transform: 'scale(0)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 }
  ],
  zoomOut: [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(0)', opacity: 0 }
  ]
}

// 性能优化的动画执行器
export class AnimationEngine {
  private static instance: AnimationEngine
  private animationQueue: Map<HTMLElement, Animation[]> = new Map()
  private observers: IntersectionObserver[] = []

  static getInstance(): AnimationEngine {
    if (!AnimationEngine.instance) {
      AnimationEngine.instance = new AnimationEngine()
    }
    return AnimationEngine.instance
  }

  // 执行动画
  animate(
    element: HTMLElement,
    type: AnimationType,
    config: AnimationConfig = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      const finalConfig = { ...defaultConfig, ...config }
      
      // 停止现有动画
      this.stopAnimations(element)
      
      // 创建新动画
      const animation = element.animate(
        animationKeyframes[type],
        {
          duration: finalConfig.duration,
          delay: finalConfig.delay,
          easing: finalConfig.easing,
          iterations: finalConfig.iterations,
          fill: finalConfig.fillMode,
          direction: finalConfig.direction
        }
      )
      
      // 记录动画
      const animations = this.animationQueue.get(element) || []
      animations.push(animation)
      this.animationQueue.set(element, animations)
      
      // 监听完成
      animation.addEventListener('finish', () => {
        this.cleanupAnimation(element, animation)
        resolve()
      })
      
      animation.addEventListener('cancel', () => {
        this.cleanupAnimation(element, animation)
        resolve()
      })
    })
  }

  // 停止元素的所有动画
  stopAnimations(element: HTMLElement): void {
    const animations = this.animationQueue.get(element) || []
    animations.forEach(animation => {
      animation.cancel()
    })
    this.animationQueue.delete(element)
  }

  // 清理单个动画
  private cleanupAnimation(element: HTMLElement, animation: Animation): void {
    const animations = this.animationQueue.get(element) || []
    const index = animations.indexOf(animation)
    if (index > -1) {
      animations.splice(index, 1)
      if (animations.length === 0) {
        this.animationQueue.delete(element)
      } else {
        this.animationQueue.set(element, animations)
      }
    }
  }

  // 创建视口观察器（用于进入动画）
  createViewportObserver(
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(callback)
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
      }
    )
    
    this.observers.push(observer)
    return observer
  }

  // 销毁所有观察器
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.animationQueue.clear()
  }
}

// React Hook for animations
export const useAnimation = () => {
  const engine = AnimationEngine.getInstance()
  
  const animate = useCallback(
    (element: HTMLElement, type: AnimationType, config?: AnimationConfig) => {
      return engine.animate(element, type, config)
    },
    [engine]
  )
  
  const stopAnimations = useCallback(
    (element: HTMLElement) => {
      engine.stopAnimations(element)
    },
    [engine]
  )
  
  return { animate, stopAnimations }
}

// 自动进入动画Hook
export const useInViewAnimation = (
  type: AnimationType,
  config?: AnimationConfig,
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { animate } = useAnimation()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = AnimationEngine.getInstance().createViewportObserver(
      (entry) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          animate(element, type, config)
        }
      },
      options
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [animate, type, config, options, isVisible])

  return { ref, isVisible }
}

// 页面过渡动画Hook
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { animate } = useAnimation()

  const startTransition = useCallback(async (element: HTMLElement) => {
    setIsTransitioning(true)
    await animate(element, 'fadeOut', { duration: 200 })
  }, [animate])

  const completeTransition = useCallback(async (element: HTMLElement) => {
    await animate(element, 'fadeIn', { duration: 200 })
    setIsTransitioning(false)
  }, [animate])

  return { isTransitioning, startTransition, completeTransition }
}

// 预定义的动画组合
export const animationPresets = {
  // 页面进入动画
  pageEnter: {
    type: 'slideUp' as AnimationType,
    config: { duration: 400, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
  },
  
  // 卡片悬停动画
  cardHover: {
    type: 'scaleIn' as AnimationType,
    config: { duration: 200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
  },
  
  // 按钮点击动画
  buttonClick: {
    type: 'pulse' as AnimationType,
    config: { duration: 150, easing: 'ease-out' }
  },
  
  // 错误提示动画
  errorShake: {
    type: 'shake' as AnimationType,
    config: { duration: 500, easing: 'ease-in-out' }
  },
  
  // 成功提示动画
  successBounce: {
    type: 'bounce' as AnimationType,
    config: { duration: 600, easing: 'ease-out' }
  }
}