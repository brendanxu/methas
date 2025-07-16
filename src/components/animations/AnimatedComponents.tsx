'use client'

import React, { forwardRef, useEffect, useState, useRef } from 'react'
import { 
  Motion, 
  AnimatePresence, 
  FadeIn as LWFadeIn,
  SlideUp as LWSlideUp,
  ScaleIn as LWScaleIn,
  SlideInFromLeft as LWSlideInFromLeft,
  SlideInFromRight as LWSlideInFromRight,
  StaggerContainer,
  ScrollTrigger,
  AnimationType
} from './LightweightMotion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { shouldEnableAnimations } from '@/lib/lightweight-animations'

// 基础动画组件类型
interface BaseAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
  threshold?: number
  rootMargin?: string
}

// 动画容器属性
interface AnimatedContainerProps extends BaseAnimationProps {
  animation?: AnimationType
  custom?: any
  disabled?: boolean
  duration?: number
}

/**
 * 通用动画容器
 */
export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ 
    children, 
    className, 
    animation = 'fade-in', 
    delay = 0, 
    once = true, 
    threshold = 0.1, 
    rootMargin = '0px',
    disabled = false,
    duration = 0.3,
    custom,
    ...props 
  }, ref) => {
    const { ref: observerRef, isIntersecting, hasIntersected } = useIntersectionObserver({
      threshold,
      rootMargin,
    })

    const shouldAnimate = !disabled && (once ? hasIntersected : isIntersecting) && shouldEnableAnimations()

    if (disabled || !shouldEnableAnimations()) {
      return (
        <div ref={observerRef} className={className} {...props}>
          {children}
        </div>
      )
    }

    return (
      <Motion
        ref={observerRef}
        className={className}
        whileInView={shouldAnimate ? animation : undefined}
        viewport={{ once, amount: threshold }}
        transition={{ duration, delay }}
        {...props}
      >
        {children}
      </Motion>
    )
  }
)

AnimatedContainer.displayName = 'AnimatedContainer'

/**
 * 淡入组件
 */
export const FadeIn: React.FC<BaseAnimationProps & { duration?: number }> = ({ 
  children, 
  className, 
  delay = 0, 
  once = true, 
  threshold = 0.1, 
  rootMargin = '0px',
  duration = 0.3
}) => (
  <LWFadeIn delay={delay} duration={duration}>
    <div className={className}>
      {children}
    </div>
  </LWFadeIn>
)

/**
 * 滑动方向组件
 */
interface SlideProps extends BaseAnimationProps {
  direction: 'up' | 'down' | 'left' | 'right'
  duration?: number
}

export const Slide: React.FC<SlideProps> = ({ 
  children, 
  className, 
  direction, 
  delay = 0, 
  once = true, 
  threshold = 0.1,
  duration = 0.3
}) => {
  const animationMap: Record<string, AnimationType> = {
    up: 'slide-up',
    down: 'slide-down', 
    left: 'slide-left',
    right: 'slide-right'
  }

  return (
    <AnimatedContainer
      animation={animationMap[direction]}
      className={className}
      delay={delay}
      once={once}
      threshold={threshold}
      duration={duration}
    >
      {children}
    </AnimatedContainer>
  )
}

/**
 * 缩放变体组件
 */
interface ScaleProps extends BaseAnimationProps {
  variant: 'in' | 'out' | 'bounce'
  duration?: number
}

export const Scale: React.FC<ScaleProps> = ({ 
  children, 
  className, 
  variant, 
  delay = 0, 
  once = true, 
  threshold = 0.1,
  duration = 0.3
}) => {
  const animationMap: Record<string, AnimationType> = {
    in: 'scale-in',
    out: 'scale-out',
    bounce: 'bounce-in'
  }

  return (
    <AnimatedContainer
      animation={animationMap[variant]}
      className={className}
      delay={delay}
      once={once}
      threshold={threshold}
      duration={duration}
    >
      {children}
    </AnimatedContainer>
  )
}

/**
 * 按钮动画组件
 */
interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'scale' | 'lift' | 'glow'
  disabled?: boolean
  onClick?: () => void
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  disabled = false,
  onClick,
}) => {
  const baseClasses = 'transition-all duration-200 ease-in-out'
  const variantClasses = {
    default: 'hover:opacity-80',
    scale: 'hover-scale',
    lift: 'hover-lift', 
    glow: 'hover-glow'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={{
        transform: 'scale(1)',
        transition: 'transform 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'scale') {
          e.currentTarget.style.transform = 'scale(1.05)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)'
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.95)'
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = variant === 'scale' ? 'scale(1.05)' : 'scale(1)'
        }
      }}
    >
      {children}
    </button>
  )
}

/**
 * 计数器动画组件
 */
interface CounterProps {
  from: number
  to: number
  duration?: number
  className?: string
  formatter?: (value: number) => string
}

export const AnimatedCounter: React.FC<CounterProps> = ({
  from,
  to,
  duration = 2,
  className,
  formatter = (value) => Math.round(value).toString()
}) => {
  const [count, setCount] = useState(from)
  const { ref, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (!isIntersecting || !shouldEnableAnimations()) {
      setCount(to)
      return
    }

    const startTime = Date.now()
    const difference = to - from

    const updateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      // 使用缓动函数
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentCount = from + (difference * easeOutCubic)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [from, to, duration, isIntersecting])

  return (
    <span ref={ref} className={className}>
      {formatter(count)}
    </span>
  )
}

/**
 * 进度条动画组件
 */
interface ProgressBarProps {
  progress: number
  className?: string
  barClassName?: string
  duration?: number
  showLabel?: boolean
}

export const AnimatedProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  barClassName = '',
  duration = 1.5,
  showLabel = false
}) => {
  const { ref, isIntersecting } = useIntersectionObserver()

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-primary rounded-full transition-all ${barClassName}`}
          style={{
            width: isIntersecting ? `${progress}%` : '0%',
            transitionDuration: `${duration}s`,
            transitionTimingFunction: 'ease-out'
          }}
        />
      </div>
      {showLabel && (
        <AnimatedCounter
          from={0}
          to={progress}
          duration={duration}
          className="absolute right-0 top-0 text-sm font-medium"
          formatter={(value) => `${Math.round(value)}%`}
        />
      )}
    </div>
  )
}

/**
 * 类型写字机效果组件
 */
interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  cursor?: boolean
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  className = '',
  cursor = true
}) => {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const { ref, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (!isIntersecting || !shouldEnableAnimations()) {
      setDisplayText(text)
      setShowCursor(false)
      return
    }

    let index = 0
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index))
        index++
      } else {
        clearInterval(timer)
        if (cursor) {
          setInterval(() => {
            setShowCursor(prev => !prev)
          }, 500)
        } else {
          setShowCursor(false)
        }
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, isIntersecting, cursor])

  return (
    <span ref={ref} className={className}>
      {displayText}
      {cursor && <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>}
    </span>
  )
}

/**
 * 模态框动画组件
 */
interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  children,
  className = ''
}) => {
  if (!shouldEnableAnimations()) {
    return isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className={`relative bg-white rounded-lg p-6 ${className}`}>
          {children}
        </div>
      </div>
    ) : null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Motion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          >
            <div />
          </Motion>
          <Motion
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-white rounded-lg p-6 ${className}`}
          >
            {children}
          </Motion>
        </div>
      )}
    </AnimatePresence>
  )
}

/**
 * 序列动画组件
 */
interface SequenceAnimationProps {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}

export const SequenceAnimation: React.FC<SequenceAnimationProps> = ({
  children,
  staggerDelay = 0.1,
  className = ''
}) => {
  return (
    <StaggerContainer staggerDelay={staggerDelay} className={className}>
      {children.map((child, index) => (
        <Motion
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="animate-fade-in"
          style={{ animationDelay: `${index * staggerDelay}s` }}
        >
          {child}
        </Motion>
      ))}
    </StaggerContainer>
  )
}

// 导出预设组件以保持向后兼容
export { 
  LWFadeIn as FadeInLegacy,
  LWSlideUp as SlideUpLegacy,
  LWScaleIn as ScaleInLegacy,
  LWSlideInFromLeft as SlideInFromLeftLegacy,
  LWSlideInFromRight as SlideInFromRightLegacy,
  Motion,
  AnimatePresence,
  ScrollTrigger
}

export type { AnimationType }