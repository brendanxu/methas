'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import {  motion, AnimatePresence  } from '@/lib/mock-framer-motion';
import { cn } from '@/lib/utils';

// Extended props for OptimizedImage
export interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /** Custom blur data URL */
  blurDataURL?: string;
  /** Enable automatic blur placeholder generation */
  autoBlur?: boolean;
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Custom skeleton component */
  skeleton?: React.ReactNode;
  /** Animation on load */
  animate?: boolean;
  /** Fallback image URL */
  fallbackSrc?: string;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Error callback */
  onError?: (error: any) => void;
  /** Load callback */
  onLoad?: () => void;
  /** Container className */
  containerClassName?: string;
  /** Enable lazy loading with intersection observer */
  lazyLoad?: boolean;
  /** Intersection observer options */
  observerOptions?: IntersectionObserverInit;
  
  // SEO enhancements
  /** Image title for SEO and accessibility */
  title?: string;
  /** Image caption for semantic markup */
  caption?: string;
  /** Loading strategy for performance */
  loading?: 'lazy' | 'eager';
  /** Fetch priority hint */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Image decoding hint */
  decoding?: 'async' | 'sync' | 'auto';
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** ARIA described by for accessibility */
  ariaDescribedBy?: string;
  /** Generate structured data for this image */
  generateStructuredData?: boolean;
}

/**
 * OptimizedImage - Enhanced Next.js Image component with advanced optimizations
 * Features blur placeholder, lazy loading, error handling, and animations
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  blurDataURL,
  autoBlur = true,
  showSkeleton = true,
  skeleton,
  animate = true,
  fallbackSrc,
  loadingComponent,
  onError,
  onLoad,
  lazyLoad = false,
  observerOptions = { threshold: 0.1, rootMargin: '50px' },
  priority = false,
  placeholder = 'blur',
  quality = 85,
  sizes,
  title,
  caption,
  loading: loadingProp,
  fetchPriority = 'auto',
  decoding = 'async',
  ariaLabel,
  ariaDescribedBy,
  generateStructuredData = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(!lazyLoad);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate blur placeholder if auto blur is enabled
  const getBlurDataURL = (width: number, height: number): string => {
    if (blurDataURL) return blurDataURL;
    if (!autoBlur) return '';
    
    // Generate a simple blur placeholder using canvas
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 10, 10);
        gradient.addColorStop(0, '#f3f4f6');
        gradient.addColorStop(1, '#e5e7eb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 10, 10);
        return canvas.toDataURL();
      }
    }
    
    // Fallback blur data URL
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      observerOptions
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazyLoad, observerOptions]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  // Handle image error
  const handleError = (error: any) => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      onError?.(error);
    }
  };

  // Generate optimized blur data URL
  const optimizedBlurDataURL = autoBlur 
    ? getBlurDataURL(
        typeof width === 'number' ? width : 100,
        typeof height === 'number' ? height : 100
      )
    : blurDataURL;

  // Determine loading strategy
  const imageLoading = loadingProp || (priority ? 'eager' : 'lazy');

  // Generate structured data for image
  const generateImageStructuredData = () => {
    if (!generateStructuredData) return null;

    const imageObject = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      url: typeof src === 'string' ? src : '',
      name: title || alt,
      description: caption || alt,
      ...(typeof width === 'number' && { width }),
      ...(typeof height === 'number' && { height }),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageObject),
        }}
      />
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => {
    if (skeleton) return <>{skeleton}</>;
    if (loadingComponent) return <>{loadingComponent}</>;
    if (!showSkeleton) return null;

    return (
      <div 
        className={cn(
          'animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700',
          'flex items-center justify-center',
          className
        )}
        style={{ 
          width: typeof width === 'number' ? width : '100%',
          height: typeof height === 'number' ? height : '100%',
          aspectRatio: typeof width === 'number' && typeof height === 'number' 
            ? `${width}/${height}` 
            : undefined
        }}
      >
        <svg 
          className="w-8 h-8 text-gray-400 dark:text-gray-600" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    );
  };

  // Error component
  const ErrorComponent = () => (
    <div 
      className={cn(
        'bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600',
        'flex items-center justify-center text-gray-500 dark:text-gray-400',
        className
      )}
      style={{ 
        width: typeof width === 'number' ? width : '100%',
        height: typeof height === 'number' ? height : '100%',
        aspectRatio: typeof width === 'number' && typeof height === 'number' 
          ? `${width}/${height}` 
          : undefined
      }}
    >
      <div className="text-center">
        <svg 
          className="w-8 h-8 mx-auto mb-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
        <p className="text-xs">Image failed to load</p>
      </div>
    </div>
  );

  // Main image component with enhanced SEO attributes
  const imageElement = (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      placeholder={placeholder}
      blurDataURL={optimizedBlurDataURL}
      priority={priority}
      quality={quality}
      sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
      onLoad={handleLoad}
      onError={handleError}
      loading={imageLoading}
      decoding={decoding}
      title={title}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      // @ts-ignore - fetchpriority is a newer HTML attribute
      fetchpriority={fetchPriority}
      {...props}
    />
  );

  const content = (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', containerClassName)}
    >
      <AnimatePresence mode="wait">
        {!isInView ? (
          <LoadingSkeleton key="skeleton" />
        ) : hasError ? (
          <ErrorComponent key="error" />
        ) : (
          <motion.div
            key="image"
            initial={animate ? { opacity: 0, scale: 1.05 } : false}
            animate={animate ? { opacity: 1, scale: 1 } : false}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative"
          >
            {imageElement}
            
            {/* Loading overlay */}
            {!isLoaded && (
              <motion.div
                className="absolute inset-0 z-10"
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoaded ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSkeleton />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // If there's a caption, wrap in figure element for semantic markup
  if (caption) {
    return (
      <>
        {generateImageStructuredData()}
        <figure className="m-0">
          {content}
          <figcaption 
            className="text-sm text-muted-foreground mt-2 text-center"
            id={ariaDescribedBy}
          >
            {caption}
          </figcaption>
        </figure>
      </>
    );
  }

  return (
    <>
      {generateImageStructuredData()}
      {content}
    </>
  );
};

// Preset configurations for common use cases
export const OptimizedImagePresets = {
  hero: {
    priority: true,
    quality: 90,
    sizes: '100vw',
    animate: true,
    autoBlur: true,
  },
  
  card: {
    quality: 80,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    animate: true,
    lazyLoad: true,
  },
  
  thumbnail: {
    quality: 75,
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw',
    lazyLoad: true,
    animate: false,
  },
  
  avatar: {
    quality: 80,
    sizes: '(max-width: 640px) 15vw, 10vw',
    lazyLoad: true,
    animate: false,
  },
  
  gallery: {
    quality: 85,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    lazyLoad: true,
    animate: true,
    observerOptions: { threshold: 0.1, rootMargin: '100px' },
  },
};

// Utility function to create optimized image with preset
export const createOptimizedImage = (preset: keyof typeof OptimizedImagePresets) => {
  const PresetImage = (props: OptimizedImageProps) => (
    <OptimizedImage {...OptimizedImagePresets[preset]} {...props} />
  );
  PresetImage.displayName = `OptimizedImage.${preset}`;
  return PresetImage;
};

// Export preset components
export const HeroImage = createOptimizedImage('hero');
export const CardImage = createOptimizedImage('card');
export const ThumbnailImage = createOptimizedImage('thumbnail');
export const AvatarImage = createOptimizedImage('avatar');
export const GalleryImage = createOptimizedImage('gallery');

export default OptimizedImage;