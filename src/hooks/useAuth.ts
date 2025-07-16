'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { UserRole } from '@prisma/client'
import { canAccessResource, hasPermission } from '@/lib/auth-helpers'

interface PermissionResult {
  granted: boolean
  reason?: string
  source: 'role' | 'user' | 'system'
}

interface UserPermission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
  granted: boolean
  source: 'role' | 'user' | 'system'
  reason?: string
  expiresAt?: Date | null
}

interface PermissionCache {
  [key: string]: PermissionResult
}

interface UserPermissions {
  effective: UserPermission[]
  byResource: Record<string, UserPermission[]>
  userSpecific: any[]
  roleDefault: any[]
}

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [permissionCache, setPermissionCache] = useState<PermissionCache>({})

  const loadUserPermissions = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/admin/permissions/${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setPermissions(data.data.permissions)
        
        // Build permission cache
        const cache: PermissionCache = {}
        data.data.permissions.effective.forEach((perm: UserPermission) => {
          cache[perm.name] = {
            granted: perm.granted,
            reason: perm.reason,
            source: perm.source
          }
        })
        setPermissionCache(cache)
      }
    } catch (error) {
      console.error('Failed to load user permissions:', error)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false)
    }
  }, [status])

  // Load user permissions when authenticated
  useEffect(() => {
    if (session?.user?.id && status === 'authenticated') {
      loadUserPermissions()
    } else {
      setPermissions(null)
      setPermissionCache({})
    }
  }, [session?.user?.id, status, loadUserPermissions])

  const requireAuth = (redirectTo = '/admin/login') => {
    if (status === 'unauthenticated') {
      router.push(redirectTo)
      return false
    }
    return true
  }

  const requireRole = (requiredRole: UserRole, redirectTo = '/admin/error?error=AccessDenied') => {
    if (!session?.user) {
      router.push('/admin/login')
      return false
    }

    if (!hasPermission(session.user.role, requiredRole)) {
      router.push(redirectTo)
      return false
    }

    return true
  }

  // Legacy resource-based permission check (for backwards compatibility)
  const checkPermission = (resource: string): boolean => {
    if (!session?.user) return false
    return canAccessResource(session.user.role, resource)
  }

  // New fine-grained permission check
  const checkSpecificPermission = (permissionName: string): PermissionResult => {
    if (!session?.user) {
      return { granted: false, reason: 'Not authenticated', source: 'system' }
    }

    // Check cache first
    if (permissionCache[permissionName]) {
      return permissionCache[permissionName]
    }

    // Fallback to role-based check for unknown permissions
    if (session.user.role === 'SUPER_ADMIN') {
      return { granted: true, reason: 'Super admin access', source: 'role' }
    }

    return { granted: false, reason: 'Permission not found', source: 'system' }
  }

  // Check multiple permissions
  const checkMultiplePermissions = (permissionNames: string[]): Record<string, PermissionResult> => {
    const results: Record<string, PermissionResult> = {}
    permissionNames.forEach(name => {
      results[name] = checkSpecificPermission(name)
    })
    return results
  }

  // Check if user has permission for a specific resource and action
  const hasResourcePermission = (resource: string, action: string): boolean => {
    if (!permissions) return false
    
    const resourcePermissions = permissions.byResource[resource] || []
    return resourcePermissions.some(perm => 
      perm.action === action && perm.granted
    )
  }

  // Get all permissions for a specific resource
  const getResourcePermissions = (resource: string): UserPermission[] => {
    if (!permissions) return []
    return permissions.byResource[resource] || []
  }

  // Refresh permissions manually
  const refreshPermissions = useCallback(() => {
    if (session?.user?.id) {
      loadUserPermissions()
    }
  }, [loadUserPermissions, session?.user?.id])

  return {
    session,
    user: session?.user,
    isLoading,
    isAuthenticated: status === 'authenticated',
    permissions,
    
    // Authentication methods
    requireAuth,
    requireRole,
    
    // Permission checking methods
    checkPermission, // Legacy
    checkSpecificPermission, // New fine-grained
    checkMultiplePermissions,
    hasResourcePermission,
    getResourcePermissions,
    
    // Permission management
    refreshPermissions,
    
    // Legacy role-based check
    hasPermission: (requiredRole: UserRole) => 
      session?.user ? hasPermission(session.user.role, requiredRole) : false
  }
}