'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ===== Modern Animation Types =====

interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  ease?: string | number[]; // 支持Framer Motion格式
  fill?: FillMode;
  iterations?: number;
}

interface MotionProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  initial?: keyof typeof animationPresets | object;
  animate?: keyof typeof animationPresets | object;
  exit?: keyof typeof animationPresets | object;
  whileHover?: keyof typeof animationPresets | object;
  whileTap?: keyof typeof animationPresets | object;
  whileInView?: keyof typeof animationPresets | object;
  transition?: AnimationConfig;
  viewport?: { once?: boolean; margin?: string };
  [key: string]: any;
}

// ===== Animation Presets =====

const animationPresets = {
  // Entrance animations (final states)
  fadeIn: { opacity: 1, y: 0 },
  slideUp: { opacity: 1, y: 0 },
  slideDown: { opacity: 1, y: 0 },
  slideLeft: { opacity: 1, x: 0 },
  slideRight: { opacity: 1, x: 0 },
  scaleIn: { opacity: 1, scale: 1 },
  rotateIn: { opacity: 1, rotate: 0 },
  
  // Exit animations
  fadeOut: { opacity: 0, y: -20 },
  slideUpOut: { opacity: 0, y: -30 },
  slideDownOut: { opacity: 0, y: 30 },
  slideLeftOut: { opacity: 0, x: -30 },
  slideRightOut: { opacity: 0, x: 30 },
  scaleOut: { opacity: 0, scale: 0.8 },
  
  // Hover animations
  lift: { y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  glow: { boxShadow: '0 0 30px rgba(74, 158, 255, 0.4)', scale: 1.05 },
  tilt: { transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-10px)' },
  
  // Tap animations
  tap: { scale: 0.95 },
  bounce: { scale: 1.1 },
  
  // Initial states
  hidden: { opacity: 0, y: 30 },
  hiddenLeft: { opacity: 0, x: -30 },
  hiddenRight: { opacity: 0, x: 30 },
  hiddenScale: { opacity: 0, scale: 0.8 },
  hiddenUp: { opacity: 0, y: -20 },
  hiddenDown: { opacity: 0, y: 20 },
  
  // Loading states
  pulse: { scale: 1.05, opacity: 0.8 },
  shimmer: { backgroundPosition: '200% 0' },
};

// ===== Modern Animation Hook =====

export const useInView = (options: { once?: boolean; margin?: string } = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.once) {
            observer.disconnect();
          }
        } else if (!options.once) {
          setIsInView(false);
        }
      },
      {
        rootMargin: options.margin || '0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.once, options.margin]);

  return [ref, isInView] as const;
};

// ===== Animation Utilities =====

const createKeyframes = (initial: any, animate: any): Keyframe[] => {
  // 处理transform属性
  const buildTransform = (obj: any) => {
    const transforms = [];
    if (obj.x !== undefined) transforms.push(`translateX(${obj.x}px)`);
    if (obj.y !== undefined) transforms.push(`translateY(${obj.y}px)`);
    if (obj.scale !== undefined) transforms.push(`scale(${obj.scale})`);
    if (obj.rotate !== undefined) transforms.push(`rotate(${obj.rotate}deg)`);
    if (obj.rotateX !== undefined) transforms.push(`rotateX(${obj.rotateX}deg)`);
    if (obj.rotateY !== undefined) transforms.push(`rotateY(${obj.rotateY}deg)`);
    if (obj.skewX !== undefined) transforms.push(`skewX(${obj.skewX}deg)`);
    if (obj.skewY !== undefined) transforms.push(`skewY(${obj.skewY}deg)`);
    if (obj.transform) transforms.push(obj.transform);
    return transforms.length > 0 ? transforms.join(' ') : 'none';
  };
  
  return [
    {
      opacity: initial.opacity ?? 1,
      transform: buildTransform(initial),
      boxShadow: initial.boxShadow ?? 'none',
      ...Object.fromEntries(
        Object.entries(initial).filter(([key]) => 
          !['opacity', 'transform', 'boxShadow', 'x', 'y', 'scale', 'rotate', 'rotateX', 'rotateY', 'skewX', 'skewY'].includes(key)
        )
      ),
    },
    {
      opacity: animate.opacity ?? 1,
      transform: buildTransform(animate),
      boxShadow: animate.boxShadow ?? 'none',
      ...Object.fromEntries(
        Object.entries(animate).filter(([key]) => 
          !['opacity', 'transform', 'boxShadow', 'x', 'y', 'scale', 'rotate', 'rotateX', 'rotateY', 'skewX', 'skewY'].includes(key)
        )
      ),
    },
  ];
};

const getAnimationConfig = (transition?: AnimationConfig): KeyframeAnimationOptions => {
  let easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  
  if (transition?.easing) {
    easing = transition.easing;
  } else if (transition?.ease) {
    if (Array.isArray(transition.ease) && transition.ease.length === 4) {
      // 处理Framer Motion格式的ease数组 [0.4, 0, 0.2, 1]
      easing = `cubic-bezier(${transition.ease.join(', ')})`;
    } else if (typeof transition.ease === 'string') {
      easing = transition.ease;
    }
  }
  
  return {
    duration: transition?.duration ? transition.duration * 1000 : 600, // 转换为毫秒
    delay: transition?.delay ? transition.delay * 1000 : 0,
    easing,
    fill: transition?.fill ?? 'both',
    iterations: transition?.iterations ?? 1,
  };
};

// ===== Motion Component Factory =====

const createMotionComponent = (tagName: string) => {
  const MotionComponent = React.forwardRef<HTMLElement, MotionProps>(
    ({ children, initial, animate, whileHover, whileTap, whileInView, transition, viewport, ...htmlProps }, forwardedRef) => {
      const elementRef = useRef<HTMLElement | null>(null);
      const [inViewRef, isInView] = useInView(viewport);
      const [currentAnimation, setCurrentAnimation] = useState<Animation | null>(null);

      // Combine refs
      const ref = useCallback((node: HTMLElement | null) => {
        if (node) {
          elementRef.current = node;
          // Set the inViewRef
          if (inViewRef && 'current' in inViewRef) {
            (inViewRef as any).current = node;
          }
          
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }
      }, [inViewRef, forwardedRef]);

      // Initial animation setup
      useEffect(() => {
        const element = elementRef.current;
        if (!element || !initial) return;

        const initialState = typeof initial === 'string' ? animationPresets[initial as keyof typeof animationPresets] : initial;
        
        // 正确设置初始CSS样式
        if (initialState.opacity !== undefined) {
          element.style.opacity = String(initialState.opacity);
        }
        if (initialState.x !== undefined || initialState.y !== undefined || initialState.scale !== undefined) {
          const transforms = [];
          if (initialState.x !== undefined) transforms.push(`translateX(${initialState.x}px)`);
          if (initialState.y !== undefined) transforms.push(`translateY(${initialState.y}px)`);
          if (initialState.scale !== undefined) transforms.push(`scale(${initialState.scale})`);
          element.style.transform = transforms.join(' ');
        } else if (initialState.transform) {
          element.style.transform = initialState.transform;
        }
        
        // 设置其他CSS属性
        Object.entries(initialState).forEach(([key, value]) => {
          if (!['opacity', 'transform', 'x', 'y', 'scale', 'rotate'].includes(key)) {
            (element.style as any)[key] = value;
          }
        });
      }, [initial]);

      // Animate when in view
      useEffect(() => {
        const element = elementRef.current;
        if (!element || !whileInView || !isInView) return;

        const initialState = typeof initial === 'string' ? animationPresets[initial as keyof typeof animationPresets] : initial;
        const animateState = typeof whileInView === 'string' ? animationPresets[whileInView as keyof typeof animationPresets] : whileInView;

        if (initialState && animateState) {
          const keyframes = createKeyframes(initialState, animateState);
          const config = getAnimationConfig(transition);
          
          const animation = element.animate(keyframes, config);
          setCurrentAnimation(animation);

          return () => animation.cancel();
        }
      }, [isInView, initial, whileInView, transition]);

      // Regular animate effect
      useEffect(() => {
        const element = elementRef.current;
        if (!element || !animate || whileInView) return;

        // 添加小延迟确保DOM已准备好
        const timer = setTimeout(() => {
          const initialState = typeof initial === 'string' ? animationPresets[initial as keyof typeof animationPresets] : initial || {};
          const animateState = typeof animate === 'string' ? animationPresets[animate as keyof typeof animationPresets] : animate;

          if (animateState) {
            const keyframes = createKeyframes(initialState, animateState);
            const config = getAnimationConfig(transition);
            
            const animation = element.animate(keyframes, config);
            setCurrentAnimation(animation);
            
            // 动画完成后设置最终状态
            animation.addEventListener('finish', () => {
              Object.assign(element.style, {
                opacity: animateState.opacity ?? 1,
                transform: createKeyframes({}, animateState)[1].transform,
              });
            });

            return () => animation.cancel();
          }
        }, 50);

        return () => clearTimeout(timer);
      }, [initial, animate, transition, whileInView]);

      // Hover effects
      const handleMouseEnter = useCallback(() => {
        const element = elementRef.current;
        if (!element || !whileHover) return;

        const hoverState = typeof whileHover === 'string' ? animationPresets[whileHover as keyof typeof animationPresets] : whileHover;
        const keyframes = createKeyframes({}, hoverState);
        const config = getAnimationConfig({ duration: 200, easing: 'ease-out' });

        element.animate(keyframes, config);
      }, [whileHover]);

      const handleMouseLeave = useCallback(() => {
        const element = elementRef.current;
        if (!element || !whileHover) return;

        const keyframes = createKeyframes(
          typeof whileHover === 'string' ? animationPresets[whileHover as keyof typeof animationPresets] : whileHover,
          {}
        );
        const config = getAnimationConfig({ duration: 200, easing: 'ease-out' });

        element.animate(keyframes, config);
      }, [whileHover]);

      // Tap effects
      const handleMouseDown = useCallback(() => {
        const element = elementRef.current;
        if (!element || !whileTap) return;

        const tapState = typeof whileTap === 'string' ? animationPresets[whileTap as keyof typeof animationPresets] : whileTap;
        const keyframes = createKeyframes({}, tapState);
        const config = getAnimationConfig({ duration: 100, easing: 'ease-out' });

        element.animate(keyframes, config);
      }, [whileTap]);

      const handleMouseUp = useCallback(() => {
        const element = elementRef.current;
        if (!element || !whileTap) return;

        const keyframes = createKeyframes(
          typeof whileTap === 'string' ? animationPresets[whileTap as keyof typeof animationPresets] : whileTap,
          {}
        );
        const config = getAnimationConfig({ duration: 100, easing: 'ease-out' });

        element.animate(keyframes, config);
      }, [whileTap]);

      // Filter out motion props
      const {
        initial: _initial,
        animate: _animate,
        exit: _exit,
        whileHover: _whileHover,
        whileTap: _whileTap,
        whileInView: _whileInView,
        transition: _transition,
        viewport: _viewport,
        ...cleanProps
      } = htmlProps;

      const enhancedProps = {
        ...cleanProps,
        ref,
        onMouseEnter: whileHover ? handleMouseEnter : htmlProps.onMouseEnter,
        onMouseLeave: whileHover ? handleMouseLeave : htmlProps.onMouseLeave,
        onMouseDown: whileTap ? handleMouseDown : htmlProps.onMouseDown,
        onMouseUp: whileTap ? handleMouseUp : htmlProps.onMouseUp,
      };

      return React.createElement(tagName, enhancedProps, children);
    }
  );

  MotionComponent.displayName = `Motion${tagName.charAt(0).toUpperCase()}${tagName.slice(1)}`;
  return MotionComponent;
};

// ===== Motion Components =====

export const motion = {
  div: createMotionComponent('div'),
  section: createMotionComponent('section'),
  article: createMotionComponent('article'),
  aside: createMotionComponent('aside'),
  header: createMotionComponent('header'),
  footer: createMotionComponent('footer'),
  main: createMotionComponent('main'),
  nav: createMotionComponent('nav'),
  span: createMotionComponent('span'),
  p: createMotionComponent('p'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  h4: createMotionComponent('h4'),
  h5: createMotionComponent('h5'),
  h6: createMotionComponent('h6'),
  img: createMotionComponent('img'),
  button: createMotionComponent('button'),
  form: createMotionComponent('form'),
  input: createMotionComponent('input'),
  textarea: createMotionComponent('textarea'),
  select: createMotionComponent('select'),
  ul: createMotionComponent('ul'),
  ol: createMotionComponent('ol'),
  li: createMotionComponent('li'),
  a: createMotionComponent('a'),
  svg: createMotionComponent('svg'),
  path: createMotionComponent('path'),
};

// ===== Animation Components =====

export const AnimatePresence: React.FC<{
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
}> = ({ children, mode = 'sync' }) => {
  const [childrenArray, setChildrenArray] = useState<React.ReactNode[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const prevChildrenRef = useRef<React.ReactNode[]>([]);
  
  useEffect(() => {
    const newChildren = React.Children.toArray(children);
    const prevChildren = prevChildrenRef.current;
    
    // 检查是否有元素被移除
    const removedChildren = prevChildren.filter(
      (prevChild: any) => !newChildren.some((newChild: any) => 
        newChild.key === prevChild.key || newChild === prevChild
      )
    );
    
    if (removedChildren.length > 0 && mode === 'wait') {
      // 如果有元素被移除且模式是wait，先执行退出动画
      setIsExiting(true);
      setTimeout(() => {
        setChildrenArray(newChildren);
        setIsExiting(false);
        prevChildrenRef.current = newChildren;
      }, 300); // 给退出动画时间
    } else {
      // 直接更新子元素
      setChildrenArray(newChildren);
      prevChildrenRef.current = newChildren;
    }
  }, [children, mode]);
  
  return (
    <div style={{ position: 'relative' }}>
      {childrenArray.map((child, index) => (
        <div key={index} style={{ position: 'relative' }}>
          {child}
        </div>
      ))}
    </div>
  );
};

// ===== Animation Hooks =====

export const useAnimation = () => {
  return {
    start: () => Promise.resolve(),
    stop: () => {},
    set: () => {},
  };
};

// ===== Stagger Animation Component =====

interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initial?: keyof typeof animationPresets | object;
  animate?: keyof typeof animationPresets | object;
  className?: string;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 100,
  initial = 'hidden',
  animate = 'fadeIn',
  className,
}) => {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={initial}
          whileInView={animate}
          transition={{ delay: index * staggerDelay }}
          viewport={{ once: true }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

// ===== Parallax Component =====

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const rate = scrollY * -speed;
      element.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
    return () => window.removeEventListener('scroll', updateParallax);
  }, [speed]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

// ===== Magnetic Component =====

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.3,
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    element.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <div
      ref={elementRef}
      className={className}
      onMouseMove={handleMouseMove as any}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {children}
    </div>
  );
};

export default motion;