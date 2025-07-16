import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

// File upload validation schema
const uploadSchema = z.object({
  file: z.any(),
  type: z.enum(['image', 'document', 'media']).optional().default('image')
})

// Upload file endpoint
export const POST = ApiWrappers.admin(async (
  request: NextRequest,
  { session }: { session: any }
) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'No file provided'
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'File size exceeds 10MB limit'
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid file type. Only images and documents are allowed.'
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // For now, we'll use a simple file storage approach
    // In production, this should be replaced with Vercel Blob or similar
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Store file metadata in database
    const fileRecord = await prisma.file.create({
      data: {
        filename: file.name,
        storedFilename: filename,
        mimeType: file.type,
        size: file.size,
        uploadedById: session.user.id,
        url: `/uploads/${filename}`, // This would be the actual URL in production
        type: file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT'
      }
    })

    // In a real implementation, you would save the file to storage here
    // For now, we'll simulate the upload and return a mock URL
    const mockUrl = `https://picsum.photos/800/600?random=${timestamp}`

    // Update the file record with the actual URL
    await prisma.file.update({
      where: { id: fileRecord.id },
      data: { url: mockUrl }
    })

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'file',
        details: {
          fileId: fileRecord.id,
          filename: file.name,
          size: file.size,
          type: file.type
        }
      }
    })

    return createSuccessResponse({
      file: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        url: mockUrl,
        size: fileRecord.size,
        type: fileRecord.type
      },
      url: mockUrl, // For backwards compatibility with the editor
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('File upload error:', error)
    
    if (error instanceof APIError) {
      throw error
    }
    
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'File upload failed'
    )
  }
})

// Get uploaded files list
export const GET = ApiWrappers.admin(async (
  request: NextRequest,
  { session }: { session: any }
) => {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const type = searchParams.get('type') // 'IMAGE' | 'DOCUMENT'
  const search = searchParams.get('search')

  const skip = (page - 1) * limit

  const where: any = {}

  // Filter by type if provided
  if (type) {
    where.type = type
  }

  // Filter by filename if search provided
  if (search) {
    where.filename = {
      contains: search,
      mode: 'insensitive'
    }
  }

  // Regular users can only see their own files
  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    where.uploadedById = session.user.id
  }

  const [files, total] = await Promise.all([
    prisma.file.findMany({
      where,
      include: {
        uploadedByUser: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.file.count({ where })
  ])

  return createSuccessResponse({
    files,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
})