import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateDownloadForm, sanitizeFormData, type DownloadFormData } from '@/lib/form-validation';

// 速率限制配置 - 每个IP每小时最多20次下载
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

// 下载记录接口
interface DownloadRecord extends DownloadFormData {
  id: string;
  downloadedAt: string;
  resourceId?: string;
  resourceName: string;
  downloadUrl: string;
  downloadCount: number;
  lastDownloadAt: string;
  userAgent?: string;
  ip: string;
}

// 资源配置接口
interface ResourceConfig {
  id: string;
  name: string;
  type: string;
  filePath: string;
  fileSize: number;
  description: string;
  requiresAuth: boolean;
  downloadLimit?: number;
  expiryDays?: number;
}

// 模拟资源配置
const resourceConfigs: Record<string, ResourceConfig> = {
  'carbon-footprint-guide': {
    id: 'carbon-footprint-guide',
    name: '碳足迹评估指南',
    type: 'guide',
    filePath: '/resources/carbon-footprint-assessment-guide.pdf',
    fileSize: 2500000, // 2.5MB
    description: '详细的碳足迹评估方法和最佳实践指南',
    requiresAuth: false,
    downloadLimit: 5, // 同一用户最多下载5次
    expiryDays: 30, // 30天后链接过期
  },
  'esg-reporting-template': {
    id: 'esg-reporting-template',
    name: 'ESG报告模板',
    type: 'template',
    filePath: '/resources/esg-reporting-template.xlsx',
    fileSize: 1200000, // 1.2MB
    description: 'ESG报告标准模板，包含所有必要指标',
    requiresAuth: false,
    downloadLimit: 3,
    expiryDays: 7,
  },
  'sustainability-whitepaper': {
    id: 'sustainability-whitepaper',
    name: '可持续发展白皮书',
    type: 'whitepaper',
    filePath: '/resources/sustainability-whitepaper-2024.pdf',
    fileSize: 4800000, // 4.8MB
    description: '2024年可持续发展趋势和解决方案白皮书',
    requiresAuth: false,
    downloadLimit: 10,
    expiryDays: 60,
  },
};

// 模拟下载记录数据库
const downloadRecords = new Map<string, DownloadRecord>();

// 生成安全的下载链接
function generateDownloadUrl(resourceId: string, userEmail: string): string {
  const timestamp = Date.now();
  const token = Buffer.from(`${resourceId}:${userEmail}:${timestamp}`).toString('base64url');
  return `/api/forms/download/file?token=${token}&id=${resourceId}`;
}

// 验证下载权限
function validateDownloadPermission(email: string, resourceId: string): { allowed: boolean; reason?: string } {
  const userDownloads = Array.from(downloadRecords.values())
    .filter(record => record.email === email && record.resourceId === resourceId);

  const config = resourceConfigs[resourceId];
  if (!config) {
    return { allowed: false, reason: 'Resource not found' };
  }

  if (config.downloadLimit && userDownloads.length >= config.downloadLimit) {
    return { allowed: false, reason: 'Download limit exceeded' };
  }

  return { allowed: true };
}

// 记录下载活动
async function recordDownloadActivity(data: DownloadFormData, resourceInfo: { id?: string; name: string }, ip: string, userAgent?: string): Promise<DownloadRecord> {
  const recordId = `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const downloadUrl = generateDownloadUrl(resourceInfo.id || 'default', data.email);

  const record: DownloadRecord = {
    id: recordId,
    firstName: data.firstName,
    lastName: data.lastName,
    company: data.company,
    email: data.email,
    resourceType: data.resourceType,
    agreeToMarketing: data.agreeToMarketing,
    downloadedAt: new Date().toISOString(),
    resourceId: resourceInfo.id,
    resourceName: resourceInfo.name,
    downloadUrl,
    downloadCount: 1,
    lastDownloadAt: new Date().toISOString(),
    userAgent,
    ip,
  };

  // 检查是否已有相同用户的下载记录
  const existingKey = `${data.email}:${resourceInfo.id || 'default'}`;
  const existing = downloadRecords.get(existingKey);

  if (existing) {
    existing.downloadCount++;
    existing.lastDownloadAt = new Date().toISOString();
    downloadRecords.set(existingKey, existing);
    return existing;
  } else {
    downloadRecords.set(existingKey, record);
    return record;
  }
}

// 发送下载通知邮件
async function sendDownloadNotification(data: DownloadFormData, resourceName: string, downloadUrl: string): Promise<boolean> {
  try {
    console.log('Sending download notification:', {
      to: data.email,
      resource: resourceName,
      timestamp: new Date().toISOString(),
    });

//     // const emailContent = { // 在生产环境中启用
//       to: data.email,
//       subject: `您的资源下载链接 - ${resourceName}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #2563eb;">感谢您下载我们的资源！</h2>
//           <p>您好 ${data.firstName}，</p>
//           <p>感谢您对我们资源的关注。您请求的 <strong>${resourceName}</strong> 下载链接如下：</p>
//           
//           <div style="text-align: center; margin: 30px 0;">
//             <a href="${downloadUrl}" 
//                style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
//               立即下载
//             </a>
//           </div>
//           
//           <p>或者，您也可以复制以下链接到浏览器中打开：</p>
//           <p style="word-break: break-all; color: #666;">${downloadUrl}</p>
//           
//           <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
//             <p style="margin: 0; font-size: 14px; color: #666;">
//               <strong>注意：</strong>此下载链接将在30天后过期。如需重新下载，请重新提交表单。
//             </p>
//           </div>
// 
//           ${data.agreeToMarketing ? `
//             <p>由于您同意接收我们的营销信息，我们会定期向您发送相关的产品更新和行业洞察。</p>
//           ` : ''}
//           
//           <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
//           <p style="font-size: 12px; color: #666;">
//             如果您在下载过程中遇到任何问题，请联系我们：<br>
//             邮箱：support@southpole.com<br>
//             电话：+86-400-123-4567<br><br>
//             South Pole - 专业的碳中和解决方案提供商
//           </p>
//         </div>
//       `,
//     // };
// 
    // 模拟邮件发送延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    return true;
  } catch (error) {
    console.error('Failed to send download notification:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端信息
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const userAgent = request.headers.get('user-agent') || undefined;

    // 速率限制检查
    try {
      await limiter.check(20, ip); // 每小时20次
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many download requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    // 解析请求体
    let body: DownloadFormData & { resourceId?: string; resourceName?: string };
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
    const sanitizedData: DownloadFormData = {
      firstName: sanitizeFormData.text(body.firstName || ''),
      lastName: sanitizeFormData.text(body.lastName || ''),
      company: sanitizeFormData.text(body.company || ''),
      email: sanitizeFormData.email(body.email || ''),
      resourceType: body.resourceType || '',
      agreeToMarketing: Boolean(body.agreeToMarketing),
    };

    // 服务器端验证
    const formValidation = validateDownloadForm(sanitizedData);
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

    // 获取资源信息
    const resourceId = body.resourceId;
    const resourceName = body.resourceName || sanitizedData.resourceType;
    
    let resourceConfig: ResourceConfig | undefined;
    if (resourceId) {
      resourceConfig = resourceConfigs[resourceId];
      if (!resourceConfig) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Requested resource not found',
            code: 'RESOURCE_NOT_FOUND'
          },
          { status: 404 }
        );
      }
    }

    // 验证下载权限
    if (resourceId) {
      const permission = validateDownloadPermission(sanitizedData.email, resourceId);
      if (!permission.allowed) {
        return NextResponse.json(
          { 
            success: false, 
            error: permission.reason || 'Download not allowed',
            code: 'DOWNLOAD_DENIED'
          },
          { status: 403 }
        );
      }
    }

    // 反垃圾检查
    const suspiciousPatterns = [
      /\b(test|fake|spam|robot|bot|temp)\b/i,
      /\b\d{10,}\b/, // 包含长数字串
    ];

    const textToCheck = `${sanitizedData.company} ${sanitizedData.firstName} ${sanitizedData.lastName}`;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(textToCheck));

    if (isSuspicious) {
      console.log('Suspicious download request detected:', { ip, data: sanitizedData });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Request validation failed',
          code: 'SUSPICIOUS_REQUEST'
        },
        { status: 400 }
      );
    }

    // 记录下载活动
    const downloadRecord = await recordDownloadActivity(
      sanitizedData,
      { id: resourceId, name: resourceName },
      ip,
      userAgent
    );

    // 生成下载URL
    const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${downloadRecord.downloadUrl}`;

    // 发送下载链接邮件
    const emailSent = await sendDownloadNotification(sanitizedData, resourceName, downloadUrl);

    // 如果用户同意营销，可以添加到营销列表
    if (sanitizedData.agreeToMarketing) {
      try {
        await fetch('/api/forms/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: sanitizedData.email,
            firstName: sanitizedData.firstName,
            source: 'download-form',
            preferences: ['product-updates', 'research'],
          }),
        });
      } catch (error) {
        console.error('Failed to add to marketing list:', error);
        // 不影响主要流程
      }
    }

    // 记录分析数据
    console.log('Download request analytics:', {
      downloadId: downloadRecord.id,
      resourceId: resourceId || 'custom',
      resourceType: sanitizedData.resourceType,
      company: sanitizedData.company,
      agreeToMarketing: sanitizedData.agreeToMarketing,
      isRepeatDownload: downloadRecord.downloadCount > 1,
      timestamp: new Date().toISOString(),
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Download request processed successfully',
      downloadId: downloadRecord.id,
      downloadUrl,
      resourceName,
      emailSent,
      expiresAt: resourceConfig ? 
        new Date(Date.now() + (resourceConfig.expiryDays || 30) * 24 * 60 * 60 * 1000).toISOString() : 
        undefined,
    });

  } catch (error) {
    console.error('Download form API error:', error);
    
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

// 文件下载端点
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const resourceId = url.searchParams.get('id');

    if (!token || !resourceId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters',
          code: 'MISSING_PARAMS'
        },
        { status: 400 }
      );
    }

    // 验证token
    try {
      const decoded = Buffer.from(token, 'base64url').toString();
      const [tokenResourceId, _email, timestamp] = decoded.split(':');
      
      if (tokenResourceId !== resourceId) {
        throw new Error('Resource ID mismatch');
      }

      // 检查token是否过期（30天）
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30天
      
      if (tokenAge > maxAge) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Download link has expired',
            code: 'EXPIRED_TOKEN'
          },
          { status: 410 }
        );
      }

    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid download token',
          code: 'INVALID_TOKEN'
        },
        { status: 400 }
      );
    }

    // 获取资源配置
    const resourceConfig = resourceConfigs[resourceId];
    if (!resourceConfig) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // 在实际环境中，这里应该：
    // 1. 从文件系统或云存储读取文件
    // 2. 设置正确的Content-Type和Content-Disposition headers
    // 3. 流式传输文件内容

    // 模拟文件下载
    console.log('File download:', {
      resourceId,
      fileName: resourceConfig.name,
      fileSize: resourceConfig.fileSize,
      timestamp: new Date().toISOString(),
    });

    // 返回重定向到实际文件或者文件内容
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${resourceConfig.filePath}`
    );

  } catch (error) {
    console.error('File download error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Download failed',
        code: 'DOWNLOAD_ERROR'
      },
      { status: 500 }
    );
  }
}

// 获取下载统计
export async function PUT(_request: NextRequest) {
  try {
    const stats = {
      totalDownloads: downloadRecords.size,
      downloadsByType: {} as Record<string, number>,
      downloadsByCompany: {} as Record<string, number>,
      recentDownloads: Array.from(downloadRecords.values())
        .sort((a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime())
        .slice(0, 10)
        .map(record => ({
          id: record.id,
          resourceName: record.resourceName,
          company: record.company,
          downloadedAt: record.downloadedAt,
        })),
    };

    // 统计按类型分布
    for (const record of downloadRecords.values()) {
      stats.downloadsByType[record.resourceType] = (stats.downloadsByType[record.resourceType] || 0) + 1;
      stats.downloadsByCompany[record.company] = (stats.downloadsByCompany[record.company] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Download stats error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get stats',
        code: 'STATS_ERROR'
      },
      { status: 500 }
    );
  }
}