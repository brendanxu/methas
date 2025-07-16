import { useEffect, useRef, useCallback } from 'react';

// 性能优化的 MegaMenu Hook
export const useMegaMenuPerformance = () => {
  const preloadTimeoutRef = useRef<NodeJS.Timeout>();
  const isPreloading = useRef(false);
  
  // 预加载菜单内容
  const preloadMenuContent = useCallback((menuKey: string) => {
    if (isPreloading.current) return;
    
    isPreloading.current = true;
    preloadTimeoutRef.current = setTimeout(() => {
      // 预加载图片和其他资源
      const images = [
        '/images/integrity-commitment.jpg',
        '/images/sustainability-report-2023.jpg',
        '/images/carbon-credits-feature.jpg',
        '/images/net-zero-report-2025.jpg',
        '/images/digital-climate-solutions.jpg',
        '/images/article-6-guide.jpg',
        '/images/impact-report-2023.jpg',
        '/images/global-project-map.jpg',
        '/images/carbon-market-guide-2025.jpg',
        '/images/penguin-perspectives-blog.jpg'
      ];
      
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
      
      isPreloading.current = false;
    }, 100);
  }, []);
  
  // 清理预加载
  const clearPreload = useCallback(() => {
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
      isPreloading.current = false;
    }
  }, []);
  
  // 清理效果
  useEffect(() => {
    return () => {
      clearPreload();
    };
  }, [clearPreload]);
  
  return { preloadMenuContent, clearPreload };
};

// 智能鼠标移动检测
export const useSmartMouseDetection = (
  onOpen: () => void,
  onClose: () => void,
  options: {
    openDelay?: number;
    closeDelay?: number;
    tolerance?: number;
  } = {}
) => {
  const {
    openDelay = 150,
    closeDelay = 300,
    tolerance = 100
  } = options;
  
  const openTimeoutRef = useRef<NodeJS.Timeout>();
  const closeTimeoutRef = useRef<NodeJS.Timeout>();
  const mousePathRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const isHoveringRef = useRef(false);
  
  // 记录鼠标轨迹
  const recordMousePath = useCallback((x: number, y: number) => {
    const now = Date.now();
    mousePathRef.current.push({ x, y, time: now });
    
    // 只保留最近500ms的轨迹
    mousePathRef.current = mousePathRef.current.filter(
      point => now - point.time < 500
    );
  }, []);
  
  // 计算鼠标移动趋势
  const getMouseTrend = useCallback(() => {
    const path = mousePathRef.current;
    if (path.length < 2) return { dx: 0, dy: 0, speed: 0 };
    
    const recent = path.slice(-5);
    const start = recent[0];
    const end = recent[recent.length - 1];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dt = end.time - start.time;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;
    
    return { dx, dy, speed };
  }, []);
  
  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    isHoveringRef.current = true;
    recordMousePath(event.clientX, event.clientY);
    
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    const trend = getMouseTrend();
    const delay = trend.speed > 0.5 ? openDelay / 2 : openDelay;
    
    openTimeoutRef.current = setTimeout(() => {
      if (isHoveringRef.current) {
        onOpen();
      }
    }, delay);
  }, [onOpen, openDelay, recordMousePath, getMouseTrend]);
  
  const handleMouseLeave = useCallback((event: React.MouseEvent) => {
    isHoveringRef.current = false;
    recordMousePath(event.clientX, event.clientY);
    
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }
    
    const trend = getMouseTrend();
    const delay = trend.speed > 0.8 ? closeDelay / 2 : closeDelay;
    
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        onClose();
      }
    }, delay);
  }, [onClose, closeDelay, recordMousePath, getMouseTrend]);
  
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    recordMousePath(event.clientX, event.clientY);
  }, [recordMousePath]);
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    isHovering: isHoveringRef.current
  };
};

// 键盘导航支持
export const useKeyboardNavigation = (
  items: Array<{ id: string; label: string; href?: string }>,
  onSelect: (item: any) => void,
  isOpen: boolean
) => {
  const activeIndexRef = useRef(-1);
  const itemsRef = useRef<HTMLElement[]>([]);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        activeIndexRef.current = Math.min(
          activeIndexRef.current + 1,
          items.length - 1
        );
        itemsRef.current[activeIndexRef.current]?.focus();
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        activeIndexRef.current = Math.max(
          activeIndexRef.current - 1,
          0
        );
        itemsRef.current[activeIndexRef.current]?.focus();
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndexRef.current >= 0) {
          onSelect(items[activeIndexRef.current]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        onSelect(null);
        break;
    }
  }, [items, onSelect, isOpen]);
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);
  
  const registerItem = useCallback((index: number) => {
    return (element: HTMLElement | null) => {
      if (element) {
        itemsRef.current[index] = element;
      }
    };
  }, []);
  
  return { registerItem, activeIndex: activeIndexRef.current };
};

const megaMenuHooks = {
  useMegaMenuPerformance,
  useSmartMouseDetection,
  useKeyboardNavigation
};

export default megaMenuHooks;