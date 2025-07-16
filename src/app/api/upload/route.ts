
import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { prisma } from '@/lib/prisma'
import path from 'path'
import { randomUUID } from 'crypto'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

// 支持的文件类型
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  all: [] as string[]
}
ALLOWED_TYPES.all = [...ALLOWED_TYPES.image, ...ALLOWED_TYPES.document]

// 文件大小限制 (bytes)
const MAX_FILE_SIZE = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
}

// POST /api/upload - 文件上传
const handleFileUpload = async (request: NextRequest, context: any) => {
  const { session } = context

  const formData = await request.formData()
  const file = formData.get('file') as File
  const type = formData.get('type') as string || 'image' // 'image' | 'document' | 'avatar'
  const category = formData.get('category') as string || 'general' // 'general' | 'avatar' | 'content'

  // 验证文件是否存在
  if (!file) {
    throw new APIError(ErrorCode.BAD_REQUEST, 'No file uploaded')
  }

  // 验证文件名
  if (!file.name || file.name.length === 0) {
    throw new APIError(ErrorCode.BAD_REQUEST, 'Invalid file name')
  }

  // 确定文件类型和大小限制
  let allowedTypes: string[]
  let maxSize: number

  if (type === 'image' || category === 'avatar') {
    allowedTypes = ALLOWED_TYPES.image
    maxSize = MAX_FILE_SIZE.image
  } else if (type === 'document') {
    allowedTypes = ALLOWED_TYPES.document
    maxSize = MAX_FILE_SIZE.document
  } else {
    allowedTypes = ALLOWED_TYPES.all
    maxSize = Math.max(MAX_FILE_SIZE.image, MAX_FILE_SIZE.document)
  }

  // 验证文件类型
  if (!allowedTypes.includes(file.type)) {
    throw new APIError(
      ErrorCode.BAD_REQUEST, 
      `File type ${file.type} is not allowed`,
      { allowedTypes, receivedType: file.type }
    )
  }

  // 验证文件大小
  if (file.size > maxSize) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
      { maxSize, fileSize: file.size, limitMB: maxSize / (1024 * 1024) }
    )
  }

  // 验证category参数
  const validCategories = ['general', 'avatar', 'content']
  if (!validCategories.includes(category)) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Invalid category',
      { allowedCategories: validCategories, receivedCategory: category }
    )
  }

  try {
    // 生成唯一文件名
    const fileExtension = path.extname(file.name)
    const fileName = `${randomUUID()}${fileExtension}`
    
    // 根据类别确定存储路径
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category)
    const filePath = path.join(uploadDir, fileName)

    // 确保目录存在
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (dirError) {
      // 目录可能已存在，这是正常的
      if (dirError && typeof dirError === 'object' && 'code' in dirError && dirError.code !== 'EEXIST') {
        throw new APIError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          'Failed to create upload directory',
          dirError
        )
      }
    }

    // 保存文件到磁盘
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 保存文件信息到数据库
    const fileRecord = await prisma.file.create({
      data: {
        filename: file.name,
        storedFilename: fileName,
        url: `/uploads/${category}/${fileName}`,
        size: file.size,
        mimeType: file.type,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT',
        uploadedById: session.user.id,
      }
    })

    // 如果是头像上传，更新用户信息
    if (category === 'avatar') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: fileRecord.url }
      })
    }

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPLOAD_FILE',
        resource: 'file',
        details: {
          fileId: fileRecord.id,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          category
        }
      }
    })

    return createSuccessResponse({
      file: {
        id: fileRecord.id,
        name: fileRecord.filename,
        storedFilename: fileRecord.storedFilename,
        url: fileRecord.url,
        size: fileRecord.size,
        type: fileRecord.mimeType,
        uploadedAt: fileRecord.createdAt
      }
    })

  } catch (error) {
    // 如果是APIError，直接抛出
    if (error instanceof APIError) {
      throw error
    }
    
    // 处理文件系统错误
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ENOSPC') {
        throw new APIError(ErrorCode.RESOURCE_EXHAUSTED, 'Insufficient disk space')
      }
      if (error.code === 'EACCES') {
        throw new APIError(ErrorCode.FORBIDDEN, 'Permission denied for file operation')
      }
    }

    // 其他未知错误
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'File upload failed',
      error
    )
  }
}

// GET /api/upload - 获取文件列表
const handleGetFiles = async (request: NextRequest, context: any) => {
  const { session } = context
  
  // 权限检查 - 只有管理员可以查看文件列表
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    throw new APIError(ErrorCode.FORBIDDEN, 'Admin access required')
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20'))) // 限制在1-100之间
  const category = searchParams.get('category')
  const type = searchParams.get('type')
  const search = searchParams.get('search')
  const skip = (page - 1) * limit

  // 验证category参数
  const validCategories = ['general', 'avatar', 'content']
  if (category && !validCategories.includes(category)) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Invalid category filter',
      { allowedCategories: validCategories, receivedCategory: category }
    )
  }

  // 验证type参数
  const validTypes = ['image', 'application', 'text', 'video', 'audio']
  if (type && !validTypes.includes(type)) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Invalid type filter',
      { allowedTypes: validTypes, receivedType: type }
    )
  }

  try {
    // 构建查询条件
    const where: any = {}
    
    if (category) {
      where.url = { contains: `/${category}/` }
    }
    
    if (type) {
      where.mimeType = { startsWith: type }
    }
    
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { filename: { contains: search, mode: 'insensitive' } },
        { mimeType: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          filename: true,
          storedFilename: true,
          url: true,
          size: true,
          mimeType: true,
          type: true,
          uploadedBy: true,
          uploadedById: true,
          createdAt: true
        }
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
      },
      filters: {
        category: category || null,
        type: type || null,
        search: search || null
      }
    })

  } catch (error) {
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to fetch files',
      error
    )
  }
}

// 导出包装的处理器
export const POST = ApiWrappers.admin(handleFileUpload)
export const GET = ApiWrappers.admin(handleGetFiles)