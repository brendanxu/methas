import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

// Production logging utilities
const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { 
  createPermissionChecker,
  PermissionKey,
  hasMinimumRole,
  canManageUser
} from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

// 路由保护器配置
interface RouteConfig {
  auth?: boolean | UserRole | PermissionKey
  validation?: z.ZodSchema
  customPermissionCheck?: (session: any, request: NextRequest) => boolean | Promise<boolean>
  audit?: {
    action: string
    resource: string
    getDetails?: (request: NextRequest, params: any, result?: any) => any
  }
}

// HTTP方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 路由处理器类型
type RouteHandler<T = any> = (
  request: NextRequest,
  context: {
    session: NonNullable<Awaited<ReturnType<typeof getServerSession>>>
    permissionChecker: ReturnType<typeof createPermissionChecker>
    params?: any
    validatedData?: T
  }
) => Promise<NextResponse> | NextResponse

// 创建受保护的路由处理器
export function createProtectedRoute<T = any>(
  config: RouteConfig,
  handler: RouteHandler<T>
) {
  return async (request: NextRequest, context: { params?: any } = {}) => {
    try {
      // 1. 身份验证检查
      if (config.auth !== false) {
        const session = await getServerSession(authOptions)
        
        if (!session?.user) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }

        const permissionChecker = createPermissionChecker(session)

        // 2. 权限检查
        if (typeof config.auth === 'string') {
          // 检查具体权限或角色
          if (Object.values(UserRole).includes(config.auth as UserRole)) {
            // 角色检查
            if (!hasMinimumRole(session.user.role, config.auth as UserRole)) {
              return NextResponse.json(
                { error: 'Insufficient privileges' },
                { status: 403 }
              )
            }
          } else {
            // 权限检查
            if (!permissionChecker.hasPermission(config.auth as PermissionKey)) {
              return NextResponse.json(
                { error: 'Permission denied' },
                { status: 403 }
              )
            }
          }
        }

        // 3. 自定义权限检查
        if (config.customPermissionCheck) {
          const hasCustomPermission = await config.customPermissionCheck(session, request)
          if (!hasCustomPermission) {
            return NextResponse.json(
              { error: 'Custom permission check failed' },
              { status: 403 }
            )
          }
        }

        // 4. 数据验证
        let validatedData: T | undefined
        if (config.validation && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
          try {
            const body = await request.json()
            validatedData = config.validation.parse(body)
          } catch (error) {
            if (error instanceof z.ZodError) {
              return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
              )
            }
            throw error
          }
        }

        // 5. 调用处理器
        const result = await handler(request, {
          session,
          permissionChecker,
          params: context.params,
          validatedData
        })

        // 6. 审计日志
        if (config.audit && result.status < 400) {
          try {
            const details = config.audit.getDetails 
              ? config.audit.getDetails(request, context.params, result)
              : { params: context.params, method: request.method }

            await prisma.auditLog.create({
              data: {
                userId: session.user.id,
                action: config.audit.action,
                resource: config.audit.resource,
                details
              }
            })
          } catch (auditError) {
            logError('Audit log failed:', auditError)
            // 不因审计失败而影响主要操作
          }
        }

        return result
      }

      // 无需认证的路由处理
      return NextResponse.json(
        { error: 'Configuration error: Route requires authentication but auth is disabled' },
        { status: 500 }
      )

    } catch (error) {
      logError('Route protection error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// 用户资源所有权检查
export async function checkUserOwnership(userId: string, resourceUserId: string, userRole: UserRole): Promise<boolean> {
  // 超级管理员可以访问所有资源
  if (userRole === UserRole.SUPER_ADMIN) {
    return true
  }
  
  // 管理员可以访问非管理员用户的资源
  if (userRole === UserRole.ADMIN) {
    const targetUser = await prisma.user.findUnique({
      where: { id: resourceUserId },
      select: { role: true }
    })
    
    if (targetUser && targetUser.role !== UserRole.SUPER_ADMIN) {
      return true
    }
  }
  
  // 用户只能访问自己的资源
  return userId === resourceUserId
}

// 内容资源所有权检查
export async function checkContentOwnership(userId: string, contentId: string, userRole: UserRole): Promise<boolean> {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { authorId: true }
  })
  
  if (!content) {
    return false
  }
  
  return checkUserOwnership(userId, content.authorId, userRole)
}

// 文件资源所有权检查
export async function checkFileOwnership(userId: string, fileId: string, userRole: UserRole): Promise<boolean> {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    select: { uploadedBy: true }
  })
  
  if (!file || !file.uploadedBy) {
    return false
  }
  
  return checkUserOwnership(userId, file.uploadedBy, userRole)
}

// 预定义的路由保护配置
export const RouteConfigs = {
  // 公开路由（无需认证）
  public: {
    auth: false
  },
  
  // 需要登录
  authenticated: {
    auth: true
  },
  
  // 管理员权限
  adminOnly: {
    auth: UserRole.ADMIN,
    audit: {
      action: 'ADMIN_ACCESS',
      resource: 'admin'
    }
  },
  
  // 超级管理员权限
  superAdminOnly: {
    auth: UserRole.SUPER_ADMIN,
    audit: {
      action: 'SUPER_ADMIN_ACCESS',
      resource: 'system'
    }
  },
  
  // 内容管理
  contentRead: {
    auth: 'CONTENT_READ' as PermissionKey
  },
  
  contentWrite: {
    auth: 'CONTENT_CREATE' as PermissionKey,
    audit: {
      action: 'CONTENT_WRITE',
      resource: 'content'
    }
  },
  
  // 用户管理
  userManagement: {
    auth: 'USER_READ' as PermissionKey,
    audit: {
      action: 'USER_MANAGEMENT',
      resource: 'user'
    }
  },
  
  // 文件上传
  fileUpload: {
    auth: 'FILE_UPLOAD' as PermissionKey,
    audit: {
      action: 'FILE_UPLOAD',
      resource: 'file'
    }
  }
} as const

// 创建CRUD路由处理器
export function createCRUDRoutes<T = any>(
  resourceName: string,
  config: {
    list?: RouteConfig
    create?: RouteConfig
    read?: RouteConfig
    update?: RouteConfig
    delete?: RouteConfig
  },
  handlers: {
    list?: RouteHandler
    create?: RouteHandler<T>
    read?: RouteHandler
    update?: RouteHandler<T>
    delete?: RouteHandler
  }
) {
  const routes: Partial<Record<HttpMethod, any>> = {}
  
  if (handlers.list && config.list) {
    routes.GET = createProtectedRoute(config.list, handlers.list)
  }
  
  if (handlers.create && config.create) {
    routes.POST = createProtectedRoute(config.create, handlers.create)
  }
  
  if (handlers.read && config.read) {
    routes.GET = createProtectedRoute(config.read, handlers.read)
  }
  
  if (handlers.update && config.update) {
    routes.PUT = createProtectedRoute(config.update, handlers.update)
  }
  
  if (handlers.delete && config.delete) {
    routes.DELETE = createProtectedRoute(config.delete, handlers.delete)
  }
  
  return routes
}

// 错误响应助手
export const ApiResponses = {
  success: (data: any = null, status = 200) => 
    NextResponse.json({ success: true, data }, { status }),
    
  error: (message: string, status = 400, code?: string) =>
    NextResponse.json({ 
      success: false, 
      error: message, 
      ...(code && { code }) 
    }, { status }),
    
  unauthorized: (message = 'Authentication required') =>
    NextResponse.json({ 
      success: false, 
      error: message, 
      code: 'UNAUTHORIZED' 
    }, { status: 401 }),
    
  forbidden: (message = 'Permission denied') =>
    NextResponse.json({ 
      success: false, 
      error: message, 
      code: 'FORBIDDEN' 
    }, { status: 403 }),
    
  notFound: (message = 'Resource not found') =>
    NextResponse.json({ 
      success: false, 
      error: message, 
      code: 'NOT_FOUND' 
    }, { status: 404 }),
    
  validationError: (errors: any) =>
    NextResponse.json({ 
      success: false, 
      error: 'Validation failed', 
      details: errors,
      code: 'VALIDATION_ERROR' 
    }, { status: 400 })
}