'use client';

import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { useFormContext } from './EnhancedForm';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  showSuccess?: boolean;
  variant?: 'default' | 'outline' | 'filled';
  autoResize?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  name,
  label,
  description,
  showSuccess,
  variant = 'default',
  autoResize = true,
  className,
  rows = 4,
  ...props
}, ref) => {
  const { register, formState: { errors }, watch } = useFormContext();
  const error = errors[name];
  const value = watch(name);

  const baseStyles = cn(
    'w-full px-4 py-3 transition-all duration-200 ease-in-out resize-none',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    {
      // Default variant
      'border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white': variant === 'default',
      'focus:border-primary focus:ring-primary': variant === 'default' && !error,
      'border-red-300 focus:border-red-500 focus:ring-red-500': variant === 'default' && error,
      
      // Outline variant
      'border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent': variant === 'outline',
      'focus:border-primary focus:ring-primary/20': variant === 'outline' && !error,
      'border-red-300 focus:border-red-500 focus:ring-red-500/20': variant === 'outline' && error,
      
      // Filled variant
      'border-0 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white': variant === 'filled',
      'focus:bg-white dark:focus:bg-gray-800 focus:ring-primary': variant === 'filled' && !error,
      'bg-red-50 dark:bg-red-900/20 focus:ring-red-500': variant === 'filled' && error,
    },
    className
  );

  // Auto-resize functionality
  const handleTextareaRef = (element: HTMLTextAreaElement | null) => {
    if (element && autoResize) {
      const resizeTextarea = () => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
      };
      
      element.addEventListener('input', resizeTextarea);
      resizeTextarea(); // Initial resize
      
      return () => element.removeEventListener('input', resizeTextarea);
    }
    return undefined;
  };

  React.useEffect(() => {
    if (autoResize && value !== undefined) {
      // Trigger resize when value changes programmatically
      const textarea = document.querySelector(`textarea[name="${name}"]`) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, [value, name, autoResize]);

  return (
    <FormField
      name={name}
      label={label}
      description={description}
      showSuccess={showSuccess}
    >
      <textarea
        {...register(name)}
        ref={(el) => {
          handleTextareaRef(el);
          if (ref) {
            if (typeof ref === 'function') {
              ref(el);
            } else {
              ref.current = el;
            }
          }
        }}
        rows={rows}
        className={baseStyles}
        {...props}
      />
    </FormField>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;