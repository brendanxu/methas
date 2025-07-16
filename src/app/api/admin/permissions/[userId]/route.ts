import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'
import { PermissionManager } from '@/lib/permissions/permission-manager'
import { requirePermission } from '@/lib/permissions/permission-middleware'

// 获取用户权限详情
export const GET = ApiWrappers.admin(
  requirePermission('users:read')(
    async (
      request: NextRequest,
      { params, session }: { params: { userId: string }, session: any }
    ) => {
      const userId = params.userId
      
      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          userPermissions: {
            include: {
              permission: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })
      
      if (!user) {
        throw new APIError(
          ErrorCode.NOT_FOUND,
          'User not found'
        )
      }
      
      // 获取角色权限
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { role: user.role },
        include: {
          permission: true
        }
      })
      
      // 获取有效权限列表（合并角色权限和用户权限）
      const effectivePermissions: any[] = []
      const userPermissionMap = new Map(
        user.userPermissions.map(up => [up.permission.name, up])
      )
      
      // 先添加角色权限
      for (const rp of rolePermissions) {
        const userOverride = userPermissionMap.get(rp.permission.name)
        
        if (userOverride) {
          // 用户有特定设置，使用用户设置
          effectivePermissions.push({
            ...rp.permission,
            granted: userOverride.granted,
            source: 'user',
            reason: userOverride.reason,
            expiresAt: userOverride.expiresAt,
            createdAt: userOverride.createdAt
          })
        } else {
          // 使用角色默认权限
          effectivePermissions.push({
            ...rp.permission,
            granted: rp.granted,
            source: 'role',
            reason: `Default ${user.role} permission`,
            expiresAt: null,
            createdAt: rp.createdAt
          })
        }
      }
      
      // 添加用户独有权限（不在角色权限中的）
      for (const up of user.userPermissions) {
        const hasRolePermission = rolePermissions.some(
          rp => rp.permission.name === up.permission.name
        )
        
        if (!hasRolePermission) {
          effectivePermissions.push({
            ...up.permission,
            granted: up.granted,
            source: 'user',
            reason: up.reason,
            expiresAt: up.expiresAt,
            createdAt: up.createdAt
          })
        }
      }
      
      // 按资源分组
      const permissionsByResource = effectivePermissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) {
          acc[perm.resource] = []
        }
        acc[perm.resource].push(perm)
        return acc
      }, {} as Record<string, any[]>)
      
      return createSuccessResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        },
        permissions: {
          effective: effectivePermissions,
          byResource: permissionsByResource,
          userSpecific: user.userPermissions,
          roleDefault: rolePermissions
        },
        summary: {
          totalPermissions: effectivePermissions.length,
          grantedPermissions: effectivePermissions.filter(p => p.granted).length,
          userOverrides: user.userPermissions.length,
          rolePermissions: rolePermissions.length
        }
      })
    }
  )
)