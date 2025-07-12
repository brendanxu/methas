// 速率限制实用工具
interface RateLimitOptions {
  interval: number; // 时间窗口（毫秒）
  uniqueTokenPerInterval?: number; // 每个间隔的唯一令牌数
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private cache = new Map<string, RateLimitEntry>();
  private interval: number;
  private uniqueTokenPerInterval: number;

  constructor(options: RateLimitOptions) {
    this.interval = options.interval;
    this.uniqueTokenPerInterval = options.uniqueTokenPerInterval || 500;
  }

  async check(limit: number, token: string): Promise<{ success: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const key = `${token}`;

    // 清理过期条目
    this.cleanup();

    // 获取或创建条目
    let entry = this.cache.get(key);
    
    if (!entry || now >= entry.resetTime) {
      // 创建新条目或重置过期条目
      entry = {
        count: 0,
        resetTime: now + this.interval,
      };
      this.cache.set(key, entry);
    }

    // 检查是否超过限制
    if (entry.count >= limit) {
      throw new Error(`Rate limit exceeded for ${token}`);
    }

    // 增加计数
    entry.count++;

    return {
      success: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    
    // 如果缓存大小超过限制，清理过期条目
    if (this.cache.size > this.uniqueTokenPerInterval) {
      for (const [key, entry] of this.cache.entries()) {
        if (now >= entry.resetTime) {
          this.cache.delete(key);
        }
      }
    }
  }

  // 获取令牌的当前状态
  getStatus(token: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.cache.get(token);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now >= entry.resetTime) {
      return null;
    }

    return {
      count: entry.count,
      remaining: Math.max(0, 10 - entry.count), // 假设默认限制为10
      resetTime: entry.resetTime,
    };
  }

  // 重置特定令牌
  reset(token: string): void {
    this.cache.delete(token);
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear();
  }

  // 获取缓存统计信息
  getStats(): { totalTokens: number; activeTokens: number } {
    const now = Date.now();
    let activeTokens = 0;

    for (const entry of this.cache.values()) {
      if (now < entry.resetTime) {
        activeTokens++;
      }
    }

    return {
      totalTokens: this.cache.size,
      activeTokens,
    };
  }
}

// 创建速率限制器实例的工厂函数
export function rateLimit(options: RateLimitOptions): RateLimiter {
  return new RateLimiter(options);
}

// 预定义的速率限制器
export const rateLimiters = {
  // 表单提交限制 - 每小时5次
  formSubmission: rateLimit({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
  }),

  // API调用限制 - 每分钟60次
  apiCall: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 1000,
  }),

  // 搜索查询限制 - 每分钟30次
  searchQuery: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 1000,
  }),

  // 密码重置限制 - 每小时3次
  passwordReset: rateLimit({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 200,
  }),

  // 严格限制 - 用于敏感操作，每天5次
  strict: rateLimit({
    interval: 24 * 60 * 60 * 1000, // 24 hours
    uniqueTokenPerInterval: 100,
  }),
};

// IP 地址提取工具
export function getClientIP(request: Request): string {
  // 尝试从各种头部获取真实IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // 作为最后的备选
  return 'unknown';
}

// 复合键生成器 - 用于更复杂的速率限制场景
export function createCompositeKey(...parts: string[]): string {
  return parts.join(':');
}

// 速率限制中间件助手
export function createRateLimitHeaders(
  remaining: number,
  resetTime: number,
  limit: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };
}

// 错误响应助手
export function createRateLimitError(resetTime: number): Response {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}