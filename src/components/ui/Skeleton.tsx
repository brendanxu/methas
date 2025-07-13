import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'loading-skeleton',
    none: '',
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1em',
      }}
    />
  );
};

// 特定组件的骨架屏
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
        <Skeleton height={200} className="mb-4" />
        <Skeleton width="60%" height={24} />
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton width="40%" height={16} />
      </div>
    ))}
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
        <Skeleton width={80} height={80} variant="circular" />
        <div className="flex-1 space-y-2">
          <Skeleton width="40%" height={20} />
          <Skeleton height={16} />
          <Skeleton width="80%" height={16} />
        </div>
      </div>
    ))}
  </div>
);

export const NewsCardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <Skeleton height={200} variant="rectangular" className="rounded-none" />
        <div className="p-6 space-y-3">
          <Skeleton width="80%" height={20} />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton width="50%" height={14} />
        </div>
      </div>
    ))}
  </div>
);

export const HeaderSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between h-20 px-4">
      <div className="flex items-center space-x-3">
        <Skeleton width={40} height={40} variant="circular" />
        <div className="space-y-1">
          <Skeleton width={120} height={20} />
          <Skeleton width={80} height={12} />
        </div>
      </div>
      <div className="hidden md:flex space-x-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={80} height={16} />
        ))}
      </div>
      <div className="flex space-x-3">
        <Skeleton width={100} height={36} />
        <Skeleton width={36} height={36} />
      </div>
    </div>
  </div>
);

export default Skeleton;