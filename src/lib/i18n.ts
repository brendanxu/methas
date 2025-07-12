import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译资源
import enCommon from '../../public/locales/en/common.json';
import enHome from '../../public/locales/en/home.json';
import enNav from '../../public/locales/en/nav.json';
import zhCommon from '../../public/locales/zh/common.json';
import zhHome from '../../public/locales/zh/home.json';
import zhNav from '../../public/locales/zh/nav.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    nav: enNav,
  },
  zh: {
    common: zhCommon,
    home: zhHome,
    nav: zhNav,
  },
} as const;

// 支持的语言列表
export const supportedLanguages = ['en', 'zh'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

// 语言显示名称
export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  zh: '中文',
};

// 语言配置
export const i18nConfig = {
  defaultLanguage: 'en' as SupportedLanguage,
  supportedLanguages,
  fallbackLanguage: 'en' as SupportedLanguage,
};

// 初始化 i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: i18nConfig.defaultLanguage,
    fallbackLng: i18nConfig.fallbackLanguage,
    defaultNS,
    ns: ['common', 'home', 'nav'],
    
    resources,
    
    // 语言检测配置
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
    },
    
    // 插值配置
    interpolation: {
      escapeValue: false, // React已经处理了XSS防护
    },
    
    // 开发模式配置
    debug: process.env.NODE_ENV === 'development',
    
    // React配置
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// 工具函数：从URL获取语言
export const getLocaleFromUrl = (): SupportedLanguage => {
  if (typeof window === 'undefined') return i18nConfig.defaultLanguage;
  
  const pathname = window.location.pathname;
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (potentialLocale && supportedLanguages.includes(potentialLocale as SupportedLanguage)) {
    return potentialLocale as SupportedLanguage;
  }
  
  return i18nConfig.defaultLanguage;
};

// 工具函数：获取当前语言
export const getCurrentLanguage = (): SupportedLanguage => {
  // First try to get from URL
  const urlLocale = getLocaleFromUrl();
  if (urlLocale !== i18nConfig.defaultLanguage || !i18n.language) {
    return urlLocale;
  }
  
  const current = i18n.language;
  return supportedLanguages.includes(current as SupportedLanguage) 
    ? (current as SupportedLanguage) 
    : i18nConfig.defaultLanguage;
};

// 工具函数：切换语言
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(language);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', language);
    
    // Update URL with new locale
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    
    // Remove current locale if it exists
    if (segments[1] && supportedLanguages.includes(segments[1] as SupportedLanguage)) {
      segments.splice(1, 1);
    }
    
    // Add new locale
    const newPath = `/${language}${segments.join('/') || ''}`;
    
    // Navigate to new URL
    window.history.replaceState({}, '', newPath);
  }
};

// 工具函数：获取本地化路径
export const getLocalizedPath = (path: string, locale?: SupportedLanguage): string => {
  const targetLocale = locale || getCurrentLanguage();
  
  // Remove existing locale from path if present
  let cleanPath = path;
  for (const lang of supportedLanguages) {
    if (path.startsWith(`/${lang}/`) || path === `/${lang}`) {
      cleanPath = path.substring(lang.length + 1) || '/';
      break;
    }
  }
  
  // Add target locale
  return `/${targetLocale}${cleanPath === '/' ? '' : cleanPath}`;
};

// 工具函数：格式化日期
export const formatDate = (
  date: Date | string | number, 
  options?: Intl.DateTimeFormatOptions
): string => {
  const currentLang = getCurrentLanguage();
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options })
    .format(new Date(date));
};

// 工具函数：格式化数字
export const formatNumber = (
  number: number,
  options?: Intl.NumberFormatOptions
): string => {
  const currentLang = getCurrentLanguage();
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US';
  
  return new Intl.NumberFormat(locale, options).format(number);
};

// 工具函数：格式化货币
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string => {
  const currentLang = getCurrentLanguage();
  const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US';
  
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
  };
  
  return new Intl.NumberFormat(locale, { ...defaultOptions, ...options })
    .format(amount);
};


// 类型定义
export type TranslationKey = keyof typeof resources.en.common;
export type HomeTranslationKey = keyof typeof resources.en.home;
export type NavTranslationKey = keyof typeof resources.en.nav;