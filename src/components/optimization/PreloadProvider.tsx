'use client';

/**
 * Legacy Preload Provider Component
 * 
 * This file re-exports the new PreloadProvider for backward compatibility
 */

export { 
  PreloadProvider,
  usePreload,
  useRoutePreloader,
  useHoverPreload,
  useScrollPreload,
  usePreloadMetrics,
  usePreloadDebug
} from '@/lib/preload-strategy';

// Legacy compatibility components
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePreload } from '@/lib/preload-strategy';

/**
 * Component-level preloader for heavy components
 */
interface ComponentPreloaderProps {
  /** Component import function */
  importFn: () => Promise<any>;
  /** Component name for tracking */
  componentName: string;
  /** Trigger condition */
  trigger: 'hover' | 'scroll' | 'intersection' | 'immediate';
  /** Scroll threshold percentage (for scroll trigger) */
  scrollThreshold?: number;
  /** Intersection options (for intersection trigger) */
  intersectionOptions?: IntersectionObserverInit;
  /** Delay in milliseconds */
  delay?: number;
  /** Children to render */
  children?: React.ReactNode;
}

export const ComponentPreloader: React.FC<ComponentPreloaderProps> = ({
  importFn,
  componentName,
  trigger,
  scrollThreshold = 50,
  intersectionOptions = {},
  delay = 0,
  children
}) => {
  const { preloadComponent, isReady } = usePreload();

  useEffect(() => {
    if (!isReady) return;

    if (trigger === 'immediate') {
      const timeoutId = setTimeout(() => {
        preloadComponent(importFn, { 
          priority: 'low',
          component: componentName 
        });
      }, delay);
      return () => clearTimeout(timeoutId);
    }

    if (trigger === 'scroll') {
      let hasTriggered = false;
      
      const handleScroll = () => {
        if (hasTriggered) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollPercent > scrollThreshold) {
          preloadComponent(importFn, { 
            priority: 'medium',
            component: componentName 
          });
          hasTriggered = true;
          window.removeEventListener('scroll', handleScroll);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [trigger, importFn, componentName, preloadComponent, scrollThreshold, delay, isReady]);

  return <>{children}</>;
};

/**
 * Link component with hover preloading
 */
interface PreloadLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}

export const PreloadLink: React.FC<PreloadLinkProps> = ({
  href,
  children,
  className,
  priority = 'medium'
}) => {
  const { preloadRoute, isReady } = usePreload();

  const handleMouseEnter = () => {
    if (isReady) {
      preloadRoute(href, { priority });
    }
  };

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter} // For accessibility
    >
      {children}
    </a>
  );
};

/**
 * Performance monitoring component
 */
export const PreloadMonitor: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const logPerformance = () => {
      // Log First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        console.log(`FCP: ${Math.round(fcpEntry.startTime)}ms`);
      }

      // Log Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`LCP: ${Math.round(lastEntry.startTime)}ms`);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // Log bundle chunks loading
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0] as PerformanceNavigationTiming;
        console.log(`DOM Content Loaded: ${Math.round(nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart)}ms`);
        console.log(`Page Load Complete: ${Math.round(nav.loadEventEnd - nav.loadEventStart)}ms`);
      }
    };

    // Run after page load
    if (document.readyState === 'complete') {
      setTimeout(logPerformance, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(logPerformance, 100);
      });
    }
  }, []);

  return null;
};