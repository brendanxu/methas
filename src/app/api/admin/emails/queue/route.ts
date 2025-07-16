import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createSuccessResponse, APIError, ErrorCode } from '@/lib/api-error-handler'
import { emailQueue } from '@/lib/email-queue'

// GET /api/admin/emails/queue - 获取邮件队列状态
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      throw new APIError(ErrorCode.UNAUTHORIZED, 'Admin access required')
    }

    const stats = await emailQueue.getQueueStats()

    return createSuccessResponse({
      stats,
      message: 'Email queue status retrieved successfully'
    })

  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to get email queue status',
      error
    )
  }
}

// POST /api/admin/emails/queue - 手动操作邮件队列
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      throw new APIError(ErrorCode.UNAUTHORIZED, 'Admin access required')
    }

    const { action } = await request.json()

    let result: any = {}

    switch (action) {
      case 'process':
        // 手动触发队列处理
        await emailQueue.processQueue()
        result = { message: 'Queue processing triggered' }
        break

      case 'requeue_failed':
        // 重新排队失败的邮件
        const requeuedCount = await emailQueue.requeueFailedEmails()
        result = { 
          message: 'Failed emails requeued', 
          requeuedCount 
        }
        break

      case 'cleanup':
        // 清理旧记录
        const cleanedCount = await emailQueue.cleanupOldRecords()
        result = { 
          message: 'Old records cleaned up', 
          cleanedCount 
        }
        break

      case 'start_processor':
        // 启动队列处理器
        emailQueue.startProcessor()
        result = { message: 'Queue processor started' }
        break

      case 'stop_processor':
        // 停止队列处理器
        emailQueue.stopProcessor()
        result = { message: 'Queue processor stopped' }
        break

      default:
        throw new APIError(ErrorCode.BAD_REQUEST, 'Invalid action')
    }

    return createSuccessResponse(result)

  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to perform email queue action',
      error
    )
  }
}