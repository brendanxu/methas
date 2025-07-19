'use client';

import React, { useEffect, useState } from 'react';
import { motion } from '@/lib/modern-animations';
import { useScroll, useTransform, useSpring } from 'framer-motion';
import { southPoleAnimations } from '@/lib/southpole-animations';

interface ScrollProgressProps {
  className?: string;
  color?: string;
}

// ===== 滚动进度指示器 =====
export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = '',
  color = '#10b981'
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 origin-left z-50 ${className}`}
      style={{
        scaleX,
        backgroundColor: color,
      }}
    />
  );
};

interface ParallaxElementProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

// ===== 视差滚动元素 =====
export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  offset = 50,
  className = ''
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  const opacity = useTransform(scrollY, [0, 300, 700, 1000], [1, 0.8, 0.6, 0.4]);

  return (
    <motion.div
      className={className}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

// ===== 章节揭示动画 =====
export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          ...southPoleAnimations.timing.elegant,
          delay,
          duration,
        }
      }}
      viewport={southPoleAnimations.viewports.standard}
    >
      {children}
    </motion.div>
  );
};

interface CountUpProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

// ===== 数字计数动画 =====
export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 2,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateValue = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      
      // 使用缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(easeOutQuart * value);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    updateValue();
  }, [hasAnimated, value, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        transition: southPoleAnimations.timing.spring
      }}
      viewport={{ once: true }}
      onViewportEnter={() => setHasAnimated(true)}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};

interface TypeWriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursor?: boolean;
}

// ===== 打字机效果 =====
export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  delay = 0,
  speed = 50,
  className = '',
  cursor = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          if (cursor) {
            // 光标闪烁
            const cursorInterval = setInterval(() => {
              setShowCursor(prev => !prev);
            }, 500);
            
            setTimeout(() => {
              clearInterval(cursorInterval);
              setShowCursor(false);
            }, 3000);
          }
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [hasStarted, text, delay, speed, cursor]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ 
        opacity: 1,
        transition: southPoleAnimations.timing.standard
      }}
      viewport={{ once: true }}
      onViewportEnter={() => setHasStarted(true)}
    >
      {displayText}
      {cursor && showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.8,
            ease: "easeInOut"
          }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </motion.span>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

// ===== 交错动画容器 =====
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
  direction = 'up'
}) => {
  const getInitialOffset = () => {
    switch (direction) {
      case 'down': return { y: -30 };
      case 'left': return { x: 30 };
      case 'right': return { x: -30 };
      default: return { y: 30 };
    }
  };

  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...getInitialOffset(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: southPoleAnimations.timing.elegant,
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={southPoleAnimations.viewports.standard}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface GradientTextProps {
  children: React.ReactNode;
  gradient?: string;
  className?: string;
}

// ===== 渐变文字动画 =====
export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = 'from-blue-600 via-green-500 to-indigo-600',
  className = ''
}) => {
  return (
    <motion.span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
      initial={{ opacity: 0, backgroundPosition: '200% center' }}
      whileInView={{ 
        opacity: 1,
        backgroundPosition: '0% center',
        transition: {
          duration: 1.5,
          ease: "easeOut"
        }
      }}
      viewport={{ once: true }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.span>
  );
};

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

// ===== 磁性效果（鼠标跟随） =====
export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.3,
  className = ''
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={southPoleAnimations.timing.preciseSpring}
    >
      {children}
    </motion.div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  amplitude?: number;
  frequency?: number;
  delay?: number;
  className?: string;
}

// ===== 浮动动画 =====
export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  amplitude = 10,
  frequency = 2,
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: frequency,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

// ===== 组合导出 =====
export const ScrollAnimations = {
  ScrollProgress,
  ParallaxElement,
  SectionReveal,
  CountUp,
  TypeWriter,
  StaggerContainer,
  GradientText,
  Magnetic,
  FloatingElement,
};

export default ScrollAnimations;