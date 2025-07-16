/**
 * 增强的用户反馈组件
 * 提供更好的加载、错误和成功体验
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Motion, LoadingSpinner, ErrorMessage, SuccessMessage } from '@/components/animations/EnhancedMotion'
import { useI18n } from '@/hooks/useI18n'

// 加载状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// 加载组件Props
interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  showProgress?: boolean
  progress?: number
  className?: string
}

// 增强的加载组件
export const EnhancedLoading: React.FC<LoadingProps> = ({
  size = 'medium',
  message,
  showProgress = false,
  progress = 0,
  className = ''
}) => {
  const { t } = useI18n()
  const [dots, setDots] = useState('')

  // 动画化的加载点
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    small: 'py-4',
    medium: 'py-8',
    large: 'py-12'
  }

  return (
    <Motion.div
      className={`flex flex-col items-center justify-center ${sizeClasses[size]} ${className}`}
      initial="fadeOut"
      animate="fadeIn"
      transition={{ duration: 300 }}
    >
      <LoadingSpinner size={size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'} />
      
      {message && (
        <Motion.p
          className="mt-4 text-muted-foreground text-center"
          initial="slideUp"
          animate="slideUp"
          transition={{ delay: 200 }}
        >
          {message}{dots}
        </Motion.p>
      )}

      {showProgress && (
        <Motion.div
          className="mt-4 w-full max-w-xs"
          initial="slideUp"
          animate="slideUp"
          transition={{ delay: 300 }}
        >
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{t('common.loading', 'Loading')}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Motion.div>
      )}
    </Motion.div>
  )
}

// 错误组件Props
interface ErrorProps {
  title?: string
  message?: string
  showRetry?: boolean
  onRetry?: () => void
  className?: string
}

// 增强的错误组件
export const EnhancedError: React.FC<ErrorProps> = ({
  title,
  message,
  showRetry = true,
  onRetry,
  className = ''
}) => {
  const { t } = useI18n()

  return (
    <Motion.div
      className={`flex flex-col items-center justify-center py-8 ${className}`}
      initial="shake"
      animate="shake"
      transition={{ duration: 300 }}
    >
      <div className="text-error text-5xl mb-4">
        <CloseCircleOutlined />
      </div>
      
      <Motion.h3
        className="text-lg font-semibold text-error mb-2"
        initial="slideUp"
        animate="slideUp"
        transition={{ delay: 100 }}
      >
        {title || t('common.error', 'An error occurred')}
      </Motion.h3>
      
      {message && (
        <Motion.p
          className="text-muted-foreground text-center mb-6 max-w-md"
          initial="slideUp"
          animate="slideUp"
          transition={{ delay: 200 }}
        >
          {message}
        </Motion.p>
      )}

      {showRetry && onRetry && (
        <Motion.div
          initial="slideUp"
          animate="slideUp"
          transition={{ delay: 300 }}
        >
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={onRetry}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            {t('common.retry', 'Retry')}
          </Button>
        </Motion.div>
      )}
    </Motion.div>
  )
}

// 成功组件Props
interface SuccessProps {
  title?: string
  message?: string
  showAction?: boolean
  actionText?: string
  onAction?: () => void
  className?: string
}

// 增强的成功组件
export const EnhancedSuccess: React.FC<SuccessProps> = ({
  title,
  message,
  showAction = false,
  actionText,
  onAction,
  className = ''
}) => {
  const { t } = useI18n()

  return (
    <Motion.div
      className={`flex flex-col items-center justify-center py-8 ${className}`}
      initial="bounce"
      animate="bounce"
      transition={{ duration: 600 }}
    >
      <div className="text-success text-5xl mb-4">
        <CheckCircleOutlined />
      </div>
      
      <Motion.h3
        className="text-lg font-semibold text-success mb-2"
        initial="slideUp"
        animate="slideUp"
        transition={{ delay: 100 }}
      >
        {title || t('common.success', 'Success')}
      </Motion.h3>
      
      {message && (
        <Motion.p
          className="text-muted-foreground text-center mb-6 max-w-md"
          initial="slideUp"
          animate="slideUp"
          transition={{ delay: 200 }}
        >
          {message}
        </Motion.p>
      )}

      {showAction && onAction && (
        <Motion.div
          initial="slideUp"
          animate="slideUp"
          transition={{ delay: 300 }}
        >
          <Button
            type="primary"
            onClick={onAction}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            {actionText || t('common.continue', 'Continue')}
          </Button>
        </Motion.div>
      )}
    </Motion.div>
  )
}

// 组合状态组件Props
interface StatefulFeedbackProps {
  state: LoadingState
  loadingProps?: LoadingProps
  errorProps?: ErrorProps
  successProps?: SuccessProps
  className?: string
}

// 组合状态组件
export const StatefulFeedback: React.FC<StatefulFeedbackProps> = ({
  state,
  loadingProps,
  errorProps,
  successProps,
  className = ''
}) => {
  switch (state) {
    case 'loading':
      return <EnhancedLoading {...loadingProps} className={className} />
    case 'error':
      return <EnhancedError {...errorProps} className={className} />
    case 'success':
      return <EnhancedSuccess {...successProps} className={className} />
    default:
      return null
  }
}

// 空状态组件Props
interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  message?: string
  actionText?: string
  onAction?: () => void
  className?: string
}

// 空状态组件
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionText,
  onAction,
  className = ''
}) => {
  const { t } = useI18n()

  return (
    <Motion.div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
      initial="slideUp"
      animate="slideUp"
      transition={{ duration: 400 }}
    >
      {icon && (
        <div className="text-muted-foreground text-6xl mb-4">
          {icon}
        </div>
      )}
      
      <Motion.h3
        className="text-xl font-semibold mb-2"
        initial="slideUp"
        animate="slideUp"
        transition={{ delay: 100 }}
      >
        {title || t('common.noData', 'No data available')}
      </Motion.h3>
      
      {message && (
        <Motion.p
          className="text-muted-foreground text-center mb-6 max-w-md"
          initial="slideUp"
          animate="slideUp"
          transition={{ delay: 200 }}
        >
          {message}
        </Motion.p>
      )}

      {actionText && onAction && (
        <Motion.div
          initial="slideUp"
          animate="slideUp"
          transition={{ delay: 300 }}
        >
          <Button
            type="primary"
            onClick={onAction}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            {actionText}
          </Button>
        </Motion.div>
      )}
    </Motion.div>
  )
}

// 带有自动消失的通知组件
interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  className?: string
}

export const AutoNotification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  duration = 3000,
  onClose,
  className = ''
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [duration, onClose])

  if (!visible) return null

  const typeConfig = {
    success: {
      icon: <CheckCircleOutlined />,
      className: 'border-success bg-success/10 text-success'
    },
    error: {
      icon: <CloseCircleOutlined />,
      className: 'border-error bg-error/10 text-error'
    },
    info: {
      icon: <div className="w-4 h-4 bg-info rounded-full" />,
      className: 'border-info bg-info/10 text-info'
    },
    warning: {
      icon: <div className="w-4 h-4 bg-warning rounded-full" />,
      className: 'border-warning bg-warning/10 text-warning'
    }
  }

  const config = typeConfig[type]

  return (
    <Motion.div
      className={`fixed top-4 right-4 p-4 rounded-lg border-2 shadow-lg max-w-sm z-50 ${config.className} ${className}`}
      initial="slideLeft"
      animate="slideLeft"
      exit="slideRight"
      transition={{ duration: 300 }}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl mt-0.5">
          {config.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && (
            <p className="text-xs mt-1 opacity-80">{message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className="text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </Motion.div>
  )
}

// 骨架屏组件
interface SkeletonProps {
  lines?: number
  width?: string
  height?: string
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  lines = 3,
  width = '100%',
  height = '1rem',
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Motion.div
          key={index}
          className="bg-muted rounded animate-pulse"
          style={{ 
            width: index === lines - 1 ? '60%' : width,
            height 
          }}
          initial="fadeOut"
          animate="fadeIn"
          transition={{ delay: index * 100 }}
        >
          <div />
        </Motion.div>
      ))}
    </div>
  )
}

// 进度指示器组件
interface ProgressIndicatorProps {
  current: number
  total: number
  showText?: boolean
  className?: string
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  showText = true,
  className = ''
}) => {
  const { t } = useI18n()
  const percentage = Math.round((current / total) * 100)

  return (
    <Motion.div
      className={`w-full ${className}`}
      initial="slideUp"
      animate="slideUp"
      transition={{ duration: 300 }}
    >
      {showText && (
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{t('common.progress', 'Progress')}</span>
          <span>{current} / {total} ({percentage}%)</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Motion.div>
  )
}

// 导出所有组件
const EnhancedFeedbackComponents = {
  EnhancedLoading,
  EnhancedError,
  EnhancedSuccess,
  StatefulFeedback,
  EmptyState,
  AutoNotification,
  Skeleton,
  ProgressIndicator
}

export default EnhancedFeedbackComponents