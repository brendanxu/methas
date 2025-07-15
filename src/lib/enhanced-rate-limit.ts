import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// 限流策略类型
export enum RateLimitStrategy {
  FIXED_WINDOW = 'fixed_window',           // 固定窗口
  SLIDING_WINDOW = 'sliding_window',       // 滑动窗口
  TOKEN_BUCKET = 'token_bucket',           // 令牌桶
  LEAKY_BUCKET = 'leaky_bucket'            // 漏桶
}

// 限流层级
export enum RateLimitTier {
  GLOBAL = 'global',        // 全局限制
  IP = 'ip',               // IP限制
  USER = 'user',           // 用户限制  
  API_KEY = 'api_key',     // API密钥限制
  ENDPOINT = 'endpoint'     // 端点限制
}

// 限流配置接口
export interface RateLimitConfig {
  key: string                    // 限流标识
  strategy: RateLimitStrategy    // 限流策略
  tier: RateLimitTier           // 限流层级
  limit: number                 // 请求数限制
  window: number                // 时间窗口（秒）
  burst?: number                // 突发限制（令牌桶）
  refillRate?: number           // 补充速率（令牌桶）
  enabled: boolean              // 是否启用
  description?: string          // 描述
}

// 限流结果
export interface RateLimitResult {
  allowed: boolean              // 是否允许
  remaining: number             // 剩余次数
  resetTime: number             // 重置时间
  retryAfter?: number           // 重试延迟（秒）
  strategy: RateLimitStrategy   // 使用的策略
  tier: RateLimitTier          // 限流层级
  metadata?: any               // 额外元数据
}

// 限流记录（数据库存储）
interface RateLimitRecord {
  identifier: string            // 标识符（IP、用户ID等）
  configKey: string            // 配置键
  count: number                // 当前计数
  windowStart: Date            // 窗口开始时间
  tokens?: number              // 令牌数（令牌桶）
  lastRequest: Date            // 最后请求时间
}

// 预定义限流配置
export const defaultRateLimitConfigs: Record<string, RateLimitConfig> = {
  // API通用限制
  'api.general': {
    key: 'api.general',
    strategy: RateLimitStrategy.SLIDING_WINDOW,
    tier: RateLimitTier.IP,
    limit: 1000,
    window: 3600, // 1小时
    enabled: true,
    description: 'General API rate limit per IP per hour'
  },

  // 表单提交限制
  'forms.submission': {
    key: 'forms.submission',
    strategy: RateLimitStrategy.FIXED_WINDOW,
    tier: RateLimitTier.IP,
    limit: 10,
    window: 3600, // 1小时
    enabled: true,
    description: 'Form submission limit per IP per hour'
  },

  // 搜索查询限制
  'search.query': {
    key: 'search.query',
    strategy: RateLimitStrategy.TOKEN_BUCKET,
    tier: RateLimitTier.IP,
    limit: 100,
    window: 3600, // 1小时
    burst: 20,
    refillRate: 10, // 每小时补充10个令牌
    enabled: true,
    description: 'Search query rate limit with burst support'
  },

  // 认证相关限制
  'auth.login': {
    key: 'auth.login',
    strategy: RateLimitStrategy.FIXED_WINDOW,
    tier: RateLimitTier.IP,
    limit: 5,
    window: 900, // 15分钟
    enabled: true,
    description: 'Login attempt rate limit per IP'
  },

  'auth.register': {
    key: 'auth.register',
    strategy: RateLimitStrategy.FIXED_WINDOW,
    tier: RateLimitTier.IP,
    limit: 3,
    window: 3600, // 1小时
    enabled: true,
    description: 'Registration rate limit per IP'
  },

  'auth.password_reset': {
    key: 'auth.password_reset',
    strategy: RateLimitStrategy.FIXED_WINDOW,
    tier: RateLimitTier.IP,
    limit: 3,
    window: 3600, // 1小时
    enabled: true,
    description: 'Password reset request rate limit'
  },

  // 管理员操作限制
  'admin.content_create': {
    key: 'admin.content_create',
    strategy: RateLimitStrategy.SLIDING_WINDOW,
    tier: RateLimitTier.USER,
    limit: 50,
    window: 3600, // 1小时
    enabled: true,
    description: 'Content creation rate limit per user'
  },

  'admin.bulk_operations': {
    key: 'admin.bulk_operations',
    strategy: RateLimitStrategy.FIXED_WINDOW,
    tier: RateLimitTier.USER,
    limit: 10,
    window: 3600, // 1小时
    enabled: true,
    description: 'Bulk operations rate limit per user'
  },

  // 公开API限制
  'public.newsletter': {
    key: 'public.newsletter',
    strategy: RateLimitStrategy.FIXED_WINDOW,
    tier: RateLimitTier.IP,
    limit: 5,
    window: 3600, // 1小时
    enabled: true,
    description: 'Newsletter subscription rate limit'
  },

  'public.contact': {
    key: 'public.contact',
    strategy: RateLimitStrategy.FIXED_WINDOW,
    tier: RateLimitTier.IP,
    limit: 3,
    window: 3600, // 1小时
    enabled: true,
    description: 'Contact form submission rate limit'
  },

  // 文件上传限制
  'upload.files': {
    key: 'upload.files',
    strategy: RateLimitStrategy.TOKEN_BUCKET,
    tier: RateLimitTier.USER,
    limit: 100, // 100MB总量
    window: 3600, // 1小时
    burst: 20,   // 突发20MB
    refillRate: 5, // 每小时补充5MB
    enabled: true,
    description: 'File upload rate limit per user'
  },

  // 严格限制
  'security.suspicious': {
    key: 'security.suspicious',
    strategy: RateLimitStrategy.FIXED_WINDOW,
    tier: RateLimitTier.IP,
    limit: 1,
    window: 86400, // 24小时
    enabled: true,
    description: 'Suspicious activity rate limit'
  }
}

// 增强限流器类
export class EnhancedRateLimiter {
  private memoryCache = new Map<string, any>()
  private configs: Map<string, RateLimitConfig>

  constructor(configs?: Record<string, RateLimitConfig>) {
    this.configs = new Map(Object.entries(configs || defaultRateLimitConfigs))
  }

  // 添加或更新配置
  setConfig(key: string, config: RateLimitConfig): void {
    this.configs.set(key, config)
  }

  // 获取配置
  getConfig(key: string): RateLimitConfig | undefined {
    return this.configs.get(key)
  }

  // 主要限流检查方法
  async checkLimit(
    configKey: string,
    identifier: string,
    weight: number = 1
  ): Promise<RateLimitResult> {
    const config = this.configs.get(configKey)
    if (!config || !config.enabled) {
      return {
        allowed: true,
        remaining: config?.limit || 999,
        resetTime: Date.now() + (config?.window || 3600) * 1000,
        strategy: config?.strategy || RateLimitStrategy.FIXED_WINDOW,
        tier: config?.tier || RateLimitTier.IP
      }
    }

    switch (config.strategy) {
      case RateLimitStrategy.FIXED_WINDOW:
        return this.checkFixedWindow(config, identifier, weight)
      case RateLimitStrategy.SLIDING_WINDOW:
        return this.checkSlidingWindow(config, identifier, weight)
      case RateLimitStrategy.TOKEN_BUCKET:
        return this.checkTokenBucket(config, identifier, weight)
      case RateLimitStrategy.LEAKY_BUCKET:
        return this.checkLeakyBucket(config, identifier, weight)
      default:
        throw new Error(`Unsupported rate limit strategy: ${config.strategy}`)
    }
  }

  // 固定窗口算法
  private async checkFixedWindow(
    config: RateLimitConfig,
    identifier: string,
    weight: number
  ): Promise<RateLimitResult> {
    const now = new Date()
    const windowStart = new Date(Math.floor(now.getTime() / (config.window * 1000)) * config.window * 1000)
    const cacheKey = `${config.key}:${identifier}:${windowStart.getTime()}`

    // 尝试从内存缓存获取
    let record = this.memoryCache.get(cacheKey)
    
    if (!record) {
      // 从数据库获取（在实际环境中）
      record = await this.getRecordFromDB(config.key, identifier, windowStart)
      if (!record) {
        record = {
          identifier,
          configKey: config.key,
          count: 0,
          windowStart,
          lastRequest: now
        }
      }
    }

    // 检查是否超限
    if (record.count + weight > config.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: windowStart.getTime() + config.window * 1000,
        retryAfter: config.window - Math.floor((now.getTime() - windowStart.getTime()) / 1000),
        strategy: config.strategy,
        tier: config.tier
      }
    }

    // 更新计数
    record.count += weight
    record.lastRequest = now

    // 更新缓存和数据库
    this.memoryCache.set(cacheKey, record)
    await this.saveRecordToDB(record)

    return {
      allowed: true,
      remaining: config.limit - record.count,
      resetTime: windowStart.getTime() + config.window * 1000,
      strategy: config.strategy,
      tier: config.tier
    }
  }

  // 滑动窗口算法
  private async checkSlidingWindow(
    config: RateLimitConfig,
    identifier: string,
    weight: number
  ): Promise<RateLimitResult> {
    const now = Date.now()
    const windowStart = now - config.window * 1000
    const cacheKey = `${config.key}:${identifier}:sliding`

    // 获取滑动窗口内的请求记录
    let requests = this.memoryCache.get(cacheKey) || []
    
    // 清理过期请求
    requests = requests.filter((timestamp: number) => timestamp > windowStart)

    // 检查是否超限
    if (requests.length + weight > config.limit) {
      const oldestRequest = Math.min(...requests)
      const retryAfter = Math.ceil((oldestRequest + config.window * 1000 - now) / 1000)
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: oldestRequest + config.window * 1000,
        retryAfter,
        strategy: config.strategy,
        tier: config.tier
      }
    }

    // 添加新请求
    for (let i = 0; i < weight; i++) {
      requests.push(now)
    }

    // 更新缓存
    this.memoryCache.set(cacheKey, requests)

    return {
      allowed: true,
      remaining: config.limit - requests.length,
      resetTime: now + config.window * 1000,
      strategy: config.strategy,
      tier: config.tier
    }
  }

  // 令牌桶算法
  private async checkTokenBucket(
    config: RateLimitConfig,
    identifier: string,
    weight: number
  ): Promise<RateLimitResult> {
    const now = Date.now()
    const cacheKey = `${config.key}:${identifier}:bucket`

    let bucket = this.memoryCache.get(cacheKey)
    
    if (!bucket) {
      bucket = {
        tokens: config.burst || config.limit,
        lastRefill: now,
        capacity: config.burst || config.limit
      }
    }

    // 计算需要补充的令牌
    const timePassed = (now - bucket.lastRefill) / 1000
    const refillRate = config.refillRate || (config.limit / config.window)
    const tokensToAdd = Math.floor(timePassed * refillRate)

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd)
      bucket.lastRefill = now
    }

    // 检查是否有足够令牌
    if (bucket.tokens < weight) {
      const tokensNeeded = weight - bucket.tokens
      const timeToWait = Math.ceil(tokensNeeded / refillRate)
      
      return {
        allowed: false,
        remaining: bucket.tokens,
        resetTime: now + timeToWait * 1000,
        retryAfter: timeToWait,
        strategy: config.strategy,
        tier: config.tier,
        metadata: { tokens: bucket.tokens, capacity: bucket.capacity }
      }
    }

    // 消耗令牌
    bucket.tokens -= weight

    // 更新缓存
    this.memoryCache.set(cacheKey, bucket)

    return {
      allowed: true,
      remaining: bucket.tokens,
      resetTime: now + (bucket.capacity - bucket.tokens) / refillRate * 1000,
      strategy: config.strategy,
      tier: config.tier,
      metadata: { tokens: bucket.tokens, capacity: bucket.capacity }
    }
  }

  // 漏桶算法
  private async checkLeakyBucket(
    config: RateLimitConfig,
    identifier: string,
    weight: number
  ): Promise<RateLimitResult> {
    const now = Date.now()
    const cacheKey = `${config.key}:${identifier}:leaky`

    let bucket = this.memoryCache.get(cacheKey)
    
    if (!bucket) {
      bucket = {
        volume: 0,
        lastLeak: now,
        capacity: config.limit
      }
    }

    // 计算漏掉的水量
    const timePassed = (now - bucket.lastLeak) / 1000
    const leakRate = config.limit / config.window
    const volumeToLeak = timePassed * leakRate

    bucket.volume = Math.max(0, bucket.volume - volumeToLeak)
    bucket.lastLeak = now

    // 检查是否溢出
    if (bucket.volume + weight > bucket.capacity) {
      const excessVolume = bucket.volume + weight - bucket.capacity
      const timeToWait = Math.ceil(excessVolume / leakRate)
      
      return {
        allowed: false,
        remaining: Math.floor(bucket.capacity - bucket.volume),
        resetTime: now + timeToWait * 1000,
        retryAfter: timeToWait,
        strategy: config.strategy,
        tier: config.tier,
        metadata: { volume: bucket.volume, capacity: bucket.capacity }
      }
    }

    // 添加到桶中
    bucket.volume += weight

    // 更新缓存
    this.memoryCache.set(cacheKey, bucket)

    return {
      allowed: true,
      remaining: Math.floor(bucket.capacity - bucket.volume),
      resetTime: now + bucket.volume / leakRate * 1000,
      strategy: config.strategy,
      tier: config.tier,
      metadata: { volume: bucket.volume, capacity: bucket.capacity }
    }
  }

  // 从数据库获取记录（模拟）
  private async getRecordFromDB(
    configKey: string,
    identifier: string,
    windowStart: Date
  ): Promise<RateLimitRecord | null> {
    // 在实际应用中，这里会查询数据库
    // 目前返回null，使用内存缓存
    return null
  }

  // 保存记录到数据库（模拟）
  private async saveRecordToDB(record: RateLimitRecord): Promise<void> {
    // 在实际应用中，这里会保存到数据库
    // 目前仅记录日志
    // Debug log removed for production
  }

  // 获取限流状态
  async getStatus(configKey: string, identifier: string): Promise<any> {
    const config = this.configs.get(configKey)
    if (!config) return null

    // 根据策略返回不同的状态信息
    switch (config.strategy) {
      case RateLimitStrategy.FIXED_WINDOW:
        return this.getFixedWindowStatus(config, identifier)
      case RateLimitStrategy.SLIDING_WINDOW:
        return this.getSlidingWindowStatus(config, identifier)
      case RateLimitStrategy.TOKEN_BUCKET:
        return this.getTokenBucketStatus(config, identifier)
      case RateLimitStrategy.LEAKY_BUCKET:
        return this.getLeakyBucketStatus(config, identifier)
      default:
        return null
    }
  }

  // 获取固定窗口状态
  private getFixedWindowStatus(config: RateLimitConfig, identifier: string): any {
    const now = new Date()
    const windowStart = new Date(Math.floor(now.getTime() / (config.window * 1000)) * config.window * 1000)
    const cacheKey = `${config.key}:${identifier}:${windowStart.getTime()}`
    
    const record = this.memoryCache.get(cacheKey)
    return {
      strategy: config.strategy,
      current: record?.count || 0,
      limit: config.limit,
      remaining: config.limit - (record?.count || 0),
      resetTime: windowStart.getTime() + config.window * 1000,
      windowStart: windowStart.getTime()
    }
  }

  // 获取滑动窗口状态
  private getSlidingWindowStatus(config: RateLimitConfig, identifier: string): any {
    const now = Date.now()
    const windowStart = now - config.window * 1000
    const cacheKey = `${config.key}:${identifier}:sliding`
    
    let requests = this.memoryCache.get(cacheKey) || []
    requests = requests.filter((timestamp: number) => timestamp > windowStart)
    
    return {
      strategy: config.strategy,
      current: requests.length,
      limit: config.limit,
      remaining: config.limit - requests.length,
      resetTime: requests.length > 0 ? Math.min(...requests) + config.window * 1000 : now + config.window * 1000,
      windowStart
    }
  }

  // 获取令牌桶状态
  private getTokenBucketStatus(config: RateLimitConfig, identifier: string): any {
    const cacheKey = `${config.key}:${identifier}:bucket`
    const bucket = this.memoryCache.get(cacheKey)
    
    return {
      strategy: config.strategy,
      tokens: bucket?.tokens || (config.burst || config.limit),
      capacity: config.burst || config.limit,
      refillRate: config.refillRate || (config.limit / config.window),
      lastRefill: bucket?.lastRefill || Date.now()
    }
  }

  // 获取漏桶状态
  private getLeakyBucketStatus(config: RateLimitConfig, identifier: string): any {
    const cacheKey = `${config.key}:${identifier}:leaky`
    const bucket = this.memoryCache.get(cacheKey)
    
    return {
      strategy: config.strategy,
      volume: bucket?.volume || 0,
      capacity: config.limit,
      leakRate: config.limit / config.window,
      lastLeak: bucket?.lastLeak || Date.now()
    }
  }

  // 重置限流
  async reset(configKey: string, identifier?: string): Promise<void> {
    if (identifier) {
      // 重置特定标识符的限流
      const keysToDelete = Array.from(this.memoryCache.keys())
        .filter(key => key.includes(`${configKey}:${identifier}`))
      
      keysToDelete.forEach(key => this.memoryCache.delete(key))
    } else {
      // 重置所有相关限流
      const keysToDelete = Array.from(this.memoryCache.keys())
        .filter(key => key.startsWith(`${configKey}:`))
      
      keysToDelete.forEach(key => this.memoryCache.delete(key))
    }
  }

  // 清空所有缓存
  clear(): void {
    this.memoryCache.clear()
  }

  // 获取统计信息
  getStats(): any {
    return {
      totalConfigs: this.configs.size,
      enabledConfigs: Array.from(this.configs.values()).filter(c => c.enabled).length,
      cacheSize: this.memoryCache.size,
      strategies: Array.from(new Set(Array.from(this.configs.values()).map(c => c.strategy))),
      tiers: Array.from(new Set(Array.from(this.configs.values()).map(c => c.tier)))
    }
  }
}

// 获取标识符的工具函数
export function getIdentifier(request: NextRequest, tier: RateLimitTier, userId?: string): string {
  switch (tier) {
    case RateLimitTier.GLOBAL:
      return 'global'
    case RateLimitTier.IP:
      return getClientIP(request)
    case RateLimitTier.USER:
      return userId || getClientIP(request)
    case RateLimitTier.API_KEY:
      return request.headers.get('x-api-key') || getClientIP(request)
    case RateLimitTier.ENDPOINT:
      return `${getClientIP(request)}:${new URL(request.url).pathname}`
    default:
      return getClientIP(request)
  }
}

// 获取客户端IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  return 'unknown'
}

// 创建限流响应头
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
    'X-RateLimit-Strategy': result.strategy,
    'X-RateLimit-Tier': result.tier
  }

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString()
  }

  return headers
}

// 全局限流器实例
export const globalRateLimiter = new EnhancedRateLimiter()

// 便捷的检查函数
export async function checkRateLimit(
  configKey: string,
  request: NextRequest,
  userId?: string,
  weight: number = 1
): Promise<RateLimitResult> {
  const config = globalRateLimiter.getConfig(configKey)
  if (!config) {
    throw new Error(`Rate limit config not found: ${configKey}`)
  }

  const identifier = getIdentifier(request, config.tier, userId)
  return globalRateLimiter.checkLimit(configKey, identifier, weight)
}