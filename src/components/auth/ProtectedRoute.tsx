'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@prisma/client'
import { Spin, Alert, Card } from 'antd'
import { ErrorIcon } from '@/components/icons/LightweightIcons'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  fallback?: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requiredRole = 'USER',
  fallback,
  redirectTo
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, requireAuth, requireRole, user } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      requireAuth(redirectTo)
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectTo])

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole !== 'USER') {
      requireRole(requiredRole, redirectTo)
    }
  }, [isLoading, isAuthenticated, requiredRole, requireRole, redirectTo])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <Card className="max-w-md mx-auto mt-8">
        <Alert
          message="需要登录"
          description="请先登录以访问此页面"
          type="warning"
          showIcon
          icon={<ErrorIcon />}
        />
      </Card>
    )
  }

  if (requiredRole !== 'USER' && user && !requireRole(requiredRole)) {
    return fallback || (
      <Card className="max-w-md mx-auto mt-8">
        <Alert
          message="权限不足"
          description="您没有访问此页面的权限"
          type="error"
          showIcon
          icon={<ErrorIcon />}
        />
      </Card>
    )
  }

  return <>{children}</>
}