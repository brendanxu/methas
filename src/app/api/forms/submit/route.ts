
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
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode 
} from '@/lib/api-error-handler'

const formSubmissionSchema = z.object({
  type: z.enum(['CONTACT', 'CONSULTATION', 'NEWSLETTER']),
  data: z.record(z.any()),
})

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  company: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  phone: z.string().optional(),
  subject: z.string().optional(),
})

const consultationFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  company: z.string().min(1, 'Company is required'),
  industry: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().min(1, 'Project description is required'),
})

const newsletterFormSchema = z.object({
  email: z.string().email('Invalid email'),
  preferences: z.array(z.string()).optional(),
})

// 使用增强的API包装器处理表单提交
export const POST = ApiWrappers.form(async (request: NextRequest) => {
  const body = await request.json()
  const { type, data } = formSubmissionSchema.parse(body)

  // Validate form data based on type
  let validatedData
  switch (type) {
    case 'CONTACT':
      validatedData = contactFormSchema.parse(data)
      break
    case 'CONSULTATION':
      validatedData = consultationFormSchema.parse(data)
      break
    case 'NEWSLETTER':
      validatedData = newsletterFormSchema.parse(data)
      break
    default:
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid form type',
        { supportedTypes: ['CONTACT', 'CONSULTATION', 'NEWSLETTER'] }
      )
  }

  // 检查重复提交（基于邮箱和类型）
  const existingSubmission = await prisma.formSubmission.findFirst({
    where: {
      type,
      data: {
        path: '$.email',
        equals: validatedData.email
      },
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24小时内
      }
    }
  })

  if (existingSubmission) {
    throw new APIError(
      ErrorCode.CONFLICT,
      'Duplicate submission detected. Please wait 24 hours before submitting again.',
      { 
        lastSubmission: existingSubmission.createdAt,
        submissionId: existingSubmission.id 
      }
    )
  }

  // Store form submission
  const submission = await prisma.formSubmission.create({
    data: {
      type,
      data: validatedData,
      status: 'NEW',
    }
  })

  // Send email notifications based on form type
  try {
    await sendFormNotification(type, validatedData, submission.id)
  } catch (emailError) {
    logError('Email sending failed:', emailError)
    
    // 更新提交状态为邮件发送失败，但不失败整个请求
    await prisma.formSubmission.update({
      where: { id: submission.id },
      data: { 
        status: 'EMAIL_FAILED',
        notes: 'Email notification failed to send'
      }
    })
  }

  return createSuccessResponse({
    submissionId: submission.id,
    message: getSuccessMessage(type),
    type,
    status: 'submitted'
  })
})

async function sendFormNotification(type: string, data: any, submissionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  switch (type) {
    case 'CONTACT':
      await sendEmail({
        to: process.env.CONTACT_EMAIL || 'contact@southpole.com',
        subject: `New Contact Form Submission - ${data.subject || 'General Inquiry'}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Submission ID:</strong> ${submissionId}</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          
          <hr>
          <p><small>Manage this submission: <a href="${baseUrl}/admin/forms">Admin Dashboard</a></small></p>
        `
      })
      break

    case 'CONSULTATION':
      await sendEmail({
        to: process.env.CONTACT_EMAIL || 'contact@southpole.com',
        subject: `New Consultation Request - ${data.company}`,
        html: `
          <h2>New Consultation Request</h2>
          <p><strong>Submission ID:</strong> ${submissionId}</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Industry:</strong> ${data.industry || 'Not specified'}</p>
          <p><strong>Project Type:</strong> ${data.projectType || 'Not specified'}</p>
          <p><strong>Budget:</strong> ${data.budget || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
          <p><strong>Description:</strong></p>
          <p>${data.description.replace(/\n/g, '<br>')}</p>
          
          <hr>
          <p><small>Manage this submission: <a href="${baseUrl}/admin/forms">Admin Dashboard</a></small></p>
        `
      })
      break

    case 'NEWSLETTER':
      await sendEmail({
        to: process.env.NEWSLETTER_EMAIL || 'newsletter@southpole.com',
        subject: 'New Newsletter Subscription',
        html: `
          <h2>New Newsletter Subscription</h2>
          <p><strong>Submission ID:</strong> ${submissionId}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Preferences:</strong> ${data.preferences?.join(', ') || 'All topics'}</p>
          
          <hr>
          <p><small>Manage subscriptions: <a href="${baseUrl}/admin/forms">Admin Dashboard</a></small></p>
        `
      })
      break
  }
}

function getSuccessMessage(type: string): string {
  switch (type) {
    case 'CONTACT':
      return 'Thank you for your message. We\'ll get back to you within 24 hours.'
    case 'CONSULTATION':
      return 'Thank you for your consultation request. Our team will review your requirements and contact you soon.'
    case 'NEWSLETTER':
      return 'Successfully subscribed to our newsletter. Thank you for your interest!'
    default:
      return 'Form submitted successfully.'
  }
}