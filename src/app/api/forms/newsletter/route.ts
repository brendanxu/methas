import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateNewsletterForm, sanitizeFormData, type NewsletterFormData } from '@/lib/form-validation';

// 速率限制配置 - 每个IP每小时最多10次订阅
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

// 订阅者数据存储接口
interface SubscriberData extends NewsletterFormData {
  id: string;
  subscribedAt: string;
  source: string;
  status: 'active' | 'pending' | 'unsubscribed';
  confirmationToken?: string;
  lastUpdated: string;
}

// 模拟订阅者数据库
const subscribers = new Map<string, SubscriberData>();

// 发送确认邮件函数（模拟）
async function sendConfirmationEmail(data: NewsletterFormData, confirmationToken: string): Promise<boolean> {
  try {
    console.log('Sending confirmation email:', {
      to: data.email,
      name: data.firstName,
      token: confirmationToken,
      timestamp: new Date().toISOString(),
    });

    // 在实际环境中，这里应该发送确认邮件
    const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/confirm?token=${confirmationToken}`;
    
//     // const emailContent = { // 在生产环境中启用
//       to: data.email,
//       subject: '确认您的Newsletter订阅 - South Pole',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #2563eb;">感谢您订阅South Pole Newsletter！</h2>
//           ${data.firstName ? `<p>您好 ${data.firstName}，</p>` : '<p>您好，</p>'}
//           <p>感谢您订阅我们的Newsletter。为了确保您能收到我们的最新资讯，请点击下面的链接确认您的订阅：</p>
//           <div style="text-align: center; margin: 30px 0;">
//             <a href="${confirmationUrl}" 
//                style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
//               确认订阅
//             </a>
//           </div>
//           <p>或者，您也可以复制以下链接到浏览器中打开：</p>
//           <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
//           
//           ${data.preferences && data.preferences.length > 0 ? `
//             <p><strong>您选择的订阅内容：</strong></p>
//             <ul>
//               ${data.preferences.map(pref => `<li>${getPreferenceLabel(pref)}</li>`).join('')}
//             </ul>
//           ` : ''}
//           
//           <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
//           <p style="font-size: 12px; color: #666;">
//             如果您没有订阅我们的Newsletter，请忽略此邮件。<br>
//             South Pole - 专业的碳中和解决方案提供商<br>
//             <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(data.email)}">取消订阅</a>
//           </p>
//         </div>
//       `,
//     // };

    // 模拟邮件发送延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

// 获取偏好标签
function getPreferenceLabel(value: string): string {
  const preferences = {
    'climate-news': '气候新闻',
    'industry-insights': '行业洞察',
    'product-updates': '产品更新',
    'events': '活动邀请',
    'research': '研究报告',
  };
  return preferences[value as keyof typeof preferences] || value;
}

// 保存订阅者信息
async function saveSubscriber(data: NewsletterFormData, source: string = 'direct'): Promise<SubscriberData> {
  const subscriberId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const confirmationToken = `conf_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  
  const subscriber: SubscriberData = {
    id: subscriberId,
    email: data.email,
    firstName: data.firstName,
    preferences: data.preferences || [],
    subscribedAt: new Date().toISOString(),
    source,
    status: 'pending', // 需要邮件确认
    confirmationToken,
    lastUpdated: new Date().toISOString(),
  };

  // 保存到模拟数据库
  subscribers.set(data.email, subscriber);

  console.log('Subscriber saved:', {
    id: subscriberId,
    email: data.email,
    source,
    timestamp: new Date().toISOString(),
  });

  return subscriber;
}

// 检查是否已订阅
function checkExistingSubscription(email: string): SubscriberData | null {
  return subscribers.get(email) || null;
}

// 更新订阅者偏好
async function updateSubscriberPreferences(email: string, preferences: string[]): Promise<boolean> {
  const subscriber = subscribers.get(email);
  if (!subscriber) {
    return false;
  }

  subscriber.preferences = preferences;
  subscriber.lastUpdated = new Date().toISOString();
  subscribers.set(email, subscriber);

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // 速率限制检查
    try {
      await limiter.check(10, ip); // 每小时10次
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many subscription requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    // 解析请求体
    let body: NewsletterFormData & { source?: string };
    try {
      body = await request.json();
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

    // 数据清理
    const sanitizedData: NewsletterFormData = {
      email: sanitizeFormData.email(body.email || ''),
      firstName: body.firstName ? sanitizeFormData.text(body.firstName) : undefined,
      preferences: body.preferences || [],
    };

    // 服务器端验证
    const formValidation = validateNewsletterForm(sanitizedData);
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

    // 检查是否已订阅
    const existingSubscriber = checkExistingSubscription(sanitizedData.email);
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        // 如果已经是活跃订阅者，更新偏好
        await updateSubscriberPreferences(sanitizedData.email, sanitizedData.preferences || []);
        
        return NextResponse.json({
          success: true,
          message: 'Subscription preferences updated successfully',
          isUpdate: true,
          status: 'active',
        });
      } else if (existingSubscriber.status === 'pending') {
        // 如果是待确认状态，重新发送确认邮件
        const emailSent = await sendConfirmationEmail(sanitizedData, existingSubscriber.confirmationToken!);
        
        return NextResponse.json({
          success: true,
          message: 'Confirmation email resent successfully',
          isResend: true,
          status: 'pending',
          emailSent,
        });
      }
    }

    // 反垃圾邮件检查
    const suspiciousPatterns = [
      /\b(test|fake|spam|robot|bot)\b/i,
      /\+.*\+/, // 包含多个+号的邮箱
      /\.{2,}/, // 连续点号
    ];

    const emailToCheck = sanitizedData.email.toLowerCase();
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(emailToCheck));

    if (isSuspicious) {
      console.log('Suspicious email detected:', { ip, email: sanitizedData.email });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email validation failed',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    // 保存新订阅者
    const subscriber = await saveSubscriber(sanitizedData, body.source || 'direct');

    // 发送确认邮件
    const emailSent = await sendConfirmationEmail(sanitizedData, subscriber.confirmationToken!);

    // 记录分析数据
    console.log('Newsletter subscription analytics:', {
      subscriberId: subscriber.id,
      source: body.source || 'direct',
      hasName: !!sanitizedData.firstName,
      preferencesCount: sanitizedData.preferences?.length || 0,
      timestamp: new Date().toISOString(),
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Newsletter subscription successful. Please check your email to confirm.',
      subscriberId: subscriber.id,
      status: 'pending',
      emailSent,
      confirmationRequired: true,
    });

  } catch (error) {
    console.error('Newsletter subscription API error:', error);
    
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

// 确认订阅端点
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Confirmation token required',
          code: 'MISSING_TOKEN'
        },
        { status: 400 }
      );
    }

    // 查找对应的订阅者
    let foundSubscriber: SubscriberData | null = null;
    for (const subscriber of subscribers.values()) {
      if (subscriber.confirmationToken === token && subscriber.status === 'pending') {
        foundSubscriber = subscriber;
        break;
      }
    }

    if (!foundSubscriber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or expired confirmation token',
          code: 'INVALID_TOKEN'
        },
        { status: 400 }
      );
    }

    // 激活订阅
    foundSubscriber.status = 'active';
    foundSubscriber.confirmationToken = undefined;
    foundSubscriber.lastUpdated = new Date().toISOString();
    subscribers.set(foundSubscriber.email, foundSubscriber);

    console.log('Newsletter subscription confirmed:', {
      subscriberId: foundSubscriber.id,
      email: foundSubscriber.email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Newsletter subscription confirmed successfully',
      subscriberId: foundSubscriber.id,
      status: 'active',
    });

  } catch (error) {
    console.error('Newsletter confirmation API error:', error);
    
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

// 取消订阅端点
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email address required',
          code: 'MISSING_EMAIL'
        },
        { status: 400 }
      );
    }

    const subscriber = subscribers.get(email);
    if (!subscriber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Subscriber not found',
          code: 'SUBSCRIBER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // 标记为取消订阅
    subscriber.status = 'unsubscribed';
    subscriber.lastUpdated = new Date().toISOString();
    subscribers.set(email, subscriber);

    console.log('Newsletter unsubscription:', {
      subscriberId: subscriber.id,
      email: subscriber.email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      subscriberId: subscriber.id,
      status: 'unsubscribed',
    });

  } catch (error) {
    console.error('Newsletter unsubscription API error:', error);
    
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
  const stats = {
    totalSubscribers: subscribers.size,
    activeSubscribers: Array.from(subscribers.values()).filter(s => s.status === 'active').length,
    pendingSubscribers: Array.from(subscribers.values()).filter(s => s.status === 'pending').length,
  };

  return NextResponse.json({ 
    status: 'ok', 
    endpoint: 'newsletter',
    stats,
    timestamp: new Date().toISOString()
  });
}