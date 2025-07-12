'use client';

import React, { forwardRef } from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

// TypeScript type definitions
export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'> {
  /** Section padding size */
  spacing?: 'compact' | 'normal' | 'large';
  /** Background variant */
  background?: 'white' | 'gray' | 'dark' | 'gradient';
  /** Container width control */
  width?: 'full' | 'container' | 'narrow';
  /** Section subtitle (small colored text) */
  subtitle?: string;
  /** Section main title */
  title?: string;
  /** Section description */
  description?: string;
  /** Center align title area */
  centered?: boolean;
  /** Show top divider line */
  topDivider?: boolean;
  /** Show bottom divider line */
  bottomDivider?: boolean;
  /** Background pattern */
  pattern?: 'none' | 'dots' | 'grid';
  /** Enable parallax scrolling effect */
  parallax?: boolean;
  /** Custom background image URL */
  backgroundImage?: string;
  /** Custom gradient colors */
  gradientFrom?: string;
  /** Custom gradient to color */
  gradientTo?: string;
  /** Section content */
  children?: React.ReactNode;
  /** Custom container class */
  containerClassName?: string;
  /** Show title area */
  showTitleArea?: boolean;
}

/**
 * Section - Universal section component for page layout blocks
 * Features flexible spacing, backgrounds, patterns, and title areas
 */
export const Section = forwardRef<HTMLElement, SectionProps>(({
  spacing = 'normal',
  background = 'white',
  width = 'container',
  subtitle,
  title,
  description,
  centered = false,
  topDivider = false,
  bottomDivider = false,
  pattern = 'none',
  parallax = false,
  backgroundImage,
  gradientFrom,
  gradientTo,
  children,
  className,
  containerClassName,
  showTitleArea = true,
  ...props
}, ref) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();

  // Spacing configurations
  const spacingConfig = {
    compact: 'py-8 md:py-12',
    normal: 'py-12 md:py-20',
    large: 'py-20 md:py-32',
  };

  // Width configurations
  const widthConfig = {
    full: 'w-full',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  };

  // Background configurations
  const getBackgroundStyles = () => {
    switch (background) {
      case 'gray':
        return {
          className: 'bg-gray-50 dark:bg-gray-800',
          style: {
            backgroundColor: colors.muted,
          },
        };
      case 'dark':
        return {
          className: 'bg-gray-900 text-white',
          style: {
            backgroundColor: '#111827',
            color: '#FFFFFF',
          },
        };
      case 'gradient':
        return {
          className: 'bg-gradient-to-br',
          style: {
            background: `linear-gradient(135deg, ${gradientFrom || colors.primary} 0%, ${gradientTo || colors.secondary} 100%)`,
            color: background === 'gradient' ? '#FFFFFF' : colors.foreground,
          },
        };
      default: // white
        return {
          className: 'bg-white',
          style: {
            backgroundColor: colors.background,
            color: colors.foreground,
          },
        };
    }
  };

  const backgroundStyles = getBackgroundStyles();

  // Pattern configurations
  const getPatternStyles = () => {
    const isDark = background === 'dark' || background === 'gradient';
    const patternColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(${patternColor} 1px, transparent 1px),
            linear-gradient(90deg, ${patternColor} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        };
      default:
        return {};
    }
  };

  const patternStyles = getPatternStyles();

  // Title area color based on background
  const getTitleColors = () => {
    const isDark = background === 'dark' || background === 'gradient';
    return {
      subtitle: isDark ? '#60A5FA' : colors.primary, // Light blue for dark backgrounds
      title: isDark ? '#FFFFFF' : colors.foreground,
      description: isDark ? '#D1D5DB' : colors.mutedForeground, // Light gray for dark backgrounds
    };
  };

  const titleColors = getTitleColors();

  // Render title area
  const renderTitleArea = () => {
    if (!showTitleArea || (!subtitle && !title && !description)) return null;

    return (
      <motion.div
        className={cn(
          'mb-12 md:mb-16',
          centered ? 'text-center' : 'text-left',
          widthConfig[width]
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {subtitle && (
          <motion.p
            className="text-sm md:text-base font-semibold uppercase tracking-wider mb-3"
            style={{ color: titleColors.subtitle }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.p>
        )}
        
        {title && (
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{ color: titleColors.title }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>
        )}
        
        {description && (
          <motion.p
            className={cn(
              'text-lg md:text-xl leading-relaxed',
              centered ? 'max-w-3xl mx-auto' : 'max-w-3xl'
            )}
            style={{ color: titleColors.description }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    );
  };

  // Render divider
  const renderDivider = (position: 'top' | 'bottom') => {
    const dividerClass = position === 'top' ? 'absolute top-0 left-0 right-0' : 'absolute bottom-0 left-0 right-0';
    const isDark = background === 'dark' || background === 'gradient';
    
    return (
      <div 
        className={cn('h-px', dividerClass)}
        style={{ 
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.border 
        }}
      />
    );
  };

  // Motion variants for parallax
  const parallaxVariants = {
    initial: { y: 0 },
    animate: { y: 0 },
  };

  return (
    <motion.section
      ref={ref}
      className={cn(
        'relative',
        spacingConfig[spacing],
        backgroundStyles.className,
        topDivider || bottomDivider ? 'relative' : '',
        className
      )}
      style={{
        ...backgroundStyles.style,
        ...patternStyles,
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }),
      }}
      variants={parallax && !settings.reducedMotion ? parallaxVariants : undefined}
      initial="initial"
      whileInView="animate"
      viewport={{ once: false }}
      {...props}
    >
      {/* Background overlay for better text readability when using background images */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-black/40"
          style={{ 
            backgroundColor: background === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)' 
          }} 
        />
      )}

      {/* Dividers */}
      {topDivider && renderDivider('top')}
      {bottomDivider && renderDivider('bottom')}

      {/* Content */}
      <div className="relative z-10">
        {/* Title Area */}
        {renderTitleArea()}

        {/* Main Content */}
        {children && (
          <motion.div
            className={cn(
              width === 'full' ? 'w-full' : widthConfig[width],
              containerClassName
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
});

Section.displayName = 'Section';

export default Section;