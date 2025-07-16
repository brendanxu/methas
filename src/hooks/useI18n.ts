/**
 * 轻量级i18n Hook
 * 替代react-i18next，提供简单的国际化支持
 */

import { useContext } from 'react'
import { I18nContext } from '@/components/providers/I18nLiteProvider'

// 默认翻译
const DEFAULT_TRANSLATIONS = {
  en: {
    home: {
      climateSolutions: 'Climate Solutions',
      solution1: 'Carbon Footprint Assessment',
      solution2: 'Renewable Energy Strategy',
      solution3: 'Sustainability Consulting',
      solutionDescription: 'Comprehensive climate solutions for your business',
      ourImpact: 'Our Impact',
      impactStory1: 'Reduced CO2 by 40%',
      impactStory2: 'Helped 500+ Companies',
      impactStory3: 'Saved $2M in Energy Costs',
      impactStory4: 'Planted 10,000+ Trees',
      impactDescription: 'Real-world impact through innovative climate solutions'
    },
    errors: {
      heroLoadFailed: 'Failed to load hero section',
      servicesLoadFailed: 'Failed to load services section',
      caseStudiesLoadFailed: 'Failed to load case studies section',
      showcaseLoadFailed: 'Failed to load theme showcase'
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      close: 'Close',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      export: 'Export',
      import: 'Import',
      refresh: 'Refresh',
      settings: 'Settings',
      help: 'Help',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    },
    navigation: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      news: 'News',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      dashboard: 'Dashboard',
      admin: 'Admin'
    },
    footer: {
      description: 'Leading climate solutions provider',
      quickLinks: 'Quick Links',
      services: 'Services',
      contact: 'Contact',
      legal: 'Legal',
      followUs: 'Follow Us',
      newsletter: 'Newsletter',
      subscribe: 'Subscribe',
      allRightsReserved: 'All rights reserved'
    }
  },
  zh: {
    home: {
      climateSolutions: '气候解决方案',
      solution1: '碳足迹评估',
      solution2: '可再生能源战略',
      solution3: '可持续发展咨询',
      solutionDescription: '为您的企业提供全面的气候解决方案',
      ourImpact: '我们的影响',
      impactStory1: '减少40%的二氧化碳排放',
      impactStory2: '帮助500+家公司',
      impactStory3: '节省200万美元能源成本',
      impactStory4: '种植10,000+棵树',
      impactDescription: '通过创新的气候解决方案产生真实世界的影响'
    },
    errors: {
      heroLoadFailed: '无法加载主页横幅',
      servicesLoadFailed: '无法加载服务部分',
      caseStudiesLoadFailed: '无法加载案例研究部分',
      showcaseLoadFailed: '无法加载主题展示'
    },
    common: {
      loading: '加载中...',
      error: '发生错误',
      retry: '重试',
      close: '关闭',
      submit: '提交',
      cancel: '取消',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      export: '导出',
      import: '导入',
      refresh: '刷新',
      settings: '设置',
      help: '帮助',
      about: '关于',
      contact: '联系',
      privacy: '隐私政策',
      terms: '服务条款'
    },
    navigation: {
      home: '首页',
      services: '服务',
      about: '关于',
      news: '新闻',
      contact: '联系',
      login: '登录',
      logout: '登出',
      profile: '个人资料',
      dashboard: '仪表板',
      admin: '管理'
    },
    footer: {
      description: '领先的气候解决方案提供商',
      quickLinks: '快速链接',
      services: '服务',
      contact: '联系',
      legal: '法律',
      followUs: '关注我们',
      newsletter: '新闻简报',
      subscribe: '订阅',
      allRightsReserved: '版权所有'
    }
  }
}

// 获取嵌套翻译
function getNestedTranslation(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

// 格式化字符串（支持参数替换）
function formatString(str: string, params?: Record<string, any>): string {
  if (!params) return str
  
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

// 主要的i18n Hook
export function useI18n() {
  const context = useContext(I18nContext)
  
  if (!context) {
    // 如果没有Provider，返回一个基本的实现
    return {
      t: (key: string, fallback?: string, params?: Record<string, any>) => {
        const translation = getNestedTranslation(DEFAULT_TRANSLATIONS.en, key)
        const result = translation || fallback || key
        return formatString(result, params)
      },
      locale: 'en' as const,
      setLocale: () => {},
      availableLocales: ['en', 'zh'] as const
    }
  }
  
  const { locale, setLocale } = context
  
  const t = (key: string, fallback?: string, params?: Record<string, any>) => {
    // 首先尝试当前语言
    let translation = getNestedTranslation(DEFAULT_TRANSLATIONS[locale], key)
    
    // 如果没有找到，尝试英语作为后备
    if (!translation && locale !== 'en') {
      translation = getNestedTranslation(DEFAULT_TRANSLATIONS.en, key)
    }
    
    // 如果仍然没有找到，使用fallback或key
    const result = translation || fallback || key
    
    // 格式化字符串
    return formatString(result, params)
  }
  
  return {
    t,
    locale,
    setLocale,
    availableLocales: ['en', 'zh'] as const
  }
}

// 语言切换Hook
export function useLanguage() {
  const { locale, setLocale, availableLocales } = useI18n()
  
  const switchLanguage = (newLocale: 'en' | 'zh') => {
    setLocale(newLocale)
    // 可以在这里添加持久化逻辑
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', newLocale)
    }
  }
  
  const getLanguageDirection = () => {
    // 目前只支持LTR语言
    return 'ltr'
  }
  
  const getLanguageName = (code: 'en' | 'zh') => {
    const names = {
      en: 'English',
      zh: '中文'
    }
    return names[code] || code
  }
  
  return {
    locale,
    availableLocales,
    switchLanguage,
    getLanguageDirection,
    getLanguageName,
    isRTL: false
  }
}

// 翻译工具函数（用于非组件环境）
export function translate(key: string, locale: 'en' | 'zh' = 'en', fallback?: string, params?: Record<string, any>) {
  let translation = getNestedTranslation(DEFAULT_TRANSLATIONS[locale], key)
  
  if (!translation && locale !== 'en') {
    translation = getNestedTranslation(DEFAULT_TRANSLATIONS.en, key)
  }
  
  const result = translation || fallback || key
  return formatString(result, params)
}

// 检查是否支持某个语言
export function isSupportedLocale(locale: string): locale is 'en' | 'zh' {
  return ['en', 'zh'].includes(locale)
}

// 获取浏览器语言
export function getBrowserLanguage(): 'en' | 'zh' {
  if (typeof window === 'undefined') return 'en'
  
  const browserLang = navigator.language.substring(0, 2)
  return isSupportedLocale(browserLang) ? browserLang : 'en'
}

// 获取保存的语言偏好
export function getSavedLanguage(): 'en' | 'zh' {
  if (typeof window === 'undefined') return 'en'
  
  const saved = localStorage.getItem('preferred-language')
  return saved && isSupportedLocale(saved) ? saved : getBrowserLanguage()
}

export default useI18n