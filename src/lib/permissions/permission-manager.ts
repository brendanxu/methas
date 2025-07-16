import { UserRole } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { CachedQueries } from '@/lib/cache/cached-queries'

// 权限定义接口
export interface PermissionDefinition {
  name: string
  description: string
  resource: string
  action: string
}

// 权限检查结果
export interface PermissionResult {
  granted: boolean
  reason?: string
  source: 'role' | 'user' | 'system'
}

// 预定义权限列表
export const PERMISSIONS: PermissionDefinition[] = [
  // 内容管理权限
  { name: 'content:read', description: '查看内容', resource: 'content', action: 'read' },
  { name: 'content:write', description: '创建和编辑内容', resource: 'content', action: 'write' },
  { name: 'content:delete', description: '删除内容', resource: 'content', action: 'delete' },
  { name: 'content:publish', description: '发布内容', resource: 'content', action: 'publish' },
  
  // 用户管理权限
  { name: 'users:read', description: '查看用户信息', resource: 'users', action: 'read' },
  { name: 'users:write', description: '创建和编辑用户', resource: 'users', action: 'write' },
  { name: 'users:delete', description: '删除用户', resource: 'users', action: 'delete' },
  { name: 'users:manage_permissions', description: '管理用户权限', resource: 'users', action: 'manage_permissions' },
  
  // 文件管理权限
  { name: 'files:read', description: '查看文件', resource: 'files', action: 'read' },
  { name: 'files:upload', description: '上传文件', resource: 'files', action: 'upload' },
  { name: 'files:delete', description: '删除文件', resource: 'files', action: 'delete' },
  { name: 'files:manage', description: '管理所有文件', resource: 'files', action: 'manage' },
  
  // 表单管理权限
  { name: 'forms:read', description: '查看表单提交', resource: 'forms', action: 'read' },
  { name: 'forms:export', description: '导出表单数据', resource: 'forms', action: 'export' },
  { name: 'forms:delete', description: '删除表单数据', resource: 'forms', action: 'delete' },
  
  // 系统管理权限
  { name: 'system:settings', description: '修改系统设置', resource: 'system', action: 'settings' },
  { name: 'system:logs', description: '查看系统日志', resource: 'system', action: 'logs' },
  { name: 'system:health', description: '查看系统健康状况', resource: 'system', action: 'health' },
  { name: 'system:maintenance', description: '系统维护操作', resource: 'system', action: 'maintenance' },
  
  // 分析权限
  { name: 'analytics:read', description: '查看分析数据', resource: 'analytics', action: 'read' },
  { name: 'analytics:export', description: '导出分析数据', resource: 'analytics', action: 'export' },
]

// 角色默认权限映射
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  USER: [
    'content:read',
    'files:read',
    'files:upload'
  ],
  ADMIN: [
    'content:read',
    'content:write',
    'content:publish',
    'users:read',
    'files:read',
    'files:upload',
    'files:delete',
    'forms:read',
    'forms:export',
    'analytics:read'
  ],
  SUPER_ADMIN: [
    // 超级管理员拥有所有权限
    ...PERMISSIONS.map(p => p.name)
  ]
}

// 权限管理类
export class PermissionManager {
  
  // 初始化权限系统
  static async initializePermissions() {
    try {
      // 创建所有预定义权限
      for (const perm of PERMISSIONS) {
        await prisma.permission.upsert({
          where: { name: perm.name },
          update: {
            description: perm.description,
            resource: perm.resource,
            action: perm.action
          },
          create: perm
        })
      }

      // 为每个角色设置默认权限
      for (const [role, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
        for (const permissionName of permissionNames) {
          const permission = await prisma.permission.findUnique({
            where: { name: permissionName }
          })

          if (permission) {
            await prisma.rolePermission.upsert({
              where: {
                role_permissionId: {
                  role: role as UserRole,
                  permissionId: permission.id
                }
              },
              update: { granted: true },
              create: {
                role: role as UserRole,
                permissionId: permission.id,
                granted: true
              }
            })
          }
        }
      }

      console.log('Permissions initialized successfully')
    } catch (error) {
      console.error('Failed to initialize permissions:', error)
      throw error
    }
  }

  // 检查用户权限（使用缓存）
  static async checkPermission(
    userId: string, 
    permissionName: string
  ): Promise<PermissionResult> {
    try {
      // 使用缓存的权限检查
      const cachedResult = await CachedQueries.checkUserPermission(userId, permissionName)
      
      if (cachedResult.data !== null) {
        return {
          granted: cachedResult.data,
          reason: cachedResult.fromCache ? 'Cached permission check' : 'Fresh permission check',
          source: 'system'
        }
      }

      // 如果缓存未命中，执行原始逻辑
      return this.checkPermissionDirect(userId, permissionName)
    } catch (error) {
      console.error('Permission check failed:', error)
      return { granted: false, reason: 'Permission check error', source: 'system' }
    }
  }

  // 直接权限检查（不使用缓存）
  private static async checkPermissionDirect(
    userId: string, 
    permissionName: string
  ): Promise<PermissionResult> {
    try {
      // 获取用户信息
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (!user) {
        return { granted: false, reason: 'User not found', source: 'system' }
      }

      // 获取权限信息
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })

      if (!permission) {
        return { granted: false, reason: 'Permission not found', source: 'system' }
      }

      // 1. 检查用户特定权限（最高优先级）
      const userPermission = await prisma.userPermission.findUnique({
        where: {
          userId_permissionId: {
            userId,
            permissionId: permission.id
          }
        }
      })

      if (userPermission) {
        // 检查是否过期
        if (userPermission.expiresAt && userPermission.expiresAt < new Date()) {
          return { granted: false, reason: 'User permission expired', source: 'user' }
        }
        
        return {
          granted: userPermission.granted,
          reason: userPermission.reason || 'User-specific permission',
          source: 'user'
        }
      }

      // 2. 检查角色权限
      const rolePermission = await prisma.rolePermission.findUnique({
        where: {
          role_permissionId: {
            role: user.role,
            permissionId: permission.id
          }
        }
      })

      if (rolePermission) {
        return {
          granted: rolePermission.granted,
          reason: `Role-based permission for ${user.role}`,
          source: 'role'
        }
      }

      // 3. 默认拒绝
      return {
        granted: false,
        reason: 'No permission granted',
        source: 'system'
      }

    } catch (error) {
      console.error('Permission check failed:', error)
      return { granted: false, reason: 'Permission check failed', source: 'system' }
    }
  }

  // 批量检查权限
  static async checkPermissions(
    userId: string,
    permissionNames: string[]
  ): Promise<Record<string, PermissionResult>> {
    const results: Record<string, PermissionResult> = {}
    
    for (const permissionName of permissionNames) {
      results[permissionName] = await this.checkPermission(userId, permissionName)
    }
    
    return results
  }

  // 授予用户权限
  static async grantUserPermission(
    userId: string,
    permissionName: string,
    reason?: string,
    expiresAt?: Date
  ) {
    const permission = await prisma.permission.findUnique({
      where: { name: permissionName }
    })

    if (!permission) {
      throw new Error('Permission not found')
    }

    const result = await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId,
          permissionId: permission.id
        }
      },
      update: {
        granted: true,
        reason,
        expiresAt
      },
      create: {
        userId,
        permissionId: permission.id,
        granted: true,
        reason,
        expiresAt
      }
    })

    // 清除相关缓存
    await CachedQueries.invalidatePermissionCache(userId)

    return result
  }

  // 撤销用户权限
  static async revokeUserPermission(
    userId: string,
    permissionName: string,
    reason?: string
  ) {
    const permission = await prisma.permission.findUnique({
      where: { name: permissionName }
    })

    if (!permission) {
      throw new Error('Permission not found')
    }

    const result = await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId,
          permissionId: permission.id
        }
      },
      update: {
        granted: false,
        reason
      },
      create: {
        userId,
        permissionId: permission.id,
        granted: false,
        reason
      }
    })

    // 清除相关缓存
    await CachedQueries.invalidatePermissionCache(userId)

    return result
  }

  // 获取用户所有权限
  static async getUserPermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // 获取角色权限
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { role: user.role },
      include: { permission: true }
    })

    return {
      role: user.role,
      rolePermissions,
      userPermissions: user.userPermissions
    }
  }
}