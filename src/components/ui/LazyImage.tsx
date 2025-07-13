'use client';

import React from 'react';
import {  motion, AnimatePresence  } from '@/lib/mock-framer-motion';
import { useLazyImage, useLazyBackgroundImage, useProgressiveImage } from '@/hooks/useLazyImage';
import { OptimizedImage, OptimizedImageProps } from './OptimizedImage';
import { cn } from '@/lib/utils';

export interface LazyImageProps extends OptimizedImageProps {
  /** Enable progressive loading (low quality first) */
  progressive?: boolean;
  /** Low quality image URL for progressive loading */
  lowQualitySrc?: string;
  /** Loading animation variant */
  loadingAnimation?: 'fade' | 'scale' | 'slide' | 'none';
  /** Custom loading indicator */
  loadingIndicator?: React.ReactNode;
  /** Container CSS class */
  containerClassName?: string;
  /** Intersection observer options */
  observerOptions?: {
    rootMargin?: string;
    threshold?: number | number[];
  };
}

/**
 * LazyImage - Image component with lazy loading capabilities
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  progressive = false,
  lowQualitySrc,
  loadingAnimation = 'fade',
  loadingIndicator,
  observerOptions = {},
  className,
  containerClassName,
  onLoad,
  onError,
  ...props
}) => {
  const {
    ref,
    isInView,
    isLoaded,
    hasError,
  } = useLazyImage({
    rootMargin: observerOptions.rootMargin || '100px',
    threshold: observerOptions.threshold || 0.1,
    onLoad: onLoad ? () => onLoad({} as any) : undefined,
    onError: onError ? (error: Event) => onError({} as any) : undefined,
  });

  // Progressive image loading
  const progressiveImage = useProgressiveImage(
    lowQualitySrc || String(src),
    String(src),
    {
      enabled: progressive && !!lowQualitySrc,
      ...observerOptions,
    }
  );

  const currentSrc = progressive && lowQualitySrc ? progressiveImage.currentSrc : src;
  const shouldRender = isInView || (progressive && progressiveImage.isInView);

  // Animation variants
  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  const variants = animationVariants[loadingAnimation];

  // Default loading indicator
  const DefaultLoadingIndicator = () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden', containerClassName)}
    >
      <AnimatePresence mode="wait">
        {!shouldRender ? (
          <motion.div
            key="loading"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {loadingIndicator || <DefaultLoadingIndicator />}
          </motion.div>
        ) : (
          <motion.div
            key="image"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <OptimizedImage
              src={currentSrc}
              alt={alt}
              className={className}
              {...props}
            />
            
            {/* Progressive loading overlay */}
            {progressive && lowQualitySrc && !progressiveImage.isHighQualityLoaded && (
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                  Loading HD...
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface LazyBackgroundImageProps {
  /** Background image URL */
  imageUrl: string;
  /** Children to render over the background */
  children?: React.ReactNode;
  /** Container className */
  className?: string;
  /** Loading placeholder */
  placeholder?: React.ReactNode;
  /** Background image CSS properties */
  backgroundStyle?: React.CSSProperties;
  /** Intersection observer options */
  observerOptions?: {
    rootMargin?: string;
    threshold?: number | number[];
  };
}

/**
 * LazyBackgroundImage - Component for lazy loading background images
 */
export const LazyBackgroundImage: React.FC<LazyBackgroundImageProps> = ({
  imageUrl,
  children,
  className,
  placeholder,
  backgroundStyle = {},
  observerOptions = {},
}) => {
  const {
    ref,
    isInView,
    isLoaded,
    style,
  } = useLazyBackgroundImage(imageUrl, {
    rootMargin: observerOptions.rootMargin || '100px',
    threshold: observerOptions.threshold || 0.1,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative', className)}
      style={{
        ...style,
        ...backgroundStyle,
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && placeholder && (
        <div className="absolute inset-0">
          {placeholder}
        </div>
      )}
      
      {/* Content */}
      <AnimatePresence>
        {(isInView || isLoaded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface LazyImageGalleryProps {
  /** Array of image URLs */
  images: Array<{
    src: string;
    alt: string;
    lowQualitySrc?: string;
  }>;
  /** Gallery container className */
  className?: string;
  /** Individual image className */
  imageClassName?: string;
  /** Enable progressive loading */
  progressive?: boolean;
  /** Grid columns */
  columns?: number;
  /** Gap between images */
  gap?: string;
  /** Loading animation */
  loadingAnimation?: 'fade' | 'scale' | 'slide' | 'stagger';
}

/**
 * LazyImageGallery - Gallery component with batch lazy loading
 */
export const LazyImageGallery: React.FC<LazyImageGalleryProps> = ({
  images,
  className,
  imageClassName,
  progressive = false,
  columns = 3,
  gap = '1rem',
  loadingAnimation = 'stagger',
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
  };

  const staggerVariants = {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  };

  return (
    <motion.div
      className={cn('w-full', className)}
      style={gridStyle}
      variants={loadingAnimation === 'stagger' ? staggerVariants.container : undefined}
      initial="initial"
      animate="animate"
    >
      {images.map((image, index) => (
        <motion.div
          key={`${image.src}-${index}`}
          variants={loadingAnimation === 'stagger' ? staggerVariants.item : undefined}
        >
          <LazyImage
            src={image.src}
            alt={image.alt}
            lowQualitySrc={image.lowQualitySrc}
            progressive={progressive}
            loadingAnimation={loadingAnimation === 'stagger' ? 'none' : loadingAnimation}
            className={imageClassName}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LazyImage;