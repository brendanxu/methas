'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { screenReader } from '@/lib/accessibility/screen-reader';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  description?: string;
  validation?: ValidationRule;
  options?: { value: string; label: string }[]; // for select/radio
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  'aria-describedby'?: string;
}

interface AccessibleFormProps {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showProgress?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface FieldErrors {
  [fieldName: string]: string;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  title,
  description,
  fields,
  onSubmit,
  submitText = '提交',
  resetText = '重置',
  showReset = true,
  validateOnChange = false,
  validateOnBlur = true,
  showProgress = true,
  className = '',
  children,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const firstErrorRef = useRef<HTMLElement | null>(null);

  // 初始化表单数据
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.name] = field.type === 'checkbox' ? false : '';
    });
    setFormData(initialData);
  }, [fields]);

  // 验证单个字段
  const validateField = useCallback((field: FormFieldConfig, value: any): string | null => {
    const validation = field.validation;
    if (!validation) return null;

    // 必填验证
    if (validation.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return validation.message || `${field.label}是必填项`;
    }

    // 字符串长度验证
    if (typeof value === 'string' && value) {
      if (validation.minLength && value.length < validation.minLength) {
        return validation.message || `${field.label}至少需要${validation.minLength}个字符`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return validation.message || `${field.label}不能超过${validation.maxLength}个字符`;
      }
      
      // 正则表达式验证
      if (validation.pattern && !validation.pattern.test(value)) {
        return validation.message || `${field.label}格式不正确`;
      }
    }

    // 自定义验证
    if (validation.custom) {
      return validation.custom(value);
    }

    return null;
  }, []);

  // 验证所有字段
  const validateForm = useCallback((): FieldErrors => {
    const newErrors: FieldErrors = {};
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    return newErrors;
  }, [fields, formData, validateField]);

  // 处理字段值变化
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    if (validateOnChange || touched[fieldName] || submitAttempted) {
      const field = fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || '',
        }));

        // 宣布验证结果
        if (error) {
          screenReader.announceFormError(field.label, error);
        }
      }
    }
  }, [fields, validateField, validateOnChange, touched, submitAttempted]);

  // 处理字段失焦
  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    if (validateOnBlur) {
      const field = fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(field, formData[fieldName]);
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || '',
        }));

        if (error) {
          screenReader.announceFormError(field.label, error);
        }
      }
    }
  }, [fields, formData, validateField, validateOnBlur]);

  // 处理表单提交
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);

    const formErrors = validateForm();
    setErrors(formErrors);

    const hasErrors = Object.values(formErrors).some(error => error);

    if (hasErrors) {
      // 聚焦到第一个错误字段
      const firstErrorField = fields.find(field => formErrors[field.name]);
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField.name}"]`) as HTMLElement;
        if (errorElement) {
          errorElement.focus();
          firstErrorRef.current = errorElement;
        }
      }

      // 宣布错误统计
      const errorCount = Object.values(formErrors).filter(error => error).length;
      screenReader.announce(`表单包含 ${errorCount} 个错误，请修正后重新提交`, { 
        priority: 'assertive' 
      });
      
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      screenReader.announceFormSuccess('表单提交成功');
    } catch (error) {
      screenReader.announce('表单提交失败，请重试', { priority: 'assertive' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, fields, onSubmit, validateForm]);

  // 处理表单重置
  const handleReset = useCallback(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.name] = field.type === 'checkbox' ? false : '';
    });
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
    
    screenReader.announce('表单已重置', { priority: 'polite' });
  }, [fields]);

  // 计算表单完成度
  const calculateProgress = useCallback((): number => {
    if (!showProgress) return 0;
    
    const requiredFields = fields.filter(field => field.required || field.validation?.required);
    if (requiredFields.length === 0) return 100;
    
    const completedFields = requiredFields.filter(field => {
      const value = formData[field.name];
      return value && (typeof value !== 'string' || value.trim());
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }, [fields, formData, showProgress]);

  // 渲染字段
  const renderField = (field: FormFieldConfig) => {
    const fieldId = `field-${field.name}`;
    const errorId = `${fieldId}-error`;
    const descId = `${fieldId}-desc`;
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const hasError = Boolean(error);

    const commonProps = {
      id: fieldId,
      name: field.name,
      'aria-required': field.required || field.validation?.required,
      'aria-invalid': hasError,
      'aria-describedby': [
        field.description ? descId : '',
        hasError ? errorId : '',
        field['aria-describedby'] || '',
      ].filter(Boolean).join(' ') || undefined,
      disabled: field.disabled || isSubmitting,
      autoComplete: field.autoComplete,
      onBlur: () => handleFieldBlur(field.name),
    };

    const fieldElement = (() => {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              {...commonProps}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
            />
          );

        case 'select':
          return (
            <select
              {...commonProps}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">请选择...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'checkbox':
          return (
            <input
              {...commonProps}
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          );

        case 'radio':
          return (
            <div className="space-y-2" role="radiogroup" aria-labelledby={`${fieldId}-legend`}>
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    aria-describedby={commonProps['aria-describedby']}
                    disabled={commonProps.disabled}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          );

        default:
          return (
            <input
              {...commonProps}
              type={field.type || 'text'}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          );
      }
    })();

    return (
      <div key={field.name} className="space-y-2">
        {field.type === 'radio' ? (
          <fieldset>
            <legend id={`${fieldId}-legend`} className="text-sm font-medium text-gray-700">
              {field.label}
              {(field.required || field.validation?.required) && (
                <span className="text-red-500 ml-1" aria-label="必填项">*</span>
              )}
            </legend>
            {fieldElement}
          </fieldset>
        ) : (
          <>
            <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
              {field.label}
              {(field.required || field.validation?.required) && (
                <span className="text-red-500 ml-1" aria-label="必填项">*</span>
              )}
            </label>
            {fieldElement}
          </>
        )}

        {field.description && (
          <p id={descId} className="text-sm text-gray-600">
            {field.description}
          </p>
        )}

        {hasError && (
          <p id={errorId} role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  };

  const progress = calculateProgress();

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      noValidate
      aria-labelledby="form-title"
      aria-describedby={description ? "form-description" : undefined}
    >
      <div>
        <h2 id="form-title" className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
        {description && (
          <p id="form-description" className="mt-2 text-gray-600">
            {description}
          </p>
        )}
      </div>

      {showProgress && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">表单完成度</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`表单完成度 ${progress}%`}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {fields.map(renderField)}
      </div>

      {children}

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-describedby={isSubmitting ? 'submit-status' : undefined}
        >
          {isSubmitting ? '提交中...' : submitText}
        </button>

        {showReset && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetText}
          </button>
        )}
      </div>

      {isSubmitting && (
        <div id="submit-status" className="sr-only" aria-live="polite">
          正在提交表单，请稍候...
        </div>
      )}
    </form>
  );
};

export default AccessibleForm;