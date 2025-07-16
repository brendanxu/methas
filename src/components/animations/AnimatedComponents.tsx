'use client'

import React, { forwardRef, useEffect, useState, useRef } from 'react'
import { 
  Motion, 
  FadeIn as EnhancedFadeIn,
  SlideUp as EnhancedSlideUp,
  ScaleIn as EnhancedScaleIn,
  AnimatedButton as EnhancedAnimatedButton,
  AnimatedCard as EnhancedAnimatedCard,
  PageTransition,
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage
} from './EnhancedMotion'
import { useInViewAnimation, AnimationType } from '@/lib/enhanced-animations'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

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
    animation = 'fadeIn', 
    delay = 0, 
    once = true, 
    threshold = 0.1, 
    rootMargin = '0px',
    disabled = false,
    duration = 300,
    custom,
    ...props 
  }, ref) => {
    const { ref: observerRef, isIntersecting, hasIntersected } = useIntersectionObserver({
      threshold,
      rootMargin,
    })

    const shouldAnimate = !disabled && (once ? hasIntersected : isIntersecting)

    if (disabled) {
      return (
        <div ref={observerRef} className={className} {...props}>
          {children}
        </div>
      )
    }

    return (
      <Motion.div
        ref={observerRef}
        className={className}
        whileInView={shouldAnimate ? animation : undefined}
        viewport={{ threshold }}
        transition={{ duration, delay }}
        {...props}
      >
        {children}
      </Motion.div>
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
  duration = 300
}) => (
  <EnhancedFadeIn className={className} delay={delay}>
    {children}
  </EnhancedFadeIn>
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
  duration = 300
}) => {
  const animationMap: Record<string, AnimationType> = {
    up: 'slideUp',
    down: 'slideDown', 
    left: 'slideLeft',
    right: 'slideRight'
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
  duration = 300
}) => {
  const animationMap: Record<string, AnimationType> = {
    in: 'scaleIn',
    out: 'scaleOut',
    bounce: 'bounce'
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
  variant?: 'default' | 'scale' | 'lift' | 'glow' | 'primary' | 'secondary' | 'outline'
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
  // 如果是新的变体，使用增强版按钮
  if (['primary', 'secondary', 'outline'].includes(variant)) {
    return (
      <EnhancedAnimatedButton
        className={className}
        variant={variant as 'primary' | 'secondary' | 'outline'}
        onClick={onClick}
      >
        {children}
      </EnhancedAnimatedButton>
    )
  }

  const baseClasses = 'transition-all duration-200 ease-in-out'
  const variantClasses = {
    default: 'hover:opacity-80',
    scale: 'hover-scale',
    lift: 'hover-lift', 
    glow: 'hover-glow'
  }

  return (
    <Motion.div
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? undefined : "scaleIn"}
      whileTap={disabled ? undefined : "pulse"}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}
    >
      {children}
    </Motion.div>
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
    if (!isIntersecting) {
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
    <Motion.span ref={ref} className={className} whileInView="fadeIn">
      {formatter(count)}
    </Motion.span>
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
    if (!isIntersecting) {
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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Motion.div
        initial="fadeOut"
        animate="fadeIn"
        exit="fadeOut"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      >
        <div />
      </Motion.div>
      <Motion.div
        initial="scaleOut"
        animate="scaleIn"
        exit="scaleOut"
        transition={{ duration: 300 }}
        className={`relative bg-white rounded-lg p-6 ${className}`}
      >
        {children}
      </Motion.div>
    </div>
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
  staggerDelay = 100,
  className = ''
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Motion.div
          key={index}
          whileInView="slideUp"
          viewport={{ threshold: 0.1 }}
          transition={{ delay: index * staggerDelay, duration: 400 }}
        >
          {child}
        </Motion.div>
      ))}
    </div>
  )
}

// 导出增强版组件
export { 
  EnhancedFadeIn as FadeInLegacy,
  EnhancedSlideUp as SlideUpLegacy,
  EnhancedScaleIn as ScaleInLegacy,
  EnhancedAnimatedCard as AnimatedCardLegacy,
  Motion,
  PageTransition,
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage
}

export type { AnimationType }