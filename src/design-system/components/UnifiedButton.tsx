/**
 * 统一的按钮组件
 * 替换所有重复的按钮实现，提供一致的API和样式
 */

'use client'

import React, { forwardRef, useMemo } from 'react'
import { Button as AntdButton } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { ButtonProps } from '../component-interfaces'
import { DESIGN_TOKENS } from '../tokens'
import { cssVar } from '../css-generator'

// 按钮变体样式映射
const buttonVariants = {
  primary: {
    backgroundColor: cssVar('primary'),
    borderColor: cssVar('primary'),
    color: cssVar('white'),
    '&:hover': {
      backgroundColor: cssVar('primary'),
      borderColor: cssVar('primary'),
      opacity: 0.9,
    },
    '&:focus': {
      backgroundColor: cssVar('primary'),
      borderColor: cssVar('primary'),
      boxShadow: cssVar('shadows-primary'),
    },
  },
  secondary: {
    backgroundColor: cssVar('secondary'),
    borderColor: cssVar('secondary'),
    color: cssVar('white'),
    '&:hover': {
      backgroundColor: cssVar('secondary'),
      borderColor: cssVar('secondary'),
      opacity: 0.9,
    },
    '&:focus': {
      backgroundColor: cssVar('secondary'),
      borderColor: cssVar('secondary'),
      boxShadow: cssVar('shadows-secondary'),
    },
  },
  success: {
    backgroundColor: cssVar('success'),
    borderColor: cssVar('success'),
    color: cssVar('white'),
  },
  warning: {
    backgroundColor: cssVar('warning'),
    borderColor: cssVar('warning'),
    color: cssVar('white'),
  },
  error: {
    backgroundColor: cssVar('error'),
    borderColor: cssVar('error'),
    color: cssVar('white'),
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: cssVar('border'),
    color: cssVar('foreground'),
    '&:hover': {
      backgroundColor: cssVar('muted'),
      borderColor: cssVar('border'),
    },
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: cssVar('primary'),
    color: cssVar('primary'),
    '&:hover': {
      backgroundColor: cssVar('primary'),
      borderColor: cssVar('primary'),
      color: cssVar('white'),
    },
  },
}

// 按钮尺寸映射
const buttonSizes = {
  small: {
    height: DESIGN_TOKENS.componentSizes.button.small.height,
    padding: DESIGN_TOKENS.componentSizes.button.small.padding,
    fontSize: DESIGN_TOKENS.componentSizes.button.small.fontSize,
  },
  medium: {
    height: DESIGN_TOKENS.componentSizes.button.medium.height,
    padding: DESIGN_TOKENS.componentSizes.button.medium.padding,
    fontSize: DESIGN_TOKENS.componentSizes.button.medium.fontSize,
  },
  large: {
    height: DESIGN_TOKENS.componentSizes.button.large.height,
    padding: DESIGN_TOKENS.componentSizes.button.large.padding,
    fontSize: DESIGN_TOKENS.componentSizes.button.large.fontSize,
  },
}

// 统一按钮组件
export const UnifiedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className = '',
    style,
    variant = 'primary',
    size = 'medium',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    leftIcon,
    rightIcon,
    loadingText,
    showLoadingIcon = true,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onKeyDown,
    testId,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    ...rest
  }, ref) => {
    // 计算按钮样式
    const buttonStyle = useMemo(() => {
      const variantStyle = buttonVariants[variant] || buttonVariants.primary
      const sizeStyle = buttonSizes[size] || buttonSizes.medium
      
      return {
        ...variantStyle,
        ...sizeStyle,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: cssVar('border-radius-md'),
        fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
        lineHeight: DESIGN_TOKENS.typography.lineHeight.normal,
        transition: `all ${DESIGN_TOKENS.animations.duration.fast} ${DESIGN_TOKENS.animations.easing.easeInOut}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: DESIGN_TOKENS.spacing[2],
        border: '1px solid',
        ...style,
      }
    }, [variant, size, fullWidth, disabled, style])

    // 计算按钮内容
    const buttonContent = useMemo(() => {
      const content = loading && loadingText ? loadingText : children
      const loadingIcon = loading && showLoadingIcon ? <LoadingOutlined /> : null
      
      return (
        <>
          {(leftIcon || icon) && !loading && (leftIcon || icon)}
          {loadingIcon}
          {content}
          {rightIcon && !loading && rightIcon}
        </>
      )
    }, [loading, loadingText, showLoadingIcon, icon, leftIcon, rightIcon, children])

    // 转换为 Ant Design 按钮属性
    const antdType = variant === 'primary' ? 'primary' : 
                    variant === 'ghost' ? 'text' : 
                    variant === 'outline' ? 'default' : 'default'
    
    // 转换尺寸类型
    const antdSize = size === 'small' ? 'small' : 
                    size === 'large' ? 'large' : 'middle'

    return (
      <AntdButton
        ref={ref}
        type={antdType}
        size={antdSize}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={`unified-button unified-button--${variant} unified-button--${size} ${className}`}
        style={buttonStyle}
        data-testid={testId}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        block={fullWidth}
        {...rest}
      >
        {buttonContent}
      </AntdButton>
    )
  }
)

UnifiedButton.displayName = 'UnifiedButton'

// 按钮组件变体
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <UnifiedButton ref={ref} variant="primary" {...props} />
)
PrimaryButton.displayName = 'PrimaryButton'

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <UnifiedButton ref={ref} variant="secondary" {...props} />
)
SecondaryButton.displayName = 'SecondaryButton'

export const GhostButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <UnifiedButton ref={ref} variant="ghost" {...props} />
)
GhostButton.displayName = 'GhostButton'

export const OutlineButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <UnifiedButton ref={ref} variant="outline" {...props} />
)
OutlineButton.displayName = 'OutlineButton'

export const SuccessButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <UnifiedButton ref={ref} variant="success" {...props} />
)
SuccessButton.displayName = 'SuccessButton'

export const WarningButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <UnifiedButton ref={ref} variant="warning" {...props} />
)
WarningButton.displayName = 'WarningButton'

export const ErrorButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <UnifiedButton ref={ref} variant="error" {...props} />
)
ErrorButton.displayName = 'ErrorButton'

// 按钮组件组合
export const ButtonGroup: React.FC<{
  children: React.ReactNode
  className?: string
  size?: 'small' | 'medium' | 'large'
  orientation?: 'horizontal' | 'vertical'
}> = ({ 
  children, 
  className = '', 
  size = 'medium',
  orientation = 'horizontal'
}) => {
  const groupStyle = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' as const : 'row' as const,
    gap: DESIGN_TOKENS.spacing[1],
    alignItems: 'center',
  }

  return (
    <div 
      className={`unified-button-group ${className}`}
      style={groupStyle}
    >
      {children}
    </div>
  )
}

// 图标按钮组件
export const IconButton = forwardRef<HTMLButtonElement, ButtonProps & { icon: React.ReactNode }>(
  ({ icon, children, ...props }, ref) => (
    <UnifiedButton 
      ref={ref} 
      leftIcon={icon}
      {...props}
    >
      {children}
    </UnifiedButton>
  )
)
IconButton.displayName = 'IconButton'

// 加载按钮组件
export const LoadingButton = forwardRef<HTMLButtonElement, ButtonProps & { loadingText?: string }>(
  ({ loadingText = 'Loading...', ...props }, ref) => (
    <UnifiedButton 
      ref={ref} 
      loading={true}
      loadingText={loadingText}
      {...props}
    />
  )
)
LoadingButton.displayName = 'LoadingButton'

// 导出所有按钮组件
export {
  UnifiedButton as Button,
  UnifiedButton as DefaultButton,
}

// 默认导出
export default UnifiedButton