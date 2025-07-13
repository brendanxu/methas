'use client';

import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { useFormContext } from './EnhancedForm';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  showSuccess?: boolean;
  variant?: 'default' | 'outline' | 'filled';
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  name,
  label,
  description,
  showSuccess,
  variant = 'default',
  options,
  placeholder,
  className,
  ...props
}, ref) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  const baseStyles = cn(
    'w-full px-4 py-3 pr-10 transition-all duration-200 ease-in-out appearance-none cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
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
      <div className="relative">
        <select
          {...register(name)}
          ref={ref}
          className={baseStyles}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </FormField>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;