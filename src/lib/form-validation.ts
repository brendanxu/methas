// 表单验证规则库
import { Rule } from 'antd/es/form';

// 验证结果类型
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 表单字段类型定义
export interface ContactFormData {
  firstName: string;
  lastName: string;
  company: string;
  position?: string;
  email: string;
  phone?: string;
  country: string;
  inquiryType: string;
  message: string;
  captcha?: string;
  agreeToTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
  preferences?: string[];
}

export interface DownloadFormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  resourceType: string;
  agreeToMarketing: boolean;
}

// 国家/地区选项
export const countryOptions = [
  { value: 'CN', label: '中国' },
  { value: 'US', label: '美国' },
  { value: 'GB', label: '英国' },
  { value: 'DE', label: '德国' },
  { value: 'FR', label: '法国' },
  { value: 'JP', label: '日本' },
  { value: 'KR', label: '韩国' },
  { value: 'SG', label: '新加坡' },
  { value: 'AU', label: '澳大利亚' },
  { value: 'CA', label: '加拿大' },
  { value: 'CH', label: '瑞士' },
  { value: 'NL', label: '荷兰' },
  { value: 'SE', label: '瑞典' },
  { value: 'NO', label: '挪威' },
  { value: 'DK', label: '丹麦' },
  { value: 'FI', label: '芬兰' },
  { value: 'BR', label: '巴西' },
  { value: 'MX', label: '墨西哥' },
  { value: 'IN', label: '印度' },
  { value: 'OTHER', label: '其他' },
];

// 咨询类型选项
export const inquiryTypeOptions = [
  { value: 'carbon-footprint', label: '碳足迹评估' },
  { value: 'carbon-neutrality', label: '碳中和咨询' },
  { value: 'esg-reporting', label: 'ESG报告' },
  { value: 'green-finance', label: '绿色金融' },
  { value: 'renewable-energy', label: '可再生能源' },
  { value: 'supply-chain', label: '供应链可持续性' },
  { value: 'training', label: '培训服务' },
  { value: 'partnership', label: '合作伙伴关系' },
  { value: 'media', label: '媒体咨询' },
  { value: 'other', label: '其他' },
];

// 资源类型选项
export const resourceTypeOptions = [
  { value: 'whitepaper', label: '白皮书' },
  { value: 'case-study', label: '案例研究' },
  { value: 'report', label: '研究报告' },
  { value: 'guide', label: '实施指南' },
  { value: 'toolkit', label: '工具包' },
  { value: 'template', label: '模板' },
  { value: 'webinar', label: '网络研讨会录像' },
  { value: 'infographic', label: '信息图表' },
];

// 订阅偏好选项
export const newsletterPreferences = [
  { value: 'climate-news', label: '气候新闻' },
  { value: 'industry-insights', label: '行业洞察' },
  { value: 'product-updates', label: '产品更新' },
  { value: 'events', label: '活动邀请' },
  { value: 'research', label: '研究报告' },
];

// 基础验证函数
export const validators = {
  // 邮箱验证
  email: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },

  // 电话号码验证（国际化）
  phone: (phone: string): boolean => {
    // 移除所有非数字字符
    const cleanPhone = phone.replace(/\D/g, '');
    
    // 基本长度检查（7-15位数字）
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return false;
    }
    
    // 国际格式验证
    const phoneRegex = /^(\+?\d{1,4})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phoneRegex.test(phone);
  },

  // 姓名验证
  name: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  },

  // 公司名称验证
  company: (company: string): boolean => {
    return company.trim().length >= 2 && company.trim().length <= 100;
  },

  // 消息内容验证
  message: (message: string): boolean => {
    return message.trim().length >= 10 && message.trim().length <= 1000;
  },

  // 职位验证
  position: (position: string): boolean => {
    return position.trim().length <= 100;
  },
};

// Ant Design 验证规则
export const formRules = {
  // 必填字段
  required: (message: string): Rule => ({
    required: true,
    message,
    whitespace: true,
  }),

  // 邮箱规则
  email: (): Rule[] => [
    formRules.required('请输入邮箱地址'),
    {
      type: 'email',
      message: '邮箱格式不正确',
    },
    {
      validator: async (_, value) => {
        if (value && !validators.email(value)) {
          throw new Error('请输入有效的邮箱地址');
        }
      },
    },
  ],

  // 电话规则
  phone: (): Rule[] => [
    {
      validator: async (_, value) => {
        if (value && !validators.phone(value)) {
          throw new Error('请输入有效的电话号码');
        }
      },
    },
  ],

  // 姓名规则
  name: (fieldName: string): Rule[] => [
    formRules.required(`请输入${fieldName}`),
    {
      min: 2,
      max: 50,
      message: `${fieldName}长度应在2-50个字符之间`,
    },
    {
      validator: async (_, value) => {
        if (value && !validators.name(value)) {
          throw new Error(`请输入有效的${fieldName}`);
        }
      },
    },
  ],

  // 公司规则
  company: (): Rule[] => [
    formRules.required('请输入公司名称'),
    {
      min: 2,
      max: 100,
      message: '公司名称长度应在2-100个字符之间',
    },
  ],

  // 职位规则
  position: (): Rule[] => [
    {
      max: 100,
      message: '职位名称不能超过100个字符',
    },
  ],

  // 消息规则
  message: (): Rule[] => [
    formRules.required('请输入详细信息'),
    {
      min: 10,
      max: 1000,
      message: '详细信息长度应在10-1000个字符之间',
    },
  ],

  // 选择框规则
  select: (message: string): Rule[] => [
    formRules.required(message),
  ],

  // 同意条款规则
  agreement: (message: string): Rule[] => [
    {
      validator: async (_, value) => {
        if (!value) {
          throw new Error(message);
        }
      },
    },
  ],
};

// 表单数据清理函数
export const sanitizeFormData = {
  // 清理字符串输入
  text: (value: string): string => {
    return value.trim().replace(/\s+/g, ' ');
  },

  // 清理邮箱
  email: (value: string): string => {
    return value.trim().toLowerCase();
  },

  // 清理电话号码
  phone: (value: string): string => {
    return value.replace(/\s+/g, '').replace(/[^\d+()-]/g, '');
  },

  // 清理HTML内容
  html: (value: string): string => {
    return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim();
  },
};

// 验证整个表单数据
export const validateContactForm = (data: Partial<ContactFormData>): ValidationResult => {
  const errors: string[] = [];

  // 验证必填字段
  if (!data.firstName || !validators.name(data.firstName)) {
    errors.push('请输入有效的姓');
  }

  if (!data.lastName || !validators.name(data.lastName)) {
    errors.push('请输入有效的名');
  }

  if (!data.company || !validators.company(data.company)) {
    errors.push('请输入有效的公司名称');
  }

  if (!data.email || !validators.email(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }

  if (!data.country) {
    errors.push('请选择国家/地区');
  }

  if (!data.inquiryType) {
    errors.push('请选择咨询类型');
  }

  if (!data.message || !validators.message(data.message)) {
    errors.push('请输入10-1000字符的详细信息');
  }

  // 验证可选字段
  if (data.phone && !validators.phone(data.phone)) {
    errors.push('电话号码格式不正确');
  }

  if (data.position && !validators.position(data.position)) {
    errors.push('职位名称不能超过100个字符');
  }

  if (!data.agreeToTerms) {
    errors.push('请阅读并同意服务条款');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 验证Newsletter表单
export const validateNewsletterForm = (data: Partial<NewsletterFormData>): ValidationResult => {
  const errors: string[] = [];

  if (!data.email || !validators.email(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }

  if (data.firstName && !validators.name(data.firstName)) {
    errors.push('姓名格式不正确');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 验证下载表单
export const validateDownloadForm = (data: Partial<DownloadFormData>): ValidationResult => {
  const errors: string[] = [];

  if (!data.firstName || !validators.name(data.firstName)) {
    errors.push('请输入有效的姓');
  }

  if (!data.lastName || !validators.name(data.lastName)) {
    errors.push('请输入有效的名');
  }

  if (!data.company || !validators.company(data.company)) {
    errors.push('请输入有效的公司名称');
  }

  if (!data.email || !validators.email(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }

  if (!data.resourceType) {
    errors.push('请选择要下载的资源类型');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 防重复提交功能
export class FormSubmissionManager {
  private submissions = new Map<string, number>();
  private readonly cooldownMs: number;

  constructor(cooldownMs: number = 5000) {
    this.cooldownMs = cooldownMs;
  }

  canSubmit(formId: string): boolean {
    const lastSubmission = this.submissions.get(formId);
    if (!lastSubmission) {
      return true;
    }

    return Date.now() - lastSubmission > this.cooldownMs;
  }

  recordSubmission(formId: string): void {
    this.submissions.set(formId, Date.now());
  }

  getRemainingCooldown(formId: string): number {
    const lastSubmission = this.submissions.get(formId);
    if (!lastSubmission) {
      return 0;
    }

    const elapsed = Date.now() - lastSubmission;
    return Math.max(0, this.cooldownMs - elapsed);
  }
}

// 全局提交管理器
export const formSubmissionManager = new FormSubmissionManager(5000);

// 错误日志记录
export const logFormError = (formType: string, error: unknown, formData?: unknown): void => {
  const errorLog = {
    formType,
    error: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    formData: formData ? JSON.stringify(formData, null, 2) : 'not provided',
  };

  console.error('Form Error:', errorLog);

  // 在生产环境中，这里应该发送到错误跟踪服务
  if (process.env.NODE_ENV === 'production') {
    // 发送到错误跟踪服务 (如 Sentry, LogRocket 等)
    try {
      fetch('/api/forms/error-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      }).catch(() => {
        // 忽略日志发送失败
      });
    } catch {
      // 忽略错误
    }
  }
};