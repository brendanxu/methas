import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import { PermissionManager } from './permissions/permission-manager'

// Server-side session verification
export async function getServerSessionWithAuth() {
  const session = await getServerSession(authOptions)
  return session
}

// Server-side admin check
export async function requireAdmin() {
  const session = await getServerSessionWithAuth()
  
  if (!session?.user) {
    redirect('/admin/login')
  }
  
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/admin/error?error=AccessDenied')
  }
  
  return session
}

// Server-side super admin check
export async function requireSuperAdmin() {
  const session = await getServerSessionWithAuth()
  
  if (!session?.user) {
    redirect('/admin/login')
  }
  
  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/error?error=AccessDenied')
  }
  
  return session
}

// Permission checking utilities
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    USER: 0,
    ADMIN: 1,
    SUPER_ADMIN: 2
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canAccessResource(userRole: UserRole, resource: string): boolean {
  const permissions = {
    USER: ['profile', 'content:read'],
    ADMIN: ['profile', 'content:read', 'content:write', 'users:read', 'files:manage'],
    SUPER_ADMIN: ['*'] // All permissions
  }
  
  const userPermissions = permissions[userRole] || []
  return userPermissions.includes('*') || userPermissions.includes(resource)
}

// Server-side permission check
export async function requirePermission(permissionName: string) {
  const session = await getServerSessionWithAuth()
  
  if (!session?.user) {
    redirect('/admin/login')
  }
  
  const permissionResult = await PermissionManager.checkPermission(
    session.user.id,
    permissionName
  )
  
  if (!permissionResult.granted) {
    redirect('/admin/error?error=AccessDenied')
  }
  
  return session
}

// Check multiple permissions (all required)
export async function requirePermissions(permissionNames: string[]) {
  const session = await getServerSessionWithAuth()
  
  if (!session?.user) {
    redirect('/admin/login')
  }
  
  const permissionResults = await PermissionManager.checkPermissions(
    session.user.id,
    permissionNames
  )
  
  const hasAllPermissions = Object.values(permissionResults)
    .every(result => result.granted)
  
  if (!hasAllPermissions) {
    redirect('/admin/error?error=AccessDenied')
  }
  
  return session
}

// Session data types
export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: UserRole
  emailVerified: Date | null
}

export interface AuthSession {
  user: SessionUser
  expires: string
}