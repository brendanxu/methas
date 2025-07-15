import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

const contentSchema = z.object({
  type: z.enum(['NEWS', 'CASE_STUDY', 'SERVICE', 'PAGE']),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
})

const querySchema = z.object({
  type: z.enum(['NEWS', 'CASE_STUDY', 'SERVICE', 'PAGE']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional()
})

// 公开端点 - 获取已发布内容
export const GET = ApiWrappers.public(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const query = querySchema.parse(Object.fromEntries(searchParams.entries()))
  
  const { type, status, page, limit, search } = query
  const skip = (page - 1) * limit

  // 构建查询条件
  const where: any = {
    // 公开端点只能访问已发布的内容
    status: status || 'PUBLISHED'
  }
  
  if (type) where.type = type
  
  // 搜索功能
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [contents, total] = await Promise.all([
    prisma.content.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    }),
    prisma.content.count({ where })
  ])

  return createSuccessResponse({
    contents,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1
    }
  })
})

// 管理员端点 - 创建内容
export const POST = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  const body = await request.json()
  const data = contentSchema.parse(body)

  // 检查slug是否已存在
  const existingContent = await prisma.content.findUnique({
    where: { slug: data.slug }
  })

  if (existingContent) {
    throw new APIError(
      ErrorCode.CONFLICT,
      'Content with this slug already exists',
      { slug: data.slug, existingId: existingContent.id }
    )
  }

  // 验证作者权限（用户只能创建自己的内容，除非是管理员）
  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    // 普通用户限制
    if (data.status === 'PUBLISHED') {
      throw new APIError(
        ErrorCode.FORBIDDEN,
        'Only administrators can publish content directly'
      )
    }
  }

  const content = await prisma.content.create({
    data: {
      ...data,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      authorId: session.user.id,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  // 记录审计日志
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'CREATE',
      resource: 'content',
      details: { 
        contentId: content.id, 
        title: content.title,
        type: content.type,
        status: content.status
      }
    }
  })

  return createSuccessResponse({
    content,
    message: 'Content created successfully'
  })
})