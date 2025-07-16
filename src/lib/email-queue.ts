/**
 * 邮件队列管理系统
 * 处理邮件发送失败重试和队列管理
 */

import { prisma } from './prisma'
import { sendEmail, type EmailData } from './email-service'

export interface EmailQueueItem {
  id: string
  to: string | string[]
  subject: string
  html: string
  text?: string
  priority: 'high' | 'normal' | 'low'
  attempts: number
  maxAttempts: number
  status: 'pending' | 'processing' | 'sent' | 'failed'
  scheduledAt: Date
  lastAttemptAt?: Date
  error?: string
  metadata?: Record<string, any>
}

export class EmailQueue {
  private static instance: EmailQueue
  private isProcessing = false
  private processingInterval?: NodeJS.Timeout
  
  static getInstance(): EmailQueue {
    if (!EmailQueue.instance) {
      EmailQueue.instance = new EmailQueue()
    }
    return EmailQueue.instance
  }

  /**
   * 添加邮件到队列
   */
  async addToQueue(
    emailData: EmailData,
    options: {
      priority?: 'high' | 'normal' | 'low'
      delay?: number // 延迟发送（毫秒）
      maxAttempts?: number
      metadata?: Record<string, any>
    } = {}
  ): Promise<string> {
    const {
      priority = 'normal',
      delay = 0,
      maxAttempts = 3,
      metadata = {}
    } = options

    const scheduledAt = new Date(Date.now() + delay)

    // 保存到数据库作为审计日志
    const queueItem = await prisma.auditLog.create({
      data: {
        userId: 'system',
        action: 'EMAIL_QUEUED',
        resource: 'email_queue',
        details: {
          to: Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          priority,
          attempts: 0,
          maxAttempts,
          status: 'pending',
          scheduledAt: scheduledAt.toISOString(),
          metadata
        }
      }
    })

    // 如果是高优先级且无延迟，立即处理
    if (priority === 'high' && delay === 0) {
      this.processQueue()
    }

    return queueItem.id
  }

  /**
   * 处理队列中的邮件
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing) return
    
    this.isProcessing = true
    
    try {
      // 获取待处理的邮件 (简化查询以兼容SQLite)
      const pendingEmails = await prisma.auditLog.findMany({
        where: {
          action: 'EMAIL_QUEUED'
        },
        orderBy: { createdAt: 'asc' },
        take: 50 // 获取更多记录然后过滤
      })

      // 在应用层过滤状态为pending的邮件
      const filteredEmails = pendingEmails.filter(email => {
        const details = email.details as any
        return details?.status === 'pending'
      }).slice(0, 10)

      for (const emailRecord of filteredEmails) {
        await this.processEmailItem(emailRecord)
      }
    } catch (error) {
      console.error('Failed to process email queue:', error)
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * 处理单个邮件项
   */
  private async processEmailItem(emailRecord: any): Promise<void> {
    const details = emailRecord.details as any
    const currentTime = new Date()

    // 检查是否到达发送时间
    if (new Date(details.scheduledAt) > currentTime) {
      return
    }

    // 更新状态为处理中
    await prisma.auditLog.update({
      where: { id: emailRecord.id },
      data: {
        details: {
          ...details,
          status: 'processing',
          lastAttemptAt: currentTime.toISOString(),
          attempts: details.attempts + 1
        }
      }
    })

    try {
      // 尝试发送邮件
      const emailData: EmailData = {
        to: typeof details.to === 'string' ? details.to : details.to.split(','),
        subject: details.subject,
        html: details.html,
        text: details.text
      }

      const success = await sendEmail(emailData)

      if (success) {
        // 发送成功
        await prisma.auditLog.update({
          where: { id: emailRecord.id },
          data: {
            details: {
              ...details,
              status: 'sent',
              sentAt: currentTime.toISOString()
            }
          }
        })

        // 记录成功日志
        await prisma.auditLog.create({
          data: {
            userId: 'system',
            action: 'EMAIL_SENT',
            resource: 'email',
            details: {
              queueId: emailRecord.id,
              to: typeof details.to === 'string' ? details.to : details.to.join(','),
              subject: details.subject,
              attempts: details.attempts + 1
            }
          }
        })
      } else {
        // 发送失败，检查是否需要重试
        await this.handleEmailFailure(emailRecord.id, details, 'Email sending failed')
      }
    } catch (error) {
      // 发送异常
      await this.handleEmailFailure(
        emailRecord.id, 
        details, 
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  /**
   * 处理邮件发送失败
   */
  private async handleEmailFailure(
    recordId: string, 
    details: any, 
    errorMessage: string
  ): Promise<void> {
    const attempts = details.attempts + 1
    const isMaxAttempts = attempts >= details.maxAttempts

    const updatedDetails = {
      ...details,
      attempts,
      error: errorMessage,
      lastAttemptAt: new Date().toISOString()
    }

    if (isMaxAttempts) {
      // 达到最大重试次数，标记为失败
      updatedDetails.status = 'failed'
    } else {
      // 重新调度发送
      updatedDetails.status = 'pending'
      updatedDetails.scheduledAt = new Date(
        Date.now() + this.getRetryDelay(attempts)
      ).toISOString()
    }

    await prisma.auditLog.update({
      where: { id: recordId },
      data: { details: updatedDetails }
    })

    // 记录失败日志
    await prisma.auditLog.create({
      data: {
        userId: 'system',
        action: isMaxAttempts ? 'EMAIL_FAILED' : 'EMAIL_RETRY_SCHEDULED',
        resource: 'email',
        details: {
          queueId: recordId,
          attempts,
          maxAttempts: details.maxAttempts,
          error: errorMessage,
          nextRetry: isMaxAttempts ? null : updatedDetails.scheduledAt
        }
      }
    })
  }

  /**
   * 计算重试延迟（指数退避）
   */
  private getRetryDelay(attempts: number): number {
    // 指数退避：1分钟, 5分钟, 30分钟
    const delays = [60000, 300000, 1800000] // 毫秒
    return delays[Math.min(attempts - 1, delays.length - 1)]
  }

  /**
   * 启动队列处理器
   */
  startProcessor(intervalMs: number = 60000): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
    }

    this.processingInterval = setInterval(() => {
      this.processQueue()
    }, intervalMs)

    // 立即处理一次
    this.processQueue()
  }

  /**
   * 停止队列处理器
   */
  stopProcessor(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = undefined
    }
  }

  /**
   * 获取队列统计信息
   */
  async getQueueStats(): Promise<{
    pending: number
    processing: number
    sent: number
    failed: number
    total: number
  }> {
    const stats = await prisma.auditLog.groupBy({
      by: ['details'],
      where: {
        action: 'EMAIL_QUEUED'
      },
      _count: { id: true }
    })

    const result = {
      pending: 0,
      processing: 0,
      sent: 0,
      failed: 0,
      total: 0
    }

    // 注意：由于Prisma对JSON字段的groupBy支持有限，
    // 这里需要查询所有记录然后在应用层统计
    const allEmails = await prisma.auditLog.findMany({
      where: { action: 'EMAIL_QUEUED' },
      select: { details: true }
    })

    allEmails.forEach(email => {
      const details = email.details as any
      const status = details.status || 'pending'
      result[status as keyof typeof result]++
      result.total++
    })

    return result
  }

  /**
   * 清理旧的队列记录
   */
  async cleanupOldRecords(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

    const result = await prisma.auditLog.deleteMany({
      where: {
        action: { in: ['EMAIL_QUEUED', 'EMAIL_SENT', 'EMAIL_FAILED'] },
        createdAt: { lt: cutoffDate }
      }
    })

    return result.count
  }

  /**
   * 重新排队失败的邮件
   */
  async requeueFailedEmails(maxAge: number = 7): Promise<number> {
    const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000)

    // 获取失败的邮件 (简化查询以兼容SQLite)
    const allEmails = await prisma.auditLog.findMany({
      where: {
        action: 'EMAIL_QUEUED',
        createdAt: { gte: cutoffDate }
      }
    })

    // 在应用层过滤状态为failed的邮件
    const failedEmails = allEmails.filter(email => {
      const details = email.details as any
      return details?.status === 'failed'
    })

    let requeuedCount = 0

    for (const email of failedEmails) {
      const details = email.details as any
      
      await prisma.auditLog.update({
        where: { id: email.id },
        data: {
          details: {
            ...details,
            status: 'pending',
            attempts: 0,
            error: undefined,
            scheduledAt: new Date().toISOString()
          }
        }
      })

      requeuedCount++
    }

    return requeuedCount
  }
}

// 导出单例实例
export const emailQueue = EmailQueue.getInstance()