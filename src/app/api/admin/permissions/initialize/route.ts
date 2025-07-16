import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { PermissionManager } from '@/lib/permissions/permission-manager'
import { requirePermission } from '@/lib/permissions/permission-middleware'

// 初始化权限系统
export const POST = ApiWrappers.admin(
  requirePermission('system:maintenance')(
    async (request: NextRequest, { session }: { session: any }) => {
      try {
        // 初始化权限系统
        await PermissionManager.initializePermissions()
        
        // 记录审计日志
        await prisma.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'INITIALIZE_PERMISSIONS',
            resource: 'system',
            details: {
              initiatedBy: session.user.email,
              timestamp: new Date().toISOString()
            }
          }
        })
        
        return createSuccessResponse({
          message: 'Permission system initialized successfully',
          timestamp: new Date().toISOString()
        })
        
      } catch (error) {
        console.error('Permission initialization failed:', error)
        
        throw new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          'Failed to initialize permission system',
          { error: error instanceof Error ? error.message : 'Unknown error' }
        )
      }
    }
  )
)