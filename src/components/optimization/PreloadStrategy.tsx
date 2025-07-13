'use client';

import React, { useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface PreloadStrategyProps {
  children: React.ReactNode;
}

// 预加载关键资源
export const PreloadStrategy: React.FC<PreloadStrategyProps> = ({ children }) => {
  useEffect(() => {
    // 仅在客户端执行
    if (typeof window === 'undefined') return;

    // 预加载关键字体
    const preloadFont = (href: string, type = 'font/woff2') => {
      if (typeof document === 'undefined') return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'font';
      link.type = type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // 预加载关键图片
    const preloadImage = (src: string) => {
      if (typeof document === 'undefined') return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    };

    // 预加载关键 JS 模块
    const preloadModule = (src: string) => {
      if (typeof document === 'undefined') return;
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = src;
      document.head.appendChild(link);
    };

    // 预加载关键资源
    try {
      // 预加载重要图片
      preloadImage('/og-default.jpg');
      preloadImage('/images/test-hero.png');

      // 检测用户意图并预加载
      const preloadNextLikelyPage = () => {
        const currentPath = window.location.pathname;
        
        // 根据当前页面预测下一个可能访问的页面
        switch (currentPath) {
          case '/':
            // 首页用户可能访问服务页面
            import('@/components/sections/home/Services').catch(() => {});
            break;
          case '/services':
            // 服务页面用户可能查看案例
            import('@/components/sections/home/CaseStudies').catch(() => {});
            break;
          case '/about':
            // 关于页面用户可能联系我们
            import('@/components/forms/ContactForm').catch(() => {});
            break;
        }
      };

      // 延迟预加载，避免阻塞主要内容
      setTimeout(preloadNextLikelyPage, 2000);
    } catch (error) {
      console.warn('Preload strategy error:', error);
    }
  }, []);

  return <>{children}</>;
};

// 智能预加载 Hook
export const useSmartPreload = () => {
  useEffect(() => {
    // 仅在客户端执行
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // 鼠标悬停预加载
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link?.href && link.href !== window.location.href) {
        try {
          // 预加载链接页面的关键资源
          const url = new URL(link.href);
          
          // 根据路径预加载对应组件
          switch (url.pathname) {
            case '/services':
              // 预加载服务相关组件
              import('@/components/sections/home/Services').catch(() => {});
              break;
            case '/about':
              // 预加载案例研究组件
              import('@/components/sections/home/CaseStudies').catch(() => {});
              break;
            case '/contact':
              // 预加载联系表单
              import('@/components/forms/ContactForm').catch(() => {});
              break;
            case '/news':
              // 预加载新闻相关组件
              import('@/components/sections/home/CaseStudies').catch(() => {});
              break;
          }
        } catch (error) {
          // 忽略URL解析错误
        }
      }
    };

    // 添加全局鼠标悬停监听
    document.addEventListener('mouseenter', handleMouseEnter, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, []);
};

// 可视区域预加载组件
export const ViewportPreloader: React.FC<{
  onVisible: () => void;
  threshold?: number;
  rootMargin?: string;
}> = ({ onVisible, threshold = 0.1, rootMargin = '100px' }) => {
  const { ref } = useIntersectionObserver({
    onIntersect: onVisible,
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  return <div ref={ref} style={{ height: 1, width: 1 }} />;
};

// 路由预加载组件
export const RoutePreloader: React.FC = () => {
  useEffect(() => {
    // 仅在客户端执行
    if (typeof window === 'undefined') return;

    // 预加载重要路由组件
    const preloadRoutes = async () => {
      try {
        // 延迟预加载，避免影响初始渲染
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 预加载常用组件
        const routes = [
          () => import('@/components/sections/home/Services'),
          () => import('@/components/sections/home/CaseStudies'),
          () => import('@/components/forms/ContactForm'),
          () => import('@/components/sections/home/Hero'),
        ];

        // 逐个预加载，避免一次性加载太多
        for (const route of routes) {
          try {
            await route();
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            // 忽略单个路由预加载失败
          }
        }
      } catch (error) {
        console.warn('Route preloader error:', error);
      }
    };

    // 仅在空闲时预加载
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadRoutes);
    } else {
      setTimeout(preloadRoutes, 5000);
    }
  }, []);

  return null;
};

// 渐进式加载组件
export const ProgressiveLoader: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}> = ({ children, fallback, delay = 100 }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};