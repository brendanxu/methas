import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// Request password reset
export const POST = ApiWrappers.public(async (request: NextRequest) => {
  const body = await request.json()
  const { email } = requestResetSchema.parse(body)

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  })

  // Always return success to prevent email enumeration
  if (!user) {
    return createSuccessResponse({
      message: 'If an account with that email exists, a reset link has been sent.'
    })
  }

  // Generate reset token (in production, use a proper token service)
  const resetToken = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15)
  const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

  // Store reset token (you would need to add these fields to the User model)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      // resetToken,
      // resetTokenExpiry,
      // For now, we'll store in audit log as a workaround
    }
  })

  // Record reset request
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      resource: 'auth',
      details: { 
        email: user.email,
        resetToken,
        expiresAt: resetTokenExpiry.toISOString()
      }
    }
  })

  // In production, send email with reset link
  // await sendPasswordResetEmail(user.email, resetToken)

  return createSuccessResponse({
    message: 'If an account with that email exists, a reset link has been sent.'
  })
})

// Reset password with token
export const PUT = ApiWrappers.public(async (request: NextRequest) => {
  const body = await request.json()
  const { token, password } = resetPasswordSchema.parse(body)

  // Find user by reset token (stored in audit log for now)
  // Note: This is a simplified approach. In production, use proper token storage
  const resetLogs = await prisma.auditLog.findMany({
    where: {
      action: 'PASSWORD_RESET_REQUESTED'
    },
    orderBy: { createdAt: 'desc' }
  })

  const resetLog = resetLogs.find(log => {
    const details = log.details as any
    return details?.resetToken === token
  })

  if (!resetLog) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Invalid or expired reset token'
    )
  }

  // Check if token is expired (1 hour)
  const tokenAge = Date.now() - new Date(resetLog.createdAt).getTime()
  if (tokenAge > 3600000) { // 1 hour
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Reset token has expired'
    )
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Update user password
  await prisma.user.update({
    where: { id: resetLog.userId },
    data: { password: hashedPassword }
  })

  // Record password reset
  await prisma.auditLog.create({
    data: {
      userId: resetLog.userId,
      action: 'PASSWORD_RESET_COMPLETED',
      resource: 'auth',
      details: { 
        resetToken: token,
        timestamp: new Date().toISOString()
      }
    }
  })

  return createSuccessResponse({
    message: 'Password has been reset successfully'
  })
})