import { NextRequest, NextResponse } from 'next/server'
import { createHealthCheck, ApiWrappers } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'

// 健康检查依赖项
const healthCheck = createHealthCheck({
  // 数据库连接检查
  database: async () => {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch {
      return false
    }
  },

  // 外部服务检查（示例：邮件服务）
  external: async () => {
    try {
      // 这里可以检查外部API的连通性
      // 例如: await fetch('https://api.external-service.com/health')
      return true
    } catch {
      return false
    }
  }
})

// 使用无限制的内部包装器
export const GET = ApiWrappers.internal(async (request: NextRequest) => {
  return await healthCheck()
})

// 支持HEAD请求用于负载均衡器检查
export const HEAD = ApiWrappers.internal(async (request: NextRequest) => {
  const response = await healthCheck()
  return new NextResponse(null, { status: response.status })
})