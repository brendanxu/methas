/**
 * 轻量级动画系统
 * 使用纯CSS动画替代Framer Motion
 */

// 动画持续时间配置
export const ANIMATION_DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  very_slow: '800ms'
} as const

// 缓动函数
export const ANIMATION_EASINGS = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  cubic: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
} as const

// 动画类型
export type AnimationType = 
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'scale-out'
  | 'bounce-in'
  | 'zoom-in'
  | 'zoom-out'
  | 'rotate-in'
  | 'flip-in'
  | 'wobble'
  | 'pulse'
  | 'shake'

// 动画配置
export interface AnimationConfig {
  name: string
  duration: string
  easing: string
  delay?: string
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none'
  iterationCount?: number | 'infinite'
}

// 预定义动画配置
export const ANIMATION_PRESETS: Record<AnimationType, AnimationConfig> = {
  'fade-in': {
    name: 'fadeIn',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.ease,
    fillMode: 'forwards'
  },
  'fade-out': {
    name: 'fadeOut',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.ease,
    fillMode: 'forwards'
  },
  'slide-up': {
    name: 'slideUp',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.cubic,
    fillMode: 'forwards'
  },
  'slide-down': {
    name: 'slideDown',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.cubic,
    fillMode: 'forwards'
  },
  'slide-left': {
    name: 'slideLeft',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.cubic,
    fillMode: 'forwards'
  },
  'slide-right': {
    name: 'slideRight',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.cubic,
    fillMode: 'forwards'
  },
  'scale-in': {
    name: 'scaleIn',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.bounce,
    fillMode: 'forwards'
  },
  'scale-out': {
    name: 'scaleOut',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.ease,
    fillMode: 'forwards'
  },
  'bounce-in': {
    name: 'bounceIn',
    duration: ANIMATION_DURATIONS.slow,
    easing: ANIMATION_EASINGS.bounce,
    fillMode: 'forwards'
  },
  'zoom-in': {
    name: 'zoomIn',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.cubic,
    fillMode: 'forwards'
  },
  'zoom-out': {
    name: 'zoomOut',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.cubic,
    fillMode: 'forwards'
  },
  'rotate-in': {
    name: 'rotateIn',
    duration: ANIMATION_DURATIONS.slow,
    easing: ANIMATION_EASINGS.cubic,
    fillMode: 'forwards'
  },
  'flip-in': {
    name: 'flipIn',
    duration: ANIMATION_DURATIONS.slow,
    easing: ANIMATION_EASINGS.cubic,
    fillMode: 'forwards'
  },
  'wobble': {
    name: 'wobble',
    duration: ANIMATION_DURATIONS.slow,
    easing: ANIMATION_EASINGS.ease,
    iterationCount: 1
  },
  'pulse': {
    name: 'pulse',
    duration: '2s',
    easing: ANIMATION_EASINGS.ease,
    iterationCount: 'infinite'
  },
  'shake': {
    name: 'shake',
    duration: ANIMATION_DURATIONS.normal,
    easing: ANIMATION_EASINGS.ease,
    iterationCount: 1
  }
}

/**
 * 生成CSS动画样式
 */
export function createAnimationStyle(config: AnimationConfig): string {
  const animation = [
    config.name,
    config.duration,
    config.easing,
    config.delay || '0s',
    config.iterationCount || '1',
    config.fillMode || 'none'
  ].join(' ')
  
  return `animation: ${animation};`
}

/**
 * 应用动画到元素
 */
export function applyAnimation(
  element: HTMLElement, 
  animationType: AnimationType,
  options?: Partial<AnimationConfig>
): Promise<void> {
  return new Promise((resolve) => {
    const config = { ...ANIMATION_PRESETS[animationType], ...options }
    
    // 应用动画样式
    element.style.animation = [
      config.name,
      config.duration,
      config.easing,
      config.delay || '0s',
      config.iterationCount || '1',
      config.fillMode || 'none'
    ].join(' ')
    
    // 监听动画结束
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd)
      resolve()
    }
    
    element.addEventListener('animationend', handleAnimationEnd)
  })
}

/**
 * 检查是否应该启用动画（考虑用户偏好）
 */
export function shouldEnableAnimations(): boolean {
  if (typeof window === 'undefined') return false
  
  // 检查用户是否设置了减少动画偏好
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return !prefersReducedMotion
}

/**
 * 创建响应式动画
 */
export function createResponsiveAnimation(
  animationType: AnimationType,
  options?: {
    mobile?: Partial<AnimationConfig>
    tablet?: Partial<AnimationConfig>
    desktop?: Partial<AnimationConfig>
  }
): AnimationConfig {
  const baseConfig = ANIMATION_PRESETS[animationType]
  
  // 在客户端环境中检测屏幕尺寸
  if (typeof window !== 'undefined') {
    const width = window.innerWidth
    
    if (width < 768 && options?.mobile) {
      return { ...baseConfig, ...options.mobile }
    } else if (width < 1024 && options?.tablet) {
      return { ...baseConfig, ...options.tablet }
    } else if (options?.desktop) {
      return { ...baseConfig, ...options.desktop }
    }
  }
  
  return baseConfig
}

/**
 * 序列动画执行器
 */
export class AnimationSequence {
  private elements: Array<{
    element: HTMLElement
    animation: AnimationType
    delay?: number
    options?: Partial<AnimationConfig>
  }> = []
  
  add(
    element: HTMLElement, 
    animation: AnimationType, 
    delay: number = 0,
    options?: Partial<AnimationConfig>
  ): this {
    this.elements.push({ element, animation, delay, options })
    return this
  }
  
  async play(): Promise<void> {
    for (const item of this.elements) {
      if (item.delay && item.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, item.delay))
      }
      
      if (shouldEnableAnimations()) {
        await applyAnimation(item.element, item.animation, item.options)
      }
    }
  }
  
  clear(): this {
    this.elements = []
    return this
  }
}

/**
 * 交错动画（多个元素依次执行相同动画）
 */
export async function staggerAnimation(
  elements: HTMLElement[],
  animationType: AnimationType,
  staggerDelay: number = 100,
  options?: Partial<AnimationConfig>
): Promise<void> {
  if (!shouldEnableAnimations()) return
  
  const promises = elements.map((element, index) => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        await applyAnimation(element, animationType, options)
        resolve()
      }, index * staggerDelay)
    })
  })
  
  await Promise.all(promises)
}

/**
 * 滚动触发动画管理器
 */
export class ScrollAnimationManager {
  private observer: IntersectionObserver | null = null
  private animations: Map<HTMLElement, {
    animation: AnimationType
    options?: Partial<AnimationConfig>
    threshold?: number
  }> = new Map()
  
  constructor() {
    if (typeof window !== 'undefined' && shouldEnableAnimations()) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const config = this.animations.get(entry.target as HTMLElement)
              if (config) {
                applyAnimation(
                  entry.target as HTMLElement,
                  config.animation,
                  config.options
                )
                this.observer?.unobserve(entry.target)
              }
            }
          })
        },
        { threshold: 0.1 }
      )
    }
  }
  
  observe(
    element: HTMLElement,
    animation: AnimationType,
    options?: Partial<AnimationConfig>,
    threshold: number = 0.1
  ): void {
    if (!this.observer || !shouldEnableAnimations()) return
    
    this.animations.set(element, { animation, options, threshold })
    this.observer.observe(element)
  }
  
  unobserve(element: HTMLElement): void {
    if (!this.observer) return
    
    this.animations.delete(element)
    this.observer.unobserve(element)
  }
  
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.animations.clear()
  }
}

/**
 * 悬停动画工具
 */
export function setupHoverAnimation(
  element: HTMLElement,
  hoverAnimation: AnimationType,
  leaveAnimation?: AnimationType,
  options?: Partial<AnimationConfig>
): () => void {
  if (!shouldEnableAnimations()) return () => {}
  
  const handleMouseEnter = () => {
    applyAnimation(element, hoverAnimation, options)
  }
  
  const handleMouseLeave = () => {
    if (leaveAnimation) {
      applyAnimation(element, leaveAnimation, options)
    }
  }
  
  element.addEventListener('mouseenter', handleMouseEnter)
  element.addEventListener('mouseleave', handleMouseLeave)
  
  // 返回清理函数
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * 性能优化的动画类
 */
export class OptimizedAnimation {
  private static rafId: number | null = null
  private static pendingAnimations: Array<() => void> = []
  
  static schedule(callback: () => void): void {
    this.pendingAnimations.push(callback)
    
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        const animations = [...this.pendingAnimations]
        this.pendingAnimations = []
        this.rafId = null
        
        animations.forEach(callback => callback())
      })
    }
  }
  
  static cancel(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
      this.pendingAnimations = []
    }
  }
}