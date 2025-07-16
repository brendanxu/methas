import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, APIError, ErrorCode } from '@/lib/api-error-handler'
import { CacheManager } from '@/lib/cache/cache-manager'
import { z } from 'zod'

// 更新表单状态的Schema
const updateSubmissionSchema = z.object({
  status: z.enum(['NEW', 'PROCESSED', 'REPLIED', 'ARCHIVED', 'EMAIL_FAILED']),
  notes: z.string().max(1000).optional()
})

// GET /api/admin/forms/submissions/[id] - 获取单个表单提交详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      throw new APIError(ErrorCode.UNAUTHORIZED, 'Admin access required')
    }

    const submission = await prisma.formSubmission.findUnique({
      where: { id: params.id }
    })

    if (!submission) {
      throw new APIError(ErrorCode.NOT_FOUND, 'Form submission not found')
    }

    // 格式化数据
    const data = submission.data as any
    
    return createSuccessResponse({
      id: submission.id,
      type: submission.type,
      status: submission.status,
      data,
      notes: submission.notes,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      // 额外的分析信息
      analysis: {
        isSpam: data.isSpam || false,
        hasPhone: !!data.phone,
        hasCompany: !!data.company,
        messageLength: data.message?.length || 0,
        source: data.source || 'direct',
        country: data.country || 'unknown'
      }
    })

  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to fetch form submission',
      error
    )
  }
}

// PATCH /api/admin/forms/submissions/[id] - 更新表单状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      throw new APIError(ErrorCode.UNAUTHORIZED, 'Admin access required')
    }

    const body = await request.json()
    const updateData = updateSubmissionSchema.parse(body)

    // 检查表单是否存在
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: { id: params.id }
    })

    if (!existingSubmission) {
      throw new APIError(ErrorCode.NOT_FOUND, 'Form submission not found')
    }

    // 更新表单状态
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: params.id },
      data: {
        status: updateData.status,
        notes: updateData.notes,
        updatedAt: new Date()
      }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_FORM_SUBMISSION',
        resource: 'form_submission',
        details: {
          submissionId: params.id,
          oldStatus: existingSubmission.status,
          newStatus: updateData.status,
          notes: updateData.notes
        }
      }
    })

    // 清除相关缓存
    const cacheManager = CacheManager.getInstance()
    await cacheManager.deleteByTag('forms-stats')

    return createSuccessResponse({
      id: updatedSubmission.id,
      status: updatedSubmission.status,
      notes: updatedSubmission.notes,
      updatedAt: updatedSubmission.updatedAt,
      message: 'Form submission updated successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid update data',
        error.errors
      )
    }
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to update form submission',
      error
    )
  }
}

// DELETE /api/admin/forms/submissions/[id] - 删除表单提交
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new APIError(ErrorCode.FORBIDDEN, 'Super admin access required')
    }

    // 检查表单是否存在
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: { id: params.id }
    })

    if (!existingSubmission) {
      throw new APIError(ErrorCode.NOT_FOUND, 'Form submission not found')
    }

    // 删除表单提交
    await prisma.formSubmission.delete({
      where: { id: params.id }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_FORM_SUBMISSION',
        resource: 'form_submission',
        details: {
          submissionId: params.id,
          type: existingSubmission.type,
          status: existingSubmission.status,
          deletedAt: new Date().toISOString()
        }
      }
    })

    // 清除相关缓存
    const cacheManager = CacheManager.getInstance()
    await cacheManager.deleteByTag('forms-stats')

    return createSuccessResponse({
      message: 'Form submission deleted successfully',
      id: params.id
    })

  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to delete form submission',
      error
    )
  }
}