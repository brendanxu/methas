/**
 * Preload Configuration
 * 
 * Centralized configuration for preload strategies and thresholds
 */

export interface PreloadConfig {
  thresholds: {
    scrollDepth: number;
    dwellTime: number;
    interactionCount: number;
    memoryUsage: number;
    idleTime: number;
  };
  behavior: {
    enableScrollPreload: boolean;
    enableHoverPreload: boolean;
    enableIdlePreload: boolean;
    enablePredictivePreload: boolean;
    maxConcurrentPreloads: number;
    preloadDelay: number;
  };
  network: {
    slowConnectionThreshold: number;
    fastConnectionThreshold: number;
    respectDataSaver: boolean;
  };
  device: {
    lowEndDeviceMemory: number;
    highEndDeviceMemory: number;
    enableMobileOptimizations: boolean;
  };
  routes: RoutePreloadRule[];
  retry: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
}

export interface RoutePreloadRule {
  fromRoute: string;
  toRoute: string;
  probability: number;
  conditions: PreloadCondition[];
}

export interface PreloadCondition {
  type: 'scroll' | 'time' | 'interaction' | 'device' | 'connection';
  operator: 'gt' | 'lt' | 'eq' | 'includes';
  value: number | string;
}

// Default configuration
export const DEFAULT_PRELOAD_CONFIG: PreloadConfig = {
  thresholds: {
    scrollDepth: 30,      // 30% scroll depth
    dwellTime: 3000,      // 3 seconds
    interactionCount: 2,   // 2 interactions
    memoryUsage: 100,     // 100MB memory threshold
    idleTime: 2000,       // 2 seconds idle time
  },
  behavior: {
    enableScrollPreload: true,
    enableHoverPreload: true,
    enableIdlePreload: true,
    enablePredictivePreload: true,
    maxConcurrentPreloads: 3,
    preloadDelay: 100,    // 100ms delay
  },
  network: {
    slowConnectionThreshold: 1000,  // < 1Mbps
    fastConnectionThreshold: 10000, // > 10Mbps
    respectDataSaver: true,
  },
  device: {
    lowEndDeviceMemory: 4,    // < 4GB RAM
    highEndDeviceMemory: 8,   // > 8GB RAM
    enableMobileOptimizations: true,
  },
  routes: [
    {
      fromRoute: '/',
      toRoute: '/services',
      probability: 0.4,
      conditions: [
        { type: 'scroll', operator: 'gt', value: 30 },
        { type: 'time', operator: 'gt', value: 5000 }
      ]
    },
    {
      fromRoute: '/',
      toRoute: '/case-studies',
      probability: 0.3,
      conditions: [
        { type: 'scroll', operator: 'gt', value: 50 },
        { type: 'interaction', operator: 'gt', value: 2 }
      ]
    },
    {
      fromRoute: '/services',
      toRoute: '/contact',
      probability: 0.6,
      conditions: [
        { type: 'time', operator: 'gt', value: 10000 }
      ]
    },
    {
      fromRoute: '/case-studies',
      toRoute: '/services',
      probability: 0.5,
      conditions: [
        { type: 'scroll', operator: 'gt', value: 60 }
      ]
    }
  ],
  retry: {
    maxRetries: 3,
    retryDelay: 1000,     // 1 second
    backoffMultiplier: 2, // exponential backoff
  }
};

// Environment-specific overrides
export const getPreloadConfig = (): PreloadConfig => {
  const baseConfig = { ...DEFAULT_PRELOAD_CONFIG };
  
  // Development mode - more aggressive preloading for testing
  if (process.env.NODE_ENV === 'development') {
    return {
      ...baseConfig,
      thresholds: {
        ...baseConfig.thresholds,
        scrollDepth: 20,
        dwellTime: 2000,
      },
      behavior: {
        ...baseConfig.behavior,
        preloadDelay: 50,
      }
    };
  }
  
  // Production mode - conservative preloading
  return {
    ...baseConfig,
    thresholds: {
      ...baseConfig.thresholds,
      scrollDepth: 40,
      dwellTime: 4000,
    },
    behavior: {
      ...baseConfig.behavior,
      maxConcurrentPreloads: 2,
      preloadDelay: 200,
    }
  };
};

export default getPreloadConfig();