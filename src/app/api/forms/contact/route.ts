import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateContactForm, sanitizeFormData, type ContactFormData } from '@/lib/form-validation';
import { detectThreats, createSecurityResponse, logSecurityEvent } from '@/lib/form-security';
import { createSuccessResponse, createErrorResponse, APIError, ErrorCode, withErrorHandling } from '@/lib/api-error-handler';

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
    return { isValid: false, error: 'Invalid content type' };
  }

  // 检查User-Agent
  const userAgent = request.headers.get('user-agent');
  if (!userAgent || userAgent.length < 10) {
    return { isValid: false, error: 'Invalid user agent' };
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
        return { isValid: false, error: 'Invalid referer' };
      }
    } catch {
      return { isValid: false, error: 'Invalid referer format' };
    }
  }

  return { isValid: true };
}

// 发送邮件通知函数（模拟）
async function sendContactNotification(data: ContactFormData): Promise<boolean> {
  try {
    // 在实际生产环境中，这里应该集成真实的邮件服务
    // 例如：SendGrid, AWS SES, Nodemailer 等
    
    console.log('Contact form submission:', {
      from: data.email,
      name: `${data.firstName} ${data.lastName}`,
      company: data.company,
      country: data.country,
      inquiryType: data.inquiryType,
      timestamp: new Date().toISOString(),
    });

    // 模拟邮件发送延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 发送给内部团队的邮件内容
    // 在生产环境中启用邮件发送
    // const emailContent = {
    //   to: process.env.CONTACT_EMAIL || 'contact@southpole.com',
    //   subject: `新的联系表单提交 - ${data.inquiryType}`,
    //   html: `邮件模板内容`
    // };

    // 在实际环境中发送邮件
    // await sendEmail(emailContent);

    return true;
  } catch (error) {
    console.error('Failed to send contact notification:', error);
    return false;
  }
}

// 保存到数据库函数（模拟）
async function saveContactSubmission(data: ContactFormData): Promise<string> {
  try {
    // 在实际生产环境中，这里应该保存到数据库
    // 例如：MongoDB, PostgreSQL, MySQL 等
    
    const submissionId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Saving contact submission to database:', {
      id: submissionId,
      data,
      timestamp: new Date().toISOString(),
    });

    // 模拟数据库保存延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    return submissionId;
  } catch (error) {
    console.error('Failed to save contact submission:', error);
    throw new Error('Database save failed');
  }
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
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

    // 速率限制检查
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
      console.log('Suspicious content detected:', { ip, data: sanitizedData });
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
    const emailSent = await sendContactNotification(sanitizedData);

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
        console.error('Failed to subscribe to newsletter:', error);
        // 不影响主要流程
      }
    }

    // 记录分析数据
    console.log('Contact form analytics:', {
      submissionId,
      country: sanitizedData.country,
      inquiryType: sanitizedData.inquiryType,
      hasPhone: !!sanitizedData.phone,
      subscribedNewsletter: sanitizedData.subscribeNewsletter,
      timestamp: new Date().toISOString(),
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId,
      emailSent,
    });

  } catch (error) {
    console.error('Contact form API error:', error);
    
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