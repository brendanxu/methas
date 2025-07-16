import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'
import { PermissionManager, PERMISSIONS } from '@/lib/permissions/permission-manager'
import { requirePermission } from '@/lib/permissions/permission-middleware'

const grantPermissionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  permissionName: z.string().min(1, 'Permission name is required'),
  reason: z.string().optional(),
  expiresAt: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined)
})

const revokePermissionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  permissionName: z.string().min(1, 'Permission name is required'),
  reason: z.string().optional()
})

// 获取所有权限列表
export const GET = ApiWrappers.admin(
  requirePermission('users:manage_permissions')(
    async (request: NextRequest, { session }: { session: any }) => {
      const { searchParams } = new URL(request.url)
      const resource = searchParams.get('resource')
      
      let permissions = PERMISSIONS
      
      // 按资源类型筛选
      if (resource) {
        permissions = permissions.filter(p => p.resource === resource)
      }
      
      // 获取所有角色权限配置
      const rolePermissions = await prisma.rolePermission.findMany({
        include: {
          permission: true
        }
      })
      
      // 按角色分组
      const rolePermissionMap = rolePermissions.reduce((acc, rp) => {
        if (!acc[rp.role]) {
          acc[rp.role] = []
        }
        acc[rp.role].push({
          ...rp.permission,
          granted: rp.granted
        })
        return acc
      }, {} as Record<string, any[]>)
      
      return createSuccessResponse({
        permissions,
        rolePermissions: rolePermissionMap,
        resources: [...new Set(PERMISSIONS.map(p => p.resource))]
      })
    }
  )
)

// 授予用户权限
export const POST = ApiWrappers.admin(
  requirePermission('users:manage_permissions')(
    async (request: NextRequest, { session }: { session: any }) => {
      const body = await request.json()
      const { userId, permissionName, reason, expiresAt } = grantPermissionSchema.parse(body)
      
      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true }
      })
      
      if (!user) {
        throw new APIError(
          ErrorCode.NOT_FOUND,
          'User not found'
        )
      }
      
      // 检查权限是否存在
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })
      
      if (!permission) {
        throw new APIError(
          ErrorCode.NOT_FOUND,
          'Permission not found'
        )
      }
      
      // 授予权限
      const userPermission = await PermissionManager.grantUserPermission(
        userId,
        permissionName,
        reason || `Granted by ${session.user.email}`,
        expiresAt
      )
      
      // 记录审计日志
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'GRANT_PERMISSION',
          resource: 'permission',
          details: {
            targetUserId: userId,
            targetUserEmail: user.email,
            permissionName,
            reason,
            expiresAt: expiresAt?.toISOString()
          }
        }
      })
      
      return createSuccessResponse({
        userPermission,
        message: `Permission ${permissionName} granted to ${user.email}`
      })
    }
  )
)

// 撤销用户权限
export const DELETE = ApiWrappers.admin(
  requirePermission('users:manage_permissions')(
    async (request: NextRequest, { session }: { session: any }) => {
      const body = await request.json()
      const { userId, permissionName, reason } = revokePermissionSchema.parse(body)
      
      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true }
      })
      
      if (!user) {
        throw new APIError(
          ErrorCode.NOT_FOUND,
          'User not found'
        )
      }
      
      // 撤销权限
      const userPermission = await PermissionManager.revokeUserPermission(
        userId,
        permissionName,
        reason || `Revoked by ${session.user.email}`
      )
      
      // 记录审计日志
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'REVOKE_PERMISSION',
          resource: 'permission',
          details: {
            targetUserId: userId,
            targetUserEmail: user.email,
            permissionName,
            reason
          }
        }
      })
      
      return createSuccessResponse({
        userPermission,
        message: `Permission ${permissionName} revoked from ${user.email}`
      })
    }
  )
)