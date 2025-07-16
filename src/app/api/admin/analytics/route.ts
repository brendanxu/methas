import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'
import { AnalyticsService } from '@/lib/analytics/analytics-service'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metrics: z.array(z.string()).optional(),
  granularity: z.enum(['day', 'week', 'month']).default('day')
})

// GET /api/admin/analytics - 获取分析数据
const handleGetAnalytics = async (
  request: NextRequest, 
  { session }: { session: any }
) => {
  const { searchParams } = new URL(request.url)
  const query = querySchema.parse(Object.fromEntries(searchParams.entries()))
  
  // 转换日期格式为GA4支持的格式
  const startDate = query.startDate || '30daysAgo'
  const endDate = query.endDate || 'today'

  try {
    const analyticsService = AnalyticsService.getInstance()
    
    // 并发获取综合分析数据和GA4状态
    const [analyticsData, ga4Status] = await Promise.all([
      analyticsService.getCombinedAnalytics(startDate, endDate),
      analyticsService.checkGA4Status()
    ])

    return createSuccessResponse({
      ...analyticsData,
      ga4Status,
      metadata: {
        ...analyticsData.metadata,
        granularity: query.granularity,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    })
    
  } catch (error) {
    console.error('Analytics data fetch error:', error)
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to fetch analytics data',
      error
    )
  }
}

// POST /api/admin/analytics - 记录自定义事件
const handleRecordEvent = async (
  request: NextRequest, 
  { session }: { session: any }
) => {
  const body = await request.json()
  const { eventType, eventData, category } = body

  if (!eventType) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Event type is required'
    )
  }

  try {
    // 记录自定义事件到审计日志
    const event = await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `CUSTOM_EVENT_${eventType.toUpperCase()}`,
        resource: category || 'analytics',
        details: {
          eventType,
          eventData,
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        }
      }
    })

    return createSuccessResponse({
      eventId: event.id,
      recorded: true,
      timestamp: event.createdAt
    })
    
  } catch (error) {
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to record event',
      error
    )
  }
}

// 导出包装的处理器
export const GET = ApiWrappers.admin(handleGetAnalytics)
export const POST = ApiWrappers.admin(handleRecordEvent)