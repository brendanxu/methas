/**
 * Behavior Tracker
 * 
 * Tracks user behavior patterns for intelligent preloading
 */

import { PreloadConfig } from './preload-config';

export interface UserBehavior {
  scrollDepth: number;
  dwellTime: number;
  interactionCount: number;
  currentRoute: string;
  previousRoutes: string[];
  sessionStartTime: number;
  lastInteractionTime: number;
  deviceInfo: DeviceInfo;
  networkInfo: NetworkInfo;
}

export interface DeviceInfo {
  memory?: number;
  hardwareConcurrency?: number;
  isMobile: boolean;
  isLowEnd: boolean;
}

export interface NetworkInfo {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export class BehaviorTracker {
  private behavior: UserBehavior;
  private config: PreloadConfig;
  private listeners: Map<string, (() => void)[]> = new Map();
  private scrollStartTime: number = 0;
  private isTracking: boolean = false;

  constructor(config: PreloadConfig) {
    this.config = config;
    this.behavior = this.initializeBehavior();
    this.setupEventListeners();
  }

  private initializeBehavior(): UserBehavior {
    return {
      scrollDepth: 0,
      dwellTime: 0,
      interactionCount: 0,
      currentRoute: typeof window !== 'undefined' ? window.location.pathname : '/',
      previousRoutes: [],
      sessionStartTime: Date.now(),
      lastInteractionTime: Date.now(),
      deviceInfo: this.getDeviceInfo(),
      networkInfo: this.getNetworkInfo(),
    };
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return { isMobile: false, isLowEnd: false };
    }

    const nav = window.navigator as any;
    const memory = nav.deviceMemory;
    const hardwareConcurrency = nav.hardwareConcurrency;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(nav.userAgent);
    
    return {
      memory,
      hardwareConcurrency,
      isMobile,
      isLowEnd: memory < this.config.device.lowEndDeviceMemory || hardwareConcurrency < 4,
    };
  }

  private getNetworkInfo(): NetworkInfo {
    if (typeof window === 'undefined') {
      return {};
    }

    const nav = window.navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    if (!connection) {
      return {};
    }

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Scroll tracking
    const handleScroll = this.throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      this.updateScrollDepth(scrollPercent);
    }, 100);

    // Interaction tracking
    const handleInteraction = () => {
      this.recordInteraction();
    };

    // Visibility tracking
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        this.scrollStartTime = Date.now();
        this.isTracking = true;
      } else {
        this.updateDwellTime();
        this.isTracking = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Store cleanup functions
    this.listeners.set('cleanup', [
      () => window.removeEventListener('scroll', handleScroll),
      () => window.removeEventListener('click', handleInteraction),
      () => window.removeEventListener('keydown', handleInteraction),
      () => window.removeEventListener('touchstart', handleInteraction),
      () => document.removeEventListener('visibilitychange', handleVisibilityChange),
    ]);

    // Start tracking
    this.scrollStartTime = Date.now();
    this.isTracking = true;
  }

  private throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  private updateScrollDepth(depth: number): void {
    if (depth > this.behavior.scrollDepth) {
      this.behavior.scrollDepth = depth;
      this.notifyListeners('scrollDepthChanged', depth);
    }
  }

  private updateDwellTime(): void {
    if (this.isTracking && this.scrollStartTime > 0) {
      const additionalTime = Date.now() - this.scrollStartTime;
      this.behavior.dwellTime += additionalTime;
      this.notifyListeners('dwellTimeUpdated', this.behavior.dwellTime);
    }
  }

  private recordInteraction(): void {
    this.behavior.interactionCount++;
    this.behavior.lastInteractionTime = Date.now();
    this.notifyListeners('interactionRecorded', this.behavior.interactionCount);
  }

  private notifyListeners(event: string, data: any): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.warn(`Error in behavior tracker listener for ${event}:`, error);
      }
    });
  }

  // Public API
  public getBehavior(): Readonly<UserBehavior> {
    // Update dwell time before returning
    if (this.isTracking) {
      this.updateDwellTime();
      this.scrollStartTime = Date.now();
    }
    
    return { ...this.behavior };
  }

  public updateRoute(newRoute: string): void {
    if (newRoute !== this.behavior.currentRoute) {
      this.behavior.previousRoutes.push(this.behavior.currentRoute);
      // Keep only last 10 routes
      if (this.behavior.previousRoutes.length > 10) {
        this.behavior.previousRoutes.shift();
      }
      this.behavior.currentRoute = newRoute;
      
      // Reset route-specific metrics
      this.behavior.scrollDepth = 0;
      this.behavior.dwellTime = 0;
      this.behavior.interactionCount = 0;
      this.scrollStartTime = Date.now();
      
      this.notifyListeners('routeChanged', newRoute);
    }
  }

  public shouldTriggerPreload(type: 'scroll' | 'hover' | 'idle'): boolean {
    const behavior = this.getBehavior();
    
    switch (type) {
      case 'scroll':
        return behavior.scrollDepth >= this.config.thresholds.scrollDepth;
      
      case 'hover':
        return behavior.interactionCount >= this.config.thresholds.interactionCount;
      
      case 'idle':
        const idleTime = Date.now() - behavior.lastInteractionTime;
        return idleTime >= this.config.thresholds.idleTime;
      
      default:
        return false;
    }
  }

  public addEventListener(event: string, listener: () => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  public removeEventListener(event: string, listener: () => void): void {
    const eventListeners = this.listeners.get(event) || [];
    const index = eventListeners.indexOf(listener);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  }

  public destroy(): void {
    // Clean up all event listeners
    const cleanupFunctions = this.listeners.get('cleanup') || [];
    cleanupFunctions.forEach(cleanup => cleanup());
    
    // Clear all listeners
    this.listeners.clear();
    this.isTracking = false;
  }

  // Analytics helpers
  public getSessionDuration(): number {
    return Date.now() - this.behavior.sessionStartTime;
  }

  public getEngagementScore(): number {
    const behavior = this.getBehavior();
    const sessionDuration = this.getSessionDuration();
    
    // Calculate engagement score based on multiple factors
    let score = 0;
    
    // Scroll depth contribution (0-30 points)
    score += Math.min(behavior.scrollDepth * 0.3, 30);
    
    // Dwell time contribution (0-25 points)
    score += Math.min((behavior.dwellTime / 1000) * 2.5, 25);
    
    // Interaction count contribution (0-25 points)
    score += Math.min(behavior.interactionCount * 5, 25);
    
    // Session duration contribution (0-20 points)
    score += Math.min((sessionDuration / 60000) * 2, 20);
    
    return Math.round(score);
  }
}