// 搜索输入验证和清理
export interface ValidationResult {
  isValid: boolean;
  cleanedQuery: string;
  errors: string[];
}

// 危险字符模式
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script标签
  /javascript:/gi, // JavaScript协议
  /vbscript:/gi, // VBScript协议
  /on\w+\s*=/gi, // 事件处理器
  /expression\s*\(/gi, // CSS表达式
];

// SQL注入模式
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
  /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
  /('|(\\x27)|(\\x2D\\x2D)|(%27)|(%2D%2D))/gi,
];

// 过度重复字符模式
const SPAM_PATTERNS = [
  /(.)\1{10,}/, // 同一字符重复超过10次
  /\s{5,}/, // 连续超过5个空格
];

export function validateSearchQuery(query: string): ValidationResult {
  const errors: string[] = [];
  let cleanedQuery = query;

  // 基础验证
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      cleanedQuery: '',
      errors: ['搜索查询不能为空'],
    };
  }

  // 长度验证
  if (query.length > 200) {
    errors.push('搜索查询过长，请控制在200字符以内');
    cleanedQuery = query.substring(0, 200);
  }

  if (query.trim().length < 1) {
    return {
      isValid: false,
      cleanedQuery: '',
      errors: ['搜索查询不能为空'],
    };
  }

  // 检查危险模式
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(cleanedQuery)) {
      errors.push('搜索查询包含不安全的内容');
      cleanedQuery = cleanedQuery.replace(pattern, '');
    }
  }

  // 检查SQL注入
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(cleanedQuery)) {
      errors.push('搜索查询包含不安全的字符');
      cleanedQuery = cleanedQuery.replace(pattern, '');
    }
  }

  // 检查垃圾内容
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(cleanedQuery)) {
      cleanedQuery = cleanedQuery.replace(pattern, ' ');
    }
  }

  // 清理HTML标签
  cleanedQuery = cleanedQuery.replace(/<[^>]*>/g, '');

  // 标准化空白字符
  cleanedQuery = cleanedQuery.replace(/\s+/g, ' ').trim();

  // 移除特殊Unicode字符（保留中文、英文、数字、常用标点）
  cleanedQuery = cleanedQuery.replace(/[^\u4e00-\u9fff\u3400-\u4dbf\w\s.,!?;:()\-+@#$%&*]/g, '');

  // 最终长度检查
  if (cleanedQuery.length === 0) {
    return {
      isValid: false,
      cleanedQuery: '',
      errors: ['搜索查询无效'],
    };
  }

  return {
    isValid: errors.length === 0 || (errors.length > 0 && cleanedQuery.length > 0),
    cleanedQuery,
    errors,
  };
}

// 搜索建议清理
export function sanitizeSearchSuggestion(suggestion: string): string {
  if (!suggestion || typeof suggestion !== 'string') {
    return '';
  }

  let cleaned = suggestion;

  // 移除HTML标签
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // 标准化空白字符
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 长度限制
  if (cleaned.length > 50) {
    cleaned = cleaned.substring(0, 50) + '...';
  }

  return cleaned;
}

// 搜索历史清理
export function sanitizeSearchHistory(history: string[]): string[] {
  return history
    .map(item => {
      const validation = validateSearchQuery(item);
      return validation.isValid ? validation.cleanedQuery : null;
    })
    .filter((item): item is string => item !== null)
    .filter((item, index, arr) => arr.indexOf(item) === index) // 去重
    .slice(0, 10); // 限制数量
}

// 检查搜索查询是否可能是恶意的
export function isSuspiciousQuery(query: string): boolean {
  if (!query || typeof query !== 'string') {
    return false;
  }

  // 检查是否包含过多特殊字符
  const specialCharCount = (query.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g) || []).length;
  if (specialCharCount > query.length * 0.3) {
    return true;
  }

  // 检查是否全是数字或特殊字符
  if (/^[\d\W]+$/.test(query) && query.length > 10) {
    return true;
  }

  // 检查是否包含明显的代码模式
  const codePatterns = [
    /function\s*\(/,
    /\$\{.*\}/,
    /\beval\s*\(/,
    /\bdocument\./,
    /\bwindow\./,
  ];

  for (const pattern of codePatterns) {
    if (pattern.test(query)) {
      return true;
    }
  }

  return false;
}

// 速率限制检查
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // 清理过期的尝试记录
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// 导出速率限制器实例
export const searchRateLimiter = new RateLimiter(20, 60000); // 每分钟最多20次搜索