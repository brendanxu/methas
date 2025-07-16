import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, APIError, ErrorCode } from '@/lib/api-error-handler'
import { CacheManager } from '@/lib/cache/cache-manager'

// GET /api/admin/forms/submissions - 获取表单提交列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      throw new APIError(ErrorCode.UNAUTHORIZED, 'Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const type = searchParams.get('type') as any
    const status = searchParams.get('status') as any
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    const offset = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (type && ['CONTACT', 'CONSULTATION', 'NEWSLETTER'].includes(type)) {
      where.type = type
    }
    
    if (status && ['NEW', 'PROCESSED', 'REPLIED', 'ARCHIVED', 'EMAIL_FAILED'].includes(status)) {
      where.status = status
    }

    // 搜索功能（在JSON data中搜索）
    if (search) {
      where.OR = [
        {
          data: {
            path: ['firstName'],
            string_contains: search
          }
        },
        {
          data: {
            path: ['lastName'],
            string_contains: search
          }
        },
        {
          data: {
            path: ['email'],
            string_contains: search
          }
        },
        {
          data: {
            path: ['company'],
            string_contains: search
          }
        },
        {
          data: {
            path: ['subject'],
            string_contains: search
          }
        }
      ]
    }

    // 获取数据
    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
        select: {
          id: true,
          type: true,
          status: true,
          data: true,
          notes: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.formSubmission.count({ where })
    ])

    // 处理数据格式
    const formattedSubmissions = submissions.map(submission => {
      const data = submission.data as any
      
      return {
        id: submission.id,
        type: submission.type,
        status: submission.status,
        summary: {
          name: data.firstName && data.lastName 
            ? `${data.firstName} ${data.lastName}` 
            : data.name || 'Unknown',
          email: data.email || 'Unknown',
          company: data.company,
          subject: data.subject || data.inquiryType || 'No subject',
          phone: data.phone
        },
        notes: submission.notes,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        clientInfo: data.clientInfo
      }
    })

    // 获取统计数据
    const cacheManager = CacheManager.getInstance()
    const stats = await cacheManager.getOrSet(
      'admin-forms-stats',
      async () => {
        const statusStats = await prisma.formSubmission.groupBy({
          by: ['status'],
          _count: { id: true }
        })

        const typeStats = await prisma.formSubmission.groupBy({
          by: ['type'],
          _count: { id: true }
        })

        return {
          byStatus: statusStats.reduce((acc, item) => {
            acc[item.status] = item._count.id
            return acc
          }, {} as Record<string, number>),
          byType: typeStats.reduce((acc, item) => {
            acc[item.type] = item._count.id
            return acc
          }, {} as Record<string, number>)
        }
      },
      { ttl: 5 * 60 * 1000, tags: ['forms-stats'] }
    )

    return createSuccessResponse({
      submissions: formattedSubmissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      stats,
      filters: {
        type,
        status,
        search,
        sortBy,
        sortOrder
      }
    })

  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to fetch form submissions',
      error
    )
  }
}