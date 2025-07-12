# South Pole Theme System - Component Examples

## 🎯 Overview

This guide provides practical examples of how to use the South Pole theme system with various UI components. Each example includes code snippets, best practices, and accessibility considerations.

## 🚀 Basic Components

### Theme Toggle Button

A simple theme toggle button with smooth transitions and accessibility support.

```tsx
import React from 'react';
import { useTheme } from '@/app/providers';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-3 rounded-full border-2 transition-all duration-300
        ${isDark 
          ? 'bg-gray-800 border-gray-600 text-yellow-400' 
          : 'bg-white border-gray-300 text-gray-600'
        }
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
};
```

### Color Palette Display

Display South Pole brand colors with accessibility information.

```tsx
import React from 'react';
import { SOUTH_POLE_BRAND_COLORS, getContrastRatio, isAccessible } from '@/lib/colors';
import { useThemeColors } from '@/app/providers';

interface ColorSwatchProps {
  name: string;
  color: string;
  className?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, color, className }) => {
  const whiteContrast = getContrastRatio(color, '#FFFFFF');
  const blackContrast = getContrastRatio(color, '#000000');
  const isWhiteAccessible = isAccessible(color, '#FFFFFF', 'AA');
  const isBlackAccessible = isAccessible(color, '#000000', 'AA');
  
  return (
    <div className={`group relative ${className}`}>
      <div 
        className="w-24 h-24 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
        title={`${name}: ${color}`}
      />
      
      <div className="mt-2 text-center">
        <h3 className="font-semibold text-sm capitalize">{name}</h3>
        <p className="text-xs font-mono text-muted-foreground">{color}</p>
        
        {/* Accessibility Info */}
        <div className="mt-1 text-xs">
          <div className={`inline-block px-1 rounded ${isWhiteAccessible ? 'bg-success text-white' : 'bg-error text-white'}`}>
            W: {whiteContrast.toFixed(1)}
          </div>
          <span className="mx-1">|</span>
          <div className={`inline-block px-1 rounded ${isBlackAccessible ? 'bg-success text-white' : 'bg-error text-white'}`}>
            B: {blackContrast.toFixed(1)}
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Click to copy: {color}
      </div>
    </div>
  );
};

export const ColorPalette: React.FC = () => {
  const colors = useThemeColors();
  
  const handleColorCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    // You could add a toast notification here
  };
  
  return (
    <div className="p-6 bg-card rounded-lg border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">South Pole Brand Colors</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {Object.entries(SOUTH_POLE_BRAND_COLORS).map(([name, color]) => (
          <div key={name} onClick={() => handleColorCopy(color)}>
            <ColorSwatch name={name} color={color} />
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Current Theme Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Background:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: colors.background }}
              />
              <code className="text-xs">{colors.background}</code>
            </div>
          </div>
          
          <div>
            <span className="font-medium">Foreground:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: colors.foreground }}
              />
              <code className="text-xs">{colors.foreground}</code>
            </div>
          </div>
          
          <div>
            <span className="font-medium">Primary:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: colors.primary }}
              />
              <code className="text-xs">{colors.primary}</code>
            </div>
          </div>
          
          <div>
            <span className="font-medium">Border:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: colors.border }}
              />
              <code className="text-xs">{colors.border}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Themed Card Component

A flexible card component that adapts to the current theme.

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '@/app/providers';
import { cn } from '@/lib/utils';

interface ThemedCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  hover?: boolean;
  className?: string;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  title,
  subtitle,
  children,
  variant = 'default',
  hover = true,
  className,
}) => {
  const colors = useThemeColors();
  
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: 'white',
          borderColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: 'white',
          borderColor: colors.secondary,
        };
      case 'success':
        return {
          backgroundColor: colors.success,
          color: 'white',
          borderColor: colors.success,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          color: 'white',
          borderColor: colors.warning,
        };
      case 'error':
        return {
          backgroundColor: colors.error,
          color: 'white',
          borderColor: colors.error,
        };
      default:
        return {
          backgroundColor: colors.card,
          color: colors.cardForeground,
          borderColor: colors.border,
        };
    }
  };
  
  const variantStyles = getVariantStyles(variant);
  
  return (
    <motion.div
      className={cn(
        'rounded-lg border p-6 shadow-soft transition-all duration-200',
        hover && 'hover:shadow-medium hover:-translate-y-1',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        className
      )}
      style={variantStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : undefined}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm opacity-80 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children && (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </motion.div>
  );
};

// Usage Examples
export const CardExamples: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ThemedCard
          title="Default Card"
          subtitle="This card adapts to the current theme"
        >
          <p>Content goes here. The card automatically uses the appropriate colors for the current theme.</p>
        </ThemedCard>
        
        <ThemedCard
          title="Primary Card"
          subtitle="Using South Pole primary color"
          variant="primary"
        >
          <p>This card uses the South Pole primary brand color (#002145) with appropriate contrast.</p>
        </ThemedCard>
        
        <ThemedCard
          title="Success Card"
          subtitle="For positive actions"
          variant="success"
        >
          <p>Use this variant for success messages and positive confirmations.</p>
        </ThemedCard>
        
        <ThemedCard
          title="Warning Card"
          subtitle="For attention-grabbing content"
          variant="warning"
        >
          <p>The Antarctic Orange color draws attention to important information.</p>
        </ThemedCard>
        
        <ThemedCard
          title="Error Card"
          subtitle="For error states"
          variant="error"
        >
          <p>Clear indication of errors with high contrast red color.</p>
        </ThemedCard>
        
        <ThemedCard
          title="No Hover"
          subtitle="Static card without hover effects"
          hover={false}
        >
          <p>Some cards don't need hover effects for better accessibility.</p>
        </ThemedCard>
      </div>
    </div>
  );
};
```

### Accessibility-First Button

A button component that prioritizes accessibility and theme consistency.

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useThemeColors, useTheme } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { getAccessibleTextColor, isAccessible } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className,
  'aria-label': ariaLabel,
}) => {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const { settings } = useAccessibility();
  
  const getSizeClasses = (size: string) => {
    const baseSize = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }[size];
    
    // Increase padding for larger font sizes
    if (settings.fontSize === 'large') {
      return baseSize + ' px-6 py-3';
    } else if (settings.fontSize === 'x-large') {
      return baseSize + ' px-8 py-4';
    }
    
    return baseSize;
  };
  
  const getVariantStyles = (variant: string) => {
    const baseStyles = 'transition-all duration-200 font-medium rounded-lg border-2';
    
    switch (variant) {
      case 'primary':
        const primaryTextColor = getAccessibleTextColor(colors.primary);
        const primaryAccessible = isAccessible(primaryTextColor, colors.primary, 'AA');
        
        return {
          className: cn(
            baseStyles,
            'hover:opacity-90 active:opacity-95',
            settings.highContrast && 'border-4 font-bold'
          ),
          style: {
            backgroundColor: colors.primary,
            color: primaryAccessible ? primaryTextColor : '#FFFFFF',
            borderColor: colors.primary,
          },
        };
        
      case 'secondary':
        return {
          className: cn(
            baseStyles,
            'hover:opacity-90 active:opacity-95',
            settings.highContrast && 'border-4 font-bold'
          ),
          style: {
            backgroundColor: colors.secondary,
            color: getAccessibleTextColor(colors.secondary),
            borderColor: colors.secondary,
          },
        };
        
      case 'outline':
        return {
          className: cn(
            baseStyles,
            'hover:bg-primary hover:text-white active:bg-primary/90',
            settings.highContrast && 'border-4 font-bold'
          ),
          style: {
            backgroundColor: 'transparent',
            color: colors.primary,
            borderColor: colors.primary,
          },
        };
        
      case 'ghost':
        return {
          className: cn(
            baseStyles,
            'border-transparent hover:bg-muted active:bg-muted/80',
            settings.highContrast && 'border-2 border-foreground'
          ),
          style: {
            backgroundColor: 'transparent',
            color: colors.foreground,
            borderColor: 'transparent',
          },
        };
        
      case 'destructive':
        return {
          className: cn(
            baseStyles,
            'hover:opacity-90 active:opacity-95',
            settings.highContrast && 'border-4 font-bold'
          ),
          style: {
            backgroundColor: colors.error,
            color: getAccessibleTextColor(colors.error),
            borderColor: colors.error,
          },
        };
        
      default:
        return {
          className: baseStyles,
          style: {
            backgroundColor: colors.muted,
            color: colors.foreground,
            borderColor: colors.border,
          },
        };
    }
  };
  
  const variantConfig = getVariantStyles(variant);
  const sizeClasses = getSizeClasses(size);
  
  const buttonContent = (
    <>
      {loading && (
        <motion.div
          className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      )}
      {children}
    </>
  );
  
  return (
    <motion.button
      className={cn(
        variantConfig.className,
        sizeClasses,
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        settings.reducedMotion ? '' : 'hover:scale-105 active:scale-95',
        className
      )}
      style={{
        ...variantConfig.style,
        '--tw-ring-color': colors.primary,
      } as React.CSSProperties}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      whileHover={!settings.reducedMotion && !disabled && !loading ? { scale: 1.05 } : undefined}
      whileTap={!settings.reducedMotion && !disabled && !loading ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.1 }}
    >
      {buttonContent}
    </motion.button>
  );
};

// Usage Examples
export const ButtonExamples: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  
  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };
  
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <AccessibleButton variant="primary">
            Primary
          </AccessibleButton>
          
          <AccessibleButton variant="secondary">
            Secondary
          </AccessibleButton>
          
          <AccessibleButton variant="outline">
            Outline
          </AccessibleButton>
          
          <AccessibleButton variant="ghost">
            Ghost
          </AccessibleButton>
          
          <AccessibleButton variant="destructive">
            Destructive
          </AccessibleButton>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <AccessibleButton size="sm">
            Small
          </AccessibleButton>
          
          <AccessibleButton size="md">
            Medium
          </AccessibleButton>
          
          <AccessibleButton size="lg">
            Large
          </AccessibleButton>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Button States</h3>
        <div className="flex flex-wrap gap-4">
          <AccessibleButton>
            Normal
          </AccessibleButton>
          
          <AccessibleButton disabled>
            Disabled
          </AccessibleButton>
          
          <AccessibleButton loading={loading} onClick={handleAsyncAction}>
            {loading ? 'Loading...' : 'Click to Load'}
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
};
```

### Responsive Navigation

A navigation component that adapts to different screen sizes and themes.

```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { ThemeToggle } from './ThemeToggle';
import { AccessibleButton } from './AccessibleButton';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface ResponsiveNavigationProps {
  brand?: React.ReactNode;
  items: NavigationItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  brand,
  items,
  actions,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <nav 
      className={cn(
        'sticky top-0 z-50 backdrop-blur-md border-b transition-colors',
        className
      )}
      style={{
        backgroundColor: `${colors.background}95`, // 95% opacity
        borderColor: colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand/Logo */}
          <div className="flex-shrink-0">
            {brand || (
              <div 
                className="text-xl font-bold"
                style={{ color: colors.primary }}
              >
                South Pole
              </div>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {items.map((item, index) => (
                <NavigationLink
                  key={index}
                  item={item}
                  onClick={closeMenu}
                />
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {actions}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <AccessibleButton
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </AccessibleButton>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden border-t"
            style={{ 
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
          >
            <div className="px-4 py-4 space-y-2">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: settings.reducedMotion ? 0 : 0.1,
                    delay: settings.reducedMotion ? 0 : index * 0.05,
                  }}
                >
                  <NavigationLink
                    item={item}
                    onClick={closeMenu}
                    mobile
                  />
                </motion.div>
              ))}
              
              {actions && (
                <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface NavigationLinkProps {
  item: NavigationItem;
  onClick: () => void;
  mobile?: boolean;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ 
  item, 
  onClick, 
  mobile = false 
}) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  
  return (
    <motion.a
      href={item.href}
      className={cn(
        'flex items-center space-x-2 transition-colors rounded-lg',
        mobile 
          ? 'px-3 py-2 text-base font-medium w-full' 
          : 'px-3 py-2 text-sm font-medium',
        'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
      style={{ 
        color: colors.foreground,
        '--tw-ring-color': colors.primary,
      } as React.CSSProperties}
      onClick={onClick}
      whileHover={!settings.reducedMotion ? { scale: 1.05 } : undefined}
      whileTap={!settings.reducedMotion ? { scale: 0.95 } : undefined}
    >
      {item.icon && (
        <span className="flex-shrink-0">
          {item.icon}
        </span>
      )}
      
      <span>{item.label}</span>
      
      {item.badge && (
        <span 
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: colors.primary,
            color: 'white',
          }}
        >
          {item.badge}
        </span>
      )}
    </motion.a>
  );
};

// Usage Example
export const NavigationExample: React.FC = () => {
  const navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Products',
      href: '/products',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Contact',
      href: '/contact',
      badge: 'New',
    },
  ];
  
  return (
    <ResponsiveNavigation
      items={navigationItems}
      actions={
        <div className="flex items-center space-x-2">
          <AccessibleButton variant="outline" size="sm">
            Sign In
          </AccessibleButton>
          <AccessibleButton variant="primary" size="sm">
            Get Started
          </AccessibleButton>
        </div>
      }
    />
  );
};
```

### Data Visualization Components

Theme-aware charts and data displays.

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { getContrastRatio, isAccessible } from '@/lib/colors';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
  className?: string;
}

export const AccessibleProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  color,
  showValue = true,
  className,
}) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  
  const percentage = Math.min((value / max) * 100, 100);
  const barColor = color || colors.primary;
  const textColor = isAccessible('#FFFFFF', barColor, 'AA') ? '#FFFFFF' : colors.foreground;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: colors.foreground }}>
          {label}
        </span>
        {showValue && (
          <span className="text-sm" style={{ color: colors.mutedForeground }}>
            {value} / {max}
          </span>
        )}
      </div>
      
      <div 
        className="w-full bg-muted rounded-full h-3 overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${value} out of ${max}`}
      >
        <motion.div
          className="h-full rounded-full flex items-center justify-end pr-2"
          style={{ 
            backgroundColor: barColor,
            color: textColor,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: settings.reducedMotion ? 0 : 0.8,
            ease: 'easeOut',
          }}
        >
          {showValue && percentage > 20 && (
            <span className="text-xs font-medium">
              {Math.round(percentage)}%
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
};

interface SimpleChartProps {
  data: DataPoint[];
  title?: string;
  type?: 'bar' | 'line';
  className?: string;
}

export const AccessibleChart: React.FC<SimpleChartProps> = ({
  data,
  title,
  type = 'bar',
  className,
}) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  
  const maxValue = Math.max(...data.map(d => d.value));
  const chartColors = [
    colors.primary,
    colors.secondary,
    colors.warning,
    colors.success,
    colors.info,
    colors.error,
  ];
  
  return (
    <div className={`p-4 bg-card rounded-lg border ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
          {title}
        </h3>
      )}
      
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          {data.map((point, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ 
                  backgroundColor: point.color || chartColors[index % chartColors.length],
                }}
                aria-hidden="true"
              />
              <span style={{ color: colors.foreground }}>
                {point.label}: {point.value}
              </span>
            </div>
          ))}
        </div>
        
        {/* Chart */}
        <div className="space-y-3" role="img" aria-label={`${type} chart showing ${title || 'data'}`}>
          {data.map((point, index) => {
            const percentage = (point.value / maxValue) * 100;
            const itemColor = point.color || chartColors[index % chartColors.length];
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: colors.foreground }}>
                    {point.label}
                  </span>
                  <span style={{ color: colors.mutedForeground }}>
                    {point.value}
                  </span>
                </div>
                
                <div 
                  className="w-full bg-muted rounded h-6 overflow-hidden"
                  style={{ backgroundColor: colors.muted }}
                >
                  <motion.div
                    className="h-full rounded flex items-center px-2"
                    style={{ backgroundColor: itemColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ 
                      duration: settings.reducedMotion ? 0 : 0.6,
                      delay: settings.reducedMotion ? 0 : index * 0.1,
                      ease: 'easeOut',
                    }}
                  >
                    {percentage > 15 && (
                      <span 
                        className="text-xs font-medium"
                        style={{ 
                          color: isAccessible('#FFFFFF', itemColor, 'AA') 
                            ? '#FFFFFF' 
                            : colors.foreground,
                        }}
                      >
                        {Math.round(percentage)}%
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Usage Examples
export const DataVisualizationExamples: React.FC = () => {
  const chartData: DataPoint[] = [
    { label: 'Climate Action', value: 85 },
    { label: 'Renewable Energy', value: 72 },
    { label: 'Carbon Reduction', value: 91 },
    { label: 'Sustainability', value: 68 },
    { label: 'Innovation', value: 79 },
  ];
  
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Data Visualization Examples</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccessibleChart
            title="South Pole Impact Metrics"
            data={chartData}
            type="bar"
          />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Progress Indicators</h3>
            {chartData.map((point, index) => (
              <AccessibleProgressBar
                key={index}
                label={point.label}
                value={point.value}
                max={100}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 🎨 Best Practices Summary

1. **Always use theme hooks** for colors instead of hard-coding
2. **Check accessibility** with `isAccessible()` and `getContrastRatio()`
3. **Respect user preferences** from `useAccessibility()`
4. **Provide fallbacks** for motion and animations
5. **Use semantic HTML** and proper ARIA attributes
6. **Test with different themes** and accessibility settings
7. **Leverage CSS variables** for consistent styling
8. **Performance matters** - use memoization and caching

## 📱 Responsive Considerations

- Use `useThemeColors()` for dynamic color values
- Respect `settings.reducedMotion` for animations
- Adjust spacing for larger font sizes
- Ensure touch targets meet minimum size requirements
- Test across different screen sizes and orientations

## ♿ Accessibility Checklist

- ✅ Color contrast meets WCAG AA standards
- ✅ Components work with keyboard navigation
- ✅ Screen readers can understand content structure
- ✅ Focus indicators are visible
- ✅ Motion can be disabled
- ✅ Text can be scaled up to 200%
- ✅ High contrast mode is supported