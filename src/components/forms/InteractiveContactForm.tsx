'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Motion, AnimatePresence } from '@/components/animations/LightweightMotion';
import { useInView } from 'react-intersection-observer';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  BankOutlined,
  MessageOutlined,
  SendOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  industry: string;
  budget: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
  industry: '',
  budget: ''
};

const industryOptions = [
  { value: '', label: 'Select Industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Financial Services' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'energy', label: 'Energy' },
  { value: 'other', label: 'Other' }
];

const budgetOptions = [
  { value: '', label: 'Select Budget Range' },
  { value: 'under-50k', label: 'Under $50K' },
  { value: '50k-100k', label: '$50K - $100K' },
  { value: '100k-500k', label: '$100K - $500K' },
  { value: 'over-500k', label: 'Over $500K' },
  { value: 'to-be-determined', label: 'To be determined' }
];

export default function InteractiveContactForm() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const formSteps = [
    {
      title: 'Personal Information',
      fields: ['name', 'email', 'company', 'phone']
    },
    {
      title: 'Project Details',
      fields: ['subject', 'message']
    },
    {
      title: 'Additional Information',
      fields: ['industry', 'budget']
    }
  ];

  const validateField = (name: keyof FormData, value: string) => {
    switch (name) {
      case 'name':
        return value.length >= 2 ? '' : 'Name must be at least 2 characters';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email';
      case 'subject':
        return value.length >= 5 ? '' : 'Subject must be at least 5 characters';
      case 'message':
        return value.length >= 20 ? '' : 'Message must be at least 20 characters';
      case 'phone':
        return !value || /^[+]?[0-9\s\-\(\)]{10,}$/.test(value) ? '' : 'Please enter a valid phone number';
      default:
        return '';
    }
  };

  const handleInputChange = useCallback((name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const getCurrentStepFields = () => formSteps[currentStep]?.fields || [];
  const getCurrentStepProgress = () => {
    const currentFields = getCurrentStepFields();
    const filledFields = currentFields.filter(field => formData[field as keyof FormData]?.trim());
    return filledFields.length / currentFields.length;
  };

  const canProceedToNextStep = () => {
    const currentFields = getCurrentStepFields();
    const requiredFields = ['name', 'email', 'subject', 'message'];
    
    for (const field of currentFields) {
      const value = formData[field as keyof FormData];
      const hasError = errors[field as keyof FormData];
      
      if (requiredFields.includes(field) && (!value?.trim() || hasError)) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    const finalErrors: Partial<FormData> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData]);
      if (error) finalErrors[key as keyof FormData] = error;
    });

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData(initialFormData);
        setCurrentStep(0);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (fieldName: string) => {
    const value = formData[fieldName as keyof FormData];
    const error = errors[fieldName as keyof FormData];
    const isFocused = focusedField === fieldName;

    const baseInputClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-300 ${
      isFocused 
        ? 'border-primary ring-2 ring-primary/20' 
        : error 
          ? 'border-red-500' 
          : 'border-gray-300 hover:border-gray-400'
    }`;

    switch (fieldName) {
      case 'name':
        return (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Name *</label>
            <div className="relative">
              <UserOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`${baseInputClasses} pl-10`}
                placeholder="Your full name"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'email':
        return (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Email *</label>
            <div className="relative">
              <MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={value}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`${baseInputClasses} pl-10`}
                placeholder="your.email@company.com"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'company':
        return (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Company</label>
            <div className="relative">
              <BankOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange('company', e.target.value)}
                onFocus={() => setFocusedField('company')}
                onBlur={() => setFocusedField(null)}
                className={`${baseInputClasses} pl-10`}
                placeholder="Your company name"
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Phone</label>
            <div className="relative">
              <PhoneOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={value}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className={`${baseInputClasses} pl-10`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'subject':
        return (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Subject *</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              onFocus={() => setFocusedField('subject')}
              onBlur={() => setFocusedField(null)}
              className={baseInputClasses}
              placeholder="What can we help you with?"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'message':
        return (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Message *</label>
            <div className="relative">
              <MessageOutlined className="absolute left-3 top-3 text-gray-400" />
              <textarea
                value={value}
                onChange={(e) => handleInputChange('message', e.target.value)}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                rows={4}
                className={`${baseInputClasses} pl-10 resize-none`}
                placeholder="Tell us more about your project requirements..."
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'industry':
        return (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Industry</label>
            <select
              value={value}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              onFocus={() => setFocusedField('industry')}
              onBlur={() => setFocusedField(null)}
              className={baseInputClasses}
            >
              {industryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Budget Range</label>
            <select
              value={value}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              onFocus={() => setFocusedField('budget')}
              onBlur={() => setFocusedField(null)}
              className={baseInputClasses}
            >
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Motion
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-lg p-8 shadow-soft text-center"
      >
        <CheckCircleOutlined className="text-green-600 text-6xl mb-4" />
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Send Another Message
        </button>
      </Motion>
    );
  }

  return (
    <Motion
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="bg-background rounded-lg shadow-soft overflow-hidden"
    >
      {/* Progress Bar */}
      <div className="bg-muted p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">Step {currentStep + 1} of {formSteps.length}</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(getCurrentStepProgress() * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (formSteps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <AnimatePresence mode="wait">
          <Motion
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6">{formSteps[currentStep].title}</h3>
            
            <div className="grid gap-6">
              {getCurrentStepFields().map(fieldName => (
                <Motion
                  key={fieldName}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {renderFormField(fieldName)}
                </Motion>
              ))}
            </div>
          </Motion>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < formSteps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceedToNextStep()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                canProceedToNextStep()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canProceedToNextStep() || isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                canProceedToNextStep() && !isSubmitting
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoadingOutlined className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <SendOutlined />
                  Send Message
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </Motion>
  );
}