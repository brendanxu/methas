'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ===== Performance Optimized Animation System =====

interface AnimationPreset {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  skewX?: number;
  skewY?: number;
  transform?: string;
  boxShadow?: string;
  filter?: string;
  backgroundColor?: string;
  borderRadius?: string;
  [key: string]: any;
}

interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  ease?: string | number[];
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

interface AdvancedMotionProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  initial?: keyof typeof ANIMATION_PRESETS | AnimationPreset;
  animate?: keyof typeof ANIMATION_PRESETS | AnimationPreset;
  exit?: keyof typeof ANIMATION_PRESETS | AnimationPreset;
  whileHover?: keyof typeof ANIMATION_PRESETS | AnimationPreset;
  whileTap?: keyof typeof ANIMATION_PRESETS | AnimationPreset;
  whileInView?: keyof typeof ANIMATION_PRESETS | AnimationPreset;
  transition?: AnimationConfig;
  viewport?: { once?: boolean; margin?: string; threshold?: number };
  stagger?: { delay?: number; from?: 'start' | 'center' | 'end' };
  variants?: Record<string, AnimationPreset>;
  [key: string]: any;
}

// ===== Enhanced Animation Presets =====

export const ANIMATION_PRESETS = {
  // 入场动画 (最终状态)
  fadeIn: { opacity: 1, y: 0 },
  slideUp: { opacity: 1, y: 0 },
  slideDown: { opacity: 1, y: 0 },
  slideLeft: { opacity: 1, x: 0 },
  slideRight: { opacity: 1, x: 0 },
  scaleIn: { opacity: 1, scale: 1 },
  rotateIn: { opacity: 1, rotate: 0 },
  flipX: { opacity: 1, rotateX: 0 },
  flipY: { opacity: 1, rotateY: 0 },
  zoomIn: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  elasticIn: { opacity: 1, scale: 1 },
  
  // 出场动画
  fadeOut: { opacity: 0, y: -20 },
  slideUpOut: { opacity: 0, y: -50 },
  slideDownOut: { opacity: 0, y: 50 },
  slideLeftOut: { opacity: 0, x: -50 },
  slideRightOut: { opacity: 0, x: 50 },
  scaleOut: { opacity: 0, scale: 0.8 },
  zoomOut: { opacity: 0, scale: 0.8, filter: 'blur(4px)' },
  
  // 悬停效果
  lift: { y: -12, scale: 1.03, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' },
  glow: { boxShadow: '0 0 30px rgba(74, 158, 255, 0.6)', scale: 1.05 },
  tilt: { transform: 'perspective(1000px) rotateX(10deg) rotateY(10deg) translateY(-15px)' },
  shine: { boxShadow: '0 0 40px rgba(255,255,255,0.8)', scale: 1.02 },
  vibrate: { x: 2 },
  pulse: { scale: 1.05 },
  bounce: { y: -8, scale: 1.02 },
  
  // 点击效果
  tap: { scale: 0.95, opacity: 0.8 },
  ripple: { scale: 1.1, opacity: 0.7 },
  press: { scale: 0.98, y: 2 },
  
  // 初始状态
  hidden: { opacity: 0, y: 30 },
  hiddenLeft: { opacity: 0, x: -50 },
  hiddenRight: { opacity: 0, x: 50 },
  hiddenUp: { opacity: 0, y: -30 },
  hiddenDown: { opacity: 0, y: 30 },
  hiddenScale: { opacity: 0, scale: 0.8 },
  hiddenRotate: { opacity: 0, rotate: -180 },
  hiddenFlipX: { opacity: 0, rotateX: -90 },
  hiddenFlipY: { opacity: 0, rotateY: -90 },
  hiddenBlur: { opacity: 0, filter: 'blur(20px)', scale: 1.1 },
  
  // 特殊效果
  morphing: { borderRadius: '50%', scale: 0.8 },
  elastic: { scale: 1.2 },
  swing: { rotate: 15 },
  wobble: { x: 15, rotate: 5 },
  flash: { opacity: 0 },
} as const;

// ===== Easing Functions =====

export const EASING = {
  // 标准缓动
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // 专业缓动曲线
  smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  dramatic: 'cubic-bezier(0.77, 0, 0.175, 1)',
  swift: 'cubic-bezier(0.4, 0, 0.2, 1)',
  swiftOut: 'cubic-bezier(0, 0, 0.2, 1)',
  swiftIn: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// ===== Performance Optimized Intersection Observer =====

const createIntersectionObserver = (() => {
  const observerMap = new Map<string, IntersectionObserver>();
  const elementsMap = new Map<string, Map<Element, { callback: (isIntersecting: boolean) => void; once: boolean }>>();
  
  return (
    element: Element,
    callback: (isIntersecting: boolean) => void,
    options: { threshold?: number; margin?: string; once?: boolean } = {}
  ) => {
    // 创建配置键值
    const configKey = `${options.threshold || 0.1}-${options.margin || '0px'}`;
    
    let observer = observerMap.get(configKey);
    let elements = elementsMap.get(configKey);
    
    if (!observer || !elements) {
      elements = new Map();
      elementsMap.set(configKey, elements);
      
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const elementData = elements!.get(entry.target);
            if (elementData) {
              elementData.callback(entry.isIntersecting);
              
              // 如果是一次性观察，移除元素
              if (elementData.once && entry.isIntersecting) {
                elements!.delete(entry.target);
                observer!.unobserve(entry.target);
              }
            }
          });
        },
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.margin || '0px',
        }
      );
      
      observerMap.set(configKey, observer);
    }
    
    elements.set(element, { callback, once: options.once || false });
    observer.observe(element);
    
    return () => {
      elements.delete(element);
      observer?.unobserve(element);
      
      // 如果没有元素了，清理observer
      if (elements.size === 0) {
        observer?.disconnect();
        observerMap.delete(configKey);
        elementsMap.delete(configKey);
      }
    };
  };
})();

// ===== Animation Utilities =====

const buildTransform = (state: AnimationPreset): string => {
  const transforms: string[] = [];
  
  if (state.x !== undefined) transforms.push(`translateX(${state.x}px)`);
  if (state.y !== undefined) transforms.push(`translateY(${state.y}px)`);
  if (state.scale !== undefined) transforms.push(`scale(${state.scale})`);
  if (state.rotate !== undefined) transforms.push(`rotate(${state.rotate}deg)`);
  if (state.rotateX !== undefined) transforms.push(`rotateX(${state.rotateX}deg)`);
  if (state.rotateY !== undefined) transforms.push(`rotateY(${state.rotateY}deg)`);
  if (state.skewX !== undefined) transforms.push(`skewX(${state.skewX}deg)`);
  if (state.skewY !== undefined) transforms.push(`skewY(${state.skewY}deg)`);
  if (state.transform) transforms.push(state.transform);
  
  return transforms.length > 0 ? transforms.join(' ') : 'none';
};

const createOptimizedKeyframes = (from: AnimationPreset, to: AnimationPreset): Keyframe[] => {
  return [
    {
      opacity: from.opacity ?? 1,
      transform: buildTransform(from),
      boxShadow: from.boxShadow ?? 'none',
      filter: from.filter ?? 'none',
      backgroundColor: from.backgroundColor ?? 'transparent',
      borderRadius: from.borderRadius ?? 'inherit',
      offset: 0,
    },
    {
      opacity: to.opacity ?? 1,
      transform: buildTransform(to),
      boxShadow: to.boxShadow ?? 'none',
      filter: to.filter ?? 'none',
      backgroundColor: to.backgroundColor ?? 'transparent',
      borderRadius: to.borderRadius ?? 'inherit',
      offset: 1,
    },
  ];
};

const getAnimationOptions = (config?: AnimationConfig): KeyframeAnimationOptions => {
  let easing: string = EASING.smooth;
  
  if (config?.easing) {
    easing = config.easing;
  } else if (config?.ease) {
    if (Array.isArray(config.ease) && config.ease.length === 4) {
      easing = `cubic-bezier(${config.ease.join(', ')})`;
    } else if (typeof config.ease === 'string') {
      easing = config.ease;
    }
  }
  
  return {
    duration: config?.duration ? config.duration * 1000 : 600,
    delay: config?.delay ? config.delay * 1000 : 0,
    easing,
    iterations: config?.iterations ?? 1,
    direction: config?.direction ?? 'normal',
    fill: 'both',
  };
};

// ===== Advanced Motion Component =====

const createAdvancedMotionComponent = (tagName: string) => {
  const AdvancedMotionComponent = React.forwardRef<HTMLElement, AdvancedMotionProps>(
    (props, forwardedRef) => {
      const {
        children,
        initial,
        animate,
        whileHover,
        whileTap,
        whileInView,
        transition,
        viewport,
        stagger,
        variants,
        className,
        style,
        ...htmlProps
      } = props;

      const elementRef = useRef<HTMLElement | null>(null);
      const [isInView, setIsInView] = useState(false);
      const animationsRef = useRef<Animation[]>([]);
      const isInitializedRef = useRef(false);

      // Combined ref handling
      const ref = useCallback((node: HTMLElement | null) => {
        elementRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }, [forwardedRef]);

      // Initialize element with initial state
      useEffect(() => {
        const element = elementRef.current;
        if (!element || !initial || isInitializedRef.current) return;

        const initialState = typeof initial === 'string' 
          ? ANIMATION_PRESETS[initial as keyof typeof ANIMATION_PRESETS] 
          : initial;

        // 应用初始样式
        Object.assign(element.style, {
          opacity: String(initialState.opacity ?? 1),
          transform: buildTransform(initialState),
          boxShadow: initialState.boxShadow ?? 'none',
          filter: initialState.filter ?? 'none',
          backgroundColor: initialState.backgroundColor ?? 'transparent',
          borderRadius: initialState.borderRadius ?? 'inherit',
          willChange: 'transform, opacity',
        });

        isInitializedRef.current = true;
      }, [initial]);

      // Intersection Observer setup - 优化依赖
      useEffect(() => {
        const element = elementRef.current;
        if (!element || !whileInView) return;

        const cleanup = createIntersectionObserver(
          element,
          setIsInView,
          {
            threshold: viewport?.threshold ?? 0.1,
            margin: viewport?.margin ?? '0px',
            once: viewport?.once ?? true,
          }
        );

        return cleanup;
      }, [whileInView, viewport?.threshold, viewport?.margin, viewport?.once]);

      // InView animation - 优化依赖和性能
      useEffect(() => {
        const element = elementRef.current;
        if (!element || !whileInView || !isInView) return;

        // 使用requestAnimationFrame确保平滑动画
        const animationFrame = requestAnimationFrame(() => {
          const initialState = typeof initial === 'string' 
            ? ANIMATION_PRESETS[initial as keyof typeof ANIMATION_PRESETS] 
            : initial || {};
            
          const animateState = typeof whileInView === 'string' 
            ? ANIMATION_PRESETS[whileInView as keyof typeof ANIMATION_PRESETS] 
            : whileInView;

          const keyframes = createOptimizedKeyframes(initialState, animateState);
          const options = getAnimationOptions(transition);

          // 添加交错延迟
          if (stagger?.delay) {
            const children = element.parentElement?.children;
            if (children) {
              const index = Array.from(children).indexOf(element);
              options.delay = (options.delay || 0) + index * (stagger.delay * 1000);
            }
          }

          element.style.willChange = 'transform, opacity, filter, box-shadow';
          const animation = element.animate(keyframes, options);
          animationsRef.current.push(animation);

          animation.addEventListener('finish', () => {
            element.style.willChange = 'auto';
            animationsRef.current = animationsRef.current.filter(a => a !== animation);
          });
        });

        return () => {
          cancelAnimationFrame(animationFrame);
          animationsRef.current.forEach(animation => animation.cancel());
          animationsRef.current = [];
        };
      }, [isInView]); // 减少依赖，只监听isInView

      // Regular animate effect
      useEffect(() => {
        const element = elementRef.current;
        if (!element || !animate || whileInView) return;

        const initialState = typeof initial === 'string' 
          ? ANIMATION_PRESETS[initial as keyof typeof ANIMATION_PRESETS] 
          : initial || {};
          
        const animateState = typeof animate === 'string' 
          ? ANIMATION_PRESETS[animate as keyof typeof ANIMATION_PRESETS] 
          : animate;

        const keyframes = createOptimizedKeyframes(initialState, animateState);
        const options = getAnimationOptions(transition);

        element.style.willChange = 'transform, opacity, filter, box-shadow';
        const animation = element.animate(keyframes, options);
        animationsRef.current.push(animation);

        animation.addEventListener('finish', () => {
          element.style.willChange = 'auto';
          animationsRef.current = animationsRef.current.filter(a => a !== animation);
        });

        return () => {
          animation.cancel();
          animationsRef.current = animationsRef.current.filter(a => a !== animation);
        };
      }, [initial, animate, transition, whileInView]);

      // Hover effects
      const handleMouseEnter = useCallback(() => {
        const element = elementRef.current;
        if (!element || !whileHover) return;

        const hoverState = typeof whileHover === 'string' 
          ? ANIMATION_PRESETS[whileHover as keyof typeof ANIMATION_PRESETS] 
          : whileHover;

        const keyframes = createOptimizedKeyframes({}, hoverState);
        const options = getAnimationOptions({ duration: 0.3, easing: EASING.swift });

        element.style.willChange = 'transform, opacity, filter, box-shadow';
        const animation = element.animate(keyframes, options);
        animationsRef.current.push(animation);
      }, [whileHover]);

      const handleMouseLeave = useCallback(() => {
        const element = elementRef.current;
        if (!element || !whileHover) return;

        const hoverState = typeof whileHover === 'string' 
          ? ANIMATION_PRESETS[whileHover as keyof typeof ANIMATION_PRESETS] 
          : whileHover;

        const keyframes = createOptimizedKeyframes(hoverState, {});
        const options = getAnimationOptions({ duration: 0.3, easing: EASING.swiftOut });

        const animation = element.animate(keyframes, options);
        animation.addEventListener('finish', () => {
          element.style.willChange = 'auto';
          animationsRef.current = animationsRef.current.filter(a => a !== animation);
        });
      }, [whileHover]);

      // Tap effects
      const handleMouseDown = useCallback(() => {
        const element = elementRef.current;
        if (!element || !whileTap) return;

        const tapState = typeof whileTap === 'string' 
          ? ANIMATION_PRESETS[whileTap as keyof typeof ANIMATION_PRESETS] 
          : whileTap;

        const keyframes = createOptimizedKeyframes({}, tapState);
        const options = getAnimationOptions({ duration: 0.1, easing: EASING.swiftIn });

        element.style.willChange = 'transform';
        const animation = element.animate(keyframes, options);
        animationsRef.current.push(animation);
      }, [whileTap]);

      const handleMouseUp = useCallback(() => {
        const element = elementRef.current;
        if (!element || !whileTap) return;

        const tapState = typeof whileTap === 'string' 
          ? ANIMATION_PRESETS[whileTap as keyof typeof ANIMATION_PRESETS] 
          : whileTap;

        const keyframes = createOptimizedKeyframes(tapState, {});
        const options = getAnimationOptions({ duration: 0.2, easing: EASING.swiftOut });

        const animation = element.animate(keyframes, options);
        animation.addEventListener('finish', () => {
          element.style.willChange = 'auto';
          animationsRef.current = animationsRef.current.filter(a => a !== animation);
        });
      }, [whileTap]);

      // Cleanup all animations on unmount
      useEffect(() => {
        return () => {
          animationsRef.current.forEach(animation => animation.cancel());
          animationsRef.current = [];
        };
      }, []);

      // Filter out motion props
      const cleanProps = {
        ...htmlProps,
        ref,
        className,
        style,
        onMouseEnter: whileHover ? handleMouseEnter : htmlProps.onMouseEnter,
        onMouseLeave: whileHover ? handleMouseLeave : htmlProps.onMouseLeave,
        onMouseDown: whileTap ? handleMouseDown : htmlProps.onMouseDown,
        onMouseUp: whileTap ? handleMouseUp : htmlProps.onMouseUp,
      };

      return React.createElement(tagName, cleanProps, children);
    }
  );

  AdvancedMotionComponent.displayName = `AdvancedMotion${tagName.charAt(0).toUpperCase()}${tagName.slice(1)}`;
  return AdvancedMotionComponent;
};

// ===== Export Advanced Motion Components =====

export const advancedMotion = {
  div: createAdvancedMotionComponent('div'),
  section: createAdvancedMotionComponent('section'),
  article: createAdvancedMotionComponent('article'),
  header: createAdvancedMotionComponent('header'),
  footer: createAdvancedMotionComponent('footer'),
  main: createAdvancedMotionComponent('main'),
  nav: createAdvancedMotionComponent('nav'),
  span: createAdvancedMotionComponent('span'),
  p: createAdvancedMotionComponent('p'),
  h1: createAdvancedMotionComponent('h1'),
  h2: createAdvancedMotionComponent('h2'),
  h3: createAdvancedMotionComponent('h3'),
  h4: createAdvancedMotionComponent('h4'),
  h5: createAdvancedMotionComponent('h5'),
  h6: createAdvancedMotionComponent('h6'),
  img: createAdvancedMotionComponent('img'),
  button: createAdvancedMotionComponent('button'),
  a: createAdvancedMotionComponent('a'),
  ul: createAdvancedMotionComponent('ul'),
  li: createAdvancedMotionComponent('li'),
};

// ===== Enhanced Components =====

interface AdvancedStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  from?: 'start' | 'center' | 'end';
  initial?: keyof typeof ANIMATION_PRESETS | AnimationPreset;
  animate?: keyof typeof ANIMATION_PRESETS | AnimationPreset;
  transition?: AnimationConfig;
  className?: string;
}

export const AdvancedStagger: React.FC<AdvancedStaggerProps> = React.memo(({
  children,
  staggerDelay = 100,
  from = 'start',
  initial = 'hidden',
  animate = 'fadeIn',
  transition,
  className,
}) => {
  const childArray = React.Children.toArray(children);
  const childCount = childArray.length;

  const getDelay = (index: number): number => {
    switch (from) {
      case 'center':
        const center = Math.floor(childCount / 2);
        return Math.abs(index - center) * (staggerDelay / 1000);
      case 'end':
        return (childCount - 1 - index) * (staggerDelay / 1000);
      default:
        return index * (staggerDelay / 1000);
    }
  };

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <advancedMotion.div
          key={index}
          initial={initial}
          whileInView={animate}
          transition={{
            ...transition,
            delay: getDelay(index),
            duration: transition?.duration || 0.6,
            easing: transition?.easing || EASING.smooth,
          }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
        >
          {child}
        </advancedMotion.div>
      ))}
    </div>
  );
});

AdvancedStagger.displayName = 'AdvancedStagger';

// ===== Export Default =====

export default advancedMotion;