import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DatabaseHealthCheck, QueryOptimizer, OptimizedQueries } from '@/lib/database/query-optimizer'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: {
    connection: boolean
    responseTime: number
    tableCount: number
    recordCounts: Record<string, number>
    recentActivity: {
      lastUser?: Date
      lastContent?: Date
      lastFormSubmission?: Date
    }
    performance: {
      avgQueryTime: number
      slowQueries: number
    }
  }
  recommendations: string[]
  timestamp: Date
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const startTime = Date.now()
    const checks: HealthCheck['checks'] = {
      connection: false,
      responseTime: 0,
      tableCount: 0,
      recordCounts: {},
      recentActivity: {},
      performance: {
        avgQueryTime: 0,
        slowQueries: 0,
      },
    }
    const recommendations: string[] = []

    // Test connection using health check utility
    const connectionCheck = await DatabaseHealthCheck.checkConnection()
    checks.connection = connectionCheck.status === 'healthy'
    if (connectionCheck.status !== 'healthy') {
      recommendations.push(connectionCheck.message)
    }

    // Get table statistics using optimized method
    const tableStats = await DatabaseHealthCheck.getTableStats()

    checks.recordCounts = tableStats
    checks.tableCount = Object.keys(tableStats).length

    // Check recent activity
    const [lastUser, lastContent, lastForm] = await Promise.all([
      prisma.user.findFirst({ orderBy: { createdAt: 'desc' } }),
      prisma.content.findFirst({ orderBy: { createdAt: 'desc' } }),
      prisma.formSubmission.findFirst({ orderBy: { createdAt: 'desc' } }),
    ])

    checks.recentActivity = {
      lastUser: lastUser?.createdAt,
      lastContent: lastContent?.createdAt,
      lastFormSubmission: lastForm?.createdAt,
    }

    // Analyze query performance using optimizer
    const slowQueryAnalysis = await DatabaseHealthCheck.analyzeSlowQueries()
    checks.performance.avgQueryTime = slowQueryAnalysis.totalQueries > 0 
      ? slowQueryAnalysis.slowQueryDetails.reduce((sum, q) => sum + q.averageTime, 0) / slowQueryAnalysis.totalQueries 
      : 0
    checks.performance.slowQueries = slowQueryAnalysis.slowQueries

    if (slowQueryAnalysis.slowQueries > 0) {
      recommendations.push(...slowQueryAnalysis.recommendations)
    }

    // Database-specific checks for SQLite
    const dbInfo = await prisma.$queryRaw<any[]>`
      SELECT 
        page_count * page_size as size,
        page_count,
        page_size
      FROM pragma_page_count(), pragma_page_size();
    `
    
    const dbSize = dbInfo[0]?.size || 0
    if (dbSize > 100 * 1024 * 1024) { // 100MB
      recommendations.push('Database size exceeding 100MB - consider archiving old data')
    }

    // Check for orphaned records - skip for now due to schema constraints
    // const orphanedAccounts = await prisma.account.findMany({
    //   where: {
    //     userId: null,
    //   },
    // })
    // if (orphanedAccounts.length > 0) {
    //   recommendations.push(`Found ${orphanedAccounts.length} orphaned account records - run cleanup`)
    // }

    // SQLite-specific recommendations
    recommendations.push('Currently using SQLite - for production, consider migrating to PostgreSQL for better performance and concurrency')

    // Calculate response time
    checks.responseTime = Date.now() - startTime

    // Determine overall health status
    let status: HealthCheck['status'] = 'healthy'
    if (!checks.connection || checks.responseTime > 5000) {
      status = 'unhealthy'
    } else if (checks.performance.slowQueries > 0 || recommendations.length > 2) {
      status = 'degraded'
    }

    const healthCheck: HealthCheck = {
      status,
      checks,
      recommendations,
      timestamp: new Date(),
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    console.error('Database health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Endpoint to run database optimization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    switch (action) {
      case 'vacuum':
        // Run VACUUM to optimize SQLite database
        await prisma.$executeRaw`VACUUM;`
        return NextResponse.json({ success: true, message: 'Database vacuumed successfully' })

      case 'analyze':
        // Update SQLite statistics
        await prisma.$executeRaw`ANALYZE;`
        return NextResponse.json({ success: true, message: 'Database statistics updated' })

      case 'cleanup':
        // Use optimized cleanup method
        const cleanupResult = await OptimizedQueries.cleanupExpiredData()
        
        return NextResponse.json({ 
          success: true, 
          message: `Cleaned up ${cleanupResult.deletedSessions} expired sessions and ${cleanupResult.deletedPermissions} expired permissions`
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Database optimization failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}