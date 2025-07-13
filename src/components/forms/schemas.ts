import { z } from 'zod';

// Common validation schemas for forms

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符'),
  email: z.string()
    .email('请输入有效的邮箱地址')
    .min(1, '邮箱地址不能为空'),
  company: z.string()
    .min(1, '公司名称不能为空')
    .max(100, '公司名称不能超过100个字符'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(val), {
      message: '请输入有效的电话号码'
    }),
  subject: z.string()
    .min(5, '主题至少需要5个字符')
    .max(100, '主题不能超过100个字符'),
  message: z.string()
    .min(10, '消息内容至少需要10个字符')
    .max(1000, '消息内容不能超过1000个字符'),
  industry: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  consent: z.boolean()
    .refine((val) => val === true, {
      message: '请同意我们的隐私政策'
    }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string()
    .email('请输入有效的邮箱地址')
    .min(1, '邮箱地址不能为空'),
  preferences: z.array(z.string()).optional(),
  frequency: z.enum(['weekly', 'monthly', 'quarterly']).optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

// Quote request schema
export const quoteRequestSchema = z.object({
  companyName: z.string()
    .min(2, '公司名称至少需要2个字符')
    .max(100, '公司名称不能超过100个字符'),
  contactName: z.string()
    .min(2, '联系人姓名至少需要2个字符')
    .max(50, '联系人姓名不能超过50个字符'),
  email: z.string()
    .email('请输入有效的邮箱地址'),
  phone: z.string()
    .min(10, '请输入有效的电话号码'),
  industry: z.string()
    .min(1, '请选择行业类型'),
  companySize: z.string()
    .min(1, '请选择公司规模'),
  projectDescription: z.string()
    .min(20, '项目描述至少需要20个字符')
    .max(2000, '项目描述不能超过2000个字符'),
  timeline: z.string()
    .min(1, '请选择项目时间线'),
  budget: z.string()
    .min(1, '请选择预算范围'),
  goals: z.array(z.string())
    .min(1, '请至少选择一个项目目标'),
  additionalInfo: z.string().optional(),
});

export type QuoteRequestData = z.infer<typeof quoteRequestSchema>;

// Search form schema
export const searchFormSchema = z.object({
  query: z.string()
    .min(1, '搜索关键词不能为空')
    .max(100, '搜索关键词不能超过100个字符'),
  category: z.string().optional(),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;

// Login form schema
export const loginFormSchema = z.object({
  email: z.string()
    .email('请输入有效的邮箱地址'),
  password: z.string()
    .min(6, '密码至少需要6个字符'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Registration form schema
export const registrationFormSchema = z.object({
  firstName: z.string()
    .min(2, '名字至少需要2个字符')
    .max(30, '名字不能超过30个字符'),
  lastName: z.string()
    .min(2, '姓氏至少需要2个字符')
    .max(30, '姓氏不能超过30个字符'),
  email: z.string()
    .email('请输入有效的邮箱地址'),
  password: z.string()
    .min(8, '密码至少需要8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  confirmPassword: z.string(),
  company: z.string()
    .min(2, '公司名称至少需要2个字符')
    .max(100, '公司名称不能超过100个字符'),
  jobTitle: z.string()
    .min(2, '职位至少需要2个字符')
    .max(50, '职位不能超过50个字符'),
  industry: z.string()
    .min(1, '请选择行业类型'),
  termsAccepted: z.boolean()
    .refine((val) => val === true, {
      message: '请同意服务条款'
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: '密码确认不匹配',
  path: ['confirmPassword'],
});

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;