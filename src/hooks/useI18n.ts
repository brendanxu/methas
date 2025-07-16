'use client'

import { useState, useEffect, useCallback } from 'react'
import { i18n, type Locale } from '@/lib/i18n-lite'

/**
 * React Hook for internationalization
 */
export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>(i18n.getLocale())

  useEffect(() => {
    // 监听语言变化
    const unsubscribe = i18n.onChange((newLocale) => {
      setLocaleState(newLocale)
    })

    return unsubscribe
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    i18n.setLocale(newLocale)
  }, [])

  const t = useCallback((key: string, params?: Record<string, any>) => {
    return i18n.t(key, params)
  }, [locale]) // 依赖locale以便在语言切换时重新渲染

  const formatDate = useCallback((date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
    return i18n.formatDate(date, options)
  }, [locale])

  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return i18n.formatNumber(number, options)
  }, [locale])

  const formatCurrency = useCallback((amount: number, currency?: string, options?: Intl.NumberFormatOptions) => {
    return i18n.formatCurrency(amount, currency, options)
  }, [locale])

  const formatRelativeTime = useCallback((date: Date | string | number) => {
    return i18n.formatRelativeTime(date)
  }, [locale])

  return {
    locale,
    setLocale,
    t,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime
  }
}

/**
 * Hook to get only the translation function
 */
export function useTranslation() {
  const { t } = useI18n()
  return t
}

/**
 * Hook to get only the locale
 */
export function useLocale() {
  const { locale, setLocale } = useI18n()
  return { locale, setLocale }
}