import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'
import { QueryOptimizer, DatabaseHealthCheck } from '@/lib/database/query-optimizer'

// GET /api/admin/db-performance - 获取数据库性能统计
const handleGetPerformanceStats = async (
  request: NextRequest, 
  { session }: { session: any }
) => {
  // 获取查询性能统计
  const queryStats = QueryOptimizer.getQueryStats()
  
  // 获取表统计信息
  const tableStats = await DatabaseHealthCheck.getTableStats()
  
  // 分析慢查询
  const slowQueryAnalysis = await DatabaseHealthCheck.analyzeSlowQueries()
  
  // 数据库连接检查
  const connectionCheck = await DatabaseHealthCheck.checkConnection()

  return createSuccessResponse({
    overview: {
      totalQueries: queryStats.length,
      slowQueries: slowQueryAnalysis.slowQueries,
      connectionStatus: connectionCheck.status,
      lastUpdated: new Date().toISOString()
    },
    queryStatistics: queryStats.slice(0, 20), // 前20个查询
    tableStatistics: tableStats,
    slowQueryAnalysis,
    recommendations: slowQueryAnalysis.recommendations,
    performanceMetrics: {
      averageQueryTime: queryStats.length > 0 
        ? queryStats.reduce((sum, q) => sum + q.averageTime, 0) / queryStats.length 
        : 0,
      totalQueryTime: queryStats.reduce((sum, q) => sum + q.totalTime, 0),
      mostExecutedQueries: queryStats
        .sort((a, b) => b.executionCount - a.executionCount)
        .slice(0, 10),
      slowestQueries: queryStats
        .sort((a, b) => b.averageTime - a.averageTime)
        .slice(0, 10)
    }
  })
}

// POST /api/admin/db-performance - 数据库性能操作
const handlePerformanceOperations = async (
  request: NextRequest, 
  { session }: { session: any }
) => {
  const body = await request.json()
  const { action } = body

  switch (action) {
    case 'clear-stats':
      QueryOptimizer.clearStats()
      return createSuccessResponse({
        message: 'Performance statistics cleared successfully'
      })

    case 'run-benchmark':
      // 运行性能基准测试
      const benchmark = await runPerformanceBenchmark()
      return createSuccessResponse({
        message: 'Performance benchmark completed',
        results: benchmark
      })

    case 'optimize-queries':
      // 获取优化建议
      const analysis = await DatabaseHealthCheck.analyzeSlowQueries()
      return createSuccessResponse({
        message: 'Query optimization analysis completed',
        recommendations: analysis.recommendations,
        slowQueries: analysis.slowQueryDetails
      })

    default:
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid action. Supported actions: clear-stats, run-benchmark, optimize-queries'
      )
  }
}

// 性能基准测试
async function runPerformanceBenchmark() {
  const benchmarks = []

  // 测试用户查询性能
  const userBenchmark = await QueryOptimizer.measureQuery('benchmark_users', async () => {
    const { OptimizedQueries } = await import('@/lib/database/query-optimizer')
    return OptimizedQueries.getUsersWithFilters({
      page: 1,
      limit: 50,
      sortBy: 'createdAt'
    })
  })

  benchmarks.push({
    test: 'User Query with Filters',
    duration: QueryOptimizer.getQueryStats()
      .find(q => q.queryName === 'benchmark_users')?.averageTime || 0,
    recordsReturned: userBenchmark.users.length
  })

  // 测试内容查询性能
  const contentBenchmark = await QueryOptimizer.measureQuery('benchmark_content', async () => {
    const { OptimizedQueries } = await import('@/lib/database/query-optimizer')
    return OptimizedQueries.getContentsWithFilters({
      page: 1,
      limit: 50,
      sortBy: 'createdAt'
    })
  })

  benchmarks.push({
    test: 'Content Query with Filters',
    duration: QueryOptimizer.getQueryStats()
      .find(q => q.queryName === 'benchmark_content')?.averageTime || 0,
    recordsReturned: contentBenchmark.contents.length
  })

  // 测试审计日志查询性能
  const auditBenchmark = await QueryOptimizer.measureQuery('benchmark_audit', async () => {
    const { OptimizedQueries } = await import('@/lib/database/query-optimizer')
    return OptimizedQueries.getAuditLogsWithFilters({
      page: 1,
      limit: 100
    })
  })

  benchmarks.push({
    test: 'Audit Log Query',
    duration: QueryOptimizer.getQueryStats()
      .find(q => q.queryName === 'benchmark_audit')?.averageTime || 0,
    recordsReturned: auditBenchmark.logs.length
  })

  return {
    benchmarks,
    summary: {
      totalTests: benchmarks.length,
      averageDuration: benchmarks.reduce((sum, b) => sum + b.duration, 0) / benchmarks.length,
      slowTests: benchmarks.filter(b => b.duration > 500).length
    },
    timestamp: new Date().toISOString()
  }
}

// 导出包装的处理器
export const GET = ApiWrappers.admin(handleGetPerformanceStats)
export const POST = ApiWrappers.admin(handlePerformanceOperations)