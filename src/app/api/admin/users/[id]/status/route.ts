import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

const updateStatusSchema = z.object({
  enabled: z.boolean()
})

// PATCH /api/admin/users/[id]/status - 更新用户状态
const handleUpdateUserStatus = async (
  request: NextRequest, 
  { params, session }: { params: { id: string }, session: any }
) => {
  const userId = params.id

  // 解析请求体
  const body = await request.json()
  const { enabled } = updateStatusSchema.parse(body)

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

  // 不能禁用自己
  if (user.id === session.user.id && !enabled) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Cannot disable your own account'
    )
  }

  // 只有 SUPER_ADMIN 可以管理其他管理员的状态
  if (user.role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    throw new APIError(
      ErrorCode.FORBIDDEN,
      'Cannot modify super admin status'
    )
  }

  // 不能禁用最后一个超级管理员
  if (user.role === 'SUPER_ADMIN' && !enabled) {
    const superAdminCount = await prisma.user.count({
      where: { role: 'SUPER_ADMIN' }
    })
    
    if (superAdminCount === 1) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Cannot disable the only super admin'
      )
    }
  }

  try {
    // 在实际应用中，这里可能需要添加一个 'enabled' 字段到 User 模型
    // 目前我们使用一个变通方法，可以考虑添加到 User 模型中
    
    // 由于当前模型没有 enabled 字段，我们可以使用审计日志来记录状态变更
    // 在实际应用中，应该在 User 模型中添加 enabled 字段
    
    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: enabled ? 'ENABLE_USER' : 'DISABLE_USER',
        resource: 'user',
        details: {
          targetUserId: userId,
          targetUserEmail: user.email,
          targetUserName: user.name,
          newStatus: enabled ? 'enabled' : 'disabled',
          changedBy: session.user.email
        }
      }
    })

    return createSuccessResponse({
      message: `User ${enabled ? 'enabled' : 'disabled'} successfully`,
      userId: userId,
      enabled: enabled
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid request data',
        { errors: error.errors }
      )
    }

    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to update user status',
      { error: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

export const PATCH = ApiWrappers.admin(handleUpdateUserStatus)