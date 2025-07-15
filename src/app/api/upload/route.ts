
// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { writeFile, mkdir } from 'fs/promises'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'
import { randomUUID } from 'crypto'

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'image' // 'image' | 'document' | 'avatar'
    const category = formData.get('category') as string || 'general' // 'general' | 'avatar' | 'content'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // 验证文件类型
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

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      )
    }

    // 验证文件大小
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const fileExtension = path.extname(file.name)
    const fileName = `${randomUUID()}${fileExtension}`
    
    // 根据类别确定存储路径
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category)
    const filePath = path.join(uploadDir, fileName)

    // 确保目录存在
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // 目录可能已存在，忽略错误
    }

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 保存文件信息到数据库
    const fileRecord = await prisma.file.create({
      data: {
        filename: fileName,
        originalName: file.name,
        url: `/uploads/${category}/${fileName}`,
        size: file.size,
        mimeType: file.type,
        uploadedBy: session.user.id,
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

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        name: fileRecord.filename,
        originalName: fileRecord.originalName,
        url: fileRecord.url,
        size: fileRecord.size,
        type: fileRecord.mimeType,
        uploadedAt: fileRecord.createdAt
      }
    })
  } catch (error) {
    logError('File upload error:', error)
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const skip = (page - 1) * limit

    const where: any = {}
    if (category) where.url = { contains: `/${category}/` }
    if (type) where.mimeType = { startsWith: type }

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.file.count({ where })
    ])

    return NextResponse.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logError('Files fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}