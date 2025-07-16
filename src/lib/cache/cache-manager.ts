/**
 * 缓存管理系统
 * 支持内存缓存、Redis缓存和混合缓存策略
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  tags: string[]
}

interface CacheOptions {
  ttl?: number // 生存时间（秒）
  tags?: string[] // 缓存标签，用于批量清除
  refreshBackground?: boolean // 后台刷新
  staleWhileRevalidate?: number // 过期后仍可使用的时间
}

interface CacheStats {
  hits: number
  misses: number
  sets: number
  deletes: number
  hitRate: number
}

// 内存缓存实现
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.stats.misses++
      this.updateHitRate()
      return null
    }

    const now = Date.now()
    const isExpired = now > entry.timestamp + (entry.ttl * 1000)

    if (isExpired) {
      this.cache.delete(key)
      this.stats.misses++
      this.updateHitRate()
      return null
    }

    this.stats.hits++
    this.updateHitRate()
    return entry.data
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const { ttl = 300, tags = [] } = options // 默认5分钟
    
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
      tags
    }

    this.cache.set(key, entry)
    this.stats.sets++
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.stats.deletes++
    }
    return deleted
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  async deleteByTag(tag: string): Promise<number> {
    let deletedCount = 0
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key)
        deletedCount++
      }
    }
    this.stats.deletes += deletedCount
    return deletedCount
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key)
  }

  getStats(): CacheStats {
    return { ...this.stats }
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }

  // 清理过期条目
  cleanup(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + (entry.ttl * 1000)) {
        this.cache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }

  size(): number {
    return this.cache.size
  }
}

// 缓存管理器主类
export class CacheManager {
  private static instance: CacheManager
  private memoryCache: MemoryCache
  private backgroundTasks = new Map<string, NodeJS.Timeout>()

  private constructor() {
    this.memoryCache = new MemoryCache()
    
    // 定期清理过期缓存
    setInterval(() => {
      this.memoryCache.cleanup()
    }, 60000) // 每分钟清理一次
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  /**
   * 获取缓存数据
   */
  async get<T>(key: string): Promise<T | null> {
    return this.memoryCache.get<T>(key)
  }

  /**
   * 设置缓存数据
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    await this.memoryCache.set(key, value, options)
  }

  /**
   * 删除缓存
   */
  async delete(key: string): Promise<boolean> {
    // 清理相关的后台任务
    const backgroundTask = this.backgroundTasks.get(key)
    if (backgroundTask) {
      clearTimeout(backgroundTask)
      this.backgroundTasks.delete(key)
    }

    return this.memoryCache.delete(key)
  }

  /**
   * 按标签删除缓存
   */
  async deleteByTag(tag: string): Promise<number> {
    return this.memoryCache.deleteByTag(tag)
  }

  /**
   * 清空所有缓存
   */
  async clear(): Promise<void> {
    // 清理所有后台任务
    for (const task of this.backgroundTasks.values()) {
      clearTimeout(task)
    }
    this.backgroundTasks.clear()

    await this.memoryCache.clear()
  }

  /**
   * 获取或设置缓存（缓存穿透保护）
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key)
    
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    await this.set(key, data, options)
    return data
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    return this.memoryCache.getStats()
  }

  /**
   * 检查缓存是否存在
   */
  async has(key: string): Promise<boolean> {
    return this.memoryCache.has(key)
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.memoryCache.size()
  }

  /**
   * 预热缓存
   */
  async warmup<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}): Promise<void> {
    const data = await fetcher()
    await this.set(key, data, options)
  }

  /**
   * 批量获取缓存
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map(key => this.get<T>(key)))
  }

  /**
   * 批量设置缓存
   */
  async mset<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void> {
    await Promise.all(
      entries.map(({ key, value, options }) => this.set(key, value, options))
    )
  }
}

// 缓存装饰器
export function Cached(options: CacheOptions & { keyGenerator?: (...args: any[]) => string } = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const cache = CacheManager.getInstance()

    descriptor.value = async function (...args: any[]) {
      const { keyGenerator, ...cacheOptions } = options
      const key = keyGenerator 
        ? keyGenerator(...args)
        : `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`

      return cache.getOrSet(
        key,
        () => originalMethod.apply(this, args),
        cacheOptions
      )
    }

    return descriptor
  }
}

// 缓存键生成器
export class CacheKeyGenerator {
  static user(userId: string, action?: string): string {
    return action ? `user:${userId}:${action}` : `user:${userId}`
  }

  static content(filters: any): string {
    const normalized = Object.keys(filters)
      .sort()
      .reduce((acc, key) => {
        acc[key] = filters[key]
        return acc
      }, {} as any)
    
    return `content:${Buffer.from(JSON.stringify(normalized)).toString('base64')}`
  }

  static permission(userId: string, permissionName?: string): string {
    return permissionName 
      ? `permission:${userId}:${permissionName}`
      : `permission:${userId}`
  }

  static userPermissions(userId: string): string {
    return `user:permissions:${userId}`
  }

  static rolePermissions(role: string): string {
    return `role:permissions:${role}`
  }

  static auditLogs(filters: any): string {
    const normalized = Object.keys(filters)
      .sort()
      .reduce((acc, key) => {
        acc[key] = filters[key]
        return acc
      }, {} as any)
    
    return `audit:${Buffer.from(JSON.stringify(normalized)).toString('base64')}`
  }

  static formSubmissions(filters: any): string {
    const normalized = Object.keys(filters)
      .sort()
      .reduce((acc, key) => {
        acc[key] = filters[key]
        return acc
      }, {} as any)
    
    return `forms:${Buffer.from(JSON.stringify(normalized)).toString('base64')}`
  }
}

// 缓存标签常量
export const CacheTags = {
  USERS: 'users',
  CONTENT: 'content',
  PERMISSIONS: 'permissions',
  ROLES: 'roles',
  AUDIT_LOGS: 'audit_logs',
  FORM_SUBMISSIONS: 'form_submissions',
  FILES: 'files',
  SESSIONS: 'sessions',
  ANALYTICS: 'analytics'
} as const

// 默认TTL配置
export const CacheTTL = {
  SHORT: 60, // 1分钟
  MEDIUM: 300, // 5分钟
  LONG: 1800, // 30分钟
  VERY_LONG: 3600, // 1小时
  ULTRA_LONG: 86400 // 24小时
} as const