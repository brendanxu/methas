'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
}

interface ScrollAnimationReturn<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  isVisible: boolean;
  hasBeenVisible: boolean;
}

export const useScrollAnimation = <T extends HTMLElement = HTMLElement>(
  options: ScrollAnimationOptions = {}
): ScrollAnimationReturn<T> => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true,
    delay = 0,
    duration = 600,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasBeenVisible(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasBeenVisible(true);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, delay]);

  return { ref, isVisible, hasBeenVisible };
};

// Hook for staggered animations
export const useStaggeredScrollAnimation = <T extends HTMLElement = HTMLElement>(
  itemCount: number,
  options: ScrollAnimationOptions = {}
) => {
  const { delay = 0, duration = 600 } = options;
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const { ref, isVisible } = useScrollAnimation<T>(options);

  useEffect(() => {
    if (isVisible) {
      const staggerDelay = 100; // 100ms between each item
      
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setVisibleItems(prev => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, delay + (i * staggerDelay));
      }
    }
  }, [isVisible, itemCount, delay]);

  return { ref, visibleItems };
};

// Performance optimized scroll position hook
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let ticking = false;

    const updateScrollPosition = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return { scrollY, isScrolling };
};

// Hook for parallax effects
export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);
  const { scrollY } = useScrollPosition();

  useEffect(() => {
    setOffset(scrollY * speed);
  }, [scrollY, speed]);

  return offset;
};

// Hook for scroll-triggered animations with CSS classes
export const useScrollAnimationCSS = <T extends HTMLElement = HTMLElement>(
  animationClass: string = 'animate-fade-in-up',
  options: ScrollAnimationOptions = {}
) => {
  const { ref, isVisible } = useScrollAnimation<T>(options);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (isVisible) {
      element.classList.add(animationClass);
    } else {
      element.classList.remove(animationClass);
    }
  }, [isVisible, animationClass, ref]);

  return { ref, isVisible };
};

export default useScrollAnimation;