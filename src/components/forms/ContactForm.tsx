'use client';

import React, { useState } from 'react';
import { EnhancedForm, FormInput, FormTextarea, FormSelect, FormButton } from './index';
import { contactFormSchema, ContactFormData } from './schemas';
import { FadeIn } from '@/components/ui/FadeIn';
import { motion } from '@/lib/mock-framer-motion';

// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  onSubmitSuccess?: (data: ContactFormData) => void;
  onSubmitError?: (error: any) => void;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmit,
  onSubmitSuccess,
  onSubmitError, 
  className 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industryOptions = [
    { value: 'technology', label: '科技' },
    { value: 'finance', label: '金融' },
    { value: 'manufacturing', label: '制造业' },
    { value: 'energy', label: '能源' },
    { value: 'retail', label: '零售' },
    { value: 'healthcare', label: '医疗健康' },
    { value: 'education', label: '教育' },
    { value: 'government', label: '政府' },
    { value: 'other', label: '其他' },
  ];

  const budgetOptions = [
    { value: 'under-10k', label: '10万以下' },
    { value: '10k-50k', label: '10-50万' },
    { value: '50k-100k', label: '50-100万' },
    { value: '100k-500k', label: '100-500万' },
    { value: 'over-500k', label: '500万以上' },
    { value: 'discuss', label: '面议' },
  ];

  const timelineOptions = [
    { value: 'immediate', label: '立即开始' },
    { value: '1-3months', label: '1-3个月内' },
    { value: '3-6months', label: '3-6个月内' },
    { value: '6-12months', label: '6-12个月内' },
    { value: 'over-12months', label: '12个月以上' },
    { value: 'flexible', label: '时间灵活' },
  ];

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // 提交到后端API
        const response = await fetch('/api/forms/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'CONTACT',
            data: {
              name: data.name,
              email: data.email,
              company: data.company,
              phone: data.phone,
              subject: data.subject,
              message: data.message,
              industry: data.industry,
              budget: data.budget,
              timeline: data.timeline,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('提交失败');
        }

        const result = await response.json();
        // Debug log removed for production
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      } else {
        alert('提交成功！我们将尽快与您联系。');
      }
    } catch (error) {
      logError('提交失败:', error);
      if (onSubmitError) {
        onSubmitError(error);
      } else {
        alert('提交失败，请稍后重试。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <FadeIn>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              联系我们
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              告诉我们您的需求，我们将为您提供专业的碳中和解决方案
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <EnhancedForm
              schema={contactFormSchema}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              loadingText="提交中..."
              defaultValues={{
                consent: false,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  name="name"
                  label="姓名"
                  placeholder="请输入您的姓名"
                  required
                  showSuccess
                />

                <FormInput
                  name="email"
                  label="邮箱地址"
                  type="email"
                  placeholder="your@email.com"
                  required
                  showSuccess
                />

                <FormInput
                  name="company"
                  label="公司名称"
                  placeholder="请输入公司名称"
                  required
                  showSuccess
                />

                <FormInput
                  name="phone"
                  label="联系电话"
                  type="tel"
                  placeholder="+86 138 0000 0000"
                  showSuccess
                />

                <FormSelect
                  name="industry"
                  label="所属行业"
                  placeholder="请选择行业"
                  options={industryOptions}
                  showSuccess
                />

                <FormSelect
                  name="budget"
                  label="预算范围"
                  placeholder="请选择预算范围"
                  options={budgetOptions}
                  showSuccess
                />
              </div>

              <FormInput
                name="subject"
                label="咨询主题"
                placeholder="请简要描述您的咨询主题"
                required
                showSuccess
              />

              <FormTextarea
                name="message"
                label="详细需求"
                placeholder="请详细描述您的需求和期望..."
                required
                rows={6}
                showSuccess
                autoResize
              />

              <FormSelect
                name="timeline"
                label="期望时间线"
                placeholder="请选择项目开始时间"
                options={timelineOptions}
                showSuccess
              />

              <div className="flex items-start space-x-3 pt-4">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-300">
                  我同意 South Pole 收集和处理我的个人信息，用于回应我的询问。
                  我理解我可以随时撤回此同意。请查看我们的
                  <a href="/privacy" className="text-primary hover:underline ml-1">
                    隐私政策
                  </a>
                  了解更多信息。
                </label>
              </div>

              <div className="pt-6">
                <FormButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  loadingText="提交中..."
                >
                  提交咨询
                </FormButton>
              </div>
            </EnhancedForm>
          </motion.div>
        </div>
      </FadeIn>
    </div>
  );
};

export default ContactForm;