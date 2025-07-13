import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, any>;
}

// 创建API错误
export function createApiError(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: Record<string, any>
): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
}

// 错误处理中间件
export function withErrorHandler<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      return handleApiError(error, req);
    }
  };
}

// 处理API错误
export function handleApiError(error: unknown, req: NextRequest): NextResponse {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';
  let details: Record<string, any> = {};

  // 解析错误类型
  if (error instanceof Error) {
    const apiError = error as ApiError;
    message = apiError.message;
    statusCode = apiError.statusCode || 500;
    code = apiError.code || 'INTERNAL_ERROR';
    details = apiError.details || {};
  } else if (typeof error === 'string') {
    message = error;
  }

  // 记录错误日志
  logger.error('API Error', error instanceof Error ? error : new Error(String(error)), {
    url: req.url,
    method: req.method,
    statusCode,
    code,
    details,
    userAgent: req.headers.get('user-agent'),
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
  });

  // 开发环境显示详细错误信息
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    success: false,
    error: {
      message,
      code,
      ...(isDevelopment && {
        details,
        stack: error instanceof Error ? error.stack : undefined,
      }),
    },
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
  };

  return NextResponse.json(errorResponse, { status: statusCode });
}

// 生成请求ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 验证请求体
export async function validateRequestBody<T>(
  req: NextRequest,
  validator: (data: any) => data is T
): Promise<T> {
  let body: any;
  
  try {
    body = await req.json();
  } catch (error) {
    throw createApiError('Invalid JSON in request body', 400, 'INVALID_JSON');
  }

  if (!validator(body)) {
    throw createApiError('Invalid request body format', 400, 'INVALID_FORMAT');
  }

  return body;
}

// 验证查询参数
export function validateQueryParams(
  req: NextRequest,
  requiredParams: string[]
): Record<string, string> {
  const { searchParams } = new URL(req.url);
  const params: Record<string, string> = {};

  for (const param of requiredParams) {
    const value = searchParams.get(param);
    if (!value) {
      throw createApiError(`Missing required query parameter: ${param}`, 400, 'MISSING_PARAMETER');
    }
    params[param] = value;
  }

  return params;
}

// 速率限制检查
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const key = identifier;
  
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}

// 应用速率限制
export function withRateLimit(
  identifier: (req: NextRequest) => string,
  limit: number = 100,
  windowMs: number = 60000
) {
  return function <T extends any[]>(
    handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
  ) {
    return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
      const id = identifier(req);
      
      if (!checkRateLimit(id, limit, windowMs)) {
        throw createApiError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED', {
          limit,
          windowMs,
          identifier: id,
        });
      }
      
      return handler(req, ...args);
    };
  };
}

// 常用的速率限制标识符
export const rateLimitIdentifiers = {
  byIP: (req: NextRequest) => 
    req.headers.get('x-forwarded-for') || 
    req.headers.get('x-real-ip') || 
    'unknown',
  
  byUserAgent: (req: NextRequest) => 
    req.headers.get('user-agent') || 'unknown',
  
  byIPAndUserAgent: (req: NextRequest) => 
    `${rateLimitIdentifiers.byIP(req)}-${rateLimitIdentifiers.byUserAgent(req)}`,
};

// 健康检查中间件
export function withHealthCheck<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    // 简单的健康检查
    if (req.nextUrl.pathname === '/api/health') {
      return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      });
    }
    
    return handler(req, ...args);
  };
}

// CORS处理
export function withCORS<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
  origins: string[] = ['*']
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const response = await handler(req, ...args);
    
    // 设置CORS头
    const origin = req.headers.get('origin');
    if (origins.includes('*') || (origin && origins.includes(origin))) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  };
}

// 组合多个中间件
export function combineMiddleware<T extends any[]>(
  ...middlewares: Array<(handler: any) => any>
) {
  return (handler: (req: NextRequest, ...args: T) => Promise<NextResponse>) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

// 预定义的中间件组合
export const createApiHandler = <T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) => {
  return combineMiddleware(
    withErrorHandler,
    withHealthCheck,
    withCORS
  )(handler);
};

export const createRateLimitedApiHandler = <T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
  rateLimit: { limit: number; windowMs: number } = { limit: 100, windowMs: 60000 }
) => {
  return combineMiddleware(
    withErrorHandler,
    withRateLimit(rateLimitIdentifiers.byIP, rateLimit.limit, rateLimit.windowMs),
    withHealthCheck,
    withCORS
  )(handler);
};