'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from '@/lib/mock-framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'onLoad'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** 是否为关键图片（首屏） */
  priority?: boolean;
  /** 图片质量 (1-100) */
  quality?: number;
  /** 占位符类型 */
  placeholder?: 'blur' | 'empty';
  /** 模糊占位符数据 */
  blurDataURL?: string;
  /** 图片尺寸 */
  sizes?: string;
  /** 对象适配方式 */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 错误回调 */
  onError?: () => void;
  /** 是否显示加载状态 */
  showLoader?: boolean;
  /** 懒加载阈值 */
  threshold?: number;
  /** 根边距 */
  rootMargin?: string;
}

/**
 * 优化的图片组件
 * - 自动 WebP/AVIF 格式
 * - 响应式图片
 * - Intersection Observer 懒加载
 * - 渐进式加载
 * - 错误处理
 * - 占位符支持
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  objectFit = 'cover',
  onLoad,
  onError,
  showLoader = true,
  threshold = 0.1,
  rootMargin = '50px 0px',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // 使用 Intersection Observer 进行懒加载
  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  // 处理ref设置
  const handleRef = useCallback((node: HTMLImageElement | null) => {
    imageRef.current = node;
    if (observerRef && typeof observerRef === 'object' && 'current' in observerRef) {
      (observerRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
    }
  }, [observerRef]);

  // 是否应该加载图片
  const shouldLoad = priority || isIntersecting;

  // 处理图片加载完成
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // 处理图片加载错误
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // 生成默认的模糊占位符
  const defaultBlurDataURL = 
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  // 错误状态的占位符
  const ErrorPlaceholder = () => (
    <div 
      className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
      style={{ width, height }}
    >
      <svg 
        className="w-8 h-8" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    </div>
  );

  // 加载状态的 shimmer 效果
  const LoadingShimmer = () => (
    <div 
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
      style={{ width, height }}
    >
      <div className="w-full h-full bg-gray-200 rounded animate-shimmer" />
    </div>
  );

  if (hasError) {
    return <ErrorPlaceholder />;
  }

  return (
    <div className="relative overflow-hidden">
      {/* 加载状态指示器 */}
      <AnimatePresence>
        {isLoading && showLoader && shouldLoad && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            <LoadingShimmer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主图片 */}
      {shouldLoad && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            ref={handleRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL || defaultBlurDataURL}
            sizes={sizes}
            className={`transition-all duration-300 ${objectFit ? `object-${objectFit}` : ''} ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </motion.div>
      )}

      {/* 未触发懒加载时的占位符 */}
      {!shouldLoad && (
        <div 
          className={`bg-gray-100 ${className}`}
          style={{ width, height }}
        />
      )}
    </div>
  );
};

/**
 * 图片画廊组件 - 支持轮播和预览
 */
export interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  showThumbnails?: boolean;
  showDots?: boolean;
  allowZoom?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  autoPlay = false,
  autoPlayDelay = 5000,
  showThumbnails = true,
  showDots = true,
  allowZoom = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 自动播放逻辑
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayDelay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, autoPlayDelay, images.length]);

  // 停止自动播放
  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 导航函数
  const goToNext = useCallback(() => {
    stopAutoPlay();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    stopAutoPlay();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    stopAutoPlay();
    setCurrentIndex(index);
  }, []);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') setIsZoomed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  const currentImage = images[currentIndex];

  return (
    <div className={`relative ${className}`}>
      {/* 主图片区域 */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <OptimizedImage
            src={currentImage.src}
            alt={currentImage.alt}
            width={800}
            height={600}
            className={`w-full h-auto ${allowZoom ? 'cursor-zoom-in' : ''}`}
            onClick={() => allowZoom && setIsZoomed(true)}
            priority={currentIndex === 0}
          />
          
          {/* 图片说明 */}
          {currentImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm">{currentImage.caption}</p>
            </div>
          )}
        </motion.div>

        {/* 导航按钮 */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="上一张图片"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="下一张图片"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 指示点 */}
      {showDots && images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`跳转到第 ${index + 1} 张图片`}
            />
          ))}
        </div>
      )}

      {/* 缩略图 */}
      {showThumbnails && images.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <OptimizedImage
                src={image.src}
                alt={`${image.alt} 缩略图`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}

      {/* 全屏预览 */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-full max-h-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <OptimizedImage
                src={currentImage.src}
                alt={currentImage.alt}
                width={1200}
                height={900}
                className="max-w-full max-h-full object-contain"
                quality={95}
              />
              
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                aria-label="关闭预览"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 英雄图片组件 - 针对首屏大图优化
 */
export const HeroImage: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      priority={true}
      quality={90}
      sizes="100vw"
      placeholder="blur"
      {...props}
    />
  );
};

/**
 * 卡片图片组件 - 针对卡片图片优化
 */
export const CardImage: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      priority={false}
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      {...props}
    />
  );
};

/**
 * 头像图片组件 - 针对小尺寸头像优化
 */
export const AvatarImage: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      priority={false}
      quality={75}
      sizes="(max-width: 768px) 80px, 120px"
      placeholder="blur"
      {...props}
    />
  );
};

/**
 * 图标图片组件 - 针对图标优化
 */
export const IconImage: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      priority={false}
      quality={70}
      sizes="48px"
      placeholder="empty"
      {...props}
    />
  );
};