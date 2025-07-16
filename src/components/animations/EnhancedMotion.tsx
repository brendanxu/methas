/**
 * 增强版动画组件系统
 * 提供类似Framer Motion的API，但更轻量和高性能
 */

import React, { forwardRef, useEffect, useRef, useImperativeHandle, ReactNode } from 'react'
import { AnimationType, AnimationConfig, useAnimation, useInViewAnimation, animationPresets } from '@/lib/enhanced-animations'

// 动画变体定义
export interface MotionVariant {
  initial?: {
    opacity?: number
    scale?: number
    x?: number
    y?: number
    rotate?: number
  }
  animate?: {
    opacity?: number
    scale?: number
    x?: number
    y?: number
    rotate?: number
  }
  exit?: {
    opacity?: number
    scale?: number
    x?: number
    y?: number
    rotate?: number
  }
  transition?: AnimationConfig
}

// 基础动画Props
interface BaseMotionProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (event: React.MouseEvent) => void
  onMouseEnter?: (event: React.MouseEvent) => void
  onMouseLeave?: (event: React.MouseEvent) => void
  // 动画配置
  initial?: AnimationType | MotionVariant['initial']
  animate?: AnimationType | MotionVariant['animate']
  exit?: AnimationType | MotionVariant['exit']
  transition?: AnimationConfig
  // 视口动画
  whileInView?: AnimationType | MotionVariant['animate']
  viewport?: IntersectionObserverInit
  // 交互动画
  whileHover?: AnimationType | MotionVariant['animate']
  whileTap?: AnimationType | MotionVariant['animate']
  whileFocus?: AnimationType | MotionVariant['animate']
  // 自定义动画
  custom?: string
  preset?: keyof typeof animationPresets
}

// 将变体转换为动画类型
const variantToAnimationType = (variant: MotionVariant['initial'] | MotionVariant['animate']): AnimationType => {
  if (!variant) return 'fadeIn'
  
  if (variant.opacity !== undefined) {
    return variant.opacity === 0 ? 'fadeOut' : 'fadeIn'
  }
  
  if (variant.scale !== undefined) {
    return variant.scale < 1 ? 'scaleOut' : 'scaleIn'
  }
  
  if (variant.y !== undefined) {
    return variant.y > 0 ? 'slideDown' : 'slideUp'
  }
  
  if (variant.x !== undefined) {
    return variant.x > 0 ? 'slideRight' : 'slideLeft'
  }
  
  if (variant.rotate !== undefined) {
    return 'rotate'
  }
  
  return 'fadeIn'
}

// 基础动画组件
const BaseMotion = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ 
    children, 
    className = '', 
    style, 
    onClick, 
    onMouseEnter, 
    onMouseLeave,
    initial, 
    animate, 
    exit, 
    transition,
    whileInView,
    viewport,
    whileHover,
    whileTap,
    whileFocus,
    custom,
    preset,
    ...props 
  }, ref) => {
    const elementRef = useRef<HTMLDivElement>(null)
    const { animate: runAnimation } = useAnimation()
    const isHovered = useRef(false)
    const isFocused = useRef(false)

    // 合并refs
    useImperativeHandle(ref, () => elementRef.current!, [])

    // 初始化动画
    useEffect(() => {
      const element = elementRef.current
      if (!element) return

      // 使用预设
      if (preset) {
        const presetConfig = animationPresets[preset]
        runAnimation(element, presetConfig.type, presetConfig.config)
        return
      }

      // 初始动画
      if (initial && typeof initial === 'string') {
        runAnimation(element, initial, transition)
      } else if (initial && typeof initial === 'object') {
        const animType = variantToAnimationType(initial)
        runAnimation(element, animType, transition)
      }

      // 自动执行animate
      if (animate) {
        setTimeout(() => {
          if (typeof animate === 'string') {
            runAnimation(element, animate, transition)
          } else if (typeof animate === 'object') {
            const animType = variantToAnimationType(animate)
            runAnimation(element, animType, transition)
          }
        }, 50)
      }
    }, [initial, animate, transition, preset, runAnimation])

    // 视口动画
    const { ref: viewportRef } = useInViewAnimation(
      whileInView 
        ? (typeof whileInView === 'string' ? whileInView : variantToAnimationType(whileInView))
        : 'fadeIn',
      transition,
      viewport
    )

    // 合并视口ref
    useEffect(() => {
      if (whileInView && elementRef.current) {
        // 视口ref已通过useInViewAnimation处理
      }
    }, [whileInView])

    // 交互事件处理
    const handleMouseEnter = (e: React.MouseEvent) => {
      isHovered.current = true
      if (whileHover && elementRef.current) {
        const animType = typeof whileHover === 'string' ? whileHover : variantToAnimationType(whileHover)
        runAnimation(elementRef.current, animType, { duration: 200 })
      }
      onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent) => {
      isHovered.current = false
      if (whileHover && elementRef.current) {
        // 恢复到原始状态
        runAnimation(elementRef.current, 'fadeIn', { duration: 200 })
      }
      onMouseLeave?.(e)
    }

    const handleClick = (e: React.MouseEvent) => {
      if (whileTap && elementRef.current) {
        const animType = typeof whileTap === 'string' ? whileTap : variantToAnimationType(whileTap)
        runAnimation(elementRef.current, animType, { duration: 150 })
      }
      onClick?.(e)
    }

    const handleFocus = () => {
      isFocused.current = true
      if (whileFocus && elementRef.current) {
        const animType = typeof whileFocus === 'string' ? whileFocus : variantToAnimationType(whileFocus)
        runAnimation(elementRef.current, animType, { duration: 200 })
      }
    }

    const handleBlur = () => {
      isFocused.current = false
      if (whileFocus && elementRef.current) {
        runAnimation(elementRef.current, 'fadeIn', { duration: 200 })
      }
    }

    return (
      <div
        ref={elementRef}
        className={className}
        style={style}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
      </div>
    )
  }
)

BaseMotion.displayName = 'BaseMotion'

// 专门的Motion组件
const MotionSection = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionSection.displayName = 'MotionSection'

const MotionArticle = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionArticle.displayName = 'MotionArticle'

const MotionHeader = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionHeader.displayName = 'MotionHeader'

const MotionFooter = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionFooter.displayName = 'MotionFooter'

const MotionMain = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionMain.displayName = 'MotionMain'

const MotionNav = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionNav.displayName = 'MotionNav'

const MotionAside = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionAside.displayName = 'MotionAside'

const MotionH1 = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionH1.displayName = 'MotionH1'

const MotionH2 = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionH2.displayName = 'MotionH2'

const MotionH3 = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionH3.displayName = 'MotionH3'

const MotionP = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionP.displayName = 'MotionP'

const MotionSpan = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionSpan.displayName = 'MotionSpan'

const MotionButton = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionButton.displayName = 'MotionButton'

const MotionA = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionA.displayName = 'MotionA'

const MotionImg = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionImg.displayName = 'MotionImg'

const MotionUl = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionUl.displayName = 'MotionUl'

const MotionLi = forwardRef<HTMLElement, BaseMotionProps>((props, ref) => (
  <BaseMotion ref={ref as any} {...props} />
))
MotionLi.displayName = 'MotionLi'

export const Motion = {
  div: BaseMotion,
  section: MotionSection,
  article: MotionArticle,
  header: MotionHeader,
  footer: MotionFooter,
  main: MotionMain,
  nav: MotionNav,
  aside: MotionAside,
  h1: MotionH1,
  h2: MotionH2,
  h3: MotionH3,
  p: MotionP,
  span: MotionSpan,
  button: MotionButton,
  a: MotionA,
  img: MotionImg,
  ul: MotionUl,
  li: MotionLi
}

// 预定义的动画组件
export const FadeIn: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className, 
  delay = 0 
}) => (
  <Motion.div
    initial="fadeOut"
    animate="fadeIn"
    transition={{ delay: delay * 100, duration: 300 }}
    className={className}
  >
    {children}
  </Motion.div>
)

export const SlideUp: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className, 
  delay = 0 
}) => (
  <Motion.div
    initial="slideUp"
    whileInView="slideUp"
    transition={{ delay: delay * 100, duration: 400 }}
    className={className}
  >
    {children}
  </Motion.div>
)

export const ScaleIn: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className, 
  delay = 0 
}) => (
  <Motion.div
    initial="scaleOut"
    animate="scaleIn"
    transition={{ delay: delay * 100, duration: 300 }}
    className={className}
  >
    {children}
  </Motion.div>
)

export const AnimatedButton: React.FC<{ 
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
}> = ({ 
  children, 
  className = '', 
  onClick, 
  variant = 'primary' 
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200'
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  }

  return (
    <Motion.button
      whileHover="scaleIn"
      whileTap="pulse"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Motion.button>
  )
}

export const AnimatedCard: React.FC<{ 
  children: ReactNode
  className?: string
  delay?: number
}> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => (
  <Motion.div
    initial="slideUp"
    whileInView="slideUp"
    whileHover="scaleIn"
    transition={{ delay: delay * 100, duration: 400 }}
    className={`${className} transition-shadow duration-300 hover:shadow-lg`}
  >
    {children}
  </Motion.div>
)

// 页面过渡组件
export const PageTransition: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Motion.div
    initial="fadeOut"
    animate="fadeIn"
    exit="fadeOut"
    transition={{ duration: 300 }}
    className="min-h-screen"
  >
    {children}
  </Motion.div>
)

// 加载动画组件
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeStyles = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  }

  return (
    <Motion.div
      animate="rotate"
      transition={{ duration: 1000, iterations: Infinity }}
      className={`${sizeStyles[size]} border-primary border-t-transparent rounded-full`}
    >
      <div />
    </Motion.div>
  )
}

// 错误提示组件
export const ErrorMessage: React.FC<{ 
  children: ReactNode
  className?: string
  onClose?: () => void
}> = ({ 
  children, 
  className = '', 
  onClose 
}) => (
  <Motion.div
    initial="shake"
    animate="shake"
    className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`}
  >
    {children}
    {onClose && (
      <Motion.button
        whileHover="scaleIn"
        whileTap="pulse"
        onClick={onClose}
        className="absolute top-0 right-0 px-4 py-3"
      >
        <span className="sr-only">Close</span>
        ×
      </Motion.button>
    )}
  </Motion.div>
)

// 成功提示组件
export const SuccessMessage: React.FC<{ 
  children: ReactNode
  className?: string
  onClose?: () => void
}> = ({ 
  children, 
  className = '', 
  onClose 
}) => (
  <Motion.div
    initial="bounce"
    animate="bounce"
    className={`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative ${className}`}
  >
    {children}
    {onClose && (
      <Motion.button
        whileHover="scaleIn"
        whileTap="pulse"
        onClick={onClose}
        className="absolute top-0 right-0 px-4 py-3"
      >
        <span className="sr-only">Close</span>
        ×
      </Motion.button>
    )}
  </Motion.div>
)

export default Motion