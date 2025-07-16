'use client'

import React, { 
  forwardRef, 
  useEffect, 
  useRef, 
  useState, 
  useImperativeHandle,
  ReactNode,
  HTMLAttributes
} from 'react'
import { 
  AnimationType, 
  shouldEnableAnimations, 
  applyAnimation, 
  ANIMATION_PRESETS,
  AnimationConfig,
  ScrollAnimationManager,
  setupHoverAnimation
} from '@/lib/lightweight-animations'

// 动画变体接口
export interface AnimationVariant {
  opacity?: number
  scale?: number
  x?: number
  y?: number
  rotate?: number
  transition?: {
    duration?: number
    delay?: number
    easing?: string
  }
}

// Motion组件属性
export interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  initial?: AnimationVariant | AnimationType | false
  animate?: AnimationVariant | AnimationType
  exit?: AnimationVariant | AnimationType
  whileHover?: AnimationVariant | AnimationType
  whileTap?: AnimationVariant | AnimationType
  whileInView?: AnimationVariant | AnimationType
  transition?: {
    duration?: number
    delay?: number
    easing?: string
    staggerChildren?: number
  }
  viewport?: {
    once?: boolean
    amount?: number
  }
  layout?: boolean
  layoutId?: string
  as?: keyof JSX.IntrinsicElements
}

// AnimatePresence组件属性
export interface AnimatePresenceProps {
  children: ReactNode
  mode?: 'wait' | 'sync'
  initial?: boolean
}

/**
 * 轻量级Motion组件
 * 提供类似Framer Motion的API，但使用CSS动画实现
 */
export const Motion = forwardRef<HTMLDivElement, MotionProps>(({
  children,
  initial = false,
  animate,
  exit,
  whileHover,
  whileTap,
  whileInView,
  transition = {},
  viewport = { once: true, amount: 0.1 },
  as: Component = 'div',
  className = '',
  style = {},
  ...props
}, ref) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInView, setIsInView] = useState(false)
  
  useImperativeHandle(ref, () => elementRef.current!)

  // 转换动画变体为CSS样式
  const variantToStyle = (variant: AnimationVariant): React.CSSProperties => {
    const style: React.CSSProperties = {}
    
    if (variant.opacity !== undefined) style.opacity = variant.opacity
    if (variant.scale !== undefined) style.transform = `${style.transform || ''} scale(${variant.scale})`
    if (variant.x !== undefined) style.transform = `${style.transform || ''} translateX(${variant.x}px)`
    if (variant.y !== undefined) style.transform = `${style.transform || ''} translateY(${variant.y}px)`
    if (variant.rotate !== undefined) style.transform = `${style.transform || ''} rotate(${variant.rotate}deg)`
    
    return style
  }

  // 处理预设动画类型
  const handleAnimationType = async (animationType: AnimationType, element: HTMLElement) => {
    if (!shouldEnableAnimations()) return
    
    const config = ANIMATION_PRESETS[animationType]
    const customConfig: Partial<AnimationConfig> = {}
    
    if (transition.duration) customConfig.duration = `${transition.duration}s`
    if (transition.delay) customConfig.delay = `${transition.delay}s`
    if (transition.easing) customConfig.easing = transition.easing
    
    await applyAnimation(element, animationType, customConfig)
  }

  // 初始动画
  useEffect(() => {
    if (!elementRef.current || !shouldEnableAnimations()) return
    
    if (initial && typeof initial === 'string') {
      handleAnimationType(initial as AnimationType, elementRef.current)
    } else if (initial && typeof initial === 'object') {
      Object.assign(elementRef.current.style, variantToStyle(initial))
    }
    
    setIsVisible(true)
  }, [initial])

  // 进入动画
  useEffect(() => {
    if (!elementRef.current || !animate || !isVisible || !shouldEnableAnimations()) return
    
    const element = elementRef.current
    
    if (typeof animate === 'string') {
      setTimeout(() => {
        handleAnimationType(animate as AnimationType, element)
      }, transition.delay ? transition.delay * 1000 : 0)
    } else if (typeof animate === 'object') {
      setTimeout(() => {
        Object.assign(element.style, variantToStyle(animate))
        element.style.transition = `all ${transition.duration || 0.3}s ${transition.easing || 'ease'}`
      }, transition.delay ? transition.delay * 1000 : 0)
    }
  }, [animate, isVisible, transition])

  // 视口内动画
  useEffect(() => {
    if (!elementRef.current || !whileInView || !shouldEnableAnimations()) return
    
    const scrollManager = new ScrollAnimationManager()
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
          if (typeof whileInView === 'string') {
            handleAnimationType(whileInView as AnimationType, elementRef.current!)
          } else if (typeof whileInView === 'object') {
            Object.assign(elementRef.current!.style, variantToStyle(whileInView))
            elementRef.current!.style.transition = `all ${transition.duration || 0.3}s ${transition.easing || 'ease'}`
          }
          
          if (viewport.once) {
            observer.unobserve(elementRef.current!)
          }
        }
      },
      { threshold: viewport.amount }
    )
    
    observer.observe(elementRef.current)
    
    return () => {
      observer.disconnect()
      scrollManager.destroy()
    }
  }, [whileInView, viewport, isInView, transition])

  // 悬停动画
  useEffect(() => {
    if (!elementRef.current || !whileHover || !shouldEnableAnimations()) return
    
    const element = elementRef.current
    let cleanup: (() => void) | undefined
    
    if (typeof whileHover === 'string') {
      cleanup = setupHoverAnimation(element, whileHover as AnimationType)
    } else if (typeof whileHover === 'object') {
      const handleMouseEnter = () => {
        Object.assign(element.style, variantToStyle(whileHover))
        element.style.transition = `all ${transition.duration || 0.2}s ${transition.easing || 'ease'}`
      }
      
      const handleMouseLeave = () => {
        element.style.transform = ''
        element.style.opacity = ''
      }
      
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)
      
      cleanup = () => {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
    
    return cleanup
  }, [whileHover, transition])

  // 点击动画
  useEffect(() => {
    if (!elementRef.current || !whileTap || !shouldEnableAnimations()) return
    
    const element = elementRef.current
    
    const handleMouseDown = () => {
      if (typeof whileTap === 'string') {
        handleAnimationType(whileTap as AnimationType, element)
      } else if (typeof whileTap === 'object') {
        Object.assign(element.style, variantToStyle(whileTap))
        element.style.transition = `all 0.1s ease`
      }
    }
    
    const handleMouseUp = () => {
      element.style.transform = ''
      element.style.transition = `all 0.2s ease`
    }
    
    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('mouseup', handleMouseUp)
    element.addEventListener('mouseleave', handleMouseUp)
    
    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('mouseup', handleMouseUp)
      element.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [whileTap])

  const combinedStyle = {
    ...style,
    ...(initial === false ? {} : typeof initial === 'object' ? variantToStyle(initial) : {})
  }

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className,
      style: combinedStyle,
      ...props
    },
    children
  )
})

Motion.displayName = 'Motion'

/**
 * 轻量级AnimatePresence组件
 */
export const AnimatePresence: React.FC<AnimatePresenceProps> = ({
  children,
  mode = 'sync',
  initial = true
}) => {
  const [isPresent, setIsPresent] = useState(initial)
  
  useEffect(() => {
    setIsPresent(React.Children.count(children) > 0)
  }, [children])
  
  if (!isPresent && mode === 'wait') {
    return null
  }
  
  return <>{children}</>
}

/**
 * 预设动画组件
 */
export const FadeIn: React.FC<{ children: ReactNode; delay?: number; duration?: number }> = ({
  children,
  delay = 0,
  duration = 0.3
}) => (
  <Motion
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </Motion>
)

export const SlideUp: React.FC<{ children: ReactNode; delay?: number; duration?: number }> = ({
  children,
  delay = 0,
  duration = 0.3
}) => (
  <Motion
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
  >
    {children}
  </Motion>
)

export const ScaleIn: React.FC<{ children: ReactNode; delay?: number; duration?: number }> = ({
  children,
  delay = 0,
  duration = 0.3
}) => (
  <Motion
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </Motion>
)

export const SlideInFromLeft: React.FC<{ children: ReactNode; delay?: number; duration?: number }> = ({
  children,
  delay = 0,
  duration = 0.3
}) => (
  <Motion
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
  >
    {children}
  </Motion>
)

export const SlideInFromRight: React.FC<{ children: ReactNode; delay?: number; duration?: number }> = ({
  children,
  delay = 0,
  duration = 0.3
}) => (
  <Motion
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
  >
    {children}
  </Motion>
)

/**
 * 交错动画容器
 */
export const StaggerContainer: React.FC<{
  children: ReactNode
  staggerDelay?: number
  className?: string
}> = ({ children, staggerDelay = 0.1, className }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement, {
          style: {
            animationDelay: `${index * staggerDelay}s`,
            ...(child as React.ReactElement).props.style
          }
        })
      )}
    </div>
  )
}

/**
 * 滚动触发动画组件
 */
export const ScrollTrigger: React.FC<{
  children: ReactNode
  animation?: AnimationType
  threshold?: number
  once?: boolean
  className?: string
}> = ({ 
  children, 
  animation = 'fade-in', 
  threshold = 0.1, 
  once = true,
  className 
}) => (
  <Motion
    whileInView={animation}
    viewport={{ once, amount: threshold }}
    className={className}
  >
    {children}
  </Motion>
)

// 导出所有动画类型以供使用
export type { AnimationType }
export { shouldEnableAnimations }