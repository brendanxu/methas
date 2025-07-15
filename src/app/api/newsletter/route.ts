
// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { createProtectedRoute, ApiResponses } from '@/lib/middleware/route-protection'
import { sendNewsletterWelcome, sendConfirmationEmail } from '@/lib/email-service'
import { randomUUID } from 'crypto'
import { 
  checkRateLimit, 
  createRateLimitHeaders
} from '@/lib/enhanced-rate-limit'

// Newsletter 订阅数据验证
const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1).max(50).optional(),
  preferences: z.array(z.string()).default([]),
  source: z.string().default('direct'),
})

// Newsletter 偏好选项
export const newsletterPreferences = [
  { value: 'climate-news', label: '气候新闻' },
  { value: 'industry-insights', label: '行业洞察' },
  { value: 'product-updates', label: '产品更新' },
  { value: 'events', label: '活动邀请' },
  { value: 'research', label: '研究报告' },
]

// 数据清理函数
function sanitizeNewsletterData(data: any) {
  return {
    email: data.email?.trim().toLowerCase(),
    firstName: data.firstName?.trim().replace(/<[^>]*>/g, ''), // 移除HTML标签
    preferences: Array.isArray(data.preferences) 
      ? data.preferences.filter((p: string) => newsletterPreferences.some(np => np.value === p))
      : [],
    source: data.source || 'direct'
  }
}

// 反垃圾邮件检查
function isEmailSuspicious(email: string): boolean {
  const suspiciousPatterns = [
    /\b(test|fake|spam|robot|bot)\b/i,
    /\+.*\+/, // 包含多个+号的邮箱
    /\.{2,}/, // 连续点号
    /^[0-9]+@/, // 以数字开头的邮箱
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(email.toLowerCase()))
}

// 生成确认令牌
function generateConfirmationToken(): string {
  return `conf_${Date.now()}_${randomUUID().replace(/-/g, '')}`
}

// 查找现有订阅
async function findExistingSubscription(email: string) {
  return await prisma.formSubmission.findFirst({
    where: {
      type: 'NEWSLETTER',
      data: {
        path: '$.email',
        equals: email
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// 创建或更新Newsletter订阅
async function createNewsletterSubscription(data: z.infer<typeof newsletterSchema>, ip: string) {
  const confirmationToken = generateConfirmationToken()
  
  // 创建表单提交记录
  const formSubmission = await prisma.formSubmission.create({
    data: {
      type: 'NEWSLETTER',
      status: 'NEW', // 待确认状态
      data: {
        email: data.email,
        firstName: data.firstName,
        preferences: JSON.stringify(data.preferences),
        source: data.source,
        confirmationToken,
        confirmedAt: null,
        subscribedAt: new Date().toISOString(),
        ip: ip,
        userAgent: 'Unknown'
      }
    }
  })

  return { formSubmission, confirmationToken }
}

// Newsletter 订阅 - 公开端点（无需认证）
export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // 增强的速率限制检查
    const rateLimitResult = await checkRateLimit('public.newsletter', request)
    if (!rateLimitResult.allowed) {
      const headers = createRateLimitHeaders(rateLimitResult)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many subscription requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitResult.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          }
        }
      )
    }

    // 解析和验证请求数据
    let body
    try {
      body = await request.json()
    } catch {
      return ApiResponses.error('Invalid JSON format', 400, 'INVALID_JSON')
    }

    // 数据清理
    const sanitizedData = sanitizeNewsletterData(body)
    
    // 数据验证
    const validatedData = newsletterSchema.parse(sanitizedData)

    // 反垃圾邮件检查
    if (isEmailSuspicious(validatedData.email)) {
      logInfo('Suspicious email detected:', { ip, email: validatedData.email })
      return ApiResponses.error('Email validation failed', 400, 'INVALID_EMAIL')
    }

    // 检查是否已订阅
    const existingSubmission = await findExistingSubscription(validatedData.email)
    
    if (existingSubmission) {
      const submissionData = existingSubmission.data as any
      
      // 如果已经确认订阅，更新偏好
      if (submissionData.confirmedAt) {
        await prisma.formSubmission.update({
          where: { id: existingSubmission.id },
          data: {
            data: {
              ...submissionData,
              preferences: JSON.stringify(validatedData.preferences),
              lastUpdated: new Date().toISOString()
            },
            updatedAt: new Date()
          }
        })
        
        return ApiResponses.success({
          message: 'Subscription preferences updated successfully',
          isUpdate: true,
          status: 'active'
        })
      } else {
        // 重新发送确认邮件
        const emailSent = await sendConfirmationEmail(validatedData, submissionData.confirmationToken)
        
        return ApiResponses.success({
          message: 'Confirmation email resent successfully',
          isResend: true,
          status: 'pending',
          emailSent
        })
      }
    }

    // 创建新订阅
    const { formSubmission, confirmationToken } = await createNewsletterSubscription(validatedData, ip)

    // 发送确认邮件
    const emailSent = await sendConfirmationEmail(validatedData, confirmationToken)

    // 记录分析数据
    // Debug log removed for production

    return ApiResponses.success({
      message: 'Newsletter subscription successful. Please check your email to confirm.',
      submissionId: formSubmission.id,
      status: 'pending',
      emailSent,
      confirmationRequired: true
    }, 201)

  } catch (error) {
    logError('Newsletter subscription error:', error)
    
    if (error instanceof z.ZodError) {
      return ApiResponses.validationError(error.errors)
    }
    
    return ApiResponses.error('Internal server error', 500, 'INTERNAL_ERROR')
  }
}

// Newsletter 确认订阅 - 公开端点
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return ApiResponses.error('Confirmation token required', 400, 'MISSING_TOKEN')
    }

    // 查找对应的订阅
    const submission = await prisma.formSubmission.findFirst({
      where: {
        type: 'NEWSLETTER',
        data: {
          path: '$.confirmationToken',
          equals: token
        }
      }
    })

    if (!submission) {
      return ApiResponses.error('Invalid or expired confirmation token', 400, 'INVALID_TOKEN')
    }

    const submissionData = submission.data as any
    
    // 检查是否已经确认
    if (submissionData.confirmedAt) {
      return ApiResponses.success({
        message: 'Subscription already confirmed',
        status: 'active'
      })
    }

    // 确认订阅
    await prisma.formSubmission.update({
      where: { id: submission.id },
      data: {
        status: 'PROCESSED',
        data: {
          ...submissionData,
          confirmedAt: new Date().toISOString(),
          confirmationToken: undefined // 移除确认令牌
        },
        updatedAt: new Date()
      }
    })

    // 发送欢迎邮件
    const welcomeEmailSent = await sendNewsletterWelcome({
      email: submissionData.email,
      firstName: submissionData.firstName
    })

    // Debug log removed for production

    return ApiResponses.success({
      message: 'Newsletter subscription confirmed successfully',
      submissionId: submission.id,
      status: 'active',
      welcomeEmailSent
    })

  } catch (error) {
    logError('Newsletter confirmation error:', error)
    return ApiResponses.error('Internal server error', 500, 'INTERNAL_ERROR')
  }
}

// Newsletter 取消订阅 - 公开端点
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    if (!email) {
      return ApiResponses.error('Email address required', 400, 'MISSING_EMAIL')
    }

    // 查找订阅记录
    const submission = await findExistingSubscription(email)
    
    if (!submission) {
      return ApiResponses.error('Subscription not found', 404, 'SUBSCRIPTION_NOT_FOUND')
    }

    const submissionData = submission.data as any

    // 标记为已取消订阅
    await prisma.formSubmission.update({
      where: { id: submission.id },
      data: {
        status: 'ARCHIVED',
        data: {
          ...submissionData,
          unsubscribedAt: new Date().toISOString(),
          status: 'unsubscribed'
        },
        updatedAt: new Date()
      }
    })

    // Debug log removed for production

    return ApiResponses.success({
      message: 'Successfully unsubscribed from newsletter',
      submissionId: submission.id,
      status: 'unsubscribed'
    })

  } catch (error) {
    logError('Newsletter unsubscription error:', error)
    return ApiResponses.error('Internal server error', 500, 'INTERNAL_ERROR')
  }
}

// Newsletter 统计信息 - 管理员权限
export const GET = createProtectedRoute(
  {
    auth: 'ADMIN_DASHBOARD',
    audit: {
      action: 'VIEW_NEWSLETTER_STATS',
      resource: 'newsletter'
    }
  },
  async (request, { session }) => {
    try {
      // 统计各种状态的订阅数量
      const [totalSubscriptions, confirmedSubscriptions, pendingSubscriptions, unsubscribed] = await Promise.all([
        prisma.formSubmission.count({
          where: { type: 'NEWSLETTER' }
        }),
        prisma.formSubmission.count({
          where: {
            type: 'NEWSLETTER',
            data: {
              path: '$.confirmedAt',
              not: Prisma.JsonNull
            }
          }
        }),
        prisma.formSubmission.count({
          where: {
            type: 'NEWSLETTER',
            status: 'NEW'
          }
        }),
        prisma.formSubmission.count({
          where: {
            type: 'NEWSLETTER',
            status: 'ARCHIVED'
          }
        })
      ])

      // 获取最近的订阅
      const recentSubscriptions = await prisma.formSubmission.findMany({
        where: { type: 'NEWSLETTER' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          data: true,
          status: true,
          createdAt: true
        }
      })

      return ApiResponses.success({
        statistics: {
          total: totalSubscriptions,
          confirmed: confirmedSubscriptions,
          pending: pendingSubscriptions,
          unsubscribed: unsubscribed,
          conversionRate: totalSubscriptions > 0 ? (confirmedSubscriptions / totalSubscriptions * 100).toFixed(2) : '0'
        },
        recentSubscriptions: recentSubscriptions.map(sub => ({
          id: sub.id,
          email: (sub.data as any).email,
          firstName: (sub.data as any).firstName,
          status: sub.status,
          confirmedAt: (sub.data as any).confirmedAt,
          createdAt: sub.createdAt
        })),
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      logError('Newsletter stats error:', error)
      return ApiResponses.error('Failed to fetch newsletter statistics', 500)
    }
  }
)