import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

export const useIntersectionObserver = ({
  onIntersect,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = false,
  enabled = true,
}: UseIntersectionObserverProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || (triggerOnce && hasTriggered)) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
      observer.unobserve(element);
    };
  }, [onIntersect, threshold, rootMargin, triggerOnce, enabled, hasTriggered]);

  return { ref };
};