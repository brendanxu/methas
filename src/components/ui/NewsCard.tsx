'use client';

import React, { forwardRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BaseCard, BaseCardProps } from './BaseCard';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { formatDate } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// TypeScript type definitions
export interface NewsCardProps extends Omit<BaseCardProps, 'children' | 'onClick'> {
  /** News article image URL */
  imageUrl: string;
  /** Image alt text for accessibility */
  imageAlt: string;
  /** Article title */
  title: string;
  /** Article excerpt/summary */
  excerpt: string;
  /** Publication date */
  publishedAt: Date | string;
  /** Article category */
  category: string;
  /** Estimated reading time in minutes */
  readingTime?: number;
  /** Author name */
  author?: string;
  /** Link to full article */
  href?: string;
  /** External link indicator */
  external?: boolean;
  /** Layout variant for responsive design */
  layout?: 'horizontal' | 'vertical' | 'auto';
  /** Image loading state */
  imageLoading?: boolean;
  /** Show reading time */
  showReadingTime?: boolean;
  /** Show author */
  showAuthor?: boolean;
}

/**
 * NewsCard - Card component for displaying news articles with responsive layout
 * Features horizontal layout on desktop and vertical on mobile
 */
export const NewsCard = forwardRef<HTMLDivElement, NewsCardProps>(({
  imageUrl,
  imageAlt,
  title,
  excerpt,
  publishedAt,
  category,
  readingTime,
  author,
  href,
  external = false,
  layout = 'auto',
  imageLoading = false,
  showReadingTime = true,
  showAuthor = true,
  className,
  loading = false,
  ...props
}, ref) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const [imageLoadError, setImageLoadError] = useState(false);


  // Get layout classes based on variant
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return {
          container: 'md:flex md:items-start md:space-x-6 space-y-4 md:space-y-0',
          imageContainer: 'md:w-1/3 md:flex-shrink-0',
          contentContainer: 'md:w-2/3',
          imageAspect: 'aspect-video md:aspect-[4/3]',
        };
      case 'vertical':
        return {
          container: 'space-y-4',
          imageContainer: 'w-full',
          contentContainer: 'w-full',
          imageAspect: 'aspect-video',
        };
      default: // auto
        return {
          container: 'space-y-4 md:flex md:items-start md:space-x-6 md:space-y-0',
          imageContainer: 'w-full md:w-1/3 md:flex-shrink-0',
          contentContainer: 'w-full md:w-2/3',
          imageAspect: 'aspect-video md:aspect-[4/3]',
        };
    }
  };

  const layoutClasses = getLayoutClasses();

  // Loading skeleton
  const SkeletonContent = () => (
    <div className={layoutClasses.container}>
      {/* Image skeleton */}
      <div className={layoutClasses.imageContainer}>
        <div className={cn('bg-muted rounded-lg animate-pulse', layoutClasses.imageAspect)}></div>
      </div>
      
      {/* Content skeleton */}
      <div className={cn(layoutClasses.contentContainer, 'space-y-3')}>
        {/* Meta info skeleton */}
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-4/5 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-3/5 animate-pulse"></div>
        </div>
        
        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Card content
  const CardContent = () => (
    <div className={layoutClasses.container}>
      {/* Image */}
      <div className={layoutClasses.imageContainer}>
        <div className={cn('relative overflow-hidden rounded-lg bg-muted', layoutClasses.imageAspect)}>
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
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <p className="text-xs">Image not available</p>
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
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              style={{
                backgroundColor: `${colors.primary}90`,
                color: '#FFFFFF',
              }}
            >
              {category}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn(layoutClasses.contentContainer, 'space-y-3')}>
        {/* Meta information */}
        <div className="flex items-center space-x-4 text-sm">
          <span style={{ color: colors.mutedForeground }}>
            {formatDate(publishedAt)}
          </span>
          {showReadingTime && readingTime && (
            <>
              <span style={{ color: colors.border }}>•</span>
              <span 
                className="flex items-center space-x-1"
                style={{ color: colors.mutedForeground }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readingTime} min read</span>
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 
          className="text-lg md:text-xl font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200"
          style={{ color: colors.foreground }}
        >
          {title}
        </h3>

        {/* Excerpt */}
        <p 
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: colors.mutedForeground }}
        >
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {showAuthor && author ? (
            <span 
              className="text-sm font-medium"
              style={{ color: colors.foreground }}
            >
              By {author}
            </span>
          ) : (
            <div />
          )}
          
          {href && (
            <span 
              className="inline-flex items-center text-sm font-medium group-hover:gap-2 transition-all duration-200"
              style={{ color: colors.primary }}
            >
              Read more
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
          )}
        </div>
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
        padding="medium"
        hoverable={Boolean(href)}
        loading={loading}
        className={cn('group', className)}
        {...props}
      >
        {loading ? <SkeletonContent /> : <CardContent />}
      </BaseCard>
    </CardWrapper>
  );
});

NewsCard.displayName = 'NewsCard';

export default NewsCard;