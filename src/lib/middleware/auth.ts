import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Production logging utilities
const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { UserRole } from '@prisma/client'
import { 
  createPermissionChecker, 
  PermissionKey, 
  AuthenticationError, 
  PermissionError 
} from '@/lib/permissions'

// API路由处理器类型
export type ApiHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse> | NextResponse

// 带权限检查的API处理器类型
export type AuthenticatedApiHandler = (
  request: NextRequest,
  context: {
    session: any
    permissionChecker: any
    params?: any
  }
) => Promise<NextResponse> | NextResponse

// 中间件配置选项
export interface AuthMiddlewareOptions {
  // 所需的最小角色
  minimumRole?: UserRole
  // 所需的特定权限
  requiredPermission?: PermissionKey
  // 自定义权限检查函数
  customPermissionCheck?: (session: any, request: NextRequest) => boolean | Promise<boolean>
  // 错误消息自定义
  unauthorizedMessage?: string
  forbiddenMessage?: string
}

// 包装API处理器，添加认证检查
export function withAuth(
  handler: AuthenticatedApiHandler,
  options: AuthMiddlewareOptions = {}
) {
  return async (request: NextRequest, context: any = {}) => {
    try {
      // 获取会话
      const session = await getServerSession(authOptions)
      
      // 检查是否已认证
      if (!session?.user) {
        throw new AuthenticationError(
          options.unauthorizedMessage || 'Authentication required'
        )
      }

      // 创建权限检查器
      const permissionChecker = createPermissionChecker(session)

      // 检查最小角色要求
      if (options.minimumRole && !permissionChecker.hasMinimumRole(options.minimumRole)) {
        throw new PermissionError(
          options.forbiddenMessage || `Minimum role required: ${options.minimumRole}`
        )
      }

      // 检查特定权限
      if (options.requiredPermission && !permissionChecker.hasPermission(options.requiredPermission)) {
        throw new PermissionError(
          options.forbiddenMessage || `Permission required: ${options.requiredPermission}`
        )
      }

      // 自定义权限检查
      if (options.customPermissionCheck) {
        const hasCustomPermission = await options.customPermissionCheck(session, request)
        if (!hasCustomPermission) {
          throw new PermissionError(
            options.forbiddenMessage || 'Custom permission check failed'
          )
        }
      }

      // 调用原处理器
      return await handler(request, {
        ...context,
        session,
        permissionChecker
      })

    } catch (error) {
      logError('Auth middleware error:', error)
      
      if (error instanceof AuthenticationError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        )
      }
      
      if (error instanceof PermissionError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        )
      }

      // 其他错误
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// 预定义的认证中间件
export const requireAuth = withAuth

export const requireAdmin = (handler: AuthenticatedApiHandler) =>
  withAuth(handler, { minimumRole: UserRole.ADMIN })

export const requireSuperAdmin = (handler: AuthenticatedApiHandler) =>
  withAuth(handler, { minimumRole: UserRole.SUPER_ADMIN })

// 资源权限中间件生成器
export function requirePermission(permission: PermissionKey) {
  return (handler: AuthenticatedApiHandler) =>
    withAuth(handler, { requiredPermission: permission })
}

// 多种认证方式的中间件
export function withMultiAuth(
  handlers: Record<string, AuthenticatedApiHandler>,
  options: AuthMiddlewareOptions = {}
) {
  return async (request: NextRequest, context: any = {}) => {
    const method = request.method
    const handler = handlers[method]
    
    if (!handler) {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      )
    }

    return withAuth(handler, options)(request, context)
  }
}

// 所有者或管理员权限检查
export function requireOwnerOrAdmin(getResourceOwnerId: (request: NextRequest, context: any) => Promise<string | null>) {
  return (handler: AuthenticatedApiHandler) => 
    withAuth(handler, {
      customPermissionCheck: async (session, request) => {
        // 如果是管理员，直接通过
        if (session.user.role === UserRole.ADMIN || session.user.role === UserRole.SUPER_ADMIN) {
          return true
        }

        // 检查是否是资源所有者
        try {
          const ownerId = await getResourceOwnerId(request, {})
          return ownerId === session.user.id
        } catch {
          return false
        }
      }
    })
}

// API错误处理助手
export function handleApiError(error: unknown): NextResponse {
  logError('API Error:', error)

  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  if (error instanceof PermissionError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

// 验证请求参数的中间件
export function withValidation<T>(
  schema: any, // Zod schema
  handler: (request: NextRequest, data: T, context: any) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest, context: any = {}) => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      return await handler(request, validatedData, context)
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
      return handleApiError(error)
    }
  }
}

// 组合多个中间件
export function compose(...middlewares: ((handler: any) => any)[]) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}