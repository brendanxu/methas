'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from '@/lib/modern-animations';

interface SouthPoleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  target?: '_blank' | '_self';
  rel?: string;
}

export const SouthPoleButton: React.FC<SouthPoleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  type = 'button',
  target,
  rel,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'var(--sp-space-2) var(--sp-space-4)',
          fontSize: 'var(--sp-text-sm)',
          height: '32px',
          minWidth: '64px',
        };
      case 'lg':
        return {
          padding: 'var(--sp-space-4) var(--sp-space-8)',
          fontSize: 'var(--sp-text-lg)',
          height: '48px',
          minWidth: '120px',
        };
      case 'xl':
        return {
          padding: 'var(--sp-space-5) var(--sp-space-10)',
          fontSize: 'var(--sp-text-xl)',
          height: '56px',
          minWidth: '140px',
        };
      default: // md
        return {
          padding: 'var(--sp-space-3) var(--sp-space-6)',
          fontSize: 'var(--sp-text-base)',
          height: '40px',
          minWidth: '96px',
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--sp-primary-green)',
          color: 'var(--sp-white)',
          border: 'none',
          hoverBackgroundColor: 'var(--sp-text-primary)',
          hoverColor: 'var(--sp-white)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--sp-text-primary)',
          border: '2px solid var(--sp-text-primary)',
          hoverBackgroundColor: 'var(--sp-text-primary)',
          hoverColor: 'var(--sp-white)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--sp-text-primary)',
          border: 'none',
          hoverBackgroundColor: 'var(--sp-bg-light)',
          hoverColor: 'var(--sp-text-primary)',
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          color: 'var(--sp-accent)',
          border: 'none',
          hoverBackgroundColor: 'transparent',
          hoverColor: 'var(--sp-text-primary)',
          textDecoration: 'underline',
        };
      default: // primary
        return {
          backgroundColor: 'var(--sp-accent)',
          color: 'var(--sp-white)',
          border: 'none',
          hoverBackgroundColor: 'var(--sp-text-primary)',
          hoverColor: 'var(--sp-white)',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--sp-space-2)',
    fontFamily: 'var(--sp-font-primary)',
    fontWeight: 'var(--sp-fw-medium)',
    borderRadius: 'var(--sp-radius-base)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--sp-transition-base)',
    textDecoration: variant === 'link' ? 'underline' : 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    ...sizeStyles,
    ...variantStyles,
  };

  const buttonContent = (
    <>
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: '16px', height: '16px' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: 'currentColor' }}
          >
            <path
              d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
      
      {icon && iconPosition === 'left' && !loading && icon}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && !loading && icon}
      
      {variant === 'primary' && !icon && !loading && (
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: 'currentColor' }}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </>
  );

  const motionProps = {
    whileHover: disabled ? {} : { 
      scale: 1.02,
      backgroundColor: variantStyles.hoverBackgroundColor,
      color: variantStyles.hoverColor,
    },
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: { duration: 0.15 },
  };

  // If href is provided, render as Link or anchor
  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link href={href} className={className} target={target} rel={rel}>
          <motion.div
            style={baseStyles}
            {...motionProps}
          >
            {buttonContent}
          </motion.div>
        </Link>
      );
    } else {
      return (
        <motion.a
          href={href}
          className={className}
          style={baseStyles}
          target={target}
          rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
          {...motionProps}
        >
          {buttonContent}
        </motion.a>
      );
    }
  }

  // Render as button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={baseStyles}
      {...motionProps}
    >
      {buttonContent}
    </motion.button>
  );
};

// Pre-configured button variants for common use cases
export const SouthPolePrimaryButton: React.FC<Omit<SouthPoleButtonProps, 'variant'>> = (props) => (
  <SouthPoleButton {...props} variant="primary" />
);

export const SouthPoleSecondaryButton: React.FC<Omit<SouthPoleButtonProps, 'variant'>> = (props) => (
  <SouthPoleButton {...props} variant="secondary" />
);

export const SouthPoleOutlineButton: React.FC<Omit<SouthPoleButtonProps, 'variant'>> = (props) => (
  <SouthPoleButton {...props} variant="outline" />
);

export const SouthPoleGhostButton: React.FC<Omit<SouthPoleButtonProps, 'variant'>> = (props) => (
  <SouthPoleButton {...props} variant="ghost" />
);

export const SouthPoleLinkButton: React.FC<Omit<SouthPoleButtonProps, 'variant'>> = (props) => (
  <SouthPoleButton {...props} variant="link" />
);

export default SouthPoleButton;