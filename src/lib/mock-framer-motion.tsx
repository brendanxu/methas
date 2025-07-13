'use client';

import React from 'react';

// Type definitions for motion components
export type MotionProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  viewport?: any;
  variants?: any;
  custom?: any;
  layout?: boolean | "position" | "size";
  layoutId?: string;
  drag?: boolean | "x" | "y";
  dragConstraints?: any;
  dragElastic?: number;
  dragMomentum?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrag?: () => void;
  [key: string]: any;
};

// Create a HOC that strips motion props and renders the base component
const createMotionComponent = (Component: string) => {
  const MotionComponent = React.forwardRef<HTMLElement, MotionProps>(({ children, ...props }, ref) => {
    // Filter out motion-specific props
    const {
      initial,
      animate,
      exit,
      transition,
      whileHover,
      whileTap,
      whileInView,
      viewport,
      variants,
      custom,
      layout,
      layoutId,
      drag,
      dragConstraints,
      dragElastic,
      dragMomentum,
      onDragStart,
      onDragEnd,
      onDrag,
      ...htmlProps
    } = props;

    return React.createElement(Component, { ...htmlProps, ref }, children);
  });
  
  MotionComponent.displayName = `Motion${Component.charAt(0).toUpperCase()}${Component.slice(1)}`;
  return MotionComponent;
};

// Create motion components
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

// AnimatePresence component
export const AnimatePresence: React.FC<{
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
  initial?: boolean;
  custom?: any;
  exitBeforeEnter?: boolean;
  onExitComplete?: () => void;
}> = ({ children }) => {
  return <>{children}</>;
};

// Hook mocks
export const useInView = (options?: any) => {
  const ref = React.useRef(null);
  return [ref, true];
};

export const useAnimation = () => {
  return {
    start: () => Promise.resolve(),
    stop: () => {},
    set: () => {},
  };
};

export const useScroll = (options?: any) => {
  return {
    scrollX: { get: () => 0 },
    scrollY: { get: () => 0 },
    scrollXProgress: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  };
};

export const useTransform = (value: any, inputRange: number[], outputRange: any[]) => {
  return { get: () => outputRange[0] };
};

export const useSpring = (value: any, options?: any) => {
  return { get: () => value };
};

export const useMotionValue = (initial: any) => {
  return {
    get: () => initial,
    set: () => {},
    onChange: () => () => {},
  };
};

export const useMotionTemplate = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings[0];
};

// Additional exports
export const useVelocity = (value: any) => ({ get: () => 0 });
export const useReducedMotion = () => false;
export const useIsPresent = () => true;
export const useDragControls = () => ({ start: () => {} });

// Variants helper
export const domAnimation = {};
export const LazyMotion: React.FC<{ children: React.ReactNode; features?: any }> = ({ children }) => {
  return <>{children}</>;
};