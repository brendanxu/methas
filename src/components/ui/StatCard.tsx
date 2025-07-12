'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { Statistic } from 'antd';
import {  motion, useInView  } from '@/lib/mock-framer-motion';
import { BaseCard, BaseCardProps } from './BaseCard';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { formatNumber } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// TypeScript type definitions
export interface TrendData {
  /** Trend direction */
  direction: 'up' | 'down' | 'neutral';
  /** Trend percentage */
  percentage: number;
  /** Trend label */
  label?: string;
}

export interface StatCardProps extends Omit<BaseCardProps, 'children' | 'onClick'> {
  /** Statistic title */
  title: string;
  /** Statistic value */
  value: number;
  /** Value suffix (e.g., %, kg, $) */
  suffix?: string;
  /** Value prefix (e.g., $, €, £) */
  prefix?: string;
  /** Number of decimal places */
  precision?: number;
  /** Statistic icon */
  icon?: React.ReactNode;
  /** Icon color variant */
  iconVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Trend indicator data */
  trend?: TrendData;
  /** Enable animated counting */
  animated?: boolean;
  /** Custom formatter function */
  formatter?: (value: number) => string;
  /** Card size variant */
  size?: 'small' | 'medium' | 'large';
  /** Icon position */
  iconPosition?: 'left' | 'right' | 'top';
  /** Additional description */
  description?: string;
  /** Show trend indicator */
  showTrend?: boolean;
}

/**
 * StatCard - Card component for displaying statistics with Ant Design Statistic
 * Features animated numbers, trend indicators, and customizable layouts
 */
export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(({
  title,
  value,
  suffix,
  prefix,
  precision = 0,
  icon,
  iconVariant = 'primary',
  trend,
  animated = true,
  formatter,
  size = 'medium',
  iconPosition = 'left',
  description,
  showTrend = true,
  className,
  loading = false,
  ...props
}) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'small' as const,
      iconSize: 'w-8 h-8',
      titleClass: 'text-sm',
      valueClass: 'text-2xl',
      descriptionClass: 'text-xs',
      spacing: 'space-y-2',
    },
    medium: {
      padding: 'medium' as const,
      iconSize: 'w-12 h-12',
      titleClass: 'text-base',
      valueClass: 'text-3xl',
      descriptionClass: 'text-sm',
      spacing: 'space-y-3',
    },
    large: {
      padding: 'large' as const,
      iconSize: 'w-16 h-16',
      titleClass: 'text-lg',
      valueClass: 'text-4xl',
      descriptionClass: 'text-base',
      spacing: 'space-y-4',
    },
  };

  // Icon variant styles
  const getIconVariantStyles = () => {
    switch (iconVariant) {
      case 'secondary':
        return {
          backgroundColor: `${colors.secondary}15`,
          color: colors.secondary,
        };
      case 'success':
        return {
          backgroundColor: `${colors.success}15`,
          color: colors.success,
        };
      case 'warning':
        return {
          backgroundColor: '#FF8B0015', // Antarctic Orange
          color: '#FF8B00',
        };
      case 'error':
        return {
          backgroundColor: `${colors.error}15`,
          color: colors.error,
        };
      default: // primary
        return {
          backgroundColor: `${colors.primary}15`,
          color: colors.primary,
        };
    }
  };

  const config = sizeConfig[size];
  const iconVariantStyles = getIconVariantStyles();

  // Animate value when in view
  useEffect(() => {
    if (animated && isInView && !hasAnimated && !settings.reducedMotion) {
      setHasAnimated(true);
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else if (!animated || settings.reducedMotion) {
      setDisplayValue(value);
    }
  }, [animated, isInView, value, hasAnimated, settings.reducedMotion]);

  // Get trend color and icon
  const getTrendStyle = () => {
    if (!trend) return {};
    
    switch (trend.direction) {
      case 'up':
        return {
          color: colors.success,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          ),
        };
      case 'down':
        return {
          color: colors.error,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
            </svg>
          ),
        };
      default:
        return {
          color: colors.mutedForeground,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
            </svg>
          ),
        };
    }
  };

  const trendStyle = getTrendStyle();

  // Custom formatter that handles animation
  const customFormatter = (val: string | number) => {
    const numVal = typeof val === 'number' ? val : parseFloat(val) || 0;
    
    if (formatter) {
      return formatter(numVal);
    }
    
    const formattedValue = formatNumber(numVal, { minimumFractionDigits: precision, maximumFractionDigits: precision });
    return `${prefix || ''}${formattedValue}${suffix || ''}`;
  };

  // Layout configurations
  const getLayoutClasses = () => {
    switch (iconPosition) {
      case 'right':
        return 'flex items-start justify-between';
      case 'top':
        return 'text-center space-y-3';
      default: // left
        return 'flex items-start space-x-4';
    }
  };

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <motion.div
        className={cn(
          'rounded-lg flex items-center justify-center transition-all duration-200',
          config.iconSize
        )}
        style={iconVariantStyles}
        whileHover={!settings.reducedMotion ? { 
          scale: 1.05,
          transition: { duration: 0.2 }
        } : {}}
      >
        <div className="w-6 h-6">
          {icon}
        </div>
      </motion.div>
    );
  };

  // Render trend indicator
  const renderTrend = () => {
    if (!trend || !showTrend) return null;

    return (
      <div 
        className="flex items-center space-x-1 text-sm"
        style={{ color: trendStyle.color }}
      >
        {trendStyle.icon}
        <span className="font-medium">
          {formatNumber(trend.percentage, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
        </span>
        {trend.label && (
          <span className="text-xs" style={{ color: colors.mutedForeground }}>
            {trend.label}
          </span>
        )}
      </div>
    );
  };

  // Loading skeleton
  const SkeletonContent = () => (
    <div className={config.spacing}>
      <div className={getLayoutClasses()}>
        {(iconPosition === 'left' || iconPosition === 'right') && (
          <div className={cn('bg-muted rounded-lg animate-pulse', config.iconSize)}></div>
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
      {showTrend && (
        <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
      )}
      {description && (
        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
      )}
    </div>
  );

  return (
    <BaseCard
      ref={cardRef}
      padding={config.padding}
      hoverable={true}
      loading={loading}
      className={cn('group', className)}
      {...props}
    >
      {loading ? (
        <SkeletonContent />
      ) : (
        <div className={config.spacing}>
          {/* Main content */}
          <div className={getLayoutClasses()}>
            {iconPosition === 'top' && renderIcon()}
            
            {(iconPosition === 'left' || iconPosition === 'right') && renderIcon()}
            
            <div className={iconPosition === 'top' ? 'w-full' : 'flex-1'}>
              {/* Title */}
              <h3 
                className={cn(config.titleClass, 'font-medium mb-1')}
                style={{ color: colors.mutedForeground }}
              >
                {title}
              </h3>
              
              {/* Statistic */}
              <div className={config.valueClass}>
                <Statistic
                  value={displayValue}
                  formatter={customFormatter}
                  valueStyle={{
                    color: colors.foreground,
                    fontSize: 'inherit',
                    fontWeight: 'bold',
                    lineHeight: '1.2',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Trend indicator */}
          {renderTrend()}

          {/* Description */}
          {description && (
            <p 
              className={cn(config.descriptionClass, 'leading-relaxed')}
              style={{ color: colors.mutedForeground }}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </BaseCard>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;