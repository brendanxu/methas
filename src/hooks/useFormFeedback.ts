import { useState, useCallback, useRef, useEffect } from 'react'
import { message } from 'antd'

// 表单状态枚举
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'validating'

// 表单反馈状态接口
export interface FormFeedbackState {
  status: FormStatus
  message?: string
  progress?: number
  submitAttempts: number
  lastSubmitTime?: number
  canRetry: boolean
  details?: any
}

// 错误类型映射
export const ERROR_MESSAGE_MAP: Record<string, string> = {
  // 网络错误
  'NetworkError': '网络连接异常，请检查网络后重试',
  'TypeError': '网络连接异常，请检查网络后重试',
  'AbortError': '请求已取消，请重新提交',
  
  // 验证错误
  'ValidationError': '请检查表单信息是否填写正确',
  'VALIDATION_FAILED': '表单验证失败，请检查输入内容',
  'INVALID_EMAIL': '邮箱格式不正确，请重新输入',
  'INVALID_PHONE': '电话号码格式不正确，请重新输入',
  
  // 服务器错误
  'InternalServerError': '服务器暂时繁忙，请稍后重试',
  'INTERNAL_ERROR': '服务器暂时繁忙，请稍后重试',
  'BadRequestError': '请求参数有误，请检查后重试',
  
  // 业务错误
  'RATE_LIMIT_EXCEEDED': '提交过于频繁，请稍后再试',
  'DUPLICATE_SUBMISSION': '请勿重复提交',
  'UNAUTHORIZED': '权限不足，请登录后重试',
  'FORBIDDEN': '没有权限执行此操作',
  
  // 其他错误
  'TimeoutError': '请求超时，请重新提交',
  'UNKNOWN_ERROR': '操作失败，请稍后重试',
}

// 成功消息映射
export const SUCCESS_MESSAGE_MAP: Record<string, string> = {
  'contact': '提交成功！我们将在24小时内与您联系',
  'newsletter': '订阅成功！请检查邮箱确认订阅',
  'download': '下载链接已发送到您的邮箱',
  'consultation': '咨询申请已提交，我们会尽快联系您',
  'default': '操作成功！'
}

// 配置选项
export interface FormFeedbackOptions {
  // 自动重置成功状态的时间（毫秒）
  autoResetSuccessDelay?: number
  // 最大重试次数
  maxRetryAttempts?: number
  // 重试冷却时间（毫秒）
  retryCooldown?: number
  // 是否显示全局消息
  showGlobalMessage?: boolean
  // 成功消息类型
  successMessageType?: keyof typeof SUCCESS_MESSAGE_MAP
  // 自定义错误处理
  customErrorHandler?: (error: any) => string | undefined
}

export function useFormFeedback(options: FormFeedbackOptions = {}) {
  const {
    autoResetSuccessDelay = 3000,
    maxRetryAttempts = 3,
    retryCooldown = 5000,
    showGlobalMessage = true,
    successMessageType = 'default',
    customErrorHandler
  } = options

  const [state, setState] = useState<FormFeedbackState>({
    status: 'idle',
    submitAttempts: 0,
    canRetry: true
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const cooldownRef = useRef<NodeJS.Timeout>()

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current)
      }
    }
  }, [])

  // 获取用户友好的错误消息
  const getFriendlyErrorMessage = useCallback((error: any): string => {
    // 尝试自定义错误处理器
    if (customErrorHandler) {
      const customMessage = customErrorHandler(error)
      if (customMessage) {
        return customMessage
      }
    }

    // 从错误对象中提取信息
    let errorKey = 'UNKNOWN_ERROR'
    
    if (typeof error === 'string') {
      errorKey = error
    } else if (error?.message) {
      errorKey = error.message
    } else if (error?.code) {
      errorKey = error.code
    } else if (error?.name) {
      errorKey = error.name
    } else if (error?.error) {
      errorKey = error.error
    }

    // 查找匹配的错误消息
    const friendlyMessage = ERROR_MESSAGE_MAP[errorKey]
    if (friendlyMessage) {
      return friendlyMessage
    }

    // 模糊匹配
    const lowercaseKey = errorKey.toLowerCase()
    for (const [key, message] of Object.entries(ERROR_MESSAGE_MAP)) {
      if (lowercaseKey.includes(key.toLowerCase()) || key.toLowerCase().includes(lowercaseKey)) {
        return message
      }
    }

    // 返回默认错误消息
    return ERROR_MESSAGE_MAP.UNKNOWN_ERROR
  }, [customErrorHandler])

  // 设置提交中状态
  const setSubmitting = useCallback((progress?: number) => {
    setState(prev => ({
      ...prev,
      status: 'submitting',
      progress,
      lastSubmitTime: Date.now()
    }))
  }, [])

  // 设置验证中状态
  const setValidating = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'validating'
    }))
  }, [])

  // 设置成功状态
  const setSuccess = useCallback((customMessage?: string) => {
    const successMessage = customMessage || SUCCESS_MESSAGE_MAP[successMessageType]
    
    setState(prev => ({
      ...prev,
      status: 'success',
      message: successMessage,
      progress: 100,
      submitAttempts: 0 // 重置重试次数
    }))

    // 显示全局成功消息
    if (showGlobalMessage) {
      message.success(successMessage)
    }

    // 自动重置状态
    if (autoResetSuccessDelay > 0) {
      timeoutRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          status: 'idle',
          message: undefined,
          progress: undefined
        }))
      }, autoResetSuccessDelay)
    }
  }, [successMessageType, showGlobalMessage, autoResetSuccessDelay])

  // 设置错误状态
  const setError = useCallback((error: any, details?: any) => {
    const friendlyMessage = getFriendlyErrorMessage(error)
    const newAttempts = state.submitAttempts + 1
    const canRetry = newAttempts < maxRetryAttempts

    setState(prev => ({
      ...prev,
      status: 'error',
      message: friendlyMessage,
      submitAttempts: newAttempts,
      canRetry,
      details,
      progress: undefined
    }))

    // 显示全局错误消息
    if (showGlobalMessage) {
      message.error(friendlyMessage)
    }

    // 设置重试冷却
    if (!canRetry || retryCooldown > 0) {
      setState(prev => ({ ...prev, canRetry: false }))
      
      cooldownRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, canRetry: true }))
      }, retryCooldown)
    }
  }, [getFriendlyErrorMessage, state.submitAttempts, maxRetryAttempts, showGlobalMessage, retryCooldown])

  // 重置状态
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (cooldownRef.current) {
      clearTimeout(cooldownRef.current)
    }

    setState({
      status: 'idle',
      submitAttempts: 0,
      canRetry: true
    })
  }, [])

  // 更新进度
  const updateProgress = useCallback((progress: number) => {
    setState(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress))
    }))
  }, [])

  // 工具函数
  const isIdle = state.status === 'idle'
  const isSubmitting = state.status === 'submitting'
  const isValidating = state.status === 'validating'
  const isSuccess = state.status === 'success'
  const isError = state.status === 'error'
  const isLoading = isSubmitting || isValidating
  const hasError = isError
  const canSubmit = (isIdle || isError) && state.canRetry

  // 获取状态颜色
  const getStatusColor = useCallback(() => {
    switch (state.status) {
      case 'success': return '#52c41a'
      case 'error': return '#ff4d4f'
      case 'submitting': case 'validating': return '#1890ff'
      default: return '#d9d9d9'
    }
  }, [state.status])

  // 获取状态文本
  const getStatusText = useCallback(() => {
    switch (state.status) {
      case 'submitting': return '提交中...'
      case 'validating': return '验证中...'
      case 'success': return '提交成功'
      case 'error': return '提交失败'
      default: return ''
    }
  }, [state.status])

  return {
    // 状态
    state,
    status: state.status,
    message: state.message,
    progress: state.progress,
    
    // 状态判断
    isIdle,
    isSubmitting,
    isValidating,
    isSuccess,
    isError,
    isLoading,
    hasError,
    canSubmit,
    canRetry: state.canRetry,
    
    // 操作方法
    setSubmitting,
    setValidating,
    setSuccess,
    setError,
    reset,
    updateProgress,
    
    // 工具方法
    getStatusColor,
    getStatusText,
    
    // 元数据
    submitAttempts: state.submitAttempts,
    maxRetryAttempts,
    lastSubmitTime: state.lastSubmitTime
  }
}