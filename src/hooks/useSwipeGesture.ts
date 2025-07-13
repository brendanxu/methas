'use client';

import { useEffect, useRef, RefObject } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for a swipe
  preventScroll?: boolean; // Prevent default scroll behavior
}

interface TouchPosition {
  x: number;
  y: number;
}

export function useSwipeGesture<T extends HTMLElement>(
  options: SwipeGestureOptions = {}
): RefObject<T> {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventScroll = false,
  } = options;

  const elementRef = useRef<T>(null);
  const touchStartRef = useRef<TouchPosition | null>(null);
  const touchEndRef = useRef<TouchPosition | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault();
      }
      
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
      touchEndRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || !touchEndRef.current) return;

      const deltaX = touchEndRef.current.x - touchStartRef.current.x;
      const deltaY = touchEndRef.current.y - touchStartRef.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if this is a horizontal or vertical swipe
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (absDeltaX > threshold) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (absDeltaY > threshold) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }

      // Reset touch positions
      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventScroll]);

  return elementRef;
}

// Hook for mobile navigation with specific swipe behaviors
export function useMobileNavigation() {
  const isMobileNavOpen = useRef(false);
  
  const setMobileNavOpen = (isOpen: boolean) => {
    isMobileNavOpen.current = isOpen;
  };

  const swipeRef = useSwipeGesture<HTMLDivElement>({
    onSwipeLeft: () => {
      // Close mobile nav when swiping left
      if (isMobileNavOpen.current) {
        // This will be handled by the component using this hook
      }
    },
    onSwipeRight: () => {
      // Could open mobile nav when swiping right from edge
      // This is typically handled by the header component
    },
    threshold: 75,
    preventScroll: false,
  });

  return {
    swipeRef,
    setMobileNavOpen,
  };
}

export default useSwipeGesture;