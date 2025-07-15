import { NextRequest } from 'next/server'
import { z } from 'zod'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'
import { 
  globalRateLimiter, 
  RateLimitStrategy, 
  RateLimitTier,
  RateLimitConfig,
  getIdentifier
} from '@/lib/enhanced-rate-limit'
import { prisma } from '@/lib/prisma'

// 配置验证Schema
const rateLimitConfigSchema = z.object({
  key: z.string().min(1, 'Config key is required'),
  strategy: z.nativeEnum(RateLimitStrategy),
  tier: z.nativeEnum(RateLimitTier),
  limit: z.number().min(1, 'Limit must be positive'),
  window: z.number().min(1, 'Window must be positive'),
  burst: z.number().optional(),
  refillRate: z.number().optional(),
  enabled: z.boolean().default(true),
  description: z.string().optional()
})

const querySchema = z.object({
  key: z.string().optional(),
  strategy: z.nativeEnum(RateLimitStrategy).optional(),
  tier: z.nativeEnum(RateLimitTier).optional(),
  enabled: z.coerce.boolean().optional()
})

// 获取限流配置和状态 - 管理员权限
export const GET = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  const { searchParams } = new URL(request.url)
  const query = querySchema.parse(Object.fromEntries(searchParams.entries()))

  // 获取统计信息
  const stats = globalRateLimiter.getStats()

  // 获取所有配置
  const allConfigs = Array.from(globalRateLimiter['configs'].entries()).map(([configKey, config]) => ({
    ...config,
    key: configKey
  }))

  // 过滤配置
  let filteredConfigs = allConfigs
  if (query.key) {
    filteredConfigs = filteredConfigs.filter(config => 
      config.key.toLowerCase().includes(query.key!.toLowerCase())
    )
  }
  if (query.strategy) {
    filteredConfigs = filteredConfigs.filter(config => config.strategy === query.strategy)
  }
  if (query.tier) {
    filteredConfigs = filteredConfigs.filter(config => config.tier === query.tier)
  }
  if (query.enabled !== undefined) {
    filteredConfigs = filteredConfigs.filter(config => config.enabled === query.enabled)
  }

  // 获取每个配置的状态（示例）
  const configsWithStatus = await Promise.all(
    filteredConfigs.map(async (config) => {
      try {
        // 使用管理员用户作为示例标识符
        const identifier = session.user.id
        const status = await globalRateLimiter.getStatus(config.key, identifier)
        return {
          ...config,
          status
        }
      } catch (error) {
        return {
          ...config,
          status: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
  )

  return createSuccessResponse({
    stats,
    configs: configsWithStatus,
    total: filteredConfigs.length,
    strategies: Object.values(RateLimitStrategy),
    tiers: Object.values(RateLimitTier)
  })
})

// 创建或更新限流配置 - 超级管理员权限
export const POST = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  if (session.user.role !== 'SUPER_ADMIN') {
    throw new APIError(
      ErrorCode.FORBIDDEN,
      'Only super administrators can modify rate limit configurations'
    )
  }

  const body = await request.json()
  const configData = rateLimitConfigSchema.parse(body)

  // 验证策略特定的配置
  if (configData.strategy === RateLimitStrategy.TOKEN_BUCKET) {
    if (!configData.burst || !configData.refillRate) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Token bucket strategy requires burst and refillRate parameters'
      )
    }
  }

  // 添加或更新配置
  globalRateLimiter.setConfig(configData.key, configData)

  // 记录审计日志
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'RATE_LIMIT_CONFIG_UPDATE',
      resource: 'rate_limit',
      details: {
        configKey: configData.key,
        strategy: configData.strategy,
        tier: configData.tier,
        limit: configData.limit
      }
    }
  })

  return createSuccessResponse({
    message: 'Rate limit configuration updated successfully',
    config: configData
  })
})

// 删除限流配置 - 超级管理员权限
export const DELETE = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  if (session.user.role !== 'SUPER_ADMIN') {
    throw new APIError(
      ErrorCode.FORBIDDEN,
      'Only super administrators can delete rate limit configurations'
    )
  }

  const { searchParams } = new URL(request.url)
  const configKey = searchParams.get('key')

  if (!configKey) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Config key is required'
    )
  }

  // 检查配置是否存在
  const config = globalRateLimiter.getConfig(configKey)
  if (!config) {
    throw new APIError(
      ErrorCode.NOT_FOUND,
      `Rate limit configuration not found: ${configKey}`
    )
  }

  // 删除配置（通过设置空Map来模拟删除）
  globalRateLimiter['configs'].delete(configKey)

  // 清空相关缓存
  await globalRateLimiter.reset(configKey)

  // 记录审计日志
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'RATE_LIMIT_CONFIG_DELETE',
      resource: 'rate_limit',
      details: {
        configKey,
        deletedConfig: JSON.parse(JSON.stringify(config))
      }
    }
  })

  return createSuccessResponse({
    message: 'Rate limit configuration deleted successfully',
    configKey
  })
})