'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from '@/lib/modern-animations';

interface ContactButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  href?: string;
  onClick?: () => void;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'medium',
  href = '/contact-us',
  onClick,
}) => {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-2.5 text-sm',
    large: 'px-8 py-3 text-base',
  };

  const baseClasses = `
    inline-flex items-center justify-center space-x-2 font-medium rounded-full
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${sizeClasses[size]} ${className}
  `;

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary-blue)',
      color: 'var(--white)',
      hoverBackgroundColor: 'var(--hover-blue)',
      focusRingColor: 'var(--primary-blue)',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--primary-blue)',
      border: `1px solid var(--primary-blue)`,
      hoverBackgroundColor: 'var(--primary-blue)',
      focusRingColor: 'var(--primary-blue)',
    },
  };

  const buttonContent = (
    <motion.button
      className={baseClasses}
      style={{
        backgroundColor: variantStyles[variant].backgroundColor,
        color: variantStyles[variant].color,
        border: variantStyles[variant].border,
      }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        backgroundColor: variantStyles[variant].hoverBackgroundColor,
        color: variant === 'secondary' ? 'var(--white)' : undefined,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <span>Contact us</span>
      
      {/* 箭头图标 */}
      <motion.svg
        className="w-4 h-4 ml-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        whileHover={{ x: 2 }}
        transition={{ duration: 0.2 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </motion.svg>
    </motion.button>
  );

  if (href && !onClick) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};

export default ContactButton;