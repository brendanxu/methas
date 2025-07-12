/**
 * Enhanced TypeScript Types for Preload System
 * 
 * Provides strict type safety for all preload-related functionality
 */

import { ComponentType } from 'react';

// ===== Core Types =====

export type PreloadPriority = 'high' | 'medium' | 'low';
export type PreloadStatus = 'pending' | 'loading' | 'success' | 'failed' | 'cancelled';
export type ConnectionType = '2g' | '3g' | '4g' | 'slow-2g';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type PreloadTrigger = 'scroll' | 'hover' | 'idle' | 'predictive' | 'manual';

// ===== Configuration Types =====

export interface PreloadThresholds {
  readonly scrollDepth: number;
  readonly dwellTime: number;
  readonly interactionCount: number;
  readonly memoryUsage: number;
  readonly idleTime: number;
}

export interface PreloadBehaviorSettings {
  readonly enableScrollPreload: boolean;
  readonly enableHoverPreload: boolean;
  readonly enableIdlePreload: boolean;
  readonly enablePredictivePreload: boolean;
  readonly maxConcurrentPreloads: number;
  readonly preloadDelay: number;
}

export interface NetworkSettings {
  readonly slowConnectionThreshold: number;
  readonly fastConnectionThreshold: number;
  readonly respectDataSaver: boolean;
}

export interface DeviceSettings {
  readonly lowEndDeviceMemory: number;
  readonly highEndDeviceMemory: number;
  readonly enableMobileOptimizations: boolean;
}

export interface RetrySettings {
  readonly maxRetries: number;
  readonly retryDelay: number;
  readonly backoffMultiplier: number;
}

// ===== Condition and Rule Types =====

export type ConditionType = 'scroll' | 'time' | 'interaction' | 'device' | 'connection';
export type ConditionOperator = 'gt' | 'lt' | 'eq' | 'includes';

export interface PreloadCondition<T = number | string> {
  readonly type: ConditionType;
  readonly operator: ConditionOperator;
  readonly value: T;
}

export interface RoutePreloadRule {
  readonly fromRoute: string;
  readonly toRoute: string;
  readonly probability: number;
  readonly conditions: readonly PreloadCondition[];
}

// ===== Device and Network Information =====

export interface DeviceInfo {
  readonly memory?: number;
  readonly hardwareConcurrency?: number;
  readonly isMobile: boolean;
  readonly isLowEnd: boolean;
  readonly deviceType: DeviceType;
}

export interface NetworkInfo {
  readonly effectiveType?: ConnectionType;
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  readonly isSlowConnection: boolean;
}

// ===== User Behavior Types =====

export interface UserBehavior {
  readonly scrollDepth: number;
  readonly dwellTime: number;
  readonly interactionCount: number;
  readonly currentRoute: string;
  readonly previousRoutes: readonly string[];
  readonly sessionStartTime: number;
  readonly lastInteractionTime: number;
  readonly deviceInfo: DeviceInfo;
  readonly networkInfo: NetworkInfo;
}

// ===== Route Prediction Types =====

export interface RoutePrediction {
  readonly route: string;
  readonly probability: number;
  readonly confidence: number;
  readonly reasons: readonly string[];
  readonly trigger: PreloadTrigger;
}

export interface NavigationPattern {
  readonly fromRoute: string;
  readonly toRoute: string;
  readonly count: number;
  readonly lastVisited: number;
  readonly averageTime: number;
}

// ===== Preload Request Types =====

export interface PreloadOptions<T = any> {
  readonly priority?: PreloadPriority;
  readonly route?: string;
  readonly component?: string;
  readonly onSuccess?: (result: T) => void;
  readonly onError?: (error: PreloadError) => void;
  readonly maxRetries?: number;
  readonly timeout?: number;
  readonly trigger?: PreloadTrigger;
}

export interface PreloadRequest<T = any> {
  readonly id: string;
  readonly importFn: () => Promise<{ default: ComponentType<T> }>;
  readonly priority: PreloadPriority;
  readonly route?: string;
  readonly component?: string;
  readonly retryCount: number;
  readonly maxRetries: number;
  readonly createdAt: number;
  readonly lastAttempt?: number;
  readonly status: PreloadStatus;
  readonly error?: PreloadError;
  readonly trigger: PreloadTrigger;
  readonly onSuccess?: (result: any) => void;
  readonly onError?: (error: PreloadError) => void;
}

// ===== Error Types =====

export class PreloadError extends Error {
  constructor(
    message: string,
    public readonly code: PreloadErrorCode,
    public readonly requestId?: string,
    public readonly retryCount?: number,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'PreloadError';
  }
}

export type PreloadErrorCode = 
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'MODULE_NOT_FOUND'
  | 'PARSE_ERROR'
  | 'MEMORY_LIMIT'
  | 'RATE_LIMIT'
  | 'CANCELLED'
  | 'UNKNOWN';

// ===== Statistics and Metrics Types =====

export interface PreloadStats {
  readonly totalRequests: number;
  readonly successfulRequests: number;
  readonly failedRequests: number;
  readonly cancelledRequests: number;
  readonly averageLoadTime: number;
  readonly cacheHitRate: number;
  readonly errorsByCode: Readonly<Record<PreloadErrorCode, number>>;
}

export interface PerformanceMetrics {
  readonly memoryUsage: number;
  readonly loadTime: number;
  readonly cacheHitRate: number;
  readonly preloadSuccess: number;
  readonly preloadFailure: number;
  readonly routePredictions: readonly RoutePrediction[];
  readonly engagementScore: number;
  readonly networkLatency?: number;
  readonly bundleSize?: number;
}

export interface QueueStatus {
  readonly pending: number;
  readonly loading: number;
  readonly total: number;
  readonly capacity: number;
  readonly utilizationRate: number;
}

export interface NavigationStats {
  readonly totalPatterns: number;
  readonly totalTransitions: number;
  readonly mostVisitedRoute: string | null;
  readonly averageSessionTime: number;
  readonly uniqueRoutes: number;
}

// ===== Hook Types =====

export interface UsePreloadReturn {
  readonly preloadComponent: <T = any>(
    importFn: () => Promise<{ default: ComponentType<T> }>,
    options?: PreloadOptions<T>
  ) => string;
  readonly preloadRoute: (route: string, options?: PreloadOptions) => void;
  readonly getMetrics: () => PerformanceMetrics;
  readonly getBehavior: () => UserBehavior | null;
  readonly getPredictions: () => readonly RoutePrediction[];
  readonly clearCache: () => void;
  readonly isReady: boolean;
}

export interface UseHoverPreloadReturn {
  readonly onMouseEnter: () => void;
  readonly onMouseLeave?: () => void;
  readonly isPreloaded: boolean;
  readonly isLoading: boolean;
}

export interface UseScrollPreloadReturn<T = HTMLElement> {
  readonly ref: React.RefObject<T>;
  readonly isPreloaded: boolean;
  readonly isVisible: boolean;
  readonly intersectionRatio: number;
}

export interface UseRoutePreloaderOptions extends PreloadOptions {
  readonly immediate?: boolean;
  readonly conditions?: readonly PreloadCondition[];
}

// ===== Factory Types =====

export type DynamicComponentFactory<P = {}> = (
  importFn: () => Promise<{ default: ComponentType<P> }>
) => ComponentType<P>;

export type PreloadComponentFactory<P = {}> = (
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: PreloadOptions<P>
) => {
  Component: ComponentType<P>;
  preload: () => Promise<void>;
  isPreloaded: () => boolean;
};

// ===== Event Types =====

export interface PreloadEvent {
  readonly type: 'preload_start' | 'preload_success' | 'preload_error' | 'preload_cancel';
  readonly requestId: string;
  readonly timestamp: number;
  readonly route?: string;
  readonly component?: string;
  readonly error?: PreloadError;
  readonly loadTime?: number;
}

export type PreloadEventHandler = (event: PreloadEvent) => void;

// ===== Utility Types =====

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ===== Environment Types =====

export interface PreloadEnvironment {
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isBrowser: boolean;
  readonly isServer: boolean;
  readonly supportsIdleCallback: boolean;
  readonly supportsIntersectionObserver: boolean;
  readonly supportsServiceWorker: boolean;
}