import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, APIError, ErrorCode } from '@/lib/api-error-handler'
import { sendEmail, generateContactNotificationHTML, sendContactConfirmation } from '@/lib/email-service'
import { z } from 'zod'

// 邮件通知请求Schema
const emailNotificationSchema = z.object({
  submissionId: z.string(),
  formData: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    company: z.string().optional(),
    position: z.string().optional(),
    phone: z.string().optional(),
    country: z.string(),
    inquiryType: z.string(),
    message: z.string(),
    agreeToTerms: z.boolean(),
    subscribeNewsletter: z.boolean().optional()
  }),
  clientInfo: z.object({
    ip: z.string(),
    userAgent: z.string(),
    referer: z.string().optional(),
    timestamp: z.string()
  })
})

// POST /api/emails/contact-notification - 发送联系表单通知邮件
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, formData, clientInfo } = emailNotificationSchema.parse(body)

    // 检查提交是否存在
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId }
    })

    if (!submission) {
      throw new APIError(ErrorCode.NOT_FOUND, 'Form submission not found')
    }

    // 准备邮件数据
    const emailData = {
      ...formData,
      subscribeNewsletter: formData.subscribeNewsletter || false,
      submissionId,
      timestamp: clientInfo.timestamp
    }

    // 使用邮件队列发送内部通知邮件
    const { emailQueue } = await import('@/lib/email-queue')
    const notificationHTML = generateContactNotificationHTML(emailData)
    
    const internalQueueId = await emailQueue.addToQueue({
      to: process.env.CONTACT_EMAIL || 'contact@southpole.com',
      subject: `🔔 New Contact Form Submission - ${formData.inquiryType}`,
      html: notificationHTML,
      text: `New contact form submission from ${formData.firstName} ${formData.lastName} (${formData.email})`,
      replyTo: formData.email
    }, {
      priority: 'high',
      metadata: { submissionId, type: 'contact_notification' }
    })

    // 发送客户确认邮件
    const confirmationSent = await sendContactConfirmation({
      email: formData.email,
      firstName: formData.firstName,
      inquiryType: formData.inquiryType
    })

    // 内部邮件通过队列发送，视为已发送
    const internalEmailSent = true

    // 更新表单提交状态
    let newStatus = submission.status
    if (internalEmailSent && confirmationSent) {
      newStatus = 'PROCESSED'
    } else if (!internalEmailSent) {
      newStatus = 'EMAIL_FAILED'
    }

    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        status: newStatus,
        notes: !internalEmailSent ? 'Internal notification email failed' : 
               !confirmationSent ? 'Customer confirmation email failed' : 
               'Emails sent successfully'
      }
    })

    // 记录邮件发送结果到审计日志
    await prisma.auditLog.create({
      data: {
        userId: 'system',
        action: 'SEND_EMAIL_NOTIFICATION',
        resource: 'email',
        details: {
          submissionId,
          internalEmailSent,
          confirmationSent,
          recipientEmail: formData.email,
          inquiryType: formData.inquiryType,
          timestamp: new Date().toISOString()
        }
      }
    })

    return createSuccessResponse({
      notificationSent: internalEmailSent,
      confirmationSent,
      status: newStatus,
      message: 'Email notifications processed'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid email notification data',
        error.errors
      )
    }
    
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to send email notifications',
      error
    )
  }
}