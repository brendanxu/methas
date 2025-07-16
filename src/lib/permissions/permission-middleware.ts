import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PermissionManager } from './permission-manager'
import { APIError, ErrorCode } from '@/lib/api-error-handler'

// 权限检查装饰器
export function requirePermission(permissionName: string) {
  return function <T extends (...args: any[]) => Promise<NextResponse>>(
    handler: T
  ): T {
    return (async (...args: Parameters<T>) => {
      const [request] = args
      
      try {
        // 获取会话
        const session = await getServerSession(authOptions)
        
        if (!session?.user) {
          throw new APIError(
            ErrorCode.UNAUTHORIZED,
            'Authentication required'
          )
        }

        // 检查权限
        const permissionResult = await PermissionManager.checkPermission(
          session.user.id,
          permissionName
        )

        if (!permissionResult.granted) {
          throw new APIError(
            ErrorCode.FORBIDDEN,
            `Permission denied: ${permissionResult.reason}`,
            { permission: permissionName, source: permissionResult.source }
          )
        }

        // 在请求上下文中添加权限信息
        (request as any).permission = {
          name: permissionName,
          result: permissionResult,
          user: session.user
        }

        return await handler(...args)
      } catch (error) {
        if (error instanceof APIError) {
          throw error
        }
        
        throw new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          'Permission check failed'
        )
      }
    }) as T
  }
}

// 多权限检查装饰器（需要所有权限）
export function requirePermissions(permissionNames: string[]) {
  return function <T extends (...args: any[]) => Promise<NextResponse>>(
    handler: T
  ): T {
    return (async (...args: Parameters<T>) => {
      const [request] = args
      
      try {
        const session = await getServerSession(authOptions)
        
        if (!session?.user) {
          throw new APIError(
            ErrorCode.UNAUTHORIZED,
            'Authentication required'
          )
        }

        // 批量检查权限
        const permissionResults = await PermissionManager.checkPermissions(
          session.user.id,
          permissionNames
        )

        // 检查是否所有权限都被授予
        const deniedPermissions = Object.entries(permissionResults)
          .filter(([_, result]) => !result.granted)
          .map(([name, result]) => ({ name, reason: result.reason }))

        if (deniedPermissions.length > 0) {
          throw new APIError(
            ErrorCode.FORBIDDEN,
            'Insufficient permissions',
            { deniedPermissions }
          )
        }

        // 在请求上下文中添加权限信息
        (request as any).permissions = {
          required: permissionNames,
          results: permissionResults,
          user: session.user
        }

        return await handler(...args)
      } catch (error) {
        if (error instanceof APIError) {
          throw error
        }
        
        throw new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          'Permission check failed'
        )
      }
    }) as T
  }
}

// 权限检查中间件（任一权限即可）
export function requireAnyPermission(permissionNames: string[]) {
  return function <T extends (...args: any[]) => Promise<NextResponse>>(
    handler: T
  ): T {
    return (async (...args: Parameters<T>) => {
      const [request] = args
      
      try {
        const session = await getServerSession(authOptions)
        
        if (!session?.user) {
          throw new APIError(
            ErrorCode.UNAUTHORIZED,
            'Authentication required'
          )
        }

        // 批量检查权限
        const permissionResults = await PermissionManager.checkPermissions(
          session.user.id,
          permissionNames
        )

        // 检查是否至少有一个权限被授予
        const hasAnyPermission = Object.values(permissionResults)
          .some(result => result.granted)

        if (!hasAnyPermission) {
          throw new APIError(
            ErrorCode.FORBIDDEN,
            'No required permissions found',
            { requiredPermissions: permissionNames }
          )
        }

        // 在请求上下文中添加权限信息
        (request as any).permissions = {
          required: permissionNames,
          results: permissionResults,
          user: session.user
        }

        return await handler(...args)
      } catch (error) {
        if (error instanceof APIError) {
          throw error
        }
        
        throw new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          'Permission check failed'
        )
      }
    }) as T
  }
}

// 资源所有权检查装饰器
export function requireResourceOwnership(
  resourceType: 'content' | 'file' | 'form',
  getResourceId: (request: NextRequest) => string | Promise<string>
) {
  return function <T extends (...args: any[]) => Promise<NextResponse>>(
    handler: T
  ): T {
    return (async (...args: Parameters<T>) => {
      const [request] = args
      
      try {
        const session = await getServerSession(authOptions)
        
        if (!session?.user) {
          throw new APIError(
            ErrorCode.UNAUTHORIZED,
            'Authentication required'
          )
        }

        // 如果是超级管理员，跳过所有权检查
        if (session.user.role === 'SUPER_ADMIN') {
          return await handler(...args)
        }

        const resourceId = await getResourceId(request)
        let isOwner = false

        // 根据资源类型检查所有权
        switch (resourceType) {
          case 'content':
            const content = await prisma.content.findUnique({
              where: { id: resourceId },
              select: { authorId: true }
            })
            isOwner = content?.authorId === session.user.id
            break
            
          case 'file':
            const file = await prisma.file.findUnique({
              where: { id: resourceId },
              select: { uploadedById: true }
            })
            isOwner = file?.uploadedById === session.user.id
            break
        }

        if (!isOwner) {
          throw new APIError(
            ErrorCode.FORBIDDEN,
            'Resource access denied: not owner'
          )
        }

        return await handler(...args)
      } catch (error) {
        if (error instanceof APIError) {
          throw error
        }
        
        throw new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          'Ownership check failed'
        )
      }
    }) as T
  }
}