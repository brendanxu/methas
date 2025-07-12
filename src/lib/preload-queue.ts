/**
 * Preload Queue
 * 
 * Manages preload requests with retry logic and error handling
 */

import { PreloadConfig } from './preload-config';

export interface PreloadRequest {
  id: string;
  importFn: () => Promise<any>;
  priority: 'high' | 'medium' | 'low';
  route?: string;
  component?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: number;
  lastAttempt?: number;
  status: 'pending' | 'loading' | 'success' | 'failed' | 'cancelled';
  error?: Error;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export interface PreloadStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  cancelledRequests: number;
  averageLoadTime: number;
  cacheHitRate: number;
}

export class PreloadQueue {
  private config: PreloadConfig;
  private queue: Map<string, PreloadRequest> = new Map();
  private cache: Map<string, { result: any; timestamp: number }> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  private stats: PreloadStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    cancelledRequests: 0,
    averageLoadTime: 0,
    cacheHitRate: 0,
  };
  private processingInterval?: NodeJS.Timeout;
  private isProcessing: boolean = false;

  constructor(config: PreloadConfig) {
    this.config = config;
    this.startProcessing();
  }

  private generateRequestId(importFn: Function, route?: string, component?: string): string {
    const fnString = importFn.toString();
    const hash = this.simpleHash(fnString + (route || '') + (component || ''));
    return `preload_${hash}_${Date.now()}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private getCacheKey(importFn: Function): string {
    return this.simpleHash(importFn.toString());
  }

  private startProcessing(): void {
    if (typeof window === 'undefined') return;

    this.processingInterval = setInterval(() => {
      if (!this.isProcessing) {
        this.processQueue();
      }
    }, this.config.behavior.preloadDelay);
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;

    try {
      const pendingRequests = Array.from(this.queue.values())
        .filter(req => req.status === 'pending')
        .sort((a, b) => {
          // Sort by priority, then by creation time
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          return priorityDiff !== 0 ? priorityDiff : a.createdAt - b.createdAt;
        });

      const currentlyLoading = Array.from(this.queue.values())
        .filter(req => req.status === 'loading').length;

      const availableSlots = this.config.behavior.maxConcurrentPreloads - currentlyLoading;
      const requestsToProcess = pendingRequests.slice(0, availableSlots);

      await Promise.all(
        requestsToProcess.map(request => this.processRequest(request))
      );
    } catch (error) {
      console.warn('Error processing preload queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processRequest(request: PreloadRequest): Promise<void> {
    const cacheKey = this.getCacheKey(request.importFn);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.handleSuccess(request, cached.result, true);
      return;
    }

    // Check if already loading
    const existingPromise = this.loadingPromises.get(cacheKey);
    if (existingPromise) {
      try {
        const result = await existingPromise;
        this.handleSuccess(request, result, false);
      } catch (error) {
        this.handleError(request, error as Error);
      }
      return;
    }

    // Start new load
    request.status = 'loading';
    request.lastAttempt = Date.now();

    const loadPromise = this.executeWithTimeout(request.importFn(), 30000); // 30s timeout
    this.loadingPromises.set(cacheKey, loadPromise);

    try {
      const startTime = Date.now();
      const result = await loadPromise;
      const loadTime = Date.now() - startTime;

      // Cache the result
      this.cache.set(cacheKey, { result, timestamp: Date.now() });
      
      // Update average load time
      this.updateAverageLoadTime(loadTime);
      
      this.handleSuccess(request, result, false);
    } catch (error) {
      this.handleError(request, error as Error);
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Preload timeout')), timeoutMs)
      )
    ]);
  }

  private handleSuccess(request: PreloadRequest, result: any, fromCache: boolean): void {
    request.status = 'success';
    this.stats.successfulRequests++;
    
    if (fromCache) {
      this.stats.cacheHitRate = this.stats.successfulRequests > 0
        ? (this.stats.cacheHitRate * (this.stats.successfulRequests - 1) + 1) / this.stats.successfulRequests
        : 1;
    }

    try {
      request.onSuccess?.(result);
    } catch (error) {
      console.warn('Error in preload success callback:', error);
    }

    // Clean up completed request after a delay
    setTimeout(() => {
      this.queue.delete(request.id);
    }, 5000);
  }

  private handleError(request: PreloadRequest, error: Error): void {
    request.error = error;
    request.retryCount++;

    if (request.retryCount < request.maxRetries) {
      // Schedule retry with exponential backoff
      const delay = this.config.retry.retryDelay * 
        Math.pow(this.config.retry.backoffMultiplier, request.retryCount - 1);
      
      setTimeout(() => {
        if (request.status !== 'cancelled') {
          request.status = 'pending';
        }
      }, delay);
    } else {
      // Max retries reached
      request.status = 'failed';
      this.stats.failedRequests++;

      try {
        request.onError?.(error);
      } catch (callbackError) {
        console.warn('Error in preload error callback:', callbackError);
      }

      console.warn(`Preload failed after ${request.retryCount} attempts:`, {
        route: request.route,
        component: request.component,
        error: error.message
      });

      // Clean up failed request
      setTimeout(() => {
        this.queue.delete(request.id);
      }, 10000);
    }
  }

  private updateAverageLoadTime(loadTime: number): void {
    const total = this.stats.successfulRequests;
    if (total === 1) {
      this.stats.averageLoadTime = loadTime;
    } else {
      this.stats.averageLoadTime = (this.stats.averageLoadTime * (total - 1) + loadTime) / total;
    }
  }

  // Public API
  public enqueue(
    importFn: () => Promise<any>,
    options: {
      priority?: 'high' | 'medium' | 'low';
      route?: string;
      component?: string;
      onSuccess?: (result: any) => void;
      onError?: (error: Error) => void;
      maxRetries?: number;
    } = {}
  ): string {
    const request: PreloadRequest = {
      id: this.generateRequestId(importFn, options.route, options.component),
      importFn,
      priority: options.priority || 'medium',
      route: options.route,
      component: options.component,
      retryCount: 0,
      maxRetries: options.maxRetries ?? this.config.retry.maxRetries,
      createdAt: Date.now(),
      status: 'pending',
      onSuccess: options.onSuccess,
      onError: options.onError,
    };

    this.queue.set(request.id, request);
    this.stats.totalRequests++;

    // Try to process immediately if we have available slots
    if (!this.isProcessing) {
      this.processQueue();
    }

    return request.id;
  }

  public cancel(requestId: string): boolean {
    const request = this.queue.get(requestId);
    if (request && request.status !== 'success') {
      request.status = 'cancelled';
      this.stats.cancelledRequests++;
      this.queue.delete(requestId);
      return true;
    }
    return false;
  }

  public getRequest(requestId: string): PreloadRequest | undefined {
    return this.queue.get(requestId);
  }

  public getQueueStatus(): {
    pending: number;
    loading: number;
    total: number;
  } {
    const requests = Array.from(this.queue.values());
    return {
      pending: requests.filter(r => r.status === 'pending').length,
      loading: requests.filter(r => r.status === 'loading').length,
      total: requests.length,
    };
  }

  public getStats(): PreloadStats {
    return { ...this.stats };
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public clearQueue(): void {
    Array.from(this.queue.keys()).forEach(id => this.cancel(id));
  }

  public destroy(): void {
    this.clearQueue();
    this.clearCache();
    this.loadingPromises.clear();
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
    }
  }

  // Debug helpers
  public debugQueue(): void {
    const requests = Array.from(this.queue.values());
    console.group('Preload Queue Debug');
    console.log('Queue status:', this.getQueueStatus());
    console.log('Stats:', this.getStats());
    console.table(requests.map(r => ({
      id: r.id.substring(0, 16) + '...',
      status: r.status,
      priority: r.priority,
      retries: r.retryCount,
      route: r.route,
      component: r.component,
      age: Date.now() - r.createdAt
    })));
    console.groupEnd();
  }
}