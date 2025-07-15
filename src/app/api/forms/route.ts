import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode
} from '@/lib/api-error-handler'

// GET /api/forms - 获取表单提交列表
const handleGetFormSubmissions = async (request: NextRequest, context: any) => {
  const { session } = context
  
  // 权限检查
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    throw new APIError(ErrorCode.FORBIDDEN, 'Admin access required')
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // 限制最大100
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const skip = (page - 1) * limit

  // 构建查询条件
  const where: any = {}
  if (type && ['CONTACT', 'NEWSLETTER', 'CONSULTATION'].includes(type)) {
    where.type = type
  }
  if (status && ['NEW', 'PROCESSED', 'REPLIED', 'ARCHIVED'].includes(status)) {
    where.status = status
  }

  try {
    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          data: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      prisma.formSubmission.count({ where })
    ])

    return createSuccessResponse({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to fetch form submissions',
      error
    )
  }
}

// 导出包装的处理器
export const GET = ApiWrappers.admin(handleGetFormSubmissions)