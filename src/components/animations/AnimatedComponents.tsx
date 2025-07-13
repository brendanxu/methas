'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, MotionProps } from '@/lib/mock-framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { 
  ANIMATIONS, 
  STAGGER, 
  GESTURES, 
  getAdaptiveAnimation, 
  shouldReduceMotion,
  createCustomAnimation,
  createStaggerAnimation 
} from '@/lib/animation-config';

// 基础动画组件类型
interface BaseAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * 通用动画容器
 */
interface AnimatedContainerProps extends BaseAnimationProps, Omit<MotionProps, 'children'> {
  animation?: keyof typeof ANIMATIONS;
  custom?: any;
  disabled?: boolean;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ 
    children, 
    className, 
    animation = 'fade', 
    delay = 0, 
    once = true, 
    threshold = 0.1, 
    rootMargin = '0px',
    disabled = false,
    custom,
    ...motionProps 
  }, ref) => {
    const { ref: observerRef, isIntersecting, hasIntersected } = useIntersectionObserver({
      threshold,
      rootMargin,
    });

    const shouldAnimate = !disabled && (once ? hasIntersected : isIntersecting);
    const animationConfig = getAdaptiveAnimation(ANIMATIONS[animation as keyof typeof ANIMATIONS]);

    return (
      <motion.div
        ref={observerRef}
        className={className}
        initial={animationConfig.initial}
        animate={shouldAnimate ? animationConfig.animate : animationConfig.initial}
        exit={animationConfig.exit}
        transition={{
          ...animationConfig.transition,
          delay: delay / 1000,
        }}
        custom={custom}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedContainer.displayName = 'AnimatedContainer';

/**
 * 淡入组件
 */
export const FadeIn: React.FC<BaseAnimationProps> = ({ 
  children, 
  className, 
  delay = 0, 
  once = true, 
  threshold = 0.1, 
  rootMargin = '0px' 
}) => (
  <AnimatedContainer
    animation="fade"
    className={className}
    delay={delay}
    once={once}
    threshold={threshold}
    rootMargin={rootMargin}
  >
    {children}
  </AnimatedContainer>
);

/**
 * 滑动进入组件
 */
interface SlideInProps extends BaseAnimationProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  className,
  direction = 'up',
  distance,
  delay = 0,
  once = true,
  threshold = 0.1,
  rootMargin = '0px',
}) => {
  const animationKey = `slide${direction.charAt(0).toUpperCase() + direction.slice(1)}` as keyof typeof ANIMATIONS;
  
  return (
    <AnimatedContainer
      animation={animationKey}
      className={className}
      delay={delay}
      once={once}
      threshold={threshold}
      rootMargin={rootMargin}
    >
      {children}
    </AnimatedContainer>
  );
};

/**
 * 缩放组件
 */
interface ScaleInProps extends BaseAnimationProps {
  variant?: 'normal' | 'up' | 'bounce';
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  className,
  variant = 'normal',
  delay = 0,
  once = true,
  threshold = 0.1,
  rootMargin = '0px',
}) => {
  const animationMap = {
    normal: 'scale',
    up: 'scaleUp',
    bounce: 'bounce',
  } as const;

  return (
    <AnimatedContainer
      animation={animationMap[variant]}
      className={className}
      delay={delay}
      once={once}
      threshold={threshold}
      rootMargin={rootMargin}
    >
      {children}
    </AnimatedContainer>
  );
};

/**
 * 交错动画容器
 */
interface StaggerContainerProps extends BaseAnimationProps {
  staggerDelay?: number;
  variant?: 'normal' | 'fast' | 'slow';
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  staggerDelay = 100,
  variant = 'normal',
  once = true,
  threshold = 0.1,
  rootMargin = '0px',
}) => {
  const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  const shouldAnimate = once ? hasIntersected : isIntersecting;
  const staggerConfig = variant === 'normal' 
    ? createStaggerAnimation(React.Children.count(children), staggerDelay)
    : STAGGER[variant];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={shouldAnimate ? "animate" : "initial"}
      variants={staggerConfig.container}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={staggerConfig.item}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * 交互式卡片组件
 */
interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'tap';
  disabled?: boolean;
  onClick?: () => void;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  variant = 'default',
  disabled = false,
  onClick,
}) => {
  const animationConfig = variant === 'default' 
    ? ANIMATIONS.cardHover 
    : ANIMATIONS.button;

  return (
    <motion.div
      className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={!disabled ? animationConfig.whileHover : undefined}
      whileTap={!disabled ? animationConfig.whileTap : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

/**
 * 动画按钮组件
 */
interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'scale' | 'lift' | 'pulse';
  disabled?: boolean;
  onClick?: () => void;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  variant = 'scale',
  disabled = false,
  onClick,
}) => {
  const variants = {
    scale: ANIMATIONS.button,
    lift: {
      whileHover: { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
      whileTap: { y: 0, scale: 0.98 },
    },
    pulse: {
      whileHover: { scale: [1, 1.05, 1] },
      whileTap: { scale: 0.95 },
    },
  };

  return (
    <motion.button
      className={className}
      variants={variants[variant]}
      whileHover={!disabled ? variants[variant].whileHover : undefined}
      whileTap={!disabled ? variants[variant].whileTap : undefined}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

/**
 * 路径绘制动画组件
 */
interface PathDrawProps {
  d: string;
  className?: string;
  delay?: number;
  duration?: number;
  reverse?: boolean;
}

export const PathDraw: React.FC<PathDrawProps> = ({
  d,
  className,
  delay = 0,
  duration = 2,
  reverse = false,
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
  });

  return (
    <svg ref={ref as any} className={className} viewBox="0 0 100 100">
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: reverse ? 1 : 0, opacity: 0 }}
        animate={isIntersecting ? { 
          pathLength: reverse ? 0 : 1, 
          opacity: 1 
        } : { 
          pathLength: reverse ? 1 : 0, 
          opacity: 0 
        }}
        transition={{
          pathLength: { duration, delay: delay / 1000 },
          opacity: { duration: 0.3, delay: delay / 1000 },
        }}
      />
    </svg>
  );
};

/**
 * 视差滚动组件
 */
interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'up' | 'down';
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  className,
  speed = 'medium',
  direction = 'up',
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const speedMultiplier = {
    slow: 0.2,
    medium: 0.5,
    fast: 0.8,
  };

  const yOffset = scrollY * speedMultiplier[speed] * (direction === 'up' ? -1 : 1);

  return (
    <motion.div
      className={className}
      style={{ y: yOffset }}
    >
      {children}
    </motion.div>
  );
};

/**
 * 页面过渡组件
 */
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'slide' | 'fade' | 'scale';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  variant = 'slide',
}) => {
  const variants = {
    slide: ANIMATIONS.pageSlide,
    fade: ANIMATIONS.fade,
    scale: ANIMATIONS.scale,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={variants[variant].initial}
        animate={variants[variant].animate}
        exit={variants[variant].exit}
        transition={variants[variant].transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 模态框动画组件
 */
interface ModalAnimationProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ModalAnimation: React.FC<ModalAnimationProps> = ({
  children,
  isOpen,
  onClose,
  className,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* 模态框内容 */}
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
            initial={ANIMATIONS.modal.initial}
            animate={ANIMATIONS.modal.animate}
            exit={ANIMATIONS.modal.exit}
            transition={ANIMATIONS.modal.transition}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * 数字计数动画组件
 */
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2,
  className,
  prefix = '',
  suffix = '',
}) => {
  const [count, setCount] = useState(start);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (!isIntersecting) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const currentCount = start + (end - start) * progress;
      setCount(Math.floor(currentCount));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isIntersecting, start, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

/**
 * 打字机效果组件
 */
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  delay = 0,
  className,
  cursor = true,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (!isIntersecting) return;

    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          if (!cursor) setShowCursor(false);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isIntersecting, text, speed, delay, cursor]);

  useEffect(() => {
    if (!cursor) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [cursor]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {cursor && (
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
      )}
    </span>
  );
};

// 导出所有动画组件
const AnimationComponents = {
  AnimatedContainer,
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerContainer,
  InteractiveCard,
  AnimatedButton,
  PathDraw,
  Parallax,
  PageTransition,
  ModalAnimation,
  CountUp,
  Typewriter,
};

export default AnimationComponents;