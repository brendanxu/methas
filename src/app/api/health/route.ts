import { NextRequest, NextResponse } from 'next/server'
import { createHealthCheck, ApiWrappers } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// 应用启动时间
const startTime = Date.now()

// 简单的内存指标存储
let requestCount = 0
let errorCount = 0
let totalResponseTime = 0

// 增强的健康检查依赖项
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

  // 外部服务检查（包括邮件和存储）
  external: async () => {
    try {
      // 检查邮件服务配置
      const emailOk = !!process.env.SENDGRID_API_KEY
      // 检查存储服务配置
      const storageOk = !!process.env.VERCEL_BLOB_READ_WRITE_TOKEN
      
      return emailOk && storageOk
    } catch {
      return false
    }
  }
})

// 使用无限制的内部包装器
export const GET = ApiWrappers.internal(async (request: NextRequest) => {
  requestCount++
  const checkStartTime = Date.now()
  
  try {
    // 检查请求头中的健康检查密钥（可选的安全措施）
    const headersList = await headers()
    const healthCheckKey = headersList.get('x-health-check-key')
    
    // 如果配置了健康检查密钥，则验证
    if (process.env.HEALTH_CHECK_KEY && healthCheckKey !== process.env.HEALTH_CHECK_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await healthCheck()
    
    // 添加响应时间头
    const responseTime = Date.now() - checkStartTime
    totalResponseTime += responseTime
    
    const response = NextResponse.json(result)
    response.headers.set('X-Response-Time', `${responseTime}ms`)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    return response
  } catch (error) {
    errorCount++
    console.error('Health check failed:', error)
    throw error
  }
})

// 支持HEAD请求用于负载均衡器检查
export const HEAD = ApiWrappers.internal(async (request: NextRequest) => {
  const response = await healthCheck()
  return new NextResponse(null, { status: response.status })
})

// 支持POST请求用于自定义指标上报
export const POST = ApiWrappers.internal(async (request: NextRequest) => {
  try {
    const body = await request.json()
    
    // 记录自定义指标
    if (body.metrics) {
      console.log('Custom metrics received:', {
        timestamp: new Date().toISOString(),
        metrics: body.metrics
      })
    }
    
    // 可以在这里集成到监控系统
    // 例如：发送到 Sentry、DataDog 等

    return NextResponse.json({
      status: 'ok',
      message: 'Metrics recorded'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
})