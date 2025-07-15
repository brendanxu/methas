// API错误处理和响应标准化
import { NextRequest, NextResponse } from 'next/server';

// 错误代码枚举
export enum ErrorCode {
  // 客户端错误 (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // 服务器错误 (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  BAD_GATEWAY = 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // 业务逻辑错误
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
  OPERATION_FAILED = 'OPERATION_FAILED',
  
  // 安全相关
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  SPAM_DETECTED = 'SPAM_DETECTED',
  INVALID_ORIGIN = 'INVALID_ORIGIN',
}

// HTTP状态码映射
const errorStatusMap: Record<ErrorCode, number> = {
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.METHOD_NOT_ALLOWED]: 405,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.UNPROCESSABLE_ENTITY]: 422,
  [ErrorCode.TOO_MANY_REQUESTS]: 429,
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ErrorCode.NOT_IMPLEMENTED]: 501,
  [ErrorCode.BAD_GATEWAY]: 502,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
  [ErrorCode.VALIDATION_FAILED]: 400,
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.MISSING_REQUIRED_FIELD]: 400,
  [ErrorCode.INVALID_CREDENTIALS]: 401,
  [ErrorCode.EXPIRED_TOKEN]: 401,
  [ErrorCode.RESOURCE_EXHAUSTED]: 429,
  [ErrorCode.OPERATION_FAILED]: 500,
  [ErrorCode.SECURITY_VIOLATION]: 403,
  [ErrorCode.SPAM_DETECTED]: 400,
  [ErrorCode.INVALID_ORIGIN]: 403,
};

// API错误类
export class APIError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    details?: unknown,
    requestId?: string
  ) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.statusCode = errorStatusMap[code] || 500;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId || generateRequestId();
  }

  toJSON(): ErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp,
        requestId: this.requestId || generateRequestId(),
      },
      success: false as const,
    };
  }
}

// 生成请求ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 标准化成功响应
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
    [key: string]: unknown;
  };
}

// 标准化错误响应
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    timestamp: string;
    requestId: string;
  };
}

// 创建成功响应
export function createSuccessResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): NextResponse<SuccessResponse<T>> {
  const requestId = generateRequestId();
  
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      ...meta,
    },
  });
}

// 创建错误响应
export function createErrorResponse(
  error: APIError | Error | unknown
): NextResponse<ErrorResponse> {
  // 处理APIError
  if (error instanceof APIError) {
    return NextResponse.json(error.toJSON(), {
      status: error.statusCode,
      headers: {
        'X-Request-Id': error.requestId || generateRequestId(),
      },
    });
  }

  // 处理标准Error
  if (error instanceof Error) {
    const apiError = new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      error.message,
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    );
    
    return NextResponse.json(apiError.toJSON(), {
      status: 500,
      headers: {
        'X-Request-Id': apiError.requestId || generateRequestId(),
      },
    });
  }

  // 处理未知错误
  const apiError = new APIError(
    ErrorCode.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred',
    process.env.NODE_ENV === 'development' ? error : undefined
  );

  return NextResponse.json(apiError.toJSON(), {
    status: 500,
    headers: {
      'X-Request-Id': apiError.requestId || generateRequestId(),
    },
  });
}

// 验证错误处理
export function handleValidationErrors(
  errors: string[],
  requestId?: string
): NextResponse<ErrorResponse> {
  const error = new APIError(
    ErrorCode.VALIDATION_FAILED,
    'Validation failed',
    { errors },
    requestId
  );

  return createErrorResponse(error);
}

// 错误日志记录（增强版）
export async function logAPIError(
  error: APIError | Error,
  context?: Record<string, unknown>
): Promise<void> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      code: error instanceof APIError ? error.code : 'UNKNOWN',
      stack: error.stack,
    },
    context: context ? sanitizeLogContext(context) : undefined,
    environment: process.env.NODE_ENV,
  };

  // 控制台输出
  if (process.env.NODE_ENV === 'production') {
    logError('[API Error]', JSON.stringify(logEntry));
  } else {
    logError('[API Error]', logEntry);
  }

  // TODO: 存储严重错误到数据库（需要先创建ErrorLog模型）
  if (shouldPersistError(error)) {
    try {
      // 暂时注释掉，直到创建ErrorLog表
      // const { prisma } = await import('@/lib/prisma');
      // await prisma.errorLog.create({
      //   data: {
      //     level: getErrorLevel(error),
      //     message: error.message,
      //     stack: error.stack,
      //     context: logEntry.context || {},
      //     timestamp: new Date()
      //   }
      // });
      // Debug log removed for production
    } catch (dbError) {
      logError('Failed to persist error to database:', dbError);
    }
  }
}

// 清理日志上下文中的敏感信息
function sanitizeLogContext(context: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'cookie'];
  const sanitized = { ...context };

  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeLogContext(sanitized[key] as Record<string, unknown>);
    }
  });

  return sanitized;
}

// 判断是否应该持久化错误
function shouldPersistError(error: APIError | Error): boolean {
  if (error instanceof APIError) {
    // 只持久化服务器错误和严重的客户端错误
    return error.statusCode >= 500 || [
      ErrorCode.SECURITY_VIOLATION,
      ErrorCode.SPAM_DETECTED,
      ErrorCode.RATE_LIMIT_EXCEEDED
    ].includes(error.code);
  }
  return true; // 所有非APIError都应该持久化
}

// 获取错误级别
function getErrorLevel(error: APIError | Error): string {
  if (error instanceof APIError) {
    if (error.statusCode >= 500) return 'error';
    if (error.statusCode >= 400) return 'warn';
    return 'info';
  }
  return 'error';
}

// 错误恢复装饰器
export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      logAPIError(error as Error, {
        handler: handler.name,
        args: process.env.NODE_ENV === 'development' ? args : undefined,
      });
      
      return createErrorResponse(error);
    }
  }) as T;
}

// 常用错误响应快捷方法
export const ErrorResponses = {
  badRequest: (message: string, details?: unknown) =>
    createErrorResponse(new APIError(ErrorCode.BAD_REQUEST, message, details)),
  
  unauthorized: (message: string = 'Unauthorized') =>
    createErrorResponse(new APIError(ErrorCode.UNAUTHORIZED, message)),
  
  forbidden: (message: string = 'Forbidden') =>
    createErrorResponse(new APIError(ErrorCode.FORBIDDEN, message)),
  
  notFound: (resource: string = 'Resource') =>
    createErrorResponse(new APIError(ErrorCode.NOT_FOUND, `${resource} not found`)),
  
  methodNotAllowed: (method: string, allowed: string[]) =>
    createErrorResponse(
      new APIError(
        ErrorCode.METHOD_NOT_ALLOWED,
        `Method ${method} not allowed`,
        { allowedMethods: allowed }
      )
    ),
  
  tooManyRequests: (retryAfter?: number) =>
    createErrorResponse(
      new APIError(
        ErrorCode.TOO_MANY_REQUESTS,
        'Too many requests',
        { retryAfter }
      )
    ),
  
  serverError: (message: string = 'Internal server error') =>
    createErrorResponse(new APIError(ErrorCode.INTERNAL_SERVER_ERROR, message)),
  
  serviceUnavailable: (message: string = 'Service temporarily unavailable') =>
    createErrorResponse(new APIError(ErrorCode.SERVICE_UNAVAILABLE, message)),
};

// 请求验证助手
export function validateRequestMethod(
  request: Request,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(request.method)) {
    throw new APIError(
      ErrorCode.METHOD_NOT_ALLOWED,
      `Method ${request.method} not allowed`,
      { allowedMethods }
    );
  }
}

// 请求体验证助手
export async function validateRequestBody<T>(
  request: Request,
  schema?: {
    required?: string[];
    optional?: string[];
    validate?: (body: unknown) => { isValid: boolean; errors?: string[] };
  }
): Promise<T> {
  let body: unknown;
  
  try {
    body = await request.json();
  } catch {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Invalid JSON in request body'
    );
  }

  if (!body || typeof body !== 'object') {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Request body must be an object'
    );
  }

  // 验证必填字段
  if (schema?.required) {
    const missingFields = schema.required.filter(
      field => !(field in (body as Record<string, unknown>))
    );
    
    if (missingFields.length > 0) {
      throw new APIError(
        ErrorCode.MISSING_REQUIRED_FIELD,
        'Missing required fields',
        { missingFields }
      );
    }
  }

  // 自定义验证
  if (schema?.validate) {
    const validation = schema.validate(body);
    if (!validation.isValid) {
      throw new APIError(
        ErrorCode.VALIDATION_FAILED,
        'Validation failed',
        { errors: validation.errors }
      );
    }
  }

  return body as T;
}

// =============== 增强功能扩展 ===============

// 速率限制错误处理
export async function handleRateLimit(
  request: NextRequest,
  options: {
    requests: number;
    windowMs: number;
    keyGenerator?: (req: NextRequest) => string;
  }
): Promise<void> {
  try {
    const { rateLimit } = await import('@/lib/rate-limit');
    const limiter = rateLimit({
      interval: options.windowMs,
      uniqueTokenPerInterval: 500,
    });

    const key = options.keyGenerator 
      ? options.keyGenerator(request)
      : getClientIP(request);

    await limiter.check(options.requests, key);
  } catch {
    throw new APIError(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Rate limit exceeded',
      { 
        retryAfter: Math.ceil(options.windowMs / 1000),
        limit: options.requests,
        window: options.windowMs 
      }
    );
  }
}

// 获取客户端IP
function getClientIP(request: NextRequest): string {
  const headers = request.headers;
  return headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         headers.get('x-real-ip') ||
         headers.get('x-client-ip') ||
         'unknown';
}

// Prisma错误处理
export function handlePrismaError(error: any): APIError {
  if (error.code) {
    switch (error.code) {
      case 'P2002':
        return new APIError(
          ErrorCode.CONFLICT,
          'Resource already exists',
          { field: error.meta?.target }
        );
      case 'P2025':
        return new APIError(
          ErrorCode.NOT_FOUND,
          'Record not found'
        );
      case 'P2003':
        return new APIError(
          ErrorCode.BAD_REQUEST,
          'Foreign key constraint failed',
          { field: error.meta?.field_name }
        );
      case 'P2014':
        return new APIError(
          ErrorCode.BAD_REQUEST,
          'Invalid relation',
          { relation: error.meta?.relation_name }
        );
      default:
        return new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          'Database operation failed',
          process.env.NODE_ENV === 'development' ? { code: error.code, meta: error.meta } : undefined
        );
    }
  }
  
  return new APIError(
    ErrorCode.INTERNAL_SERVER_ERROR,
    'Database error',
    process.env.NODE_ENV === 'development' ? error.message : undefined
  );
}

// Zod验证错误处理
export function handleZodError(error: any): APIError {
  const issues = error.issues || [];
  const validationErrors = issues.map((issue: any) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code
  }));

  return new APIError(
    ErrorCode.VALIDATION_FAILED,
    'Input validation failed',
    { errors: validationErrors }
  );
}

// API包装器接口
interface ApiWrapperOptions {
  rateLimiting?: {
    requests: number;
    windowMs: number;
  };
  requireAuth?: boolean;
  validateInput?: boolean;
  logRequests?: boolean;
}

// 通用API包装器
export function createApiHandler(
  handler: (request: NextRequest, context: any) => Promise<NextResponse>,
  options: ApiWrapperOptions = {}
) {
  return async (request: NextRequest, context?: any) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
      // 请求日志
      if (options.logRequests) {
        // Debug log removed for production
      }

      // 速率限制
      if (options.rateLimiting) {
        await handleRateLimit(request, options.rateLimiting);
      }

      // 身份验证检查
      if (options.requireAuth) {
        const { getServerSession } = await import('next-auth');
        const { authOptions } = await import('@/lib/auth');
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
          throw new APIError(ErrorCode.UNAUTHORIZED, 'Authentication required');
        }
        
        context = { ...context, session };
      }

      // 调用处理器
      const result = await handler(request, context);
      
      // 成功日志
      if (options.logRequests) {
        const duration = Date.now() - startTime;
        // Debug log removed for production
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // 错误上下文
      const errorContext = {
        requestId,
        method: request.method,
        url: request.url,
        userAgent: request.headers.get('user-agent'),
        ip: getClientIP(request),
        duration
      };

      // 处理不同类型的错误
      let apiError: APIError;
      
      if (error instanceof APIError) {
        apiError = error;
      } else if (error && typeof error === 'object' && 'code' in error && 
                 typeof error.code === 'string' && error.code.startsWith('P')) {
        // Prisma错误
        apiError = handlePrismaError(error);
      } else if (error && typeof error === 'object' && 'issues' in error) {
        // Zod验证错误
        apiError = handleZodError(error);
      } else if (error instanceof Error) {
        apiError = new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          error.message,
          process.env.NODE_ENV === 'development' ? error.stack : undefined
        );
      } else {
        apiError = new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred'
        );
      }

      // 异步记录错误日志
      logAPIError(apiError, errorContext).catch(console.error);

      return createErrorResponse(apiError);
    }
  };
}

// 预配置的API包装器
export const ApiWrappers = {
  // 公开端点，基本速率限制
  public: (handler: (request: NextRequest, context: any) => Promise<NextResponse>) =>
    createApiHandler(handler, {
      rateLimiting: { requests: 100, windowMs: 15 * 60 * 1000 }, // 15分钟100次
      logRequests: true
    }),

  // 表单提交，严格速率限制
  form: (handler: (request: NextRequest, context: any) => Promise<NextResponse>) =>
    createApiHandler(handler, {
      rateLimiting: { requests: 10, windowMs: 60 * 60 * 1000 }, // 1小时10次
      validateInput: true,
      logRequests: true
    }),

  // 管理员端点
  admin: (handler: (request: NextRequest, context: any) => Promise<NextResponse>) =>
    createApiHandler(handler, {
      requireAuth: true,
      rateLimiting: { requests: 1000, windowMs: 15 * 60 * 1000 }, // 15分钟1000次
      logRequests: true
    }),

  // 无限制的内部端点
  internal: (handler: (request: NextRequest, context: any) => Promise<NextResponse>) =>
    createApiHandler(handler, {
      logRequests: false
    })
};

// 健康检查助手
export function createHealthCheck(dependencies: {
  database?: () => Promise<boolean>;
  cache?: () => Promise<boolean>;
  external?: () => Promise<boolean>;
} = {}) {
  return async () => {
    const checks: Record<string, boolean> = {};
    let allHealthy = true;

    // 数据库检查
    if (dependencies.database) {
      try {
        checks.database = await dependencies.database();
      } catch {
        checks.database = false;
      }
      if (!checks.database) allHealthy = false;
    }

    // 缓存检查
    if (dependencies.cache) {
      try {
        checks.cache = await dependencies.cache();
      } catch {
        checks.cache = false;
      }
      if (!checks.cache) allHealthy = false;
    }

    // 外部服务检查
    if (dependencies.external) {
      try {
        checks.external = await dependencies.external();
      } catch {
        checks.external = false;
      }
      if (!checks.external) allHealthy = false;
    }

    const response = {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks
    };

    return NextResponse.json(response, {
      status: allHealthy ? 200 : 503
    });
  };
}

// 监控指标助手
export class ApiMetrics {
  private static metrics = new Map<string, {
    requests: number;
    errors: number;
    avgResponseTime: number;
    lastReset: number;
  }>();

  static recordRequest(endpoint: string, responseTime: number, isError: boolean = false) {
    const key = endpoint;
    const current = this.metrics.get(key) || {
      requests: 0,
      errors: 0,
      avgResponseTime: 0,
      lastReset: Date.now()
    };

    current.requests++;
    if (isError) current.errors++;
    current.avgResponseTime = (current.avgResponseTime + responseTime) / 2;

    this.metrics.set(key, current);
  }

  static getMetrics() {
    return Object.fromEntries(this.metrics.entries());
  }

  static reset() {
    this.metrics.clear();
  }
}