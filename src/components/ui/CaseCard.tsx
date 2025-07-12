'use client';

import React, { forwardRef, useState } from 'react';
import Link from 'next/link';
import { Tag } from 'antd';
import { motion } from 'framer-motion';
import { BaseCard, BaseCardProps } from './BaseCard';
import { OptimizedImage } from './OptimizedImage';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

// TypeScript type definitions
export interface CaseCardTag {
  /** Tag label */
  label: string;
  /** Tag color variant */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Tag type */
  type?: 'industry' | 'service' | 'region' | 'other';
}

export interface CaseCardProps extends Omit<BaseCardProps, 'children' | 'onClick'> {
  /** Case study image URL */
  imageUrl: string;
  /** Image alt text for accessibility */
  imageAlt: string;
  /** Client company logo URL */
  clientLogo?: string;
  /** Client company name */
  clientName: string;
  /** Case study title */
  title: string;
  /** Case study summary/excerpt */
  summary: string;
  /** Industry and service tags */
  tags: CaseCardTag[];
  /** Link to full case study */
  href?: string;
  /** External link indicator */
  external?: boolean;
  /** Show client logo */
  showLogo?: boolean;
  /** Image loading state */
  imageLoading?: boolean;
  /** Maximum tags to display */
  maxTags?: number;
}

/**
 * CaseCard - Card component for displaying case studies with image, client info, and tags
 * Features 16:9 aspect ratio image and organized tag display
 */
export const CaseCard = forwardRef<HTMLDivElement, CaseCardProps>(({
  imageUrl,
  imageAlt,
  clientLogo,
  clientName,
  title,
  summary,
  tags = [],
  href,
  external = false,
  showLogo = true,
  imageLoading = false,
  maxTags = 3,
  className,
  loading = false,
  ...props
}, ref) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const [imageLoadError, setImageLoadError] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);

  // Tag color mapping
  const getTagColor = (tag: CaseCardTag) => {
    const colorMap = {
      primary: colors.primary,
      secondary: colors.secondary,
      success: colors.success,
      warning: '#FF8B00', // Antarctic Orange from brand colors
      error: colors.error,
      default: colors.mutedForeground,
    };
    return colorMap[tag.color || 'default'];
  };

  // Render tags with overflow handling
  const renderTags = () => {
    const visibleTags = tags.slice(0, maxTags);
    const remainingCount = tags.length - maxTags;

    return (
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag, index) => (
          <Tag
            key={`${tag.type}-${tag.label}-${index}`}
            color={tag.color}
            className="text-xs rounded-full border-0 px-3 py-1"
            style={{
              backgroundColor: `${getTagColor(tag)}15`,
              color: getTagColor(tag),
            }}
          >
            {tag.label}
          </Tag>
        ))}
        {remainingCount > 0 && (
          <Tag
            className="text-xs rounded-full border-0 px-3 py-1"
            style={{
              backgroundColor: `${colors.mutedForeground}15`,
              color: colors.mutedForeground,
            }}
          >
            +{remainingCount}
          </Tag>
        )}
      </div>
    );
  };

  // Loading skeleton
  const SkeletonContent = () => (
    <div className="space-y-4">
      {/* Image skeleton */}
      <div className="aspect-video bg-muted rounded-t-lg animate-pulse"></div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Client logo skeleton */}
        {showLogo && (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
          </div>
        )}
        
        {/* Title and summary skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-4/5 animate-pulse"></div>
          <div className="h-4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full w-16 animate-pulse"></div>
          <div className="h-6 bg-muted rounded-full w-20 animate-pulse"></div>
          <div className="h-6 bg-muted rounded-full w-14 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Card content
  const CardContent = () => (
    <div className="overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageLoading ? (
          <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : imageLoadError ? (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: colors.muted }}
          >
            <div 
              className="text-center"
              style={{ color: colors.mutedForeground }}
            >
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        ) : (
          <motion.img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageLoadError(true)}
            whileHover={!settings.reducedMotion ? { scale: 1.05 } : {}}
          />
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Client Logo and Name */}
        {showLogo && (
          <div className="flex items-center space-x-3">
            {clientLogo && !logoLoadError ? (
              <div className="w-12 h-12 rounded-lg border border-border overflow-hidden bg-background flex items-center justify-center">
                <OptimizedImage
                  src={clientLogo}
                  alt={`${clientName} logo`}
                  width={48}
                  height={48}
                  className="max-w-full max-h-full object-contain"
                  quality={90}
                  onError={() => setLogoLoadError(true)}
                />
              </div>
            ) : (
              <div 
                className="w-12 h-12 rounded-lg border border-border flex items-center justify-center"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.border 
                }}
              >
                <span 
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  {clientName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p 
                className="text-sm font-medium"
                style={{ color: colors.foreground }}
              >
                {clientName}
              </p>
              <p 
                className="text-xs"
                style={{ color: colors.mutedForeground }}
              >
                Client
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <h3 
          className="text-xl font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200"
          style={{ color: colors.foreground }}
        >
          {title}
        </h3>

        {/* Summary */}
        <p 
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: colors.mutedForeground }}
        >
          {summary}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="pt-2">
            {renderTags()}
          </div>
        )}
      </div>
    </div>
  );

  // Wrapper component for linking
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!href) {
      return <>{children}</>;
    }

    const linkProps = {
      className: "block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg",
      ...(external && {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    };

    return external ? (
      <a href={href} {...linkProps}>
        {children}
      </a>
    ) : (
      <Link href={href} {...linkProps}>
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <BaseCard
        ref={ref}
        padding="none"
        hoverable={Boolean(href)}
        loading={loading}
        className={cn('group overflow-hidden', className)}
        {...props}
      >
        {loading ? <SkeletonContent /> : <CardContent />}
      </BaseCard>
    </CardWrapper>
  );
});

CaseCard.displayName = 'CaseCard';

export default CaseCard;