'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { motion } from '@/lib/mock-framer-motion';
import { cn } from '@/lib/utils';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const FormButton: React.FC<FormButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    'transform active:scale-95 hover:scale-[1.02]',
    
    // Sizes
    {
      'px-3 py-2 text-sm': size === 'sm',
      'px-4 py-3 text-sm': size === 'md',
      'px-6 py-4 text-base': size === 'lg',
    },
    
    // Variants
    {
      // Primary
      'bg-primary text-white hover:bg-primary-700 focus:ring-primary shadow-sm': variant === 'primary',
      
      // Secondary
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600': variant === 'secondary',
      
      // Outline
      'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary': variant === 'outline',
      
      // Ghost
      'text-primary hover:bg-primary/10 focus:ring-primary': variant === 'ghost',
      
      // Danger
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm': variant === 'danger',
    },
    
    // Full width
    {
      'w-full': fullWidth,
    },
    
    className
  );

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={baseStyles}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            {loadingText && <span>{loadingText}</span>}
          </div>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default FormButton;