/**
 * Intelligent Preload Strategy
 * 
 * Implements smart preloading based on user behavior and route prediction
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// ===== Types =====

interface PreloadOptions {
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  condition?: () => boolean;
  maxRetries?: number;
}

interface UserBehavior {
  scrollDepth: number;
  timeOnPage: number;
  interactions: number;
  previousRoutes: string[];
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

interface RoutePredictor {
  fromRoute: string;
  toRoute: string;
  probability: number;
  conditions: string[];
}

// ===== Core Preload Manager =====

class PreloadManager {
  private static instance: PreloadManager;
  private preloadedRoutes = new Set<string>();
  private preloadedComponents = new Set<string>();
  private userBehavior: UserBehavior;
  private routePredictors: RoutePredictor[] = [];
  private preloadQueue: Array<{ url: string; options: PreloadOptions }> = [];
  private isProcessing = false;

  constructor() {
    this.userBehavior = {
      scrollDepth: 0,
      timeOnPage: 0,
      interactions: 0,
      previousRoutes: [],
      deviceType: this.detectDeviceType(),
      connectionSpeed: this.detectConnectionSpeed()
    };

    this.initializeRoutePredictors();
    this.startBehaviorTracking();
  }

  static getInstance(): PreloadManager {
    if (!PreloadManager.instance) {
      PreloadManager.instance = new PreloadManager();
    }
    return PreloadManager.instance;
  }

  // ===== Device and Connection Detection =====

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private detectConnectionSpeed(): 'slow' | 'fast' | 'unknown' {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return 'unknown';
    }

    const connection = (navigator as any).connection;
    if (!connection) return 'unknown';

    // Effective connection type
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g') return 'slow';
    return 'fast';
  }

  // ===== Route Prediction =====

  private initializeRoutePredictors() {
    this.routePredictors = [
      // Homepage to services
      {
        fromRoute: '/',
        toRoute: '/services',
        probability: 0.7,
        conditions: ['scroll > 50%', 'time > 30s']
      },
      // Homepage to case studies
      {
        fromRoute: '/',
        toRoute: '/case-studies',
        probability: 0.6,
        conditions: ['scroll > 70%', 'interactions > 2']
      },
      // Services to specific service
      {
        fromRoute: '/services',
        toRoute: '/services/carbon-footprint-assessment',
        probability: 0.8,
        conditions: ['hover on service card']
      },
      // Demo pages progression
      {
        fromRoute: '/hero-demo',
        toRoute: '/cards-demo',
        probability: 0.5,
        conditions: ['scroll > 80%']
      },
      {
        fromRoute: '/cards-demo',
        toRoute: '/forms-demo',
        probability: 0.4,
        conditions: ['scroll > 80%']
      },
      // News to article
      {
        fromRoute: '/news',
        toRoute: '/news/[slug]',
        probability: 0.9,
        conditions: ['hover on article card']
      }
    ];
  }

  // ===== Behavior Tracking =====

  private startBehaviorTracking() {
    if (typeof window === 'undefined') return;

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      this.userBehavior.scrollDepth = Math.max(this.userBehavior.scrollDepth, scrollPercent);
    };

    // Track interactions
    const handleInteraction = () => {
      this.userBehavior.interactions++;
    };

    // Track time on page
    const startTime = Date.now();
    const updateTimeOnPage = () => {
      this.userBehavior.timeOnPage = Date.now() - startTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    setInterval(updateTimeOnPage, 1000);

    // Cleanup function would be needed in a real implementation
  }

  // ===== Preload Logic =====

  preloadRoute(url: string, options: PreloadOptions = {}) {
    if (this.preloadedRoutes.has(url)) return;

    // Skip preloading on slow connections for low priority
    if (this.userBehavior.connectionSpeed === 'slow' && options.priority === 'low') {
      return;
    }

    // Check condition
    if (options.condition && !options.condition()) {
      return;
    }

    this.preloadQueue.push({ url, options });
    this.processPreloadQueue();
  }

  preloadComponent(importFn: () => Promise<any>, componentName: string, options: PreloadOptions = {}) {
    if (this.preloadedComponents.has(componentName)) return;

    const delay = options.delay || 0;
    
    setTimeout(() => {
      if (options.condition && !options.condition()) return;

      // Use requestIdleCallback for better performance
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          importFn()
            .then(() => {
              this.preloadedComponents.add(componentName);
              console.log(`Preloaded component: ${componentName}`);
            })
            .catch(() => {
              // Retry logic could be added here
            });
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          importFn()
            .then(() => {
              this.preloadedComponents.add(componentName);
            })
            .catch(() => {});
        }, 2000);
      }
    }, delay);
  }

  private async processPreloadQueue() {
    if (this.isProcessing || this.preloadQueue.length === 0) return;
    
    this.isProcessing = true;

    // Sort queue by priority
    this.preloadQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.options.priority || 'medium'] - priorityOrder[a.options.priority || 'medium'];
    });

    while (this.preloadQueue.length > 0) {
      const { url, options } = this.preloadQueue.shift()!;
      
      try {
        await this.performRoutePreload(url, options);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between preloads
      } catch (error) {
        console.warn(`Failed to preload route: ${url}`, error);
      }
    }

    this.isProcessing = false;
  }

  private async performRoutePreload(url: string, options: PreloadOptions) {
    if (this.preloadedRoutes.has(url)) return;

    // Use Next.js router prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);

    this.preloadedRoutes.add(url);
    console.log(`Preloaded route: ${url}`);
  }

  // ===== Smart Prediction =====

  predictAndPreload(currentRoute: string) {
    const predictions = this.routePredictors
      .filter(predictor => predictor.fromRoute === currentRoute)
      .filter(predictor => this.shouldPreloadBasedOnConditions(predictor.conditions))
      .sort((a, b) => b.probability - a.probability);

    predictions.forEach(prediction => {
      this.preloadRoute(prediction.toRoute, {
        priority: prediction.probability > 0.7 ? 'high' : 'medium',
        delay: prediction.probability > 0.8 ? 0 : 2000
      });
    });
  }

  private shouldPreloadBasedOnConditions(conditions: string[]): boolean {
    return conditions.every(condition => {
      if (condition.includes('scroll >')) {
        const threshold = parseInt(condition.match(/\d+/)?.[0] || '0');
        return this.userBehavior.scrollDepth > threshold;
      }
      if (condition.includes('time >')) {
        const threshold = parseInt(condition.match(/\d+/)?.[0] || '0') * 1000;
        return this.userBehavior.timeOnPage > threshold;
      }
      if (condition.includes('interactions >')) {
        const threshold = parseInt(condition.match(/\d+/)?.[0] || '0');
        return this.userBehavior.interactions > threshold;
      }
      return true;
    });
  }

  // ===== Public Methods =====

  updateRoute(route: string) {
    this.userBehavior.previousRoutes.push(route);
    if (this.userBehavior.previousRoutes.length > 5) {
      this.userBehavior.previousRoutes.shift();
    }
    
    // Reset behavior metrics for new route
    this.userBehavior.scrollDepth = 0;
    this.userBehavior.timeOnPage = 0;
    this.userBehavior.interactions = 0;

    // Predict and preload
    setTimeout(() => {
      this.predictAndPreload(route);
    }, 1000);
  }

  getBehaviorData(): UserBehavior {
    return { ...this.userBehavior };
  }
}

// ===== React Hooks =====

/**
 * Hook for route-based preloading
 */
export function useRoutePreloader() {
  const router = useRouter();
  const pathname = usePathname();
  const manager = useRef<PreloadManager>();

  useEffect(() => {
    manager.current = PreloadManager.getInstance();
    manager.current.updateRoute(pathname);
  }, [pathname]);

  const preloadRoute = useCallback((url: string, options?: PreloadOptions) => {
    manager.current?.preloadRoute(url, options);
  }, []);

  const preloadComponent = useCallback((importFn: () => Promise<any>, name: string, options?: PreloadOptions) => {
    manager.current?.preloadComponent(importFn, name, options);
  }, []);

  return {
    preloadRoute,
    preloadComponent,
    behaviorData: manager.current?.getBehaviorData()
  };
}

/**
 * Hook for hover-based preloading
 */
export function useHoverPreload(url: string, options: PreloadOptions = {}) {
  const { preloadRoute } = useRoutePreloader();
  const hasPreloaded = useRef(false);

  const onMouseEnter = useCallback(() => {
    if (!hasPreloaded.current) {
      preloadRoute(url, { ...options, priority: 'high' });
      hasPreloaded.current = true;
    }
  }, [url, options, preloadRoute]);

  return { onMouseEnter };
}

/**
 * Hook for scroll-based preloading
 */
export function useScrollPreload(
  importFn: () => Promise<any>,
  componentName: string,
  threshold: number = 50
) {
  const { preloadComponent } = useRoutePreloader();
  const hasTriggered = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasTriggered.current) return;

      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent > threshold) {
        preloadComponent(importFn, componentName, { priority: 'medium' });
        hasTriggered.current = true;
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [importFn, componentName, threshold, preloadComponent]);
}

/**
 * Hook for intersection-based preloading
 */
export function useIntersectionPreload(
  importFn: () => Promise<any>,
  componentName: string,
  options: IntersectionObserverInit = {}
) {
  const { preloadComponent } = useRoutePreloader();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            preloadComponent(importFn, componentName, { priority: 'low' });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [importFn, componentName, preloadComponent, options]);

  return ref;
}

// ===== Preload Strategies =====

/**
 * Critical route preloading for homepage
 */
export function preloadCriticalRoutes() {
  const { preloadRoute } = useRoutePreloader();
  
  useEffect(() => {
    // Preload most common routes after 2 seconds
    setTimeout(() => {
      preloadRoute('/services', { priority: 'high' });
      preloadRoute('/news', { priority: 'medium' });
      preloadRoute('/case-studies', { priority: 'medium' });
    }, 2000);
  }, [preloadRoute]);
}

/**
 * Demo page navigation preloading
 */
export function preloadDemoNavigation(currentDemo: string) {
  const { preloadRoute } = useRoutePreloader();
  
  useEffect(() => {
    const demoRoutes = [
      '/button-demo',
      '/cards-demo',
      '/hero-demo',
      '/forms-demo',
      '/section-demo',
      '/services-demo'
    ];
    
    const currentIndex = demoRoutes.indexOf(currentDemo);
    
    // Preload next and previous demos
    if (currentIndex > 0) {
      preloadRoute(demoRoutes[currentIndex - 1], { priority: 'medium', delay: 1000 });
    }
    if (currentIndex < demoRoutes.length - 1) {
      preloadRoute(demoRoutes[currentIndex + 1], { priority: 'medium', delay: 1000 });
    }
  }, [currentDemo, preloadRoute]);
}

// ===== Export =====

export default PreloadManager;