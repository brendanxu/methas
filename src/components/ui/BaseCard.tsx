'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

// TypeScript type definitions  
export interface BaseCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'> {
  /** Card padding size */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Card border radius */
  radius?: 'none' | 'small' | 'medium' | 'large';
  /** Enable hover effects */
  hoverable?: boolean;
  /** Enable loading skeleton state */
  loading?: boolean;
  /** Card elevation level */
  elevation?: 'none' | 'small' | 'medium' | 'large';
  /** Make card clickable */
  clickable?: boolean;
  /** Custom click handler */
  onClick?: () => void;
  /** Card content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Card variant style */
  variant?: 'default' | 'bordered' | 'glass';
}

/**
 * BaseCard - Foundation card component for all other card variants
 * Provides consistent styling, hover effects, and accessibility features
 */
export const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(({
  padding = 'medium',
  radius = 'medium',
  hoverable = false,
  loading = false,
  elevation = 'small',
  clickable = false,
  onClick,
  children,
  className,
  variant = 'default',
  ...props
}, ref) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();

  // Padding configurations
  const paddingConfig = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  // Border radius configurations
  const radiusConfig = {
    none: 'rounded-none',
    small: 'rounded-md',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  };

  // Elevation configurations
  const elevationConfig = {
    none: '',
    small: 'shadow-soft',
    medium: 'shadow-medium',
    large: 'shadow-strong',
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'bordered':
        return {
          className: 'border-2',
          style: {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        };
      case 'glass':
        return {
          className: 'backdrop-blur-md border',
          style: {
            backgroundColor: `${colors.background}80`,
            borderColor: `${colors.border}40`,
          },
        };
      default:
        return {
          className: 'border',
          style: {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Handle click
  const handleClick = () => {
    if (clickable && onClick && !loading) {
      onClick();
    }
  };

  // Skeleton loading content
  const SkeletonContent = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-muted rounded w-1/3"></div>
    </div>
  );

  // Motion variants for animations
  const motionVariants = {
    initial: { 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    hover: hoverable ? { 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.2 }
    } : {},
    tap: clickable ? { 
      scale: 0.98,
      transition: { duration: 0.1 }
    } : {},
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Base styles
        'relative transition-all duration-200',
        
        // Interactive states
        clickable && 'cursor-pointer',
        clickable && !loading && 'hover:shadow-medium',
        
        // Focus styles
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        settings.highContrast && 'ring-2 ring-offset-2',
        
        // Size and spacing
        paddingConfig[padding],
        radiusConfig[radius],
        elevationConfig[elevation],
        
        // Variant styles
        variantStyles.className,
        
        // Loading state
        loading && 'pointer-events-none',
        
        // Custom className
        className
      )}
      style={{
        '--tw-ring-color': colors.primary,
        ...variantStyles.style,
        // Ensure proper contrast for loading state
        ...(loading && { opacity: 0.7 }),
      } as React.CSSProperties}
      
      // Motion props
      variants={motionVariants}
      initial="initial"
      whileHover={!settings.reducedMotion ? "hover" : {}}
      whileTap={!settings.reducedMotion ? "tap" : {}}
      
      // Event handlers
      onClick={handleClick}
      
      // Accessibility
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-disabled={loading}
      aria-busy={loading}
      onKeyDown={clickable ? (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !loading) {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      
      {...props}
    >
      {loading ? <SkeletonContent /> : children}
      
      {/* Loading overlay */}
      {loading && (
        <div 
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{ backgroundColor: `${colors.background}20` }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
});

BaseCard.displayName = 'BaseCard';

export default BaseCard;