// API错误处理和响应标准化
import { NextResponse } from 'next/server';

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

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp,
        requestId: this.requestId,
      },
      success: false,
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
        'X-Request-Id': error.requestId || '',
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
        'X-Request-Id': apiError.requestId,
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
      'X-Request-Id': apiError.requestId,
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

// 错误日志记录
export function logAPIError(
  error: APIError | Error,
  context?: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      code: error instanceof APIError ? error.code : 'UNKNOWN',
      stack: error.stack,
    },
    context,
    environment: process.env.NODE_ENV,
  };

  // 在生产环境中，这里应该发送到日志服务
  if (process.env.NODE_ENV === 'production') {
    // 发送到日志服务 (如 CloudWatch, LogRocket, Datadog 等)
    console.error('[API Error]', JSON.stringify(logEntry));
  } else {
    console.error('[API Error]', logEntry);
  }
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