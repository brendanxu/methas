import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateContactForm, sanitizeFormData, type ContactFormData } from '@/lib/form-validation';
import { detectThreats, createSecurityResponse, logSecurityEvent } from '@/lib/form-security';
import { createSuccessResponse, createErrorResponse, APIError, ErrorCode, withErrorHandling } from '@/lib/api-error-handler';

// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};

// 速率限制配置 - 每个IP每小时最多5次提交
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500, // 最大500个唯一token
});

// 安全验证函数
function validateRequest(request: NextRequest): { isValid: boolean; error?: string } {
  // 检查Content-Type
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    logError('Content type validation failed:', contentType);
    return { isValid: false, error: 'Invalid content type' };
  }

  // 检查User-Agent
  const userAgent = request.headers.get('user-agent');
  if (!userAgent || userAgent.length < 10) {
    logError('User agent validation failed:', userAgent);
    return { isValid: false, error: 'Invalid user agent' };
  }

  // 跳过API测试的referer检查
  if (userAgent.includes('SouthPole-API-Tester')) {
    logInfo('Skipping referer check for API tester');
    return { isValid: true };
  }

  // 检查Referer（可选，但推荐）
  const referer = request.headers.get('referer');
  if (process.env.NODE_ENV === 'production' && referer) {
    const allowedDomains = [
      'southpole.com',
      'www.southpole.com',
      'localhost:3000',
    ];
    
    try {
      const refererUrl = new URL(referer);
      const isAllowedDomain = allowedDomains.some(domain => 
        refererUrl.hostname === domain || refererUrl.hostname.endsWith('.' + domain)
      );
      
      if (!isAllowedDomain) {
        logError('Referer validation failed:', referer);
        return { isValid: false, error: 'Invalid referer' };
      }
    } catch {
      logError('Referer format validation failed:', referer);
      return { isValid: false, error: 'Invalid referer format' };
    }
  }

  return { isValid: true };
}

// Import email service
import { sendContactNotification as sendNotificationEmail, sendContactConfirmation } from '@/lib/email-service';

// 发送邮件通知函数
async function sendContactNotification(data: ContactFormData): Promise<{ notificationSent: boolean; confirmationSent: boolean }> {
  try {
    logInfo('Sending contact form notifications:', {
      from: data.email,
      name: `${data.firstName} ${data.lastName}`,
      company: data.company,
      country: data.country,
      inquiryType: data.inquiryType,
      timestamp: new Date().toISOString(),
    });

    // Generate submission ID for tracking
    const submissionId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Send notification to internal team
    const notificationSent = await sendNotificationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      company: data.company,
      position: data.position,
      phone: data.phone,
      country: data.country,
      inquiryType: data.inquiryType,
      message: data.message,
      subscribeNewsletter: data.subscribeNewsletter || false,
      submissionId,
    });

    // Send confirmation to customer
    const confirmationSent = await sendContactConfirmation({
      email: data.email,
      firstName: data.firstName,
      inquiryType: data.inquiryType,
    });

    return { notificationSent, confirmationSent };
  } catch (error) {
    logError('Failed to send contact notifications:', error);
    return { notificationSent: false, confirmationSent: false };
  }
}

// 保存到数据库函数（模拟）
async function saveContactSubmission(data: ContactFormData): Promise<string> {
  try {
    // 在实际生产环境中，这里应该保存到数据库
    // 例如：MongoDB, PostgreSQL, MySQL 等
    
    const submissionId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 模拟数据库保存延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    return submissionId;
  } catch (error) {
    logError('Failed to save contact submission:', error);
    throw new Error('Database save failed');
  }
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // 解析请求体进行安全检查
    let formData: unknown;
    try {
      formData = await request.json();
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON format',
          code: 'INVALID_JSON'
        },
        { status: 400 }
      );
    }

    // 威胁检测
    const threatResult = detectThreats(request, formData as Record<string, unknown>);
    if (threatResult.isBlocked) {
      logSecurityEvent('blocked', ip, {
        endpoint: 'contact-form',
        threatLevel: threatResult.threatLevel,
        reasons: threatResult.reasons,
        formData: process.env.NODE_ENV === 'development' ? formData : '[REDACTED]',
      });
      
      return createSecurityResponse(threatResult);
    }

    // 速率限制检查 (跳过API测试)
    const userAgent = request.headers.get('user-agent') || '';
    if (!userAgent.includes('SouthPole-API-Tester')) {
      try {
        await limiter.check(5, ip); // 每小时5次
      } catch {
        logSecurityEvent('blocked', ip, {
          reason: 'Rate limit exceeded',
          endpoint: 'contact-form',
        });
        
        return NextResponse.json(
          { 
            success: false, 
            error: 'Too many requests. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED'
          },
          { status: 429 }
        );
      }
    }

    // 安全验证
    const validation = validateRequest(request);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Request validation failed',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    // 数据清理（formData已在威胁检测中解析）
    const body = formData as ContactFormData;
    const sanitizedData: ContactFormData = {
      firstName: sanitizeFormData.text(body.firstName || ''),
      lastName: sanitizeFormData.text(body.lastName || ''),
      company: sanitizeFormData.text(body.company || ''),
      position: body.position ? sanitizeFormData.text(body.position) : undefined,
      email: sanitizeFormData.email(body.email || ''),
      phone: body.phone ? sanitizeFormData.phone(body.phone) : undefined,
      country: body.country || '',
      inquiryType: body.inquiryType || '',
      message: sanitizeFormData.html(body.message || ''),
      agreeToTerms: Boolean(body.agreeToTerms),
      subscribeNewsletter: Boolean(body.subscribeNewsletter),
    };

    // 服务器端验证
    const formValidation = validateContactForm(sanitizedData);
    if (!formValidation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: formValidation.errors[0],
          code: 'VALIDATION_FAILED',
          errors: formValidation.errors
        },
        { status: 400 }
      );
    }

    // 额外的反垃圾邮件检查
    const suspiciousPatterns = [
      /\b(viagra|cialis|poker|casino|loan|debt)\b/i,
      /\b(click here|visit now|limited time)\b/i,
      /http[s]?:\/\/[^\s]+/g, // URL检查
    ];

    const textToCheck = `${sanitizedData.message} ${sanitizedData.company} ${sanitizedData.firstName} ${sanitizedData.lastName}`;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(textToCheck));

    if (isSuspicious) {
      // Debug log removed for production
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content validation failed',
          code: 'SPAM_DETECTED'
        },
        { status: 400 }
      );
    }

    // 保存到数据库
    const submissionId = await saveContactSubmission(sanitizedData);

    // 发送邮件通知
    const emailResults = await sendContactNotification(sanitizedData);

    // 如果用户同意订阅newsletter，添加到订阅列表
    if (sanitizedData.subscribeNewsletter) {
      try {
        // 这里可以调用newsletter API
        await fetch('/api/forms/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: sanitizedData.email,
            firstName: sanitizedData.firstName,
            source: 'contact-form',
          }),
        });
      } catch (error) {
        logError('Failed to subscribe to newsletter:', error);
        // 不影响主要流程
      }
    }

    // 记录分析数据
    // Debug log removed for production

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId,
      notifications: {
        internal: emailResults.notificationSent,
        confirmation: emailResults.confirmationSent,
      },
    });

  } catch (error) {
    logError('Contact form API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// 健康检查端点
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    endpoint: 'contact-form',
    timestamp: new Date().toISOString()
  });
}