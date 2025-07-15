
// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'
import { 
  exportData,
  ExportConfig,
  ExportFormat,
  DataSource
} from '@/lib/data-export'
import { prisma } from '@/lib/prisma'

// 导出请求验证Schema
const exportRequestSchema = z.object({
  source: z.nativeEnum(DataSource),
  format: z.nativeEnum(ExportFormat),
  filters: z.record(z.any()).optional(),
  fields: z.array(z.string()).optional(),
  includeRelations: z.boolean().default(false),
  dateRange: z.object({
    start: z.coerce.date().optional(),
    end: z.coerce.date().optional(),
    field: z.string().default('createdAt')
  }).optional(),
  limit: z.number().min(1).max(100000).default(10000),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  template: z.string().optional(),
  password: z.string().optional(),
  compression: z.boolean().default(false)
})

// 导出历史查询Schema
const historyQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  source: z.nativeEnum(DataSource).optional(),
  format: z.nativeEnum(ExportFormat).optional(),
  userId: z.string().optional()
})

// 获取导出历史和统计信息 - 管理员权限
export const GET = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  const { searchParams } = new URL(request.url)
  const query = historyQuerySchema.parse(Object.fromEntries(searchParams.entries()))

  // 构建查询条件
  const where: any = {
    action: 'DATA_EXPORT'
  }

  if (query.source) {
    where.resource = query.source
  }
  if (query.userId) {
    where.userId = query.userId
  }
  if (query.format) {
    where.details = {
      path: ['format'],
      equals: query.format
    }
  }

  // 获取导出历史
  const [exports, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit
    }),
    prisma.auditLog.count({ where })
  ])

  // 获取统计信息
  const stats = await prisma.auditLog.groupBy({
    by: ['resource'],
    where: {
      action: 'DATA_EXPORT',
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 最近30天
      }
    },
    _count: {
      id: true
    }
  })

  // 格式统计
  const formatStats = await prisma.$queryRaw`
    SELECT 
      JSON_EXTRACT(details, '$.format') as format,
      COUNT(*) as count
    FROM AuditLog 
    WHERE action = 'DATA_EXPORT'
      AND createdAt >= datetime('now', '-30 days')
    GROUP BY JSON_EXTRACT(details, '$.format')
  `

  return createSuccessResponse({
    exports,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit)
    },
    stats: {
      sourceStats: stats.map(stat => ({
        source: stat.resource,
        count: stat._count.id
      })),
      formatStats,
      totalExports: total
    },
    availableSources: Object.values(DataSource),
    availableFormats: Object.values(ExportFormat)
  })
})

// 创建数据导出 - 管理员权限
export const POST = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  const body = await request.json()
  const config: ExportConfig = exportRequestSchema.parse(body)

  try {
    // 执行数据导出
    const result = await exportData(config, session.user.id)

    return createSuccessResponse({
      message: 'Data export completed successfully',
      result
    })
  } catch (error) {
    logError('Export error:', error)
    
    // 记录导出错误
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DATA_EXPORT_ERROR',
        resource: config.source,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          config: JSON.parse(JSON.stringify(config))
        }
      }
    })

    if (error instanceof z.ZodError) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid export configuration',
        error.errors
      )
    }

    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Export failed',
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    )
  }
})