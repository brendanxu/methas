import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'
import { CacheManager, CacheTags } from '@/lib/cache/cache-manager'
import { CachedQueries } from '@/lib/cache/cached-queries'

// GET /api/admin/cache - 获取缓存统计信息
const handleGetCacheStats = async (
  request: NextRequest, 
  { session }: { session: any }
) => {
  const cache = CacheManager.getInstance()
  const stats = cache.getStats()
  
  return createSuccessResponse({
    stats: {
      ...stats,
      size: cache.size(),
      hitRatePercentage: (stats.hitRate * 100).toFixed(2)
    },
    tags: Object.values(CacheTags),
    configuration: {
      provider: 'memory',
      cleanupInterval: '60 seconds',
      defaultTTL: '5 minutes'
    },
    lastUpdated: new Date().toISOString()
  })
}

// POST /api/admin/cache - 缓存管理操作
const handleCacheOperations = async (
  request: NextRequest, 
  { session }: { session: any }
) => {
  const body = await request.json()
  const { action, tags, keys } = body

  const cache = CacheManager.getInstance()

  switch (action) {
    case 'clear-all':
      await cache.clear()
      return createSuccessResponse({
        message: 'All cache cleared successfully',
        clearedItems: 'all'
      })

    case 'clear-by-tags':
      if (!tags || !Array.isArray(tags)) {
        throw new APIError(
          ErrorCode.BAD_REQUEST,
          'Tags array is required for clear-by-tags action'
        )
      }
      
      let totalCleared = 0
      for (const tag of tags) {
        const cleared = await cache.deleteByTag(tag)
        totalCleared += cleared
      }
      
      return createSuccessResponse({
        message: `Cache cleared by tags: ${tags.join(', ')}`,
        clearedItems: totalCleared,
        tags: tags
      })

    case 'clear-by-keys':
      if (!keys || !Array.isArray(keys)) {
        throw new APIError(
          ErrorCode.BAD_REQUEST,
          'Keys array is required for clear-by-keys action'
        )
      }
      
      let deletedCount = 0
      for (const key of keys) {
        const deleted = await cache.delete(key)
        if (deleted) deletedCount++
      }
      
      return createSuccessResponse({
        message: `Cache cleared by keys`,
        clearedItems: deletedCount,
        totalRequested: keys.length
      })

    case 'warmup':
      await CachedQueries.warmupCache()
      return createSuccessResponse({
        message: 'Cache warmup completed',
        warmedUp: ['role-permissions', 'latest-content']
      })

    case 'invalidate-users':
      const userCleared = await CachedQueries.invalidateCache([CacheTags.USERS])
      return createSuccessResponse({
        message: 'User cache invalidated',
        clearedItems: userCleared
      })

    case 'invalidate-content':
      const contentCleared = await CachedQueries.invalidateCache([CacheTags.CONTENT])
      return createSuccessResponse({
        message: 'Content cache invalidated',
        clearedItems: contentCleared
      })

    case 'invalidate-permissions':
      const permCleared = await CachedQueries.invalidateCache([CacheTags.PERMISSIONS])
      return createSuccessResponse({
        message: 'Permission cache invalidated',
        clearedItems: permCleared
      })

    case 'get-cache-info':
      const allStats = cache.getStats()
      return createSuccessResponse({
        message: 'Cache information retrieved',
        stats: allStats,
        size: cache.size(),
        healthStatus: allStats.hitRate > 0.7 ? 'healthy' : 
                     allStats.hitRate > 0.4 ? 'degraded' : 'poor'
      })

    default:
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid action. Supported actions: clear-all, clear-by-tags, clear-by-keys, warmup, invalidate-users, invalidate-content, invalidate-permissions, get-cache-info'
      )
  }
}

// DELETE /api/admin/cache - 清除特定缓存
const handleDeleteCache = async (
  request: NextRequest, 
  { session }: { session: any }
) => {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const tag = searchParams.get('tag')

  const cache = CacheManager.getInstance()

  if (key) {
    const deleted = await cache.delete(key)
    return createSuccessResponse({
      message: deleted ? 'Cache key deleted' : 'Cache key not found',
      deleted,
      key
    })
  }

  if (tag) {
    const deletedCount = await cache.deleteByTag(tag)
    return createSuccessResponse({
      message: `Cache cleared by tag: ${tag}`,
      deletedCount,
      tag
    })
  }

  throw new APIError(
    ErrorCode.BAD_REQUEST,
    'Either key or tag parameter is required'
  )
}

// 导出包装的处理器
export const GET = ApiWrappers.admin(handleGetCacheStats)
export const POST = ApiWrappers.admin(handleCacheOperations)
export const DELETE = ApiWrappers.admin(handleDeleteCache)