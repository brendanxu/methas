import { NextRequest, NextResponse } from 'next/server';
import { logSecurityEvent } from '@/lib/form-security';

// 需要安全检查的路径
const PROTECTED_PATHS = [
  '/api/forms/',
  '/api/auth/',
  '/api/admin/',
];

// 速率限制配置
const RATE_LIMITS = {
  '/api/forms/contact': { requests: 5, window: 60 * 60 * 1000 }, // 每小时5次
  '/api/forms/newsletter': { requests: 10, window: 60 * 60 * 1000 }, // 每小时10次
  '/api/forms/download': { requests: 20, window: 60 * 60 * 1000 }, // 每小时20次
  '/api/search': { requests: 100, window: 60 * 1000 }, // 每分钟100次
};

// 简单的内存缓存用于速率限制
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(key: string, limit: number, window: number): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(key);

  if (!record || now > record.resetTime) {
    rateLimitCache.set(key, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// 清理过期的速率限制记录
function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitCache.entries()) {
    if (now > record.resetTime) {
      rateLimitCache.delete(key);
    }
  }
}

// 每5分钟清理一次
setInterval(cleanupRateLimit, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 添加安全头部到所有响应
  const response = NextResponse.next();
  
  // 基本安全头部
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 在生产环境中启用更严格的CSP
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://api.southpole.com https://analytics.google.com; " +
      "frame-ancestors 'none';"
    );
    
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // 检查是否需要保护
  const needsProtection = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  
  if (!needsProtection) {
    return response;
  }

  // 获取客户端IP
  const ip = request.ip || 
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';

  // 检查速率限制
  const rateLimitConfig = Object.entries(RATE_LIMITS).find(([path]) => 
    pathname.startsWith(path)
  );

  if (rateLimitConfig) {
    const [, config] = rateLimitConfig;
    const rateLimitKey = `${ip}:${pathname}`;
    
    if (!checkRateLimit(rateLimitKey, config.requests, config.window)) {
      logSecurityEvent('blocked', ip, {
        reason: 'Rate limit exceeded',
        pathname,
        userAgent: request.headers.get('user-agent'),
      });

      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(config.window / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(config.window / 1000).toString(),
            'X-RateLimit-Limit': config.requests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil((Date.now() + config.window) / 1000).toString(),
          },
        }
      );
    }
  }

  // 对POST请求进行额外的安全检查
  if (request.method === 'POST') {
    // 检查Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      logSecurityEvent('suspicious', ip, {
        reason: 'Invalid content type',
        contentType,
        pathname,
      });

      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Invalid content type',
          code: 'INVALID_CONTENT_TYPE',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 检查请求大小
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
      logSecurityEvent('suspicious', ip, {
        reason: 'Request too large',
        contentLength,
        pathname,
      });

      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Request entity too large',
          code: 'REQUEST_TOO_LARGE',
        }),
        {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 检查User-Agent
    const userAgent = request.headers.get('user-agent');
    if (!userAgent || userAgent.length < 10) {
      logSecurityEvent('suspicious', ip, {
        reason: 'Missing or invalid user agent',
        userAgent,
        pathname,
      });

      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Invalid request',
          code: 'INVALID_USER_AGENT',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 在生产环境中检查Origin
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const allowedOrigins = [
        'https://southpole.com',
        'https://www.southpole.com',
        process.env.NEXT_PUBLIC_SITE_URL,
      ].filter(Boolean);

      if (origin && !allowedOrigins.includes(origin)) {
        logSecurityEvent('blocked', ip, {
          reason: 'Unauthorized origin',
          origin,
          pathname,
        });

        return new NextResponse(
          JSON.stringify({
            success: false,
            error: 'Unauthorized origin',
            code: 'UNAUTHORIZED_ORIGIN',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }
  }

  // 记录正常请求
  logSecurityEvent('allowed', ip, {
    method: request.method,
    pathname,
    userAgent: request.headers.get('user-agent'),
  });

  return response;
}

// 配置中间件匹配路径
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * 1. _next/static (静态文件)
     * 2. _next/image (图像优化文件)
     * 3. favicon.ico (网站图标)
     * 4. 静态资源 (图片、样式、脚本等)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
};