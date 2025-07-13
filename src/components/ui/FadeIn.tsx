'use client';

import React from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0,
  duration = 0.6,
  once = true,
  className,
  direction = 'up',
  distance = 20
}) => {
  const result = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px 0px',
  });
  
  const ref = result.ref;
  const isIntersecting = 'isIntersecting' in result ? result.isIntersecting : false;
  const hasIntersected = 'hasIntersected' in result ? result.hasIntersected : false;

  const shouldAnimate = once ? hasIntersected : isIntersecting;

  // 根据方向计算初始位置
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const initialPosition = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...initialPosition
      }}
      animate={shouldAnimate ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : { 
        opacity: 0, 
        ...initialPosition
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 预设的动画组件
export const FadeInUp: React.FC<Omit<FadeInProps, 'direction'>> = (props) => (
  <FadeIn {...props} direction="up" />
);

export const FadeInDown: React.FC<Omit<FadeInProps, 'direction'>> = (props) => (
  <FadeIn {...props} direction="down" />
);

export const FadeInLeft: React.FC<Omit<FadeInProps, 'direction'>> = (props) => (
  <FadeIn {...props} direction="left" />
);

export const FadeInRight: React.FC<Omit<FadeInProps, 'direction'>> = (props) => (
  <FadeIn {...props} direction="right" />
);

// 交错动画容器
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FadeIn;