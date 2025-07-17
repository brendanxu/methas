'use client';

import { useEffect, useRef, useState } from 'react';

interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onArrowRight?.();
          break;
        case 'Tab':
          onTab?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab]);
};

// 焦点管理Hook
export const useFocusManagement = () => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const setItemRef = (index: number) => (element: HTMLElement | null) => {
    itemRefs.current[index] = element;
  };

  const focusItem = (index: number) => {
    const item = itemRefs.current[index];
    if (item) {
      item.focus();
      setFocusedIndex(index);
    }
  };

  const focusNext = () => {
    const nextIndex = (focusedIndex + 1) % itemRefs.current.length;
    focusItem(nextIndex);
  };

  const focusPrevious = () => {
    const prevIndex = focusedIndex <= 0 ? itemRefs.current.length - 1 : focusedIndex - 1;
    focusItem(prevIndex);
  };

  const resetFocus = () => {
    setFocusedIndex(-1);
  };

  return {
    focusedIndex,
    setItemRef,
    focusItem,
    focusNext,
    focusPrevious,
    resetFocus,
  };
};

// 可访问性公告Hook
export const useAccessibilityAnnouncement = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message: string) => {
    setAnnouncement(message);
    // 清除公告以允许重复相同的公告
    setTimeout(() => setAnnouncement(''), 100);
  };

  return { announcement, announce };
};

export default useKeyboardNavigation;