import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, APIError, ErrorCode } from '@/lib/api-error-handler'
import { z } from 'zod'

// 性能指标Schema
const performanceMetricsSchema = z.object({
  // Core Web Vitals
  lcp: z.number().optional(),
  inp: z.number().optional(), // INP替代FID
  cls: z.number().optional(),
  
  // 其他指标
  fcp: z.number().optional(),
  ttfb: z.number().optional(),
  loadTime: z.number().optional(),
  domReady: z.number().optional(),
  resourceLoadTime: z.number().optional(),
  
  // 元数据
  url: z.string(),
  userAgent: z.string(),
  timestamp: z.string(),
  sessionId: z.string().optional()
})

// POST /api/analytics/performance - 记录性能指标
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const metrics = performanceMetricsSchema.parse(body)
    
    // 获取用户信息（如果有）
    const userId = request.headers.get('x-user-id') || null
    
    // 存储到审计日志中
    await prisma.auditLog.create({
      data: {
        userId: userId || 'anonymous',
        action: 'PERFORMANCE_METRICS',
        resource: 'web_vitals',
        details: {
          metrics,
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          referer: request.headers.get('referer') || undefined
        }
      }
    })
    
    // 如果性能很差，记录警告
    const poorMetrics = []
    if (metrics.lcp && metrics.lcp > 4000) poorMetrics.push('LCP')
    if (metrics.inp && metrics.inp > 500) poorMetrics.push('INP')
    if (metrics.cls && metrics.cls > 0.25) poorMetrics.push('CLS')
    
    if (poorMetrics.length > 0) {
      console.warn(`Poor performance metrics detected: ${poorMetrics.join(', ')}`, {
        url: metrics.url,
        sessionId: metrics.sessionId
      })
    }
    
    return createSuccessResponse({
      received: true,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid performance metrics',
        error.errors
      )
    }
    
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to record performance metrics',
      error
    )
  }
}

// GET /api/analytics/performance - 获取性能统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = parseInt(searchParams.get('hours') || '24')
    const url = searchParams.get('url')
    
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)
    
    // 查询性能指标
    const where: any = {
      action: 'PERFORMANCE_METRICS',
      createdAt: { gte: since }
    }
    
    if (url) {
      where.details = {
        path: ['metrics', 'url'],
        equals: url
      }
    }
    
    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 1000 // 限制最多1000条
    })
    
    // 计算统计数据
    const stats = {
      total: logs.length,
      metrics: {
        lcp: { values: [] as number[], avg: 0, p50: 0, p75: 0, p95: 0 },
        inp: { values: [] as number[], avg: 0, p50: 0, p75: 0, p95: 0 },
        cls: { values: [] as number[], avg: 0, p50: 0, p75: 0, p95: 0 },
        fcp: { values: [] as number[], avg: 0, p50: 0, p75: 0, p95: 0 },
        ttfb: { values: [] as number[], avg: 0, p50: 0, p75: 0, p95: 0 },
        loadTime: { values: [] as number[], avg: 0, p50: 0, p75: 0, p95: 0 }
      },
      byUrl: {} as Record<string, number>,
      byDevice: {
        desktop: 0,
        mobile: 0,
        tablet: 0
      }
    }
    
    // 处理每条日志
    logs.forEach(log => {
      const details = log.details as any
      const metrics = details.metrics
      
      // 收集指标值
      if (metrics.lcp) stats.metrics.lcp.values.push(metrics.lcp)
      if (metrics.inp) stats.metrics.inp.values.push(metrics.inp)
      if (metrics.cls) stats.metrics.cls.values.push(metrics.cls)
      if (metrics.fcp) stats.metrics.fcp.values.push(metrics.fcp)
      if (metrics.ttfb) stats.metrics.ttfb.values.push(metrics.ttfb)
      if (metrics.loadTime) stats.metrics.loadTime.values.push(metrics.loadTime)
      
      // 统计URL
      const pageUrl = metrics.url
      stats.byUrl[pageUrl] = (stats.byUrl[pageUrl] || 0) + 1
      
      // 统计设备类型
      const userAgent = metrics.userAgent.toLowerCase()
      if (/mobile|android|iphone/.test(userAgent)) {
        stats.byDevice.mobile++
      } else if (/tablet|ipad/.test(userAgent)) {
        stats.byDevice.tablet++
      } else {
        stats.byDevice.desktop++
      }
    })
    
    // 计算统计值
    Object.keys(stats.metrics).forEach(key => {
      const metric = stats.metrics[key as keyof typeof stats.metrics]
      if (metric.values.length > 0) {
        metric.values.sort((a, b) => a - b)
        metric.avg = metric.values.reduce((sum, val) => sum + val, 0) / metric.values.length
        metric.p50 = metric.values[Math.floor(metric.values.length * 0.5)]
        metric.p75 = metric.values[Math.floor(metric.values.length * 0.75)]
        metric.p95 = metric.values[Math.floor(metric.values.length * 0.95)]
      }
    })
    
    // 移除values数组以减少响应大小
    Object.values(stats.metrics).forEach(metric => {
      delete (metric as any).values
    })
    
    return createSuccessResponse({
      timeRange: {
        start: since.toISOString(),
        end: new Date().toISOString(),
        hours
      },
      stats,
      topUrls: Object.entries(stats.byUrl)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([url, count]) => ({ url, count }))
    })
    
  } catch (error) {
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to fetch performance statistics',
      error
    )
  }
}