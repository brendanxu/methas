import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

// Generate a random password
function generateTemporaryPassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one character from each category
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// POST /api/admin/users/[id]/reset-password - 重置用户密码
const handleResetPassword = async (
  request: NextRequest, 
  { params, session }: { params: { id: string }, session: any }
) => {
  const userId = params.id

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

  // 不能重置自己的密码（通过这个接口）
  if (user.id === session.user.id) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Cannot reset your own password through this endpoint'
    )
  }

  // 只有 SUPER_ADMIN 可以重置其他管理员的密码
  if (user.role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    throw new APIError(
      ErrorCode.FORBIDDEN,
      'Cannot reset super admin password'
    )
  }

  try {
    // 生成临时密码
    const temporaryPassword = generateTemporaryPassword()
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12)

    // 更新用户密码
    await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        // 可以添加一个字段来标记密码需要在下次登录时更改
      }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'RESET_USER_PASSWORD',
        resource: 'user',
        details: {
          targetUserId: userId,
          targetUserEmail: user.email,
          targetUserName: user.name,
          resetBy: session.user.email
        }
      }
    })

    return createSuccessResponse({
      message: 'Password reset successfully',
      temporaryPassword, // 在实际生产环境中，应该通过邮件发送而不是在响应中返回
      userId: userId
    })

  } catch (error) {
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to reset password',
      { error: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
}

export const POST = ApiWrappers.admin(handleResetPassword)