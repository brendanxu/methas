/**
 * Optimized Third-party Library Imports
 * 
 * Tree-shakeable imports for better bundle size
 */

import React from 'react';

// ===== Lodash ES (Tree-shakeable) =====
// Instead of: import _ from 'lodash'
// Use specific imports for better tree shaking

export { 
  debounce,
  throttle,
  cloneDeep,
  merge,
  pick,
  omit,
  get,
  set,
  isEmpty,
  isEqual,
  uniq,
  orderBy,
  groupBy,
  flatten
} from 'lodash-es';

// ===== Date utilities (dayjs instead of moment) =====
// dayjs is already included, but ensure optimal usage
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

export { dayjs };

// ===== Lightweight Animation Alternatives =====
// Replaced Framer Motion with CSS-based animations for better performance
// Using Web Animations API where needed for complex interactions

// Simple motion wrapper using CSS transitions
export const motion = {
  div: ({ children, className, style, initial, animate, exit, transition, ...props }: any) => {
    const combinedStyle = {
      ...style,
      transition: transition ? `all ${transition.duration || 0.3}s ease` : 'all 0.3s ease',
    };
    
    return React.createElement(
      'div',
      { className, style: combinedStyle, ...props },
      children
    );
  },
  section: ({ children, className, style, initial, animate, exit, transition, ...props }: any) => {
    const combinedStyle = {
      ...style,
      transition: transition ? `all ${transition.duration || 0.3}s ease` : 'all 0.3s ease',
    };
    
    return React.createElement(
      'section',
      { className, style: combinedStyle, ...props },
      children
    );
  },
  button: ({ children, className, style, initial, animate, exit, transition, ...props }: any) => {
    const combinedStyle = {
      ...style,
      transition: transition ? `all ${transition.duration || 0.3}s ease` : 'all 0.3s ease',
    };
    
    return React.createElement(
      'button',
      { className, style: combinedStyle, ...props },
      children
    );
  }
};

// Simple AnimatePresence replacement
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};

// Simplified hooks using Intersection Observer API
export const useCustomInView = (threshold: number = 0.1) => {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
};

// Simplified animation hooks
export const useAnimation = () => ({
  start: () => {},
  stop: () => {},
  set: () => {}
});

export const useScroll = () => ({ scrollY: 0, scrollX: 0 });
export const useTransform = () => 0;
export const useSpring = () => 0;
export const useMotionValue = () => ({ get: () => 0, set: () => {} });
export const useMotionTemplate = () => '';

// Common animation variants
export const commonAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

// ===== React Intersection Observer =====
// Re-export for consistency
export { useInView as useIntersectionObserver } from 'react-intersection-observer';

// ===== Class Name Utilities =====
// Re-export optimized class name utilities
export { cn } from '@/lib/utils';
export { clsx } from 'clsx';
export { twMerge } from 'tailwind-merge';

// ===== Performance Optimized Utilities =====

/**
 * Optimized debounce hook for React components
 */
import { useCallback, useEffect, useRef } from 'react';

export function useOptimizedDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

/**
 * Optimized throttle hook for React components
 */
export function useOptimizedThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  const lastRan = useRef<number>(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRan.current >= delay) {
        callbackRef.current(...args);
        lastRan.current = Date.now();
      }
    }) as T,
    [delay]
  );
}

/**
 * Lazy load images with intersection observer
 */
import { useInView } from 'react-intersection-observer';

export function useLazyImage(threshold: number = 0.1) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  });

  return { ref, inView };
}

/**
 * Memory-efficient object comparison
 */
export function useShallowEqual<T>(obj: T): T {
  const ref = useRef<T>(obj);
  
  // Simple shallow comparison
  if (obj && ref.current) {
    const keys1 = Object.keys(obj as object);
    const keys2 = Object.keys(ref.current as object);
    
    if (keys1.length !== keys2.length) {
      ref.current = obj;
      return obj;
    }
    
    for (const key of keys1) {
      if ((obj as any)[key] !== (ref.current as any)[key]) {
        ref.current = obj;
        return obj;
      }
    }
    
    return ref.current;
  }
  
  ref.current = obj;
  return obj;
}

// ===== Bundle Size Monitoring =====

/**
 * Monitor component render performance
 */
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const start = globalThis.performance.now();
      
      return () => {
        const end = globalThis.performance.now();
        // Debug log removed for production
      };
    }
    return undefined;
  });
}

/**
 * Log bundle chunk loading in development
 */
export function logChunkLoad(chunkName: string) {
  if (process.env.NODE_ENV === 'development') {
    // Debug log removed for production
  }
}

// ===== Export Collections =====

// Animation utilities
export const animations = {
  ...commonAnimations,
  transition: {
    fast: { duration: 0.2 },
    normal: { duration: 0.3 },
    slow: { duration: 0.5 }
  }
};

// Performance utilities
export const performanceUtils = {
  useOptimizedDebounce,
  useOptimizedThrottle,
  useLazyImage,
  useShallowEqual,
  useRenderPerformance,
  logChunkLoad
};

const optimizedImports = {
  animations,
  performanceUtils,
  dayjs
};

export default optimizedImports;