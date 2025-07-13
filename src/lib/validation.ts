import { z } from 'zod';

// 基础验证规则
export const ValidationRules = {
  // 字符串验证
  required: z.string().min(1, '此字段为必填项'),
  email: z.string().email('请输入有效的邮箱地址'),
  url: z.string().url('请输入有效的URL'),
  phone: z.string().regex(
    /^(?:\+86)?1[3-9]\d{9}$|^(?:\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    '请输入有效的手机号码'
  ),
  
  // 数字验证
  numeric: z.number({ message: '必须是数字' }),
  integer: z.number().int('必须是整数'),
  positive: z.number().positive('必须是正数'),
  negative: z.number().negative('必须是负数'),
  
  // 日期验证
  date: z.date({ message: '请输入有效日期' }),
  datetime: z.date({ message: '请输入有效的日期时间' }),
  
  // 长度验证
  minLength: (min: number) => z.string().min(min, `最少需要${min}个字符`),
  maxLength: (max: number) => z.string().max(max, `最多允许${max}个字符`),
  
  // 数值范围验证
  minValue: (min: number) => z.number().min(min, `最小值为${min}`),
  maxValue: (max: number) => z.number().max(max, `最大值为${max}`),
  
  // 正则表达式验证
  regex: (pattern: RegExp, message: string) => z.string().regex(pattern, message),
  
  // 枚举验证
  enum: <T extends readonly [string, ...string[]]>(values: T) => 
    z.enum(values),
  
  // 数组验证
  array: <T>(schema: z.ZodType<T>) => z.array(schema),
  nonEmptyArray: <T>(schema: z.ZodType<T>) => z.array(schema).min(1, '至少需要一个项目'),
  
  // 对象验证
  object: <T extends z.ZodRawShape>(shape: T) => z.object(shape),
  
  // 文件验证
  file: z.instanceof(File, { message: '必须是有效文件' }),
  fileSize: (maxSize: number) => z.instanceof(File).refine(
    (file) => file.size <= maxSize,
    `文件大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`
  ),
  fileType: (allowedTypes: string[]) => z.instanceof(File).refine(
    (file) => allowedTypes.includes(file.type),
    `文件类型必须是: ${allowedTypes.join(', ')}`
  ),
} as const;

// 业务相关验证 schemas
export const BusinessSchemas = {
  // 用户相关
  user: z.object({
    id: z.string().uuid('无效的用户ID'),
    email: ValidationRules.email,
    firstName: ValidationRules.required.min(2, '名字至少2个字符'),
    lastName: ValidationRules.required.min(2, '姓氏至少2个字符'),
    role: ValidationRules.enum(['admin', 'manager', 'analyst', 'viewer']),
  }),
  
  // 组织相关
  organization: z.object({
    id: z.string().uuid('无效的组织ID'),
    name: ValidationRules.required.min(2, '组织名称至少2个字符'),
    industry: ValidationRules.required,
    size: ValidationRules.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
    website: ValidationRules.url.optional(),
    email: ValidationRules.email,
  }),
  
  // 排放数据相关
  emissionRecord: z.object({
    organizationId: z.string().uuid('无效的组织ID'),
    year: z.number().int().min(2000).max(new Date().getFullYear() + 1),
    scope1: z.number().nonnegative('Scope 1排放量不能为负'),
    scope2: z.number().nonnegative('Scope 2排放量不能为负'),
    scope3: z.number().nonnegative('Scope 3排放量不能为负'),
    unit: ValidationRules.enum(['tCO2e', 'kgCO2e', 'lbCO2e']),
    methodology: ValidationRules.required,
    certificationStatus: ValidationRules.enum(['pending', 'verified', 'certified']),
    reportingPeriod: z.object({
      start: z.string().datetime('无效的开始日期'),
      end: z.string().datetime('无效的结束日期'),
    }).refine(
      (data) => new Date(data.start) < new Date(data.end),
      '开始日期必须早于结束日期'
    ),
  }),
  
  // 项目相关
  project: z.object({
    name: ValidationRules.required.min(5, '项目名称至少5个字符'),
    description: ValidationRules.required.min(20, '项目描述至少20个字符'),
    type: ValidationRules.enum([
      'renewable-energy', 
      'forest-protection', 
      'methane-capture', 
      'community-development'
    ]),
    status: ValidationRules.enum(['planning', 'active', 'completed', 'suspended']),
    location: z.object({
      country: ValidationRules.required,
      region: ValidationRules.required,
      coordinates: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }).optional(),
    }),
    impact: z.object({
      co2Reduction: z.number().positive('CO2减排量必须为正数'),
      beneficiaries: z.number().int().nonnegative().optional(),
      area: z.number().positive().optional(),
      unit: ValidationRules.required,
    }),
  }),
  
  // 联系表单
  contactForm: z.object({
    name: ValidationRules.required.min(2, '姓名至少2个字符'),
    email: ValidationRules.email,
    company: ValidationRules.required,
    phone: ValidationRules.phone.optional(),
    subject: ValidationRules.required,
    message: ValidationRules.required.min(10, '消息至少10个字符'),
    privacy: z.boolean().refine(val => val === true, '必须同意隐私政策'),
  }),
  
  // 通讯订阅表单
  newsletterForm: z.object({
    email: ValidationRules.email,
    preferences: z.object({
      news: z.boolean().default(true),
      updates: z.boolean().default(true),
      research: z.boolean().default(false),
    }),
    language: ValidationRules.enum(['zh-CN', 'en-US']).default('zh-CN'),
  }),
  
  // 下载表单
  downloadForm: z.object({
    name: ValidationRules.required,
    email: ValidationRules.email,
    company: ValidationRules.required,
    jobTitle: ValidationRules.required,
    resourceType: ValidationRules.enum(['whitepaper', 'case-study', 'report', 'guide']),
    consent: z.boolean().refine(val => val === true, '必须同意接收相关资料'),
  }),
} as const;

// 动态验证器构建器
export class ValidationBuilder<T extends z.ZodTypeAny = z.ZodString> {
  private schema: T;

  constructor(initialSchema: T) {
    this.schema = initialSchema;
  }

  static string() {
    return new ValidationBuilder(z.string());
  }

  static number() {
    return new ValidationBuilder(z.number());
  }

  static boolean() {
    return new ValidationBuilder(z.boolean());
  }

  static array<T extends z.ZodTypeAny>(itemSchema: T) {
    return new ValidationBuilder(z.array(itemSchema));
  }

  static object<T extends z.ZodRawShape>(shape: T) {
    return new ValidationBuilder(z.object(shape));
  }

  required(message?: string) {
    if (this.schema instanceof z.ZodString) {
      return new ValidationBuilder(
        this.schema.min(1, message || '此字段为必填项')
      );
    }
    return this;
  }

  min(value: number, message?: string) {
    if (this.schema instanceof z.ZodString) {
      return new ValidationBuilder(
        this.schema.min(value, message || `最少需要${value}个字符`)
      );
    }
    if (this.schema instanceof z.ZodNumber) {
      return new ValidationBuilder(
        this.schema.min(value, message || `最小值为${value}`)
      );
    }
    return this;
  }

  max(value: number, message?: string) {
    if (this.schema instanceof z.ZodString) {
      return new ValidationBuilder(
        this.schema.max(value, message || `最多允许${value}个字符`)
      );
    }
    if (this.schema instanceof z.ZodNumber) {
      return new ValidationBuilder(
        this.schema.max(value, message || `最大值为${value}`)
      );
    }
    return this;
  }

  email(message?: string) {
    if (this.schema instanceof z.ZodString) {
      return new ValidationBuilder(
        this.schema.email(message || '请输入有效的邮箱地址')
      );
    }
    return this;
  }

  url(message?: string) {
    if (this.schema instanceof z.ZodString) {
      return new ValidationBuilder(
        this.schema.url(message || '请输入有效的URL')
      );
    }
    return this;
  }

  regex(pattern: RegExp, message: string) {
    if (this.schema instanceof z.ZodString) {
      return new ValidationBuilder(this.schema.regex(pattern, message));
    }
    return this;
  }

  optional() {
    return new ValidationBuilder(this.schema.optional());
  }

  nullable() {
    return new ValidationBuilder(this.schema.nullable());
  }

  default(value: any) {
    return new ValidationBuilder(this.schema.default(value));
  }

  transform<U>(fn: (value: z.infer<T>) => U) {
    return new ValidationBuilder(this.schema.transform(fn));
  }

  refine<U extends z.infer<T>>(
    check: (value: z.infer<T>) => boolean,
    message: string
  ) {
    return new ValidationBuilder(
      this.schema.refine(check, { message })
    );
  }

  build() {
    return this.schema;
  }
}

// 验证错误处理
export class ValidationError extends Error {
  public readonly errors: z.ZodIssue[];

  constructor(zodError: z.ZodError) {
    const message = zodError.issues.map(err => err.message).join(', ');
    super(message);
    this.name = 'ValidationError';
    this.errors = zodError.issues;
  }

  getFieldErrors(): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    
    for (const error of this.errors) {
      const path = error.path.join('.');
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(error.message);
    }
    
    return fieldErrors;
  }

  getFirstError(): string | null {
    return this.errors[0]?.message || null;
  }
}

// 验证工具函数
export const validate = {
  // 验证单个值
  value: <T>(schema: z.ZodType<T>, value: unknown): T => {
    try {
      return schema.parse(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(error);
      }
      throw error;
    }
  },

  // 安全验证（返回结果而不抛出错误）
  safe: <T>(schema: z.ZodType<T>, value: unknown): 
    { success: true; data: T } | { success: false; error: ValidationError } => {
    try {
      const data = schema.parse(value);
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: new ValidationError(error) };
      }
      throw error;
    }
  },

  // 异步验证
  async: async <T>(schema: z.ZodType<T>, value: unknown): Promise<T> => {
    return schema.parseAsync(value).catch(error => {
      if (error instanceof z.ZodError) {
        throw new ValidationError(error);
      }
      throw error;
    });
  },

  // 部分验证
  partial: <T extends z.ZodObject<any>>(schema: T, value: unknown): Partial<z.infer<T>> => {
    return schema.partial().parse(value) as Partial<z.infer<T>>;
  },
};

// 类型守卫
export const is = {
  email: (value: string): boolean => {
    const result = ValidationRules.email.safeParse(value);
    return result.success;
  },

  url: (value: string): boolean => {
    const result = ValidationRules.url.safeParse(value);
    return result.success;
  },

  phone: (value: string): boolean => {
    const result = ValidationRules.phone.safeParse(value);
    return result.success;
  },

  uuid: (value: string): boolean => {
    const result = z.string().uuid().safeParse(value);
    return result.success;
  },
};