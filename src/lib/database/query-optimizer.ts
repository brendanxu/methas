/**
 * 数据库查询优化工具
 * 提供常用的查询优化方法和性能分析
 */

import { prisma } from '@/lib/prisma'

// 查询性能分析器
export class QueryOptimizer {
  private static queryMetrics: Map<string, {
    count: number
    totalTime: number
    lastExecuted: Date
  }> = new Map()

  /**
   * 记录查询性能
   */
  static async measureQuery<T>(
    queryName: string, 
    queryFn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now()
    
    try {
      const result = await queryFn()
      const endTime = performance.now()
      const duration = endTime - startTime

      // 记录性能指标
      const existing = this.queryMetrics.get(queryName) || {
        count: 0,
        totalTime: 0,
        lastExecuted: new Date()
      }

      this.queryMetrics.set(queryName, {
        count: existing.count + 1,
        totalTime: existing.totalTime + duration,
        lastExecuted: new Date()
      })

      // 如果查询超过阈值，记录警告
      if (duration > 1000) { // 1秒
        console.warn(`Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`)
      }

      return result
    } catch (error) {
      const endTime = performance.now()
      console.error(`Query failed: ${queryName} after ${(endTime - startTime).toFixed(2)}ms`, error)
      throw error
    }
  }

  /**
   * 获取查询性能统计
   */
  static getQueryStats() {
    const stats = Array.from(this.queryMetrics.entries()).map(([name, metrics]) => ({
      queryName: name,
      executionCount: metrics.count,
      averageTime: metrics.totalTime / metrics.count,
      totalTime: metrics.totalTime,
      lastExecuted: metrics.lastExecuted
    }))

    return stats.sort((a, b) => b.averageTime - a.averageTime)
  }

  /**
   * 清除性能统计
   */
  static clearStats() {
    this.queryMetrics.clear()
  }
}

// 优化的查询方法
export class OptimizedQueries {
  /**
   * 优化的用户查询 - 支持分页和筛选
   */
  static async getUsersWithFilters(params: {
    page?: number
    limit?: number
    role?: string
    search?: string
    sortBy?: 'createdAt' | 'updatedAt' | 'name'
    sortOrder?: 'asc' | 'desc'
  }) {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    const skip = (page - 1) * limit

    return QueryOptimizer.measureQuery('getUsersWithFilters', async () => {
      // 构建 where 条件
      const where: any = {}
      
      if (role && ['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
        where.role = role
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }

      // 并行执行计数和数据查询
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                contents: true,
                auditLogs: true
              }
            }
          }
        }),
        prisma.user.count({ where })
      ])

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  }

  /**
   * 优化的内容查询 - 支持复杂筛选
   */
  static async getContentsWithFilters(params: {
    page?: number
    limit?: number
    type?: string
    status?: string
    authorId?: string
    search?: string
    sortBy?: 'createdAt' | 'updatedAt' | 'title'
    sortOrder?: 'asc' | 'desc'
  }) {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      authorId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    const skip = (page - 1) * limit

    return QueryOptimizer.measureQuery('getContentsWithFilters', async () => {
      // 构建 where 条件
      const where: any = {}
      
      if (type && ['NEWS', 'CASE_STUDY', 'SERVICE', 'PAGE'].includes(type)) {
        where.type = type
      }
      
      if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
        where.status = status
      }
      
      if (authorId) {
        where.authorId = authorId
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } }
        ]
      }

      // 并行执行计数和数据查询
      const [contents, total] = await Promise.all([
        prisma.content.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }),
        prisma.content.count({ where })
      ])

      return {
        contents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  }

  /**
   * 优化的权限查询 - 用户权限聚合
   */
  static async getUserPermissionsSummary(userId: string) {
    return QueryOptimizer.measureQuery('getUserPermissionsSummary', async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
          userPermissions: {
            include: {
              permission: true
            }
          }
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // 获取角色权限
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { role: user.role },
        include: {
          permission: true
        }
      })

      // 合并权限
      const effectivePermissions = new Map()
      
      // 先添加角色权限
      rolePermissions.forEach(rp => {
        effectivePermissions.set(rp.permission.name, {
          ...rp.permission,
          granted: rp.granted,
          source: 'role'
        })
      })
      
      // 用户权限覆盖角色权限
      user.userPermissions.forEach(up => {
        effectivePermissions.set(up.permission.name, {
          ...up.permission,
          granted: up.granted,
          source: 'user',
          expiresAt: up.expiresAt
        })
      })

      return {
        user: {
          id: user.id,
          role: user.role
        },
        permissions: Array.from(effectivePermissions.values()),
        summary: {
          total: effectivePermissions.size,
          granted: Array.from(effectivePermissions.values()).filter(p => p.granted).length,
          userOverrides: user.userPermissions.length,
          rolePermissions: rolePermissions.length
        }
      }
    })
  }

  /**
   * 优化的审计日志查询
   */
  static async getAuditLogsWithFilters(params: {
    page?: number
    limit?: number
    userId?: string
    action?: string
    resource?: string
    dateFrom?: Date
    dateTo?: Date
  }) {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      resource,
      dateFrom,
      dateTo
    } = params

    const skip = (page - 1) * limit

    return QueryOptimizer.measureQuery('getAuditLogsWithFilters', async () => {
      // 构建 where 条件
      const where: any = {}
      
      if (userId) {
        where.userId = userId
      }
      
      if (action) {
        where.action = action
      }
      
      if (resource) {
        where.resource = resource
      }
      
      if (dateFrom || dateTo) {
        where.createdAt = {}
        if (dateFrom) where.createdAt.gte = dateFrom
        if (dateTo) where.createdAt.lte = dateTo
      }

      // 并行执行计数和数据查询
      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }),
        prisma.auditLog.count({ where })
      ])

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  }

  /**
   * 数据库清理 - 清除过期的session和过期的权限
   */
  static async cleanupExpiredData() {
    return QueryOptimizer.measureQuery('cleanupExpiredData', async () => {
      const now = new Date()
      
      // 删除过期的 session
      const expiredSessions = await prisma.session.deleteMany({
        where: {
          expires: {
            lt: now
          }
        }
      })

      // 删除过期的用户权限
      const expiredPermissions = await prisma.userPermission.deleteMany({
        where: {
          expiresAt: {
            lt: now
          }
        }
      })

      return {
        deletedSessions: expiredSessions.count,
        deletedPermissions: expiredPermissions.count
      }
    })
  }
}

// 数据库健康检查
export class DatabaseHealthCheck {
  /**
   * 检查数据库连接
   */
  static async checkConnection() {
    try {
      await prisma.$queryRaw`SELECT 1`
      return { status: 'healthy', message: 'Database connection successful' }
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * 获取表统计信息
   */
  static async getTableStats() {
    return QueryOptimizer.measureQuery('getTableStats', async () => {
      const [
        userCount,
        contentCount,
        formSubmissionCount,
        fileCount,
        auditLogCount,
        permissionCount
      ] = await Promise.all([
        prisma.user.count(),
        prisma.content.count(),
        prisma.formSubmission.count(),
        prisma.file.count(),
        prisma.auditLog.count(),
        prisma.permission.count()
      ])

      return {
        users: userCount,
        contents: contentCount,
        formSubmissions: formSubmissionCount,
        files: fileCount,
        auditLogs: auditLogCount,
        permissions: permissionCount
      }
    })
  }

  /**
   * 分析慢查询模式
   */
  static async analyzeSlowQueries() {
    const stats = QueryOptimizer.getQueryStats()
    const slowQueries = stats.filter(stat => stat.averageTime > 500) // 超过500ms

    return {
      totalQueries: stats.length,
      slowQueries: slowQueries.length,
      slowQueryDetails: slowQueries,
      recommendations: this.generateOptimizationRecommendations(slowQueries)
    }
  }

  private static generateOptimizationRecommendations(slowQueries: any[]) {
    const recommendations: string[] = []

    slowQueries.forEach(query => {
      if (query.queryName.includes('Users')) {
        recommendations.push('Consider adding indexes on User table for role, createdAt, updatedAt')
      }
      if (query.queryName.includes('Content')) {
        recommendations.push('Consider adding composite indexes on Content table for (type, status), (status, createdAt)')
      }
      if (query.queryName.includes('Permission')) {
        recommendations.push('Consider optimizing permission queries with better caching strategy')
      }
      if (query.averageTime > 2000) {
        recommendations.push(`Critical: Query ${query.queryName} is extremely slow (${query.averageTime.toFixed(2)}ms average)`)
      }
    })

    return [...new Set(recommendations)] // 去重
  }
}