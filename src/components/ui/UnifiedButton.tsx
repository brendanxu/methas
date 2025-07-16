'use client';

import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/app/providers';

// 设计token系统
const buttonTokens = {
  // 更小、更精致的字体大小
  fontSize: {
    small: '12px',      // 小号按钮：12px
    medium: '14px',     // 中号按钮：14px  
    large: '16px',      // 大号按钮：16px
  },
  // 统一的按钮高度
  height: {
    small: '32px',      // 小号按钮
    medium: '36px',     // 中号按钮
    large: '40px',      // 大号按钮
  },
  // 统一的内边距
  padding: {
    small: '0 12px',    // 小号按钮
    medium: '0 16px',   // 中号按钮
    large: '0 20px',    // 大号按钮
  },
  // 统一的圆角
  radius: {
    small: '6px',       // 小号按钮
    medium: '8px',      // 中号按钮
    large: '8px',       // 大号按钮
  },
  // 统一的字重
  fontWeight: {
    normal: '500',      // 中等字重，更精致
    bold: '600',        // 粗体字重
  },
  // 统一的阴影
  shadow: {
    none: 'none',
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    large: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }
};

// 扩展的按钮属性
export interface UnifiedButtonProps extends Omit<AntButtonProps, 'size' | 'type' | 'variant' | 'iconPosition'> {
  // 按钮变体
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'warning';
  // 按钮尺寸
  size?: 'small' | 'medium' | 'large';
  // 是否圆角
  rounded?: boolean;
  // 阴影级别
  shadow?: 'none' | 'small' | 'medium' | 'large';
  // 是否显示边框
  bordered?: boolean;
  // 是否紧凑模式
  compact?: boolean;
  // 自定义颜色
  customColor?: string;
  // 图标位置
  iconPosition?: 'left' | 'right';
  // 是否全宽
  fullWidth?: boolean;
}

const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  rounded = true,
  shadow = 'small',
  bordered = true,
  compact = false,
  customColor,
  iconPosition = 'left',
  fullWidth = false,
  className,
  children,
  icon,
  ...props
}) => {
  const colors = useThemeColors();

  // 获取按钮变体样式
  const getVariantStyles = () => {
    const baseStyles = {
      fontWeight: buttonTokens.fontWeight.normal,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: customColor || colors.primary,
          color: '#ffffff',
          borderColor: customColor || colors.primary,
          '&:hover': {
            backgroundColor: customColor ? `${customColor}e6` : `${colors.primary}e6`,
            borderColor: customColor ? `${customColor}e6` : `${colors.primary}e6`,
            transform: 'translateY(-1px)',
            boxShadow: buttonTokens.shadow.medium,
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: buttonTokens.shadow.small,
          },
        };
      
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: customColor || colors.primary,
          borderColor: customColor || colors.primary,
          border: bordered ? `1px solid ${customColor || colors.primary}` : 'none',
          '&:hover': {
            backgroundColor: customColor ? `${customColor}1a` : `${colors.primary}1a`,
            borderColor: customColor || colors.primary,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        };
      
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: colors.foreground,
          border: 'none',
          '&:hover': {
            backgroundColor: colors.muted,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        };
      
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: colors.success,
          color: '#ffffff',
          borderColor: colors.success,
          '&:hover': {
            backgroundColor: `${colors.success}e6`,
            borderColor: `${colors.success}e6`,
            transform: 'translateY(-1px)',
            boxShadow: buttonTokens.shadow.medium,
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: buttonTokens.shadow.small,
          },
        };
      
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: colors.error,
          color: '#ffffff',
          borderColor: colors.error,
          '&:hover': {
            backgroundColor: `${colors.error}e6`,
            borderColor: `${colors.error}e6`,
            transform: 'translateY(-1px)',
            boxShadow: buttonTokens.shadow.medium,
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: buttonTokens.shadow.small,
          },
        };
      
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: colors.warning,
          color: '#ffffff',
          borderColor: colors.warning,
          '&:hover': {
            backgroundColor: `${colors.warning}e6`,
            borderColor: `${colors.warning}e6`,
            transform: 'translateY(-1px)',
            boxShadow: buttonTokens.shadow.medium,
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: buttonTokens.shadow.small,
          },
        };
      
      default:
        return baseStyles;
    }
  };

  // 构建样式对象
  const buttonStyles = {
    ...getVariantStyles(),
    height: compact ? `${parseInt(buttonTokens.height[size]) - 4}px` : buttonTokens.height[size],
    fontSize: buttonTokens.fontSize[size],
    padding: compact ? 
      `0 ${parseInt(buttonTokens.padding[size].split(' ')[1]) - 4}px` : 
      buttonTokens.padding[size],
    borderRadius: rounded ? buttonTokens.radius[size] : '0',
    boxShadow: shadow !== 'none' ? buttonTokens.shadow[shadow] : 'none',
    width: fullWidth ? '100%' : 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '0.01em',
    lineHeight: 1.4,
  };

  // 处理图标位置
  const renderContent = () => {
    if (!icon) return children;
    
    if (iconPosition === 'right') {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {children}
          {icon}
        </span>
      );
    }
    
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon}
        {children}
      </span>
    );
  };

  return (
    <AntButton
      {...props}
      className={cn(
        'unified-button',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'primary' && 'focus:ring-primary',
        variant === 'success' && 'focus:ring-success',
        variant === 'danger' && 'focus:ring-error',
        props.disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={buttonStyles}
    >
      {renderContent()}
    </AntButton>
  );
};

export default UnifiedButton;