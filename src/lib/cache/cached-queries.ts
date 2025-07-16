/**
 * 带缓存的优化查询类
 * 在原有优化查询基础上添加缓存层
 */

import { prisma } from '@/lib/prisma'
import { CacheManager, CacheKeyGenerator, CacheTags, CacheTTL, Cached } from './cache-manager'
import { QueryOptimizer } from '../database/query-optimizer'

interface CachedQueryResult<T> {
  data: T
  fromCache: boolean
  timestamp: string
}

export class CachedQueries {
  private static cache = CacheManager.getInstance()

  /**
   * 带缓存的用户查询
   */
  static async getUsersWithFilters(params: {
    page?: number
    limit?: number
    role?: string
    search?: string
    sortBy?: 'createdAt' | 'updatedAt' | 'name'
    sortOrder?: 'asc' | 'desc'
  }): Promise<CachedQueryResult<any>> {
    const cacheKey = CacheKeyGenerator.content(params)
    
    return this.cache.getOrSet(
      cacheKey,
      async () => {
        const result = await QueryOptimizer.measureQuery('cached_getUsersWithFilters', async () => {
          const {
            page = 1,
            limit = 20,
            role,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
          } = params

          const skip = (page - 1) * limit
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

        return {
          data: result,
          fromCache: false,
          timestamp: new Date().toISOString()
        }
      },
      {
        ttl: CacheTTL.MEDIUM,
        tags: [CacheTags.USERS]
      }
    )
  }

  /**
   * 带缓存的内容查询
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
  }): Promise<CachedQueryResult<any>> {
    const cacheKey = CacheKeyGenerator.content(params)
    
    return this.cache.getOrSet(
      cacheKey,
      async () => {
        const result = await QueryOptimizer.measureQuery('cached_getContentsWithFilters', async () => {
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

        return {
          data: result,
          fromCache: false,
          timestamp: new Date().toISOString()
        }
      },
      {
        ttl: CacheTTL.MEDIUM,
        tags: [CacheTags.CONTENT]
      }
    )
  }

  /**
   * 带缓存的用户权限查询
   */
  static async getUserPermissionsSummary(userId: string): Promise<CachedQueryResult<any>> {
    const cacheKey = CacheKeyGenerator.userPermissions(userId)
    
    return this.cache.getOrSet(
      cacheKey,
      async () => {
        const result = await QueryOptimizer.measureQuery('cached_getUserPermissionsSummary', async () => {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              role: true,
              userPermissions: {
                where: {
                  OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                  ]
                },
                include: {
                  permission: true
                }
              }
            }
          })

          if (!user) {
            throw new Error('User not found')
          }

          // 获取角色权限（缓存角色权限）
          const rolePermissions = await this.getRolePermissions(user.role)

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

        return {
          data: result,
          fromCache: false,
          timestamp: new Date().toISOString()
        }
      },
      {
        ttl: CacheTTL.LONG,
        tags: [CacheTags.PERMISSIONS, CacheTags.USERS]
      }
    )
  }

  /**
   * 带缓存的角色权限查询
   */
  private static async getRolePermissions(role: string): Promise<any[]> {
    const cacheKey = CacheKeyGenerator.rolePermissions(role)
    
    return this.cache.getOrSet(
      cacheKey,
      async () => {
        return prisma.rolePermission.findMany({
          where: { role: role as any },
          include: {
            permission: true
          }
        })
      },
      {
        ttl: CacheTTL.VERY_LONG, // 角色权限变化较少，缓存时间较长
        tags: [CacheTags.PERMISSIONS, CacheTags.ROLES]
      }
    )
  }

  /**
   * 带缓存的权限检查
   */
  static async checkUserPermission(userId: string, permissionName: string): Promise<CachedQueryResult<boolean>> {
    const cacheKey = CacheKeyGenerator.permission(userId, permissionName)
    
    return this.cache.getOrSet(
      cacheKey,
      async () => {
        const userPermissions = await this.getUserPermissionsSummary(userId)
        const permission = userPermissions.data.permissions.find(
          (p: any) => p.name === permissionName
        )
        
        const result = permission ? permission.granted : false

        return {
          data: result,
          fromCache: false,
          timestamp: new Date().toISOString()
        }
      },
      {
        ttl: CacheTTL.LONG,
        tags: [CacheTags.PERMISSIONS]
      }
    )
  }

  /**
   * 带缓存的审计日志查询
   */
  static async getAuditLogsWithFilters(params: {
    page?: number
    limit?: number
    userId?: string
    action?: string
    resource?: string
    dateFrom?: Date
    dateTo?: Date
  }): Promise<CachedQueryResult<any>> {
    const cacheKey = CacheKeyGenerator.auditLogs(params)
    
    return this.cache.getOrSet(
      cacheKey,
      async () => {
        const result = await QueryOptimizer.measureQuery('cached_getAuditLogsWithFilters', async () => {
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

        return {
          data: result,
          fromCache: false,
          timestamp: new Date().toISOString()
        }
      },
      {
        ttl: CacheTTL.SHORT, // 审计日志经常变化，缓存时间短
        tags: [CacheTags.AUDIT_LOGS]
      }
    )
  }

  /**
   * 缓存失效管理
   */
  static async invalidateCache(tags: string[]): Promise<number> {
    let totalDeleted = 0
    for (const tag of tags) {
      const deleted = await this.cache.deleteByTag(tag)
      totalDeleted += deleted
    }
    return totalDeleted
  }

  /**
   * 用户相关缓存失效
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    await Promise.all([
      this.cache.delete(CacheKeyGenerator.user(userId)),
      this.cache.delete(CacheKeyGenerator.userPermissions(userId)),
      this.cache.deleteByTag(CacheTags.USERS)
    ])
  }

  /**
   * 权限相关缓存失效
   */
  static async invalidatePermissionCache(userId?: string): Promise<void> {
    if (userId) {
      await this.cache.delete(CacheKeyGenerator.userPermissions(userId))
    }
    await this.cache.deleteByTag(CacheTags.PERMISSIONS)
  }

  /**
   * 内容相关缓存失效
   */
  static async invalidateContentCache(): Promise<void> {
    await this.cache.deleteByTag(CacheTags.CONTENT)
  }

  /**
   * 获取缓存统计
   */
  static getCacheStats() {
    return this.cache.getStats()
  }

  /**
   * 预热常用缓存
   */
  static async warmupCache(): Promise<void> {
    console.log('Starting cache warmup...')
    
    try {
      // 预热用户角色权限
      const roles = ['USER', 'ADMIN', 'SUPER_ADMIN']
      await Promise.all(
        roles.map(role => this.getRolePermissions(role))
      )

      // 预热最新内容
      await this.getContentsWithFilters({
        page: 1,
        limit: 20,
        status: 'PUBLISHED',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      console.log('Cache warmup completed')
    } catch (error) {
      console.error('Cache warmup failed:', error)
    }
  }

  /**
   * 分析数据缓存
   */
  static async getAnalyticsData(cacheKey: string): Promise<any> {
    return this.cache.get(cacheKey)
  }

  static async setAnalyticsData(cacheKey: string, data: any): Promise<void> {
    await this.cache.set(cacheKey, data, {
      ttl: CacheTTL.MEDIUM, // 5分钟
      tags: [CacheTags.ANALYTICS]
    })
  }
}