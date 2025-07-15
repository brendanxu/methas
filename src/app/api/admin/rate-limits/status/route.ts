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
  getIdentifier,
  RateLimitTier
} from '@/lib/enhanced-rate-limit'
import { prisma } from '@/lib/prisma'

// 查询Schema
const statusQuerySchema = z.object({
  configKey: z.string().min(1, 'Config key is required'),
  identifier: z.string().optional(),
  tier: z.nativeEnum(RateLimitTier).optional()
})

// 获取特定限流状态 - 管理员权限
export const GET = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  const { searchParams } = new URL(request.url)
  const query = statusQuerySchema.parse(Object.fromEntries(searchParams.entries()))

  const config = globalRateLimiter.getConfig(query.configKey)
  if (!config) {
    throw new APIError(
      ErrorCode.NOT_FOUND,
      `Rate limit configuration not found: ${query.configKey}`
    )
  }

  // 确定标识符
  let identifier: string
  if (query.identifier) {
    identifier = query.identifier
  } else {
    // 根据tier和当前用户/请求确定标识符
    const tier = query.tier || config.tier
    identifier = getIdentifier(request, tier, session.user.id)
  }

  // 获取状态
  const status = await globalRateLimiter.getStatus(query.configKey, identifier)

  return createSuccessResponse({
    configKey: query.configKey,
    identifier,
    config: {
      strategy: config.strategy,
      tier: config.tier,
      limit: config.limit,
      window: config.window,
      enabled: config.enabled
    },
    status,
    timestamp: new Date().toISOString()
  })
})

// 重置特定限流 - 超级管理员权限
export const DELETE = ApiWrappers.admin(async (request: NextRequest, { session }: any) => {
  if (session.user.role !== 'SUPER_ADMIN') {
    throw new APIError(
      ErrorCode.FORBIDDEN,
      'Only super administrators can reset rate limits'
    )
  }

  const { searchParams } = new URL(request.url)
  const configKey = searchParams.get('configKey')
  const identifier = searchParams.get('identifier')

  if (!configKey) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Config key is required'
    )
  }

  const config = globalRateLimiter.getConfig(configKey)
  if (!config) {
    throw new APIError(
      ErrorCode.NOT_FOUND,
      `Rate limit configuration not found: ${configKey}`
    )
  }

  // 重置限流
  await globalRateLimiter.reset(configKey, identifier || undefined)

  // 记录审计日志
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'RATE_LIMIT_RESET',
      resource: 'rate_limit',
      details: {
        configKey,
        identifier: identifier || 'all',
        resetBy: session.user.email
      }
    }
  })

  return createSuccessResponse({
    message: 'Rate limit reset successfully',
    configKey,
    identifier: identifier || 'all'
  })
})