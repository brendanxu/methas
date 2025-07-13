'use client';

import React, { forwardRef } from 'react';
import { Spin } from 'antd';
import {  motion  } from '@/lib/mock-framer-motion';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

// TypeScript type definitions  
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  /** Button variant styles */
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  /** Button size - affects height and padding */
  size?: 'small' | 'medium' | 'large';
  /** Loading state - shows spinner and disables button */
  loading?: boolean;
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right';
  /** Make button full width */
  fullWidth?: boolean;
  /** Button content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Custom loading text */
  loadingText?: string;
}

/**
 * Unified Button component combining Tailwind styles with Ant Design functionality
 * Supports multiple variants, sizes, loading states, and animations
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  loadingText,
  onClick,
  ...props
}, ref) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  
  // Handle loading or disabled state
  const isInteractionDisabled = loading || disabled;
  
  // Get height based on size (matching requirements)
  const sizeConfig = {
    small: {
      height: '32px',
      padding: 'px-3 py-1',
      fontSize: 'text-sm',
      iconSize: 'w-4 h-4',
      spinSize: 'small' as const,
    },
    medium: {
      height: '40px', 
      padding: 'px-4 py-2',
      fontSize: 'text-base',
      iconSize: 'w-5 h-5',
      spinSize: 'small' as const,
    },
    large: {
      height: '48px',
      padding: 'px-6 py-3', 
      fontSize: 'text-lg',
      iconSize: 'w-6 h-6',
      spinSize: 'default' as const,
    },
  };

  // Get variant styles
  const getVariantStyles = () => {
    const baseStyles = 'border border-transparent';
    
    switch (variant) {
      case 'primary':
        return {
          className: cn(baseStyles, 'text-white'),
          style: {
            backgroundColor: isInteractionDisabled ? `${colors.primary}60` : colors.primary,
            borderColor: isInteractionDisabled ? `${colors.primary}60` : colors.primary,
          },
          hoverStyle: {
            backgroundColor: `${colors.primary}E6`,
            transform: 'translateY(-1px)',
          },
        };
        
      case 'secondary':
        return {
          className: cn(baseStyles, 'bg-background border-2'),
          style: {
            color: isInteractionDisabled ? `${colors.primary}60` : colors.primary,
            borderColor: isInteractionDisabled ? `${colors.primary}60` : colors.primary,
            backgroundColor: colors.background,
          },
          hoverStyle: {
            backgroundColor: `${colors.primary}10`,
            transform: 'translateY(-1px)',
          },
        };
        
      case 'ghost':
        return {
          className: cn(baseStyles, 'bg-transparent border-transparent'),
          style: {
            color: isInteractionDisabled ? `${colors.foreground}60` : colors.foreground,
            backgroundColor: 'transparent',
          },
          hoverStyle: {
            backgroundColor: colors.muted,
            transform: 'translateY(-1px)',
          },
        };
        
      case 'success':
        return {
          className: cn(baseStyles, 'text-white'),
          style: {
            backgroundColor: isInteractionDisabled ? `${colors.success}60` : colors.success,
            borderColor: isInteractionDisabled ? `${colors.success}60` : colors.success,
          },
          hoverStyle: {
            backgroundColor: `${colors.success}E6`,
            transform: 'translateY(-1px)',
          },
        };
        
      default:
        return getVariantStyles();
    }
  };

  const variantStyles = getVariantStyles();
  const config = sizeConfig[size];

  // Handle click with loading state
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isInteractionDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  // Render icon with proper sizing
  const renderIcon = (position: 'left' | 'right') => {
    if (!icon || iconPosition !== position) return null;
    
    return (
      <span className={cn(
        'inline-flex items-center justify-center',
        config.iconSize,
        children && position === 'left' && 'mr-2',
        children && position === 'right' && 'ml-2'
      )}>
        {icon}
      </span>
    );
  };

  // Render loading spinner
  const renderLoadingSpinner = () => {
    if (!loading) return null;
    
    return (
      <span className={cn(
        'inline-flex items-center justify-center',
        children && 'mr-2'
      )}>
        <Spin size={config.spinSize} />
      </span>
    );
  };

  // Button content
  const buttonContent = (
    <>
      {loading && renderLoadingSpinner()}
      {!loading && renderIcon('left')}
      {loading && loadingText ? loadingText : children}
      {!loading && renderIcon('right')}
    </>
  );

  return (
    <motion.div
      whileHover={isInteractionDisabled ? {} : variantStyles.hoverStyle}
      whileTap={isInteractionDisabled ? {} : { 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      animate={settings.reducedMotion ? {} : {
        transition: { duration: 0.2 }
      }}
      style={{ display: 'inline-block', width: fullWidth ? '100%' : 'auto' }}
    >
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'font-semibold rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed',
          settings.highContrast && 'ring-2 ring-offset-2',
          
          // Size styles
          config.padding,
          config.fontSize,
          
          // Full width
          fullWidth && 'w-full',
          
          // Variant styles
          variantStyles.className,
          
          // Custom className
          className
        )}
        style={{
          height: config.height,
          ...variantStyles.style,
        } as React.CSSProperties}
        disabled={isInteractionDisabled}
        onClick={handleClick}
        
        // Accessibility
        aria-disabled={isInteractionDisabled}
        aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
        
        {...props}
      >
        {buttonContent}
      </button>
    </motion.div>
  );
});

Button.displayName = 'Button';

export default Button;