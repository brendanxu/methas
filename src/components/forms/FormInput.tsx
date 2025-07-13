'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { useFormContext } from './EnhancedForm';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  showSuccess?: boolean;
  variant?: 'default' | 'outline' | 'filled';
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  name,
  label,
  description,
  showSuccess,
  variant = 'default',
  className,
  type = 'text',
  ...props
}, ref) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  const baseStyles = cn(
    'w-full px-4 py-3 transition-all duration-200 ease-in-out',
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

  return (
    <FormField
      name={name}
      label={label}
      description={description}
      showSuccess={showSuccess}
    >
      <input
        {...register(name)}
        ref={ref}
        type={type}
        className={baseStyles}
        {...props}
      />
    </FormField>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;