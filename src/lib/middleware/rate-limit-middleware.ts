import { NextRequest, NextResponse } from 'next/server'
import { 
  checkRateLimit, 
  createRateLimitHeaders,
  RateLimitResult,
  globalRateLimiter
} from '@/lib/enhanced-rate-limit'

// 路由到限流配置的映射
export const ROUTE_RATE_LIMIT_MAP: Record<string, string> = {
  // 表单相关
  '/api/forms/submit': 'forms.submission',
  '/api/newsletter': 'public.newsletter',
  '/api/forms/contact': 'public.contact',
  
  // 认证相关
  '/api/auth/register': 'auth.register',
  '/api/auth/login': 'auth.login',
  '/api/auth/password-reset': 'auth.password_reset',
  
  // 搜索相关
  '/api/search': 'search.query',
  '/api/search/suggestions': 'search.query',
  
  // 管理员操作
  '/api/content': 'admin.content_create',
  '/api/upload': 'upload.files',
  '/api/admin/bulk': 'admin.bulk_operations',
  
  // 通用API
  '/api': 'api.general'
}

// 限流中间件配置
export interface RateLimitMiddlewareOptions {
  configKey?: string           // 明确指定配置键
  weight?: number             // 请求权重（默认为1）
  skipCondition?: (request: NextRequest) => boolean  // 跳过限流的条件
  customIdentifier?: (request: NextRequest) => string // 自定义标识符
  onRateLimited?: (result: RateLimitResult, request: NextRequest) => NextResponse // 自定义限流响应
}

// 创建限流中间件
export function createRateLimitMiddleware(options: RateLimitMiddlewareOptions = {}) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    // 检查是否跳过限流
    if (options.skipCondition && options.skipCondition(request)) {
      return handler(request)
    }

    try {
      // 确定配置键
      const configKey = options.configKey || getConfigKeyForRoute(request)
      
      if (!configKey) {
        // 没有找到对应的限流配置，直接执行处理器
        return handler(request)
      }

      // 执行限流检查
      const weight = options.weight || 1
      let rateLimitResult: RateLimitResult

      if (options.customIdentifier) {
        // 使用自定义标识符
        const identifier = options.customIdentifier(request)
        const config = globalRateLimiter.getConfig(configKey)
        if (config) {
          rateLimitResult = await globalRateLimiter.checkLimit(configKey, identifier, weight)
        } else {
          return handler(request)
        }
      } else {
        // 使用默认标识符
        rateLimitResult = await checkRateLimit(configKey, request, undefined, weight)
      }

      // 检查是否被限流
      if (!rateLimitResult.allowed) {
        // 如果有自定义限流响应处理器
        if (options.onRateLimited) {
          return options.onRateLimited(rateLimitResult, request)
        }

        // 默认限流响应
        const headers = createRateLimitHeaders(rateLimitResult)
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
            retryAfter: rateLimitResult.retryAfter,
            strategy: rateLimitResult.strategy,
            tier: rateLimitResult.tier
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              ...headers
            }
          }
        )
      }

      // 执行处理器
      const response = await handler(request)

      // 添加限流信息到响应头
      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult)
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response

    } catch (error) {
      logError('Rate limit middleware error:', error)
      // 出现错误时，继续执行处理器（降级处理）
      return handler(request)
    }
  }
}

// 根据路由获取配置键
function getConfigKeyForRoute(request: NextRequest): string | null {
  const pathname = new URL(request.url).pathname
  
  // 精确匹配
  if (ROUTE_RATE_LIMIT_MAP[pathname]) {
    return ROUTE_RATE_LIMIT_MAP[pathname]
  }
  
  // 前缀匹配
  for (const [route, configKey] of Object.entries(ROUTE_RATE_LIMIT_MAP)) {
    if (pathname.startsWith(route) && route !== '/api') {
      return configKey
    }
  }
  
  // 默认API限流
  if (pathname.startsWith('/api')) {
    return ROUTE_RATE_LIMIT_MAP['/api']
  }
  
  return null
}

// 预定义的中间件实例
export const rateLimitMiddlewares = {
  // 表单提交中间件
  formSubmission: createRateLimitMiddleware({
    configKey: 'forms.submission',
    onRateLimited: (result, request) => {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many form submissions',
          message: 'You have exceeded the form submission limit. Please wait before trying again.',
          retryAfter: result.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...createRateLimitHeaders(result)
          }
        }
      )
    }
  }),

  // 搜索查询中间件
  searchQuery: createRateLimitMiddleware({
    configKey: 'search.query',
    weight: 1,
    skipCondition: (request) => {
      // 跳过预填充查询
      const url = new URL(request.url)
      return url.searchParams.get('prefetch') === 'true'
    }
  }),

  // 认证中间件
  authentication: createRateLimitMiddleware({
    skipCondition: (request) => {
      // 跳过已认证用户的某些请求
      const authHeader = request.headers.get('authorization')
      return !!authHeader
    }
  }),

  // 文件上传中间件（基于文件大小）
  fileUpload: createRateLimitMiddleware({
    configKey: 'upload.files'
    // Note: 实际的文件大小权重计算需要在具体使用时实现
  }),

  // 严格限流中间件（用于敏感操作）
  strict: createRateLimitMiddleware({
    configKey: 'security.suspicious',
    onRateLimited: (result, request) => {
      // 记录可疑活动
      console.warn('Suspicious activity detected:', {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        url: request.url,
        timestamp: new Date().toISOString()
      })

      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Access temporarily restricted',
          message: 'Your access has been temporarily restricted due to suspicious activity.',
          retryAfter: result.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...createRateLimitHeaders(result)
          }
        }
      )
    }
  })
}

// 装饰器模式的中间件包装器
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: RateLimitMiddlewareOptions = {}
) {
  const middleware = createRateLimitMiddleware(options)
  return (request: NextRequest) => middleware(request, handler)
}

// 条件限流装饰器
export function withConditionalRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  condition: (request: NextRequest) => boolean,
  options: RateLimitMiddlewareOptions = {}
) {
  return withRateLimit(handler, {
    ...options,
    skipCondition: (request) => !condition(request)
  })
}

// 多层限流装饰器
export function withMultiTierRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  configs: Array<{
    configKey: string
    weight?: number
    skipCondition?: (request: NextRequest) => boolean
  }>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // 依次检查所有限流配置
    for (const config of configs) {
      if (config.skipCondition && config.skipCondition(request)) {
        continue
      }

      const result = await checkRateLimit(
        config.configKey, 
        request, 
        undefined, 
        config.weight || 1
      )

      if (!result.allowed) {
        const headers = createRateLimitHeaders(result)
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            configKey: config.configKey,
            retryAfter: result.retryAfter
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              ...headers
            }
          }
        )
      }
    }

    return handler(request)
  }
}