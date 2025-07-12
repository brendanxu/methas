'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Skeleton } from 'antd';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /** 加载状态显示的占位符高度 */
  placeholderHeight?: number;
  /** 错误时显示的备用图片 */
  fallbackSrc?: string;
  /** 是否显示加载骨架屏 */
  showSkeleton?: boolean;
  /** 自定义加载状态组件 */
  loadingComponent?: React.ReactNode;
  /** 自定义错误状态组件 */
  errorComponent?: React.ReactNode;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholderHeight = 200,
  fallbackSrc = '/images/placeholder.jpg',
  showSkeleton = true,
  loadingComponent,
  errorComponent,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false); // 重置错误状态，尝试加载备用图片
    }
  };

  // 如果有错误且没有备用图片，显示错误组件
  if (hasError && imageSrc === fallbackSrc) {
    return (
      errorComponent || (
        <div 
          className={`bg-gray-200 flex items-center justify-center ${className}`}
          style={{ height: placeholderHeight }}
        >
          <span className="text-gray-500 text-sm">图片加载失败</span>
        </div>
      )
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* 加载状态 */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          {loadingComponent || (
            showSkeleton ? (
              <Skeleton.Image 
                active 
                style={{ 
                  width: '100%', 
                  height: placeholderHeight 
                }} 
              />
            ) : (
              <div 
                className="bg-gray-200 animate-pulse"
                style={{ height: placeholderHeight }}
              />
            )
          )}
        </div>
      )}
      
      {/* 实际图片 */}
      <Image
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;