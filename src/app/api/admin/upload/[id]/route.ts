import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

// Delete file endpoint
export const DELETE = ApiWrappers.admin(async (
  request: NextRequest,
  { params, session }: { params: { id: string }, session: any }
) => {
  const fileId = params.id

  // Check if file exists
  const file = await prisma.file.findUnique({
    where: { id: fileId }
  })

  if (!file) {
    throw new APIError(
      ErrorCode.NOT_FOUND,
      'File not found'
    )
  }

  // Permission check: regular users can only delete their own files
  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    if (file.uploadedById !== session.user.id) {
      throw new APIError(
        ErrorCode.FORBIDDEN,
        'Access denied: You can only delete your own files'
      )
    }
  }

  // Delete file from database
  await prisma.file.delete({
    where: { id: fileId }
  })

  // In a real implementation, you would also delete the file from storage here
  // For now, we'll just delete the database record

  // Record audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE',
      resource: 'file',
      details: {
        fileId: fileId,
        filename: file.filename,
        size: file.size,
        type: file.type
      }
    }
  })

  return createSuccessResponse({
    message: 'File deleted successfully'
  })
})

// Get single file endpoint
export const GET = ApiWrappers.admin(async (
  request: NextRequest,
  { params, session }: { params: { id: string }, session: any }
) => {
  const fileId = params.id

  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: {
      uploadedByUser: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  if (!file) {
    throw new APIError(
      ErrorCode.NOT_FOUND,
      'File not found'
    )
  }

  // Permission check: regular users can only view their own files
  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    if (file.uploadedById !== session.user.id) {
      throw new APIError(
        ErrorCode.FORBIDDEN,
        'Access denied: You can only view your own files'
      )
    }
  }

  return createSuccessResponse({
    file
  })
})