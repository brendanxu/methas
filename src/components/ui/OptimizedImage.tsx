'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';

export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
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
}

/**
 * 优化的图片组件
 * - 自动 WebP/AVIF 格式
 * - 响应式图片
 * - 懒加载
 * - 占位符支持
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  ...props
}) => {
  // 生成默认的模糊占位符
  const defaultBlurDataURL = 
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL || defaultBlurDataURL}
      sizes={sizes}
      className={`transition-opacity duration-300 ${className}`}
      {...props}
    />
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