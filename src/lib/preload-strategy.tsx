'use client';

/**
 * Improved Intelligent Preload Strategy System
 * 
 * Refactored to use modular components with better error handling and type safety
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PreloadConfig, getPreloadConfig } from './preload-config';
import { BehaviorTracker, UserBehavior } from './behavior-tracker';
import { RoutePredictor, RoutePrediction } from './route-predictor';
import { PreloadQueue, PreloadRequest, PreloadStats } from './preload-queue';

// ===== Enhanced Types =====

interface PreloadOptions {
  priority?: 'high' | 'medium' | 'low';
  route?: string;
  component?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  maxRetries?: number;
}

interface PerformanceMetrics {
  memoryUsage: number;
  loadTime: number;
  cacheHitRate: number;
  preloadSuccess: number;
  preloadFailure: number;
  routePredictions: RoutePrediction[];
  engagementScore: number;
}

interface PreloadContextValue {
  preloadComponent: (importFn: () => Promise<any>, options?: PreloadOptions) => string;
  preloadRoute: (route: string, options?: PreloadOptions) => void;
  getMetrics: () => PerformanceMetrics;
  getBehavior: () => UserBehavior | null;
  getPredictions: () => RoutePrediction[];
  clearCache: () => void;
  isReady: boolean;
}

// ===== Enhanced Preload Manager =====

class EnhancedPreloadManager {
  private static instance: EnhancedPreloadManager;
  private config: PreloadConfig;
  private behaviorTracker: BehaviorTracker;
  private routePredictor: RoutePredictor;
  private preloadQueue: PreloadQueue;
  private isInitialized: boolean = false;
  private routeStartTime: number = Date.now();

  private constructor() {
    this.config = getPreloadConfig();
    this.behaviorTracker = new BehaviorTracker(this.config);
    this.routePredictor = new RoutePredictor(this.config);
    this.preloadQueue = new PreloadQueue(this.config);
    this.setupBehaviorListeners();
    this.isInitialized = true;
  }

  public static getInstance(): EnhancedPreloadManager {
    if (!EnhancedPreloadManager.instance) {
      EnhancedPreloadManager.instance = new EnhancedPreloadManager();
    }
    return EnhancedPreloadManager.instance;
  }

  private setupBehaviorListeners(): void {
    // Listen for behavior changes to trigger predictions
    this.behaviorTracker.addEventListener('scrollDepthChanged', () => {
      this.handleBehaviorChange();
    });

    this.behaviorTracker.addEventListener('interactionRecorded', () => {
      this.handleBehaviorChange();
    });

    this.behaviorTracker.addEventListener('routeChanged', () => {
      this.handleRouteChange();
    });
  }

  private handleBehaviorChange(): void {
    if (!this.config.behavior.enablePredictivePreload) return;

    const behavior = this.behaviorTracker.getBehavior();
    const predictions = this.routePredictor.predictRoutes(behavior);

    // Preload high-probability routes
    predictions
      .filter(prediction => 
        prediction.probability > 0.7 && 
        prediction.confidence > 0.6
      )
      .slice(0, 2) // Limit to top 2 predictions
      .forEach(prediction => {
        this.preloadRoute(prediction.route, { 
          priority: 'medium',
          route: prediction.route 
        });
      });
  }

  private handleRouteChange(): void {
    const behavior = this.behaviorTracker.getBehavior();
    
    // Record navigation if we have a previous route
    if (behavior.previousRoutes.length > 0) {
      const previousRoute = behavior.previousRoutes[behavior.previousRoutes.length - 1];
      const timeSpent = Date.now() - this.routeStartTime;
      this.routePredictor.recordNavigation(previousRoute, behavior.currentRoute, timeSpent);
    }

    this.routeStartTime = Date.now();
  }

  // Public API
  public preloadComponent(
    importFn: () => Promise<any>, 
    options: PreloadOptions = {}
  ): string {
    return this.preloadQueue.enqueue(importFn, {
      priority: options.priority || 'medium',
      route: options.route,
      component: options.component,
      onSuccess: options.onSuccess,
      onError: (error) => {
        console.warn('Component preload failed:', {
          component: options.component,
          route: options.route,
          error: error.message
        });
        options.onError?.(error);
      },
      maxRetries: options.maxRetries,
    });
  }

  public preloadRoute(route: string, options: PreloadOptions = {}): void {
    // Temporary implementation - only preload existing routes
    const routeMap: Record<string, () => Promise<any>> = {
      '/services': () => import('../components/sections/home/Services'),
      '/search': () => import('../app/search/SearchPageClient'),
      '/news': () => import('../app/news/page'),
      // Add more routes as they are implemented
    };
    
    const importFn = routeMap[route];
    if (!importFn) {
      console.warn(`Route ${route} is not configured for preloading`);
      return;
    }
    
    this.preloadComponent(importFn, {
      ...options,
      route,
      component: `Route:${route}`,
    });
  }

  public updateRoute(newRoute: string): void {
    this.behaviorTracker.updateRoute(newRoute);
  }

  public getMetrics(): PerformanceMetrics {
    const behavior = this.behaviorTracker.getBehavior();
    const predictions = this.routePredictor.predictRoutes(behavior);
    const queueStats = this.preloadQueue.getStats();
    
    return {
      memoryUsage: this.getMemoryUsage(),
      loadTime: queueStats.averageLoadTime,
      cacheHitRate: queueStats.cacheHitRate,
      preloadSuccess: queueStats.successfulRequests,
      preloadFailure: queueStats.failedRequests,
      routePredictions: predictions,
      engagementScore: this.behaviorTracker.getEngagementScore(),
    };
  }

  public getBehavior(): UserBehavior {
    return this.behaviorTracker.getBehavior();
  }

  public getPredictions(): RoutePrediction[] {
    const behavior = this.behaviorTracker.getBehavior();
    return this.routePredictor.predictRoutes(behavior);
  }

  public clearCache(): void {
    this.preloadQueue.clearCache();
  }

  public getQueueStatus() {
    return this.preloadQueue.getQueueStatus();
  }

  public getNavigationStats() {
    return this.routePredictor.getNavigationStats();
  }

  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const perf = (window.performance as any);
      if (perf.memory) {
        return Math.round(perf.memory.usedJSHeapSize / 1024 / 1024); // MB
      }
    }
    return 0;
  }

  public destroy(): void {
    this.behaviorTracker.destroy();
    this.preloadQueue.destroy();
    this.isInitialized = false;
  }

  public get ready(): boolean {
    return this.isInitialized;
  }

  // Debug utilities
  public debug(): void {
    console.group('Preload Manager Debug');
    console.log('Config:', this.config);
    console.log('Behavior:', this.getBehavior());
    console.log('Predictions:', this.getPredictions());
    console.log('Queue Status:', this.getQueueStatus());
    console.log('Navigation Stats:', this.getNavigationStats());
    console.log('Metrics:', this.getMetrics());
    this.preloadQueue.debugQueue();
    console.groupEnd();
  }
}

// ===== React Context =====

const PreloadContext = createContext<PreloadContextValue>({
  preloadComponent: () => '',
  preloadRoute: () => {},
  getMetrics: () => ({
    memoryUsage: 0,
    loadTime: 0,
    cacheHitRate: 0,
    preloadSuccess: 0,
    preloadFailure: 0,
    routePredictions: [],
    engagementScore: 0,
  }),
  getBehavior: () => null,
  getPredictions: () => [],
  clearCache: () => {},
  isReady: false,
});

// ===== Provider Component =====

export const PreloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manager] = useState(() => EnhancedPreloadManager.getInstance());
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef<string>();

  useEffect(() => {
    if (manager.ready) {
      setIsReady(true);
    }
  }, [manager]);

  useEffect(() => {
    if (isReady && pathname !== previousPathnameRef.current) {
      manager.updateRoute(pathname);
      previousPathnameRef.current = pathname;
    }
  }, [pathname, manager, isReady]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (manager) {
        manager.destroy();
      }
    };
  }, [manager]);

  const contextValue: PreloadContextValue = {
    preloadComponent: useCallback((importFn, options) => 
      manager.preloadComponent(importFn, options), [manager]),
    preloadRoute: useCallback((route, options) => 
      manager.preloadRoute(route, options), [manager]),
    getMetrics: useCallback(() => manager.getMetrics(), [manager]),
    getBehavior: useCallback(() => manager.getBehavior(), [manager]),
    getPredictions: useCallback(() => manager.getPredictions(), [manager]),
    clearCache: useCallback(() => manager.clearCache(), [manager]),
    isReady,
  };

  return (
    <PreloadContext.Provider value={contextValue}>
      {children}
    </PreloadContext.Provider>
  );
};

// ===== Enhanced Hooks =====

export const usePreload = () => {
  const context = useContext(PreloadContext);
  if (!context) {
    throw new Error('usePreload must be used within a PreloadProvider');
  }
  return context;
};

export const useRoutePreloader = (routes: string[], options: PreloadOptions = {}) => {
  const { preloadRoute, isReady } = usePreload();
  const [preloadedRoutes, setPreloadedRoutes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isReady) return;

    routes.forEach(route => {
      if (!preloadedRoutes.has(route)) {
        preloadRoute(route, options);
        setPreloadedRoutes(prev => new Set(prev).add(route));
      }
    });
  }, [routes, preloadRoute, isReady, preloadedRoutes, options]);
};

export const useHoverPreload = (
  importFn: () => Promise<any>,
  options: PreloadOptions = {}
) => {
  const { preloadComponent, isReady } = usePreload();
  const [isPreloaded, setIsPreloaded] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (!isReady || isPreloaded) return;

    preloadComponent(importFn, {
      ...options,
      priority: 'high',
      onSuccess: () => setIsPreloaded(true),
    });
  }, [preloadComponent, importFn, options, isReady, isPreloaded]);

  return { onMouseEnter: handleMouseEnter, isPreloaded };
};

export const useScrollPreload = (
  importFn: () => Promise<any>,
  threshold: number = 50,
  options: PreloadOptions = {}
) => {
  const { preloadComponent, isReady } = usePreload();
  const [isPreloaded, setIsPreloaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isReady || isPreloaded) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold / 100) {
            preloadComponent(importFn, {
              ...options,
              priority: 'medium',
              onSuccess: () => setIsPreloaded(true),
            });
            observer.disconnect();
          }
        });
      },
      { threshold: threshold / 100 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [preloadComponent, importFn, threshold, options, isReady, isPreloaded]);

  return { ref: elementRef, isPreloaded };
};

// ===== Performance Monitoring Hook =====

export const usePreloadMetrics = (interval: number = 5000) => {
  const { getMetrics, isReady } = usePreload();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (!isReady) return;

    const updateMetrics = () => {
      setMetrics(getMetrics());
    };

    updateMetrics(); // Initial update
    const intervalId = setInterval(updateMetrics, interval);

    return () => clearInterval(intervalId);
  }, [getMetrics, interval, isReady]);

  return metrics;
};

// ===== Debug Hook =====

export const usePreloadDebug = () => {
  const context = useContext(PreloadContext);
  
  return {
    debug: () => {
      if (context.isReady) {
        const manager = EnhancedPreloadManager.getInstance();
        manager.debug();
      }
    },
    getContext: () => context,
  };
};

export default EnhancedPreloadManager;