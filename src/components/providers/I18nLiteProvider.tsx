'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n-lite'

// 上下文类型
interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  isReady: boolean
}

// 创建上下文
const I18nContext = createContext<I18nContextType | undefined>(undefined)

// 上下文Hook
export function useI18nContext() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nLiteProvider')
  }
  return context
}

// Provider Props
interface I18nLiteProviderProps {
  children: React.ReactNode
}

/**
 * 轻量级国际化Provider
 * 纯客户端实现，不影响SSR
 */
export function I18nLiteProvider({ children }: I18nLiteProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(i18n.getLocale())
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 标记为ready
    setIsReady(true)

    // 监听语言变化
    const unsubscribe = i18n.onChange((newLocale) => {
      setLocaleState(newLocale)
    })

    return unsubscribe
  }, [])

  const setLocale = (newLocale: Locale) => {
    i18n.setLocale(newLocale)
  }

  const value: I18nContextType = {
    locale,
    setLocale,
    isReady
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * HOC: 为组件提供国际化支持
 */
export function withI18n<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent = (props: P) => {
    return (
      <I18nLiteProvider>
        <Component {...props} />
      </I18nLiteProvider>
    )
  }

  WrappedComponent.displayName = `withI18n(${Component.displayName || Component.name})`
  return WrappedComponent
}

/**
 * 条件渲染组件：仅在国际化系统准备就绪时渲染
 */
export function I18nReady({ children, fallback }: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 简单的准备就绪检查
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return <>{fallback || null}</>
  }

  return <>{children}</>
}