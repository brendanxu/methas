import { UserRole } from '@prisma/client'
import { Session } from 'next-auth'

// 权限级别定义
export const PERMISSION_LEVELS = {
  USER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
} as const

// 资源权限映射
export const RESOURCE_PERMISSIONS = {
  // 内容管理
  CONTENT_READ: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  CONTENT_CREATE: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  CONTENT_UPDATE: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  CONTENT_DELETE: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  CONTENT_PUBLISH: [UserRole.ADMIN, UserRole.SUPER_ADMIN],

  // 用户管理
  USER_READ: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  USER_CREATE: [UserRole.SUPER_ADMIN],
  USER_UPDATE_SELF: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  USER_UPDATE_OTHER: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  USER_DELETE: [UserRole.SUPER_ADMIN],
  USER_CHANGE_ROLE: [UserRole.SUPER_ADMIN],

  // 表单管理
  FORM_READ: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  FORM_UPDATE: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  FORM_DELETE: [UserRole.ADMIN, UserRole.SUPER_ADMIN],

  // 文件管理
  FILE_UPLOAD: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  FILE_READ: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  FILE_DELETE_OWN: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  FILE_DELETE_ANY: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  FILE_MANAGE: [UserRole.ADMIN, UserRole.SUPER_ADMIN],

  // 系统管理
  ADMIN_DASHBOARD: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  AUDIT_LOGS: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  SYSTEM_SETTINGS: [UserRole.SUPER_ADMIN],
} as const

export type PermissionKey = keyof typeof RESOURCE_PERMISSIONS

// 获取用户权限级别
export function getUserPermissionLevel(role: UserRole): number {
  return PERMISSION_LEVELS[role] || 0
}

// 检查用户是否有特定权限
export function hasPermission(userRole: UserRole, permission: PermissionKey): boolean {
  const allowedRoles = RESOURCE_PERMISSIONS[permission]
  return (allowedRoles as readonly UserRole[]).includes(userRole)
}

// 检查用户是否有足够的权限级别
export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  return getUserPermissionLevel(userRole) >= getUserPermissionLevel(minimumRole)
}

// 检查用户是否可以操作目标用户
export function canManageUser(operatorRole: UserRole, targetRole: UserRole, isOwnProfile: boolean = false): boolean {
  // 用户可以管理自己的资料（除了角色）
  if (isOwnProfile) {
    return true
  }

  // 管理员不能管理超级管理员
  if (operatorRole === UserRole.ADMIN && targetRole === UserRole.SUPER_ADMIN) {
    return false
  }

  // 只有超级管理员可以管理管理员
  if (targetRole === UserRole.ADMIN && operatorRole !== UserRole.SUPER_ADMIN) {
    return false
  }

  // 其他情况按权限级别判断
  return getUserPermissionLevel(operatorRole) > getUserPermissionLevel(targetRole)
}

// 检查用户是否可以删除资源
export function canDeleteResource(
  userRole: UserRole, 
  resourceOwnerId?: string, 
  userId?: string,
  permission?: PermissionKey
): boolean {
  // 如果指定了具体权限，优先检查
  if (permission && !hasPermission(userRole, permission)) {
    return false
  }

  // 资源所有者可以删除自己的资源
  if (resourceOwnerId && userId && resourceOwnerId === userId) {
    return true
  }

  // 管理员可以删除普通用户的资源
  return hasMinimumRole(userRole, UserRole.ADMIN)
}

// 会话权限检查助手
export class PermissionChecker {
  constructor(private session: Session | null) {}

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.session?.user
  }

  // 检查是否有特定权限
  hasPermission(permission: PermissionKey): boolean {
    if (!this.session?.user?.role) return false
    return hasPermission(this.session.user.role, permission)
  }

  // 检查是否有最小角色要求
  hasMinimumRole(minimumRole: UserRole): boolean {
    if (!this.session?.user?.role) return false
    return hasMinimumRole(this.session.user.role, minimumRole)
  }

  // 检查是否可以管理用户
  canManageUser(targetRole: UserRole, isOwnProfile: boolean = false): boolean {
    if (!this.session?.user?.role) return false
    return canManageUser(this.session.user.role, targetRole, isOwnProfile)
  }

  // 检查是否可以删除资源
  canDeleteResource(resourceOwnerId?: string, permission?: PermissionKey): boolean {
    if (!this.session?.user?.role) return false
    return canDeleteResource(
      this.session.user.role,
      resourceOwnerId,
      this.session.user.id,
      permission
    )
  }

  // 获取用户信息
  getUser() {
    return this.session?.user
  }

  // 获取用户角色
  getRole(): UserRole | null {
    return this.session?.user?.role || null
  }
}

// 权限错误类
export class PermissionError extends Error {
  constructor(
    message: string = 'Permission denied',
    public statusCode: number = 403,
    public code: string = 'PERMISSION_DENIED'
  ) {
    super(message)
    this.name = 'PermissionError'
  }
}

// 认证错误类
export class AuthenticationError extends Error {
  constructor(
    message: string = 'Authentication required',
    public statusCode: number = 401,
    public code: string = 'AUTHENTICATION_REQUIRED'
  ) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

// 创建权限检查器实例
export function createPermissionChecker(session: Session | null): PermissionChecker {
  return new PermissionChecker(session)
}