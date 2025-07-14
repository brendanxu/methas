import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻译资源（使用动态导入以支持生产环境）
export const defaultNS = 'common';

// 创建基础资源结构，避免生产环境加载失败
export const resources = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      submit: 'Submit',
    },
    home: {
      title: 'Welcome to South Pole',
      subtitle: 'Leading Carbon Management Solutions',
    },
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      cases: 'Cases',
      news: 'News',
      contact: 'Contact',
    },
  },
  zh: {
    common: {
      loading: '加载中...',
      error: '错误',
      retry: '重试',
      close: '关闭',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      submit: '提交',
    },
    home: {
      title: '欢迎来到 South Pole',
      subtitle: '领先的碳管理解决方案',
    },
    nav: {
      home: '首页',
      about: '关于我们',
      services: '服务',
      cases: '案例',
      news: '新闻',
      contact: '联系我们',
    },
  },
} as const;

// 暂时禁用动态加载以避免部署问题
const loadResources = async () => {
  // 使用静态资源，避免动态导入在生产环境的问题
  console.log('Using static i18n resources');
};

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

// 简化的 i18next 初始化
const initializeI18n = async () => {
  if (i18n.isInitialized) {
    return;
  }
  
  try {
    await i18n
      .use(initReactI18next)
      .init({
        lng: i18nConfig.defaultLanguage,
        fallbackLng: i18nConfig.fallbackLanguage,
        defaultNS,
        ns: ['common', 'home', 'nav'],
        
        resources,
        
        // 插值配置
        interpolation: {
          escapeValue: false,
        },
        
        // 开发模式配置
        debug: false, // 禁用调试以避免生产环境问题
        
        // React配置
        react: {
          useSuspense: false,
        },
      });
  } catch (error) {
    console.warn('Failed to initialize i18n:', error);
  }
};

// 延迟初始化以避免SSR问题
if (typeof window !== 'undefined') {
  initializeI18n().catch(error => {
    console.warn('Failed to initialize i18n:', error);
  });
}

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