import { NextRequest, NextResponse } from 'next/server'
import { ApiWrappers, createSuccessResponse, APIError, ErrorCode } from '@/lib/api-error-handler'

// 搜索分析事件类型
interface SearchAnalyticsEvent {
  eventType: 'search' | 'click' | 'view' | 'exit';
  query: string;
  resultCount?: number;
  clickedResult?: {
    id: string;
    position: number;
    type: string;
  };
  sessionId?: string;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// 内存中的简单分析存储 (生产环境应使用数据库)
const analyticsData: SearchAnalyticsEvent[] = [];
const MAX_EVENTS = 10000; // 限制内存使用

// POST /api/search/analytics - 记录搜索分析事件（公开）
export const POST = ApiWrappers.public(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    
    const event: SearchAnalyticsEvent = {
      ...body,
      timestamp: new Date().toISOString(),
      metadata: {
        ...body.metadata,
        ip: clientIP,
        userAgent,
        referer: request.headers.get('referer'),
      },
    };

    // 验证事件数据
    if (!event.eventType || !event.query) {
      return NextResponse.json(
        { error: '缺少必需的事件数据' },
        { status: 400 }
      );
    }

    // 存储事件 (简单内存存储，实际应用应使用数据库)
    analyticsData.push(event);
    
    // 清理旧数据
    if (analyticsData.length > MAX_EVENTS) {
      analyticsData.splice(0, analyticsData.length - MAX_EVENTS);
    }

    // 记录到控制台用于调试
    // Debug log removed for production

    return createSuccessResponse({ message: 'Analytics event recorded' })

  } catch (error) {
    throw new APIError(ErrorCode.INTERNAL_SERVER_ERROR, 'Failed to record analytics event')
  }
})

// GET /api/search/analytics - 获取搜索分析报告（需要管理员权限）
export const GET = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 默认7天
    const format = searchParams.get('format') || 'summary';

    // 计算时间范围
    const now = new Date();
    const periodMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }[period] || 7 * 24 * 60 * 60 * 1000;

    const fromTime = new Date(now.getTime() - periodMs);

    // 筛选时间范围内的事件
    const events = analyticsData.filter(event => 
      new Date(event.timestamp) >= fromTime
    );

    if (format === 'raw') {
      return createSuccessResponse({ events })
    }

    // 生成汇总报告
    const report = generateAnalyticsReport(events)
    report.generatedAt = new Date().toISOString()

    return createSuccessResponse(report)

  } catch (error) {
    throw new APIError(ErrorCode.INTERNAL_SERVER_ERROR, 'Failed to generate analytics report')
  }
})

// 生成分析报告
function generateAnalyticsReport(events: SearchAnalyticsEvent[]) {
  const report = {
    period: {
      totalEvents: events.length,
      totalSearches: 0,
      totalClicks: 0,
      uniqueQueries: new Set<string>(),
    },
    topQueries: [] as Array<{ query: string; count: number; clickRate: number }>,
    searchPatterns: {
      avgResultsPerSearch: 0,
      noResultQueries: [] as string[],
      popularFilters: {} as Record<string, number>,
    },
    userBehavior: {
      avgClickPosition: 0,
      clickThroughRate: 0,
      bounceRate: 0,
    },
    performance: {
      avgResponseTime: 0,
      slowQueries: [] as Array<{ query: string; avgTime: number }>,
    },
  };

  // 查询统计
  const queryStats = new Map<string, {
    count: number;
    clicks: number;
    totalResults: number;
    responseTimes: number[];
  }>();

  // 处理事件
  events.forEach(event => {
    report.period.uniqueQueries.add(event.query);

    if (event.eventType === 'search') {
      report.period.totalSearches++;
      
      const stats = queryStats.get(event.query) || {
        count: 0,
        clicks: 0,
        totalResults: 0,
        responseTimes: [],
      };
      
      stats.count++;
      if (event.resultCount !== undefined) {
        stats.totalResults += event.resultCount;
      }
      
      queryStats.set(event.query, stats);
      
      // 无结果查询
      if (event.resultCount === 0) {
        report.searchPatterns.noResultQueries.push(event.query);
      }
    }

    if (event.eventType === 'click') {
      report.period.totalClicks++;
      
      const stats = queryStats.get(event.query);
      if (stats) {
        stats.clicks++;
      }
    }
  });

  // 计算热门查询
  report.topQueries = Array.from(queryStats.entries())
    .map(([query, stats]) => ({
      query,
      count: stats.count,
      clickRate: stats.count > 0 ? stats.clicks / stats.count : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 计算平均指标
  const totalQueries = queryStats.size;
  if (totalQueries > 0) {
    const totalResults = Array.from(queryStats.values())
      .reduce((sum, stats) => sum + stats.totalResults, 0);
    report.searchPatterns.avgResultsPerSearch = totalResults / report.period.totalSearches;
  }

  // 用户行为指标
  if (report.period.totalSearches > 0) {
    report.userBehavior.clickThroughRate = report.period.totalClicks / report.period.totalSearches;
  }

  // 转换 Set 为数组
  const uniqueQueriesArray = Array.from(report.period.uniqueQueries);
  
  return {
    ...report,
    period: {
      ...report.period,
      uniqueQueries: uniqueQueriesArray.length,
    },
    generatedAt: new Date().toISOString(),
  };
}

// OPTIONS - CORS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}