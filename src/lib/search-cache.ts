// 搜索缓存管理
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class SearchCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 100, defaultTTL: number = 5 * 60 * 1000) { // 5分钟默认TTL
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    
    // 定期清理过期缓存
    setInterval(() => this.cleanup(), 60 * 1000); // 每分钟清理一次
  }

  // 生成缓存键
  private generateKey(query: string, filters: Record<string, unknown>): string {
    const normalizedQuery = query.toLowerCase().trim();
    const sortedFilters = Object.keys(filters)
      .sort()
      .map(key => `${key}:${filters[key]}`)
      .join('|');
    return `${normalizedQuery}::${sortedFilters}`;
  }

  // 设置缓存
  set(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);
    
    // 检查缓存大小限制
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  // 获取缓存
  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // 带查询和筛选器的缓存操作
  setWithQuery(query: string, filters: Record<string, unknown>, data: T, ttl?: number): void {
    const key = this.generateKey(query, filters);
    this.set(key, data, ttl);
  }

  getWithQuery(query: string, filters: Record<string, unknown>): T | null {
    const key = this.generateKey(query, filters);
    return this.get(key);
  }

  // 清理过期缓存
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // 移除最旧的缓存项
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // 清空缓存
  clear(): void {
    this.cache.clear();
  }

  // 获取缓存统计
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // 需要实现命中率跟踪
    };
  }
}

// 搜索结果缓存
export const searchResultsCache = new SearchCache<unknown>(200, 10 * 60 * 1000); // 10分钟

// 搜索建议缓存
export const searchSuggestionsCache = new SearchCache<unknown>(50, 30 * 60 * 1000); // 30分钟

// 防抖缓存 - 用于防止重复搜索
class DebounceCache {
  private pending = new Map<string, Promise<unknown>>();
  
  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // 如果已有相同的请求在处理中，返回同一个Promise
    if (this.pending.has(key)) {
      return this.pending.get(key) as Promise<T>;
    }
    
    // 创建新的请求
    const promise = fetcher()
      .finally(() => {
        // 请求完成后清理
        this.pending.delete(key);
      });
    
    this.pending.set(key, promise);
    return promise;
  }
  
  clear(): void {
    this.pending.clear();
  }
}

export const debounceCache = new DebounceCache();

// 本地存储缓存管理
export class LocalStorageCache {
  private prefix: string;
  
  constructor(prefix: string = 'search_') {
    this.prefix = prefix;
  }
  
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
  
  set(key: string, data: unknown, ttl?: number): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiresAt: ttl ? Date.now() + ttl : null,
      };
      
      localStorage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }
  
  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.getKey(key));
      if (!stored) return null;
      
      const item = JSON.parse(stored);
      
      // 检查是否过期
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.remove(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }
  
  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
  
  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
  
  // 清理过期项
  cleanup(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
      const now = Date.now();
      
      keys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const item = JSON.parse(stored);
            if (item.expiresAt && now > item.expiresAt) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // 删除损坏的项
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup localStorage:', error);
    }
  }
}

// 搜索历史本地缓存
export const searchHistoryCache = new LocalStorageCache('search_history_');

// 用户偏好缓存
export const userPreferencesCache = new LocalStorageCache('search_prefs_');

// 性能监控
export class SearchPerformanceMonitor {
  private metrics: {
    searchCount: number;
    totalTime: number;
    cacheHits: number;
    errors: number;
  } = {
    searchCount: 0,
    totalTime: 0,
    cacheHits: 0,
    errors: 0,
  };
  
  recordSearch(duration: number, fromCache: boolean = false): void {
    this.metrics.searchCount++;
    this.metrics.totalTime += duration;
    
    if (fromCache) {
      this.metrics.cacheHits++;
    }
  }
  
  recordError(): void {
    this.metrics.errors++;
  }
  
  getStats(): {
    totalSearches: number;
    avgResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  } {
    const { searchCount, totalTime, cacheHits, errors } = this.metrics;
    
    return {
      totalSearches: searchCount,
      avgResponseTime: searchCount > 0 ? totalTime / searchCount : 0,
      cacheHitRate: searchCount > 0 ? cacheHits / searchCount : 0,
      errorRate: searchCount > 0 ? errors / searchCount : 0,
    };
  }
  
  reset(): void {
    this.metrics = {
      searchCount: 0,
      totalTime: 0,
      cacheHits: 0,
      errors: 0,
    };
  }
}

export const performanceMonitor = new SearchPerformanceMonitor();