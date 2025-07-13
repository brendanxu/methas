import { NextRequest, NextResponse } from 'next/server';
import { createApiHandler, validateRequestBody, createApiError } from '@/middleware/errorHandler';
import { logger } from '@/lib/logger';

interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// 验证错误报告格式
function isValidErrorReport(data: any): data is ErrorReport {
  return (
    typeof data === 'object' &&
    typeof data.errorId === 'string' &&
    typeof data.message === 'string' &&
    typeof data.url === 'string' &&
    typeof data.userAgent === 'string' &&
    typeof data.timestamp === 'string'
  );
}

async function handleErrorReport(request: NextRequest) {
  // 验证请求体
  const errorReport = await validateRequestBody(request, isValidErrorReport);

  // 记录错误到日志系统
  logger.error('Client Error Report', new Error(errorReport.message), {
    errorId: errorReport.errorId,
    url: errorReport.url,
    userAgent: errorReport.userAgent,
    componentStack: errorReport.componentStack,
    metadata: errorReport.metadata,
    reportedAt: errorReport.timestamp,
  });

  // 这里可以将错误保存到数据库
  // await saveErrorToDatabase(errorReport);

  // 发送到外部错误追踪服务
  await Promise.allSettled([
    sendToSentry(errorReport),
    sendToSlack(errorReport),
    // sendToDatadog(errorReport),
    // sendToBugsnag(errorReport),
  ]);

  // 检查是否是严重错误，需要立即通知
  if (isCriticalError(errorReport)) {
    await sendCriticalErrorAlert(errorReport);
  }

  return NextResponse.json({
    success: true,
    errorId: errorReport.errorId,
    message: 'Error report received and processed',
  });
}

// 发送到Sentry
async function sendToSentry(errorReport: ErrorReport) {
  try {
    // 如果Sentry已初始化，直接使用
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.withScope((scope: any) => {
        scope.setTag('source', 'error-report-api');
        scope.setLevel('error');
        scope.setContext('errorReport', errorReport);
        (window as any).Sentry.captureException(new Error(errorReport.message));
      });
    } else {
      // 服务端发送到Sentry
      const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
      if (sentryDsn) {
        // 使用Sentry的HTTP API
        const sentryUrl = `https://sentry.io/api/0/projects/${process.env.SENTRY_PROJECT_ID}/store/`;
        
        await fetch(sentryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${process.env.SENTRY_KEY}`,
          },
          body: JSON.stringify({
            platform: 'javascript',
            sdk: { name: 'custom-error-reporter', version: '1.0.0' },
            timestamp: errorReport.timestamp,
            level: 'error',
            logger: 'error-api',
            message: {
              message: errorReport.message,
            },
            extra: {
              errorId: errorReport.errorId,
              componentStack: errorReport.componentStack,
              metadata: errorReport.metadata,
            },
            tags: {
              source: 'api-error-report',
            },
            request: {
              url: errorReport.url,
              headers: {
                'User-Agent': errorReport.userAgent,
              },
            },
          }),
        });
      }
    }
  } catch (error) {
    logger.error('Failed to send error to Sentry', error instanceof Error ? error : new Error(String(error)));
  }
}

// 发送到Slack
async function sendToSlack(errorReport: ErrorReport) {
  try {
    const slackWebhookUrl = process.env.SLACK_ERROR_WEBHOOK_URL;
    if (!slackWebhookUrl) return;

    const severity = getSeverityLevel(errorReport);
    const color = severity === 'critical' ? 'danger' : severity === 'high' ? 'warning' : 'good';

    await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🐛 客户端错误报告`,
        attachments: [{
          color,
          fields: [
            { title: '错误ID', value: errorReport.errorId, short: true },
            { title: '严重程度', value: severity.toUpperCase(), short: true },
            { title: '错误信息', value: errorReport.message, short: false },
            { title: '页面URL', value: errorReport.url, short: false },
            { title: '时间', value: new Date(errorReport.timestamp).toLocaleString('zh-CN'), short: true },
            { title: '用户代理', value: errorReport.userAgent, short: false },
          ],
        }],
      }),
    });
  } catch (error) {
    logger.error('Failed to send error to Slack', error instanceof Error ? error : new Error(String(error)));
  }
}

// 判断错误严重程度
function getSeverityLevel(errorReport: ErrorReport): 'low' | 'medium' | 'high' | 'critical' {
  const message = errorReport.message.toLowerCase();
  
  // 关键错误
  if (message.includes('security') || 
      message.includes('unauthorized') || 
      message.includes('payment') ||
      message.includes('data loss')) {
    return 'critical';
  }
  
  // 高优先级错误
  if (message.includes('api') || 
      message.includes('server') || 
      message.includes('network') ||
      message.includes('database')) {
    return 'high';
  }
  
  // 中等优先级错误
  if (message.includes('ui') || 
      message.includes('render') || 
      message.includes('component')) {
    return 'medium';
  }
  
  return 'low';
}

// 判断是否为严重错误
function isCriticalError(errorReport: ErrorReport): boolean {
  return getSeverityLevel(errorReport) === 'critical';
}

// 发送严重错误告警
async function sendCriticalErrorAlert(errorReport: ErrorReport) {
  try {
    // 发送邮件通知
    const emailApiUrl = process.env.EMAIL_API_URL;
    if (emailApiUrl) {
      await fetch(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.CRITICAL_ERROR_EMAIL,
          subject: `🚨 严重错误告警 - ${errorReport.errorId}`,
          html: `
            <h2>严重错误告警</h2>
            <p><strong>错误ID:</strong> ${errorReport.errorId}</p>
            <p><strong>错误信息:</strong> ${errorReport.message}</p>
            <p><strong>页面URL:</strong> ${errorReport.url}</p>
            <p><strong>时间:</strong> ${new Date(errorReport.timestamp).toLocaleString('zh-CN')}</p>
            <p><strong>用户代理:</strong> ${errorReport.userAgent}</p>
            ${errorReport.stack ? `<pre><strong>堆栈信息:</strong>\n${errorReport.stack}</pre>` : ''}
          `,
        }),
      });
    }

    // 发送短信通知（如果配置了）
    const smsApiUrl = process.env.SMS_API_URL;
    if (smsApiUrl) {
      await fetch(smsApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.CRITICAL_ERROR_PHONE,
          message: `严重错误告警: ${errorReport.message.substring(0, 50)}... 错误ID: ${errorReport.errorId}`,
        }),
      });
    }
  } catch (error) {
    logger.error('Failed to send critical error alert', error instanceof Error ? error : new Error(String(error)));
  }
}

// GET方法 - 获取错误统计信息
async function handleGetErrors(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || '24h';
  const severity = searchParams.get('severity');
  
  // 这里应该从数据库获取真实的错误统计
  // const stats = await getErrorStats(timeRange, severity);
  
  // 模拟数据
  const stats = {
    total: 45,
    by_severity: {
      critical: 2,
      high: 8,
      medium: 15,
      low: 20,
    },
    by_type: {
      client: 25,
      server: 12,
      network: 8,
    },
    recent_errors: [
      {
        id: 'error-001',
        message: 'Failed to fetch user data',
        severity: 'high',
        timestamp: new Date().toISOString(),
        url: '/dashboard',
      },
      {
        id: 'error-002',
        message: 'Component render error',
        severity: 'medium',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        url: '/profile',
      },
    ],
  };
  
  return NextResponse.json({
    success: true,
    data: stats,
  });
}

// 主处理函数
async function handler(request: NextRequest) {
  switch (request.method) {
    case 'POST':
      return handleErrorReport(request);
    case 'GET':
      return handleGetErrors(request);
    default:
      throw createApiError('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }
}

// 导出处理函数
export const POST = createApiHandler(handler);
export const GET = createApiHandler(handler);