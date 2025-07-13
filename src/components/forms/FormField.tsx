'use client';

import React, { ReactNode } from 'react';
import { useFormContext } from './EnhancedForm';
import { motion, AnimatePresence } from '@/lib/mock-framer-motion';
import { cn } from '@/lib/utils';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  showSuccess?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  description,
  children,
  className,
  required = false,
  showSuccess = false,
}) => {
  const { formState: { errors, dirtyFields } } = useFormContext();
  
  const error = errors[name];
  const isDirty = dirtyFields[name];
  const isValid = isDirty && !error && showSuccess;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label 
          htmlFor={name}
          className={cn(
            'block text-sm font-medium transition-colors',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      <div className="relative">
        {children}
        
        {/* Success/Error Icons */}
        <AnimatePresence>
          {(error || isValid) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            >
              {error ? (
                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
              ) : isValid ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
              <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
              <span>{error.message}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormField;