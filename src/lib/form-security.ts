// 表单安全和防护机制
import { NextRequest } from 'next/server';

// 安全配置接口
export interface SecurityConfig {
  enableRateLimit: boolean;
  enableCSRF: boolean;
  enableCaptcha: boolean;
  enableIPBlocking: boolean;
  enableContentFiltering: boolean;
  maxRequestSize: number;
  allowedOrigins: string[];
  blockedIPs: string[];
  honeypotFields: string[];
}

// 默认安全配置
export const defaultSecurityConfig: SecurityConfig = {
  enableRateLimit: true,
  enableCSRF: true,
  enableCaptcha: false, // 在生产环境中应该启用
  enableIPBlocking: true,
  enableContentFiltering: true,
  maxRequestSize: 1024 * 1024, // 1MB
  allowedOrigins: [
    'https://southpole.com',
    'https://www.southpole.com',
    'http://localhost:3000',
  ],
  blockedIPs: [],
  honeypotFields: ['website', 'url', 'homepage'],
};

// 威胁检测结果
export interface ThreatDetectionResult {
  isBlocked: boolean;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  score: number;
}

// IP黑名单管理
class IPBlacklist {
  private blocked = new Set<string>();
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly maxAttempts = 10;
  private readonly timeWindow = 60 * 60 * 1000; // 1 hour

  isBlocked(ip: string): boolean {
    return this.blocked.has(ip);
  }

  recordAttempt(ip: string, isViolation: boolean = false): void {
    const now = Date.now();
    const record = this.attempts.get(ip) || { count: 0, lastAttempt: 0 };

    // 重置计数器如果时间窗口已过
    if (now - record.lastAttempt > this.timeWindow) {
      record.count = 0;
    }

    if (isViolation) {
      record.count += 3; // 违规行为加重计数
    } else {
      record.count += 1;
    }

    record.lastAttempt = now;
    this.attempts.set(ip, record);

    // 如果超过阈值，加入黑名单
    if (record.count >= this.maxAttempts) {
      this.blocked.add(ip);
      console.warn(`IP ${ip} has been blocked due to suspicious activity`);
    }
  }

  unblock(ip: string): void {
    this.blocked.delete(ip);
    this.attempts.delete(ip);
  }

  getStats(): { blockedIPs: number; suspiciousIPs: number } {
    const suspiciousIPs = Array.from(this.attempts.values())
      .filter(record => record.count >= 5).length;

    return {
      blockedIPs: this.blocked.size,
      suspiciousIPs,
    };
  }
}

// 全局IP黑名单实例
export const ipBlacklist = new IPBlacklist();

// 内容过滤器
export class ContentFilter {
  private static readonly spamPatterns = [
    // 明显的垃圾邮件模式
    /\b(viagra|cialis|lottery|winner|congratulations|urgent|act now)\b/gi,
    /\b(click here|visit now|limited time|offer expires|free money)\b/gi,
    /\b(work from home|make money|guaranteed income|no experience)\b/gi,
    
    // SQL注入模式
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b|\bCREATE\b)/gi,
    /(\bOR\s+1\s*=\s*1\b|\bAND\s+1\s*=\s*1\b)/gi,
    /('|\"|;|--|\*|\/\*|\*\/)/g,
    
    // XSS模式
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    
    // 过度重复
    /(.)\1{10,}/g, // 连续重复字符
    /\b(\w+)\s+\1\s+\1\b/gi, // 重复单词
  ];

  private static readonly suspiciousPatterns = [
    // 可疑模式（不一定阻止，但增加威胁分数）
    /https?:\/\/[^\s]+/g, // URL链接
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // 信用卡号模式
    /\b[A-Z]{2,}\b/g, // 全大写单词
    /@[^\s]+\.[^\s]+/g, // 额外的邮箱地址
  ];

  static analyzeContent(content: string): { score: number; flags: string[] } {
    let score = 0;
    const flags: string[] = [];

    // 检查垃圾邮件模式
    for (const pattern of this.spamPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        score += matches.length * 10;
        flags.push(`Spam pattern detected: ${pattern.source}`);
      }
    }

    // 检查可疑模式
    for (const pattern of this.suspiciousPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        score += matches.length * 3;
        flags.push(`Suspicious pattern: ${pattern.source}`);
      }
    }

    // 长度检查
    if (content.length > 5000) {
      score += 5;
      flags.push('Content too long');
    }

    // 字符多样性检查
    const uniqueChars = new Set(content.toLowerCase()).size;
    const diversity = uniqueChars / content.length;
    if (diversity < 0.1) {
      score += 8;
      flags.push('Low character diversity');
    }

    return { score, flags };
  }
}

// CSRF保护
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  static generateToken(sessionId: string): string {
    const token = Buffer.from(`${sessionId}:${Date.now()}:${Math.random()}`).toString('base64url');
    const expires = Date.now() + 60 * 60 * 1000; // 1小时

    this.tokens.set(sessionId, { token, expires });
    
    // 清理过期token
    this.cleanup();
    
    return token;
  }

  static validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expires) {
      this.tokens.delete(sessionId);
      return false;
    }

    return stored.token === token;
  }

  private static cleanup(): void {
    const now = Date.now();
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now > data.expires) {
        this.tokens.delete(sessionId);
      }
    }
  }
}

// 蜜罐字段检测
export function detectHoneypot(formData: Record<string, unknown>, honeypotFields: string[]): boolean {
  for (const field of honeypotFields) {
    if (formData[field] && String(formData[field]).trim()) {
      return true; // 蜜罐字段被填充，可能是机器人
    }
  }
  return false;
}

// 用户代理分析
export function analyzeUserAgent(userAgent: string): { score: number; flags: string[] } {
  let score = 0;
  const flags: string[] = [];

  if (!userAgent || userAgent.length < 10) {
    score += 15;
    flags.push('Missing or too short user agent');
    return { score, flags };
  }

  const suspiciousPatterns = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|java|go-http/i,
    /^Mozilla\/5\.0$/i, // 过于简单的UA
    /(\d+\.){3,}/i, // 包含过多版本号
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      score += 8;
      flags.push(`Suspicious user agent pattern: ${pattern.source}`);
    }
  }

  // 检查是否是已知的正常浏览器
  const validBrowsers = /chrome|firefox|safari|edge|opera/i;
  if (!validBrowsers.test(userAgent)) {
    score += 5;
    flags.push('Unknown browser');
  }

  return { score, flags };
}

// 请求频率分析
class RequestFrequencyAnalyzer {
  private requests = new Map<string, number[]>();
  private readonly windowSize = 60 * 1000; // 1分钟窗口
  private readonly maxRequests = 30; // 每分钟最大请求数

  recordRequest(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // 清理过期请求
    const recentRequests = requests.filter(timestamp => now - timestamp < this.windowSize);
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return recentRequests.length <= this.maxRequests;
  }

  getRequestCount(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    return requests.filter(timestamp => now - timestamp < this.windowSize).length;
  }
}

export const requestFrequencyAnalyzer = new RequestFrequencyAnalyzer();

// 威胁检测主函数
export function detectThreats(
  request: NextRequest,
  formData: Record<string, unknown>,
  config: SecurityConfig = defaultSecurityConfig
): ThreatDetectionResult {
  let score = 0;
  const reasons: string[] = [];

  // 获取客户端信息
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const userAgent = request.headers.get('user-agent') || '';
  const origin = request.headers.get('origin') || '';
  // const referer = request.headers.get('referer') || ''; // 在需要时启用

  // IP黑名单检查
  if (config.enableIPBlocking && ipBlacklist.isBlocked(ip)) {
    return {
      isBlocked: true,
      threatLevel: 'critical',
      reasons: ['IP address is blacklisted'],
      score: 100,
    };
  }

  // Origin检查
  if (config.allowedOrigins.length > 0 && origin) {
    try {
      const originUrl = new URL(origin);
      const isAllowed = config.allowedOrigins.some(allowed => {
        const allowedUrl = new URL(allowed);
        return originUrl.hostname === allowedUrl.hostname;
      });
      
      if (!isAllowed) {
        score += 20;
        reasons.push('Request from unauthorized origin');
      }
    } catch {
      score += 15;
      reasons.push('Invalid origin header');
    }
  }

  // User Agent分析
  const uaAnalysis = analyzeUserAgent(userAgent);
  score += uaAnalysis.score;
  reasons.push(...uaAnalysis.flags);

  // 蜜罐字段检测
  if (detectHoneypot(formData, config.honeypotFields)) {
    score += 50;
    reasons.push('Honeypot field filled (bot detected)');
  }

  // 内容过滤
  if (config.enableContentFiltering) {
    const allContent = Object.values(formData)
      .filter(value => typeof value === 'string')
      .join(' ');
    
    const contentAnalysis = ContentFilter.analyzeContent(allContent);
    score += contentAnalysis.score;
    reasons.push(...contentAnalysis.flags);
  }

  // 请求频率检查
  if (!requestFrequencyAnalyzer.recordRequest(ip)) {
    score += 25;
    reasons.push('Request frequency too high');
  }

  // 请求大小检查
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > config.maxRequestSize) {
    score += 20;
    reasons.push('Request size exceeds limit');
  }

  // 确定威胁级别
  let threatLevel: ThreatDetectionResult['threatLevel'] = 'low';
  let isBlocked = false;

  if (score >= 50) {
    threatLevel = 'critical';
    isBlocked = true;
  } else if (score >= 30) {
    threatLevel = 'high';
    isBlocked = true;
  } else if (score >= 15) {
    threatLevel = 'medium';
  }

  // 记录可疑活动
  if (score >= 15) {
    ipBlacklist.recordAttempt(ip, score >= 30);
    console.warn(`Suspicious activity detected from ${ip}:`, {
      score,
      threatLevel,
      reasons,
      userAgent,
      origin,
    });
  }

  return {
    isBlocked,
    threatLevel,
    reasons: reasons.slice(0, 5), // 限制原因数量
    score: Math.min(score, 100), // 限制分数上限
  };
}

// 安全响应生成器
export function createSecurityResponse(result: ThreatDetectionResult): Response {
  const statusCode = result.threatLevel === 'critical' ? 403 : 429;
  
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Security check failed',
      code: 'SECURITY_VIOLATION',
      threatLevel: result.threatLevel,
      blocked: result.isBlocked,
      // 在生产环境中不应该暴露详细的原因
      ...(process.env.NODE_ENV === 'development' && { reasons: result.reasons }),
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
      },
    }
  );
}

// 安全日志记录
export function logSecurityEvent(
  type: 'blocked' | 'suspicious' | 'allowed',
  ip: string,
  details: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type,
    ip,
    details,
    environment: process.env.NODE_ENV,
  };

  // 在生产环境中，应该发送到安全监控系统
  if (type === 'blocked' || type === 'suspicious') {
    console.warn('Security Event:', logEntry);
  } else {
    // Debug log removed for production
  }

  // 在生产环境中集成SIEM系统
  if (process.env.NODE_ENV === 'production') {
    // 发送到安全信息和事件管理(SIEM)系统
    // 例如：Splunk, ELK Stack, DataDog 等
  }
}

// 获取安全统计信息
export function getSecurityStats(): {
  blacklistedIPs: number;
  suspiciousIPs: number;
  requestsAnalyzed: number;
  threatsBlocked: number;
} {
  const ipStats = ipBlacklist.getStats();
  
  return {
    blacklistedIPs: ipStats.blockedIPs,
    suspiciousIPs: ipStats.suspiciousIPs,
    requestsAnalyzed: 0, // 这里需要实际的统计实现
    threatsBlocked: 0, // 这里需要实际的统计实现
  };
}