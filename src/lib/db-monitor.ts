import { PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'

interface QueryMetrics {
  query: string
  duration: number
  timestamp: Date
  params?: any
}

interface PerformanceReport {
  period: string
  totalQueries: number
  avgDuration: number
  slowQueries: QueryMetrics[]
  queryTypeBreakdown: Record<string, number>
  recommendations: string[]
}

class DatabaseMonitor {
  private metrics: QueryMetrics[] = []
  private prisma: PrismaClient
  private slowQueryThreshold = 100 // ms

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.setupQueryLogging()
  }

  private setupQueryLogging() {
    // Extended Prisma client with query logging
    this.prisma.$use(async (params, next) => {
      const start = performance.now()
      const result = await next(params)
      const duration = performance.now() - start

      // Log query metrics
      this.metrics.push({
        query: `${params.model}.${params.action}`,
        duration,
        timestamp: new Date(),
        params: params.args,
      })

      // Keep only last 1000 queries in memory
      if (this.metrics.length > 1000) {
        this.metrics = this.metrics.slice(-1000)
      }

      // Log slow queries immediately
      if (duration > this.slowQueryThreshold) {
        console.warn(`[SLOW QUERY] ${params.model}.${params.action} took ${duration.toFixed(2)}ms`)
      }

      return result
    })
  }

  // Get performance report for a specific time period
  getPerformanceReport(minutes: number = 60): PerformanceReport {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff)

    if (recentMetrics.length === 0) {
      return {
        period: `Last ${minutes} minutes`,
        totalQueries: 0,
        avgDuration: 0,
        slowQueries: [],
        queryTypeBreakdown: {},
        recommendations: ['No queries recorded in this period'],
      }
    }

    // Calculate average duration
    const totalDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0)
    const avgDuration = totalDuration / recentMetrics.length

    // Find slow queries
    const slowQueries = recentMetrics
      .filter(m => m.duration > this.slowQueryThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)

    // Query type breakdown
    const queryTypeBreakdown = recentMetrics.reduce((acc, m) => {
      acc[m.query] = (acc[m.query] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Generate recommendations
    const recommendations = this.generateRecommendations(recentMetrics, slowQueries)

    return {
      period: `Last ${minutes} minutes`,
      totalQueries: recentMetrics.length,
      avgDuration,
      slowQueries,
      queryTypeBreakdown,
      recommendations,
    }
  }

  private generateRecommendations(metrics: QueryMetrics[], slowQueries: QueryMetrics[]): string[] {
    const recommendations: string[] = []

    // Check for high query volume
    const qpm = metrics.length / (metrics[metrics.length - 1].timestamp.getTime() - metrics[0].timestamp.getTime()) * 60000
    if (qpm > 100) {
      recommendations.push(`High query rate detected (${qpm.toFixed(1)} queries/minute). Consider implementing caching.`)
    }

    // Check for N+1 query patterns
    const queryGroups = this.groupQueriesByTime(metrics, 100) // Group queries within 100ms
    const suspiciousGroups = queryGroups.filter(group => {
      const counts = group.reduce((acc, m) => {
        acc[m.query] = (acc[m.query] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      // Look for repeated similar queries
      return Object.values(counts).some(count => count > 5)
    })

    if (suspiciousGroups.length > 0) {
      recommendations.push('Potential N+1 query pattern detected. Consider using include() or select() to reduce queries.')
    }

    // Check for missing indexes
    const findManyQueries = metrics.filter(m => m.query.includes('.findMany'))
    const slowFindMany = findManyQueries.filter(m => m.duration > 50)
    if (slowFindMany.length > findManyQueries.length * 0.2) {
      recommendations.push('Many slow findMany queries detected. Consider adding database indexes.')
    }

    // SQLite specific recommendations
    if (metrics.length > 0) {
      recommendations.push('Currently using SQLite. For better performance with concurrent writes, consider PostgreSQL.')
    }

    // Check for large result sets
    const largeQueries = metrics.filter(m => 
      m.params?.take && m.params.take > 100
    )
    if (largeQueries.length > 0) {
      recommendations.push('Large result sets detected. Implement pagination to improve performance.')
    }

    return recommendations
  }

  private groupQueriesByTime(metrics: QueryMetrics[], windowMs: number): QueryMetrics[][] {
    const groups: QueryMetrics[][] = []
    let currentGroup: QueryMetrics[] = []
    let groupStart: Date | null = null

    for (const metric of metrics) {
      if (!groupStart || metric.timestamp.getTime() - groupStart.getTime() > windowMs) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup)
        }
        currentGroup = [metric]
        groupStart = metric.timestamp
      } else {
        currentGroup.push(metric)
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }

  // Get real-time statistics
  getRealtimeStats() {
    const last5Minutes = this.metrics.filter(
      m => m.timestamp > new Date(Date.now() - 5 * 60 * 1000)
    )

    return {
      activeQueries: 0, // Would need async tracking for this
      queriesLast5Min: last5Minutes.length,
      avgResponseTime: last5Minutes.length > 0
        ? last5Minutes.reduce((sum, m) => sum + m.duration, 0) / last5Minutes.length
        : 0,
      slowQueriesLast5Min: last5Minutes.filter(m => m.duration > this.slowQueryThreshold).length,
    }
  }

  // Clear metrics (useful for testing)
  clearMetrics() {
    this.metrics = []
  }
}

// Singleton instance
let monitor: DatabaseMonitor | null = null

export function getDbMonitor(prisma: PrismaClient): DatabaseMonitor {
  if (!monitor) {
    monitor = new DatabaseMonitor(prisma)
  }
  return monitor
}

export type { QueryMetrics, PerformanceReport }