'use client';

import React, { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from '@/lib/mock-framer-motion';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { cn } from '@/lib/utils';

interface TouchCardProps {
  children: ReactNode;
  className?: string;
  onTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  href?: string;
  disabled?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  ripple?: boolean;
}

export const TouchCard: React.FC<TouchCardProps> = ({
  children,
  className,
  onTap,
  onSwipeLeft,
  onSwipeRight,
  href,
  disabled = false,
  variant = 'default',
  size = 'md',
  ripple = true,
}) => {
  const swipeRef = useSwipeGesture<HTMLDivElement>({
    onSwipeLeft,
    onSwipeRight,
    threshold: 60,
  });

  const baseClasses = cn(
    'relative overflow-hidden transition-all duration-200 cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    'active:scale-[0.98] transform-gpu',
    
    // Variants
    {
      // Default
      'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700': variant === 'default',
      
      // Elevated
      'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg': variant === 'elevated',
      
      // Outlined
      'bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-primary': variant === 'outlined',
      
      // Filled
      'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'filled',
    },
    
    // Sizes
    {
      'p-3 rounded-lg': size === 'sm',
      'p-4 rounded-xl': size === 'md', 
      'p-6 rounded-2xl': size === 'lg',
    },
    
    // Disabled state
    {
      'opacity-50 cursor-not-allowed pointer-events-none': disabled,
    },
    
    className
  );

  const Component = href ? motion.a : motion.div;
  const componentProps = href ? { href } : {};

  return (
    <Component
      ref={swipeRef}
      className={baseClasses}
      onClick={onTap}
      whileTap={disabled ? {} : { scale: 0.98 }}
      whileHover={disabled ? {} : { y: -2 }}
      transition={{ duration: 0.1 }}
      {...componentProps}
    >
      {children}
      
      {/* Touch Ripple Effect */}
      {ripple && !disabled && <TouchRipple />}
    </Component>
  );
};

// Touch Ripple Effect Component
const TouchRipple: React.FC = () => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      onMouseDown={addRipple}
    >
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-current opacity-20"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
          animate={{ width: 100, height: 100 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

// Mobile-optimized news card
interface MobileNewsCardProps {
  title: string;
  excerpt: string;
  imageUrl?: string;
  publishedAt: Date;
  category: string;
  readingTime?: number;
  href?: string;
  onShare?: () => void;
  onBookmark?: () => void;
}

export const MobileNewsCard: React.FC<MobileNewsCardProps> = ({
  title,
  excerpt,
  imageUrl,
  publishedAt,
  category,
  readingTime,
  href,
  onShare,
  onBookmark,
}) => {
  return (
    <TouchCard
      variant="elevated"
      size="md"
      href={href}
      onSwipeLeft={onBookmark}
      onSwipeRight={onShare}
      className="group"
    >
      {imageUrl && (
        <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-gray-100 relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="space-y-3">
        {/* Category and Reading Time */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
            {category}
          </span>
          {readingTime && (
            <span className="text-gray-500 dark:text-gray-400">
              {readingTime} min read
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        
        {/* Published Date */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {publishedAt.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
      
      {/* Swipe Hints */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          {onShare && (
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </div>
          )}
          {onBookmark && (
            <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </TouchCard>
  );
};

export default TouchCard;