import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

// Get current session info
export const GET = ApiWrappers.public(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return createSuccessResponse({
      session: null,
      isAuthenticated: false
    })
  }

  // Get additional user info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!user) {
    return createSuccessResponse({
      session: null,
      isAuthenticated: false
    })
  }

  return createSuccessResponse({
    session: {
      user,
      expires: session.expires
    },
    isAuthenticated: true
  })
})

// Update session info
export const PUT = ApiWrappers.admin(async (
  request: NextRequest,
  { session }: { session: any }
) => {
  const body = await request.json()
  const { name, email } = body

  // Basic validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Invalid email format'
    )
  }

  // Check if email is already taken
  if (email && email !== session.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new APIError(
        ErrorCode.CONFLICT,
        'Email is already taken'
      )
    }
  }

  // Update user info
  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name && { name }),
      ...(email && { email, emailVerified: null }) // Reset email verification if email changed
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      image: true,
      updatedAt: true
    }
  })

  // Record update
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'PROFILE_UPDATED',
      resource: 'user',
      details: {
        changes: {
          ...(name && { name }),
          ...(email && { email })
        }
      }
    }
  })

  return createSuccessResponse({
    user: updatedUser,
    message: 'Profile updated successfully'
  })
})

// Revoke session (logout)
export const DELETE = ApiWrappers.admin(async (
  request: NextRequest,
  { session }: { session: any }
) => {
  // Record logout
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'LOGOUT_API',
      resource: 'auth',
      details: {
        email: session.user.email,
        timestamp: new Date().toISOString()
      }
    }
  })

  // In a real implementation, you might want to blacklist the JWT token
  // For now, we'll just return success (client should handle clearing cookies)
  
  return createSuccessResponse({
    message: 'Session revoked successfully'
  })
})