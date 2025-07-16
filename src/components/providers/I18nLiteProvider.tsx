'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSavedLanguage } from '@/hooks/useI18n'

// 支持的语言类型
type Locale = 'en' | 'zh'

// 上下文类型
interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  isReady: boolean
}

// 创建上下文
export const I18nContext = createContext<I18nContextType | undefined>(undefined)

// 上下文Hook
export function useI18nContext() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nLiteProvider')
  }
  return context
}

// 导出类型
export type { Locale, I18nContextType }

// Provider Props
interface I18nLiteProviderProps {
  children: React.ReactNode
}

/**
 * 轻量级国际化Provider
 * 纯客户端实现，不影响SSR
 */
export function I18nLiteProvider({ children }: I18nLiteProviderProps) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 从localStorage获取保存的语言偏好
    const savedLocale = getSavedLanguage()
    setLocaleState(savedLocale)
    setIsReady(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', newLocale)
    }
    
    // 更新HTML lang属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
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
  const { isReady } = useI18nContext()

  if (!isReady) {
    return <>{fallback || <div className="animate-pulse">Loading...</div>}</>
  }

  return <>{children}</>
}

/**
 * 语言切换器组件
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useI18nContext()

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'zh' as const, name: '中文', flag: '🇨🇳' }
  ]

  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="bg-transparent border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * 语言检测组件
 */
export function LanguageDetector({ children }: { children: React.ReactNode }) {
  const { setLocale } = useI18nContext()

  useEffect(() => {
    // 检测浏览器语言
    const detectLanguage = () => {
      if (typeof window === 'undefined') return
      
      const savedLang = localStorage.getItem('preferred-language')
      if (savedLang && ['en', 'zh'].includes(savedLang)) {
        setLocale(savedLang as Locale)
        return
      }
      
      const browserLang = navigator.language.substring(0, 2)
      const supportedLang = ['en', 'zh'].includes(browserLang) ? browserLang as Locale : 'en'
      setLocale(supportedLang)
    }

    detectLanguage()
  }, [setLocale])

  return <>{children}</>
}