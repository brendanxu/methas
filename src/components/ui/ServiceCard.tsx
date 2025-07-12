'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import {  motion  } from '@/lib/mock-framer-motion';
import { BaseCard, BaseCardProps } from './BaseCard';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

// TypeScript type definitions
export interface ServiceCardProps extends Omit<BaseCardProps, 'children' | 'onClick'> {
  /** Service icon element */
  icon: React.ReactNode;
  /** Service title */
  title: string;
  /** Service description */
  description: string;
  /** Learn more link URL */
  href?: string;
  /** Learn more link text */
  linkText?: string;
  /** Icon background color variant */
  iconVariant?: 'primary' | 'secondary' | 'success' | 'gradient';
  /** Card size variant */
  size?: 'small' | 'medium' | 'large';
  /** External link indicator */
  external?: boolean;
  /** Custom icon size */
  iconSize?: 'small' | 'medium' | 'large';
}

/**
 * ServiceCard - Card component for displaying services with icon, title, description, and action link
 * Features hover animations on both card and icon elements
 */
export const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(({
  icon,
  title,
  description,
  href,
  linkText = 'Learn more',
  iconVariant = 'primary',
  size = 'medium',
  external = false,
  iconSize = 'medium',
  className,
  loading = false,
  ...props
}, ref) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'small' as const,
      iconContainer: 'w-12 h-12',
      iconSizes: {
        small: 'w-5 h-5',
        medium: 'w-6 h-6',
        large: 'w-7 h-7',
      },
      titleClass: 'text-lg font-semibold',
      descriptionClass: 'text-sm',
      spacing: 'space-y-3',
    },
    medium: {
      padding: 'medium' as const,
      iconContainer: 'w-16 h-16',
      iconSizes: {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-10 h-10',
      },
      titleClass: 'text-xl font-semibold',
      descriptionClass: 'text-base',
      spacing: 'space-y-4',
    },
    large: {
      padding: 'large' as const,
      iconContainer: 'w-20 h-20',
      iconSizes: {
        small: 'w-7 h-7',
        medium: 'w-10 h-10',
        large: 'w-12 h-12',
      },
      titleClass: 'text-2xl font-semibold',
      descriptionClass: 'text-lg',
      spacing: 'space-y-6',
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
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: '#FFFFFF',
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

  // Render learn more link
  const renderLearnMoreLink = () => {
    if (!href) return null;

    const linkContent = (
      <span className="inline-flex items-center group-hover:gap-2 transition-all duration-200">
        {linkText}
        <motion.svg 
          className="w-4 h-4 ml-1 transition-transform duration-200"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          whileHover={{ x: 4 }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 7l5 5m0 0l-5 5m5-5H6" 
          />
        </motion.svg>
        {external && (
          <svg 
            className="w-3 h-3 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        )}
      </span>
    );

    const linkProps = {
      className: cn(
        'inline-flex items-center text-sm font-medium transition-colors duration-200',
        'hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
      ),
      style: { color: colors.primary },
      ...(external && {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    };

    return external ? (
      <a href={href} {...linkProps}>
        {linkContent}
      </a>
    ) : (
      <Link href={href} {...linkProps}>
        {linkContent}
      </Link>
    );
  };

  // Loading skeleton
  const SkeletonContent = () => (
    <div className={cn('animate-pulse', config.spacing)}>
      <div 
        className={cn('rounded-lg bg-muted', config.iconContainer)}
      />
      <div className="space-y-2">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
      <div className="h-4 bg-muted rounded w-1/3"></div>
    </div>
  );

  return (
    <BaseCard
      ref={ref}
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
          {/* Icon */}
          <motion.div
            className={cn(
              'rounded-lg flex items-center justify-center transition-all duration-200',
              config.iconContainer
            )}
            style={iconVariantStyles}
            whileHover={!settings.reducedMotion ? { 
              scale: 1.1, 
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.4 }
            } : {}}
          >
            <div className={config.iconSizes[iconSize]}>
              {icon}
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-2">
            <h3 
              className={cn(config.titleClass)}
              style={{ color: colors.foreground }}
            >
              {title}
            </h3>
            <p 
              className={cn(config.descriptionClass, 'leading-relaxed')}
              style={{ color: colors.mutedForeground }}
            >
              {description}
            </p>
          </div>

          {/* Learn More Link */}
          {renderLearnMoreLink()}
        </div>
      )}
    </BaseCard>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;