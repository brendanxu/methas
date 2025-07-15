'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from '@/lib/mock-framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  MailOutlined, 
  UserOutlined, 
  SendOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  BellOutlined,
  StarFilled
} from '@ant-design/icons';

interface NewsletterFormData {
  email: string;
  firstName: string;
  interests: string[];
}

const interestOptions = [
  { id: 'carbon-offset', label: 'Carbon Offset', icon: '🌍' },
  { id: 'renewable-energy', label: 'Renewable Energy', icon: '⚡' },
  { id: 'climate-strategy', label: 'Climate Strategy', icon: '📊' },
  { id: 'sustainability', label: 'Sustainability', icon: '🌱' },
  { id: 'esg-reporting', label: 'ESG Reporting', icon: '📋' },
  { id: 'net-zero', label: 'Net Zero', icon: '🎯' }
];

export interface InteractiveNewsletterFormProps {
  variant?: 'inline' | 'card' | 'footer';
  showInterests?: boolean;
  className?: string;
}

export default function InteractiveNewsletterForm({ 
  variant = 'card',
  showInterests = true,
  className = ''
}: InteractiveNewsletterFormProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    firstName: '',
    interests: []
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const handleEmailChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    setEmailError(validateEmail(value));
  }, []);

  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, firstName: value }));
  }, []);

  const toggleInterest = useCallback((interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  }, []);

  const canProceedToNextStep = () => {
    if (currentStep === 0) {
      return formData.email && !emailError;
    }
    return true;
  };

  const handleNext = () => {
    if (canProceedToNextStep()) {
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
    
    if (emailError || !formData.email) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          preferences: formData.interests,
          source: 'interactive-form'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ email: '', firstName: '', interests: [] });
        setCurrentStep(0);
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'inline':
        return 'bg-transparent border-0 shadow-none p-0';
      case 'footer':
        return 'bg-muted border border-border shadow-soft p-6';
      default:
        return 'bg-background border border-border shadow-soft p-6';
    }
  };

  const steps = [
    {
      title: 'Join Our Newsletter',
      subtitle: 'Get the latest climate insights delivered to your inbox'
    },
    ...(showInterests ? [{
      title: 'What interests you?',
      subtitle: 'Help us personalize your content'
    }] : [])
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${getVariantStyles()} ${className} text-center rounded-lg`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircleOutlined className="text-green-600 text-5xl mb-4" />
        </motion.div>
        <h3 className="text-xl font-bold mb-2">Welcome aboard! 🎉</h3>
        <p className="text-muted-foreground mb-4">
          Thank you for subscribing! Check your email to confirm your subscription.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSubmitted(false)}
          className="text-primary font-medium hover:text-primary/80 transition-colors"
        >
          Subscribe another email
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className={`${getVariantStyles()} ${className} rounded-lg overflow-hidden`}
    >
      {/* Progress indicator for multi-step */}
      {showInterests && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index <= currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Headers */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center mb-3"
              >
                {currentStep === 0 ? (
                  <BellOutlined className="text-primary text-3xl" />
                ) : (
                  <StarFilled className="text-primary text-3xl" />
                )}
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{steps[currentStep].title}</h3>
              <p className="text-muted-foreground text-sm">{steps[currentStep].subtitle}</p>
            </div>

            {/* Step Content */}
            {currentStep === 0 && (
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <div className="relative">
                    <MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-300 ${
                        focusedField === 'email'
                          ? 'border-primary ring-2 ring-primary/20'
                          : emailError
                            ? 'border-red-500'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>

                {/* Name Field */}
                <div>
                  <div className="relative">
                    <UserOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-300 ${
                        focusedField === 'firstName'
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Your first name (optional)"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && showInterests && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <motion.button
                      key={interest.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                        formData.interests.includes(interest.id)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{interest.icon}</span>
                        <span className="font-medium text-sm">{interest.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Select topics you're interested in (optional)
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          {showInterests && currentStep > 0 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Back
            </motion.button>
          ) : (
            <div />
          )}

          {showInterests && currentStep < steps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleNext}
              disabled={!canProceedToNextStep()}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                canProceedToNextStep()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!canProceedToNextStep() || isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                canProceedToNextStep() && !isSubmitting
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoadingOutlined className="animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <SendOutlined />
                  Subscribe
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>

      {/* Trust indicators */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircleOutlined className="text-green-600" />
            No spam
          </span>
          <span className="flex items-center gap-1">
            <CheckCircleOutlined className="text-green-600" />
            Unsubscribe anytime
          </span>
          <span className="flex items-center gap-1">
            <CheckCircleOutlined className="text-green-600" />
            Weekly insights
          </span>
        </div>
      </div>
    </motion.div>
  );
}