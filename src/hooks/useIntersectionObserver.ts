import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  onIntersect?: () => void;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

// Simplified hook with consistent return type
export function useIntersectionObserver(
  options?: { 
    threshold?: number; 
    rootMargin?: string;
    onIntersect?: () => void;
    triggerOnce?: boolean;
    enabled?: boolean;
  }
): {
  ref: React.RefObject<HTMLDivElement>;
  isIntersecting: boolean;
  hasIntersected: boolean;
};

export function useIntersectionObserver(
  options: { 
    threshold?: number; 
    rootMargin?: string;
    onIntersect?: () => void;
    triggerOnce?: boolean;
    enabled?: boolean;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const {
    onIntersect,
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled || (triggerOnce && hasTriggered)) return;
    
    // 仅在客户端执行
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const intersecting = entry.isIntersecting;
          setIsIntersecting(intersecting);
          
          if (intersecting && !hasIntersected) {
            setHasIntersected(true);
          }
          
          if (intersecting && onIntersect) {
            onIntersect();
            if (triggerOnce) {
              setHasTriggered(true);
              observer.unobserve(element);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [onIntersect, threshold, rootMargin, triggerOnce, enabled, hasTriggered, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}