import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

const updateContentSchema = z.object({
  type: z.enum(['NEWS', 'CASE_STUDY', 'SERVICE', 'PAGE']).optional(),
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
})

// 管理员端点 - 获取单个内容
export const GET = ApiWrappers.admin(async (
  request: NextRequest,
  { params, session }: { params: { id: string }, session: any }
) => {
  const content = await prisma.content.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  if (!content) {
    throw new APIError(
      ErrorCode.NOT_FOUND,
      'Content not found'
    )
  }

  // 权限检查：普通用户只能查看自己的内容
  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    if (content.authorId !== session.user.id) {
      throw new APIError(
        ErrorCode.FORBIDDEN,
        'Access denied: You can only view your own content'
      )
    }
  }

  return createSuccessResponse({
    content: {
      ...content,
      tags: content.tags ? JSON.parse(content.tags) : []
    }
  })
})

// 管理员端点 - 更新内容
export const PUT = ApiWrappers.admin(async (
  request: NextRequest,
  { params, session }: { params: { id: string }, session: any }
) => {
  const body = await request.json()
  const data = updateContentSchema.parse(body)

  // 检查内容是否存在
  const existingContent = await prisma.content.findUnique({
    where: { id: params.id }
  })

  if (!existingContent) {
    throw new APIError(
      ErrorCode.NOT_FOUND,
      'Content not found'
    )
  }

  // 权限检查：普通用户只能编辑自己的内容
  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    if (existingContent.authorId !== session.user.id) {
      throw new APIError(
        ErrorCode.FORBIDDEN,
        'Access denied: You can only edit your own content'
      )
    }
    
    // 普通用户不能直接发布内容
    if (data.status === 'PUBLISHED' && existingContent.status !== 'PUBLISHED') {
      throw new APIError(
        ErrorCode.FORBIDDEN,
        'Only administrators can publish content'
      )
    }
  }

  // 检查slug是否已存在（如果更新slug）
  if (data.slug && data.slug !== existingContent.slug) {
    const slugExists = await prisma.content.findUnique({
      where: { slug: data.slug }
    })

    if (slugExists) {
      throw new APIError(
        ErrorCode.CONFLICT,
        'Slug already exists',
        { slug: data.slug, existingId: slugExists.id }
      )
    }
  }

  const content = await prisma.content.update({
    where: { id: params.id },
    data: {
      ...data,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
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
      action: 'UPDATE',
      resource: 'content',
      details: { 
        contentId: content.id, 
        title: content.title,
        changes: Object.keys(data)
      }
    }
  })

  return createSuccessResponse({
    content: {
      ...content,
      tags: content.tags ? JSON.parse(content.tags) : []
    },
    message: 'Content updated successfully'
  })
})

// 管理员端点 - 删除内容
export const DELETE = ApiWrappers.admin(async (
  request: NextRequest,
  { params, session }: { params: { id: string }, session: any }
) => {
  // 检查内容是否存在
  const existingContent = await prisma.content.findUnique({
    where: { id: params.id }
  })

  if (!existingContent) {
    throw new APIError(
      ErrorCode.NOT_FOUND,
      'Content not found'
    )
  }

  // 权限检查：普通用户只能删除自己的内容
  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
    if (existingContent.authorId !== session.user.id) {
      throw new APIError(
        ErrorCode.FORBIDDEN,
        'Access denied: You can only delete your own content'
      )
    }
  }

  await prisma.content.delete({
    where: { id: params.id }
  })

  // 记录审计日志
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE',
      resource: 'content',
      details: { 
        contentId: params.id, 
        title: existingContent.title,
        type: existingContent.type
      }
    }
  })

  return createSuccessResponse({
    message: 'Content deleted successfully'
  })
})