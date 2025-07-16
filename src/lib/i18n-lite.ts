/**
 * 轻量级国际化系统
 * 客户端专用，不影响SSR和静态生成
 */

// 支持的语言
export const SUPPORTED_LOCALES = ['en', 'zh'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]

// 默认语言
export const DEFAULT_LOCALE: Locale = 'en'

// 语言显示名称
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  zh: '中文'
}

// 翻译资源类型
export type TranslationResource = {
  [key: string]: string | TranslationResource
}

// 翻译资源
export const translations: Record<Locale, TranslationResource> = {
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
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      refresh: 'Refresh',
      export: 'Export',
      import: 'Import',
      download: 'Download',
      upload: 'Upload',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      clear: 'Clear',
      reset: 'Reset',
      apply: 'Apply',
      learnMore: 'Learn More',
      readMore: 'Read More',
      showMore: 'Show More',
      showLess: 'Show Less',
      noData: 'No data available',
      noResults: 'No results found',
      required: 'Required',
      optional: 'Optional',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      contactUs: 'Contact Us',
      aboutUs: 'About Us',
      services: 'Services',
      products: 'Products',
      solutions: 'Solutions',
      resources: 'Resources',
      blog: 'Blog',
      news: 'News',
      events: 'Events',
      careers: 'Careers',
      partners: 'Partners',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2024 South Pole. All rights reserved.',
      cookieNotice: 'This website uses cookies to ensure you get the best experience.',
      acceptCookies: 'Accept',
      declineCookies: 'Decline',
      language: 'Language',
      changeLanguage: 'Change Language',
      selectLanguage: 'Select Language'
    },
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      projects: 'Projects',
      insights: 'Insights',
      contact: 'Contact',
      adminDashboard: 'Admin Dashboard',
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      settings: 'Settings'
    },
    hero: {
      title: 'Leading the Way in Climate Solutions',
      subtitle: 'Empowering businesses to achieve net-zero emissions through innovative carbon management strategies',
      cta: 'Get Started',
      learnMore: 'Learn More'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive climate solutions for your business',
      carbonFootprint: {
        title: 'Carbon Footprint Assessment',
        description: 'Measure and analyze your organization\'s carbon emissions with precision'
      },
      carbonNeutrality: {
        title: 'Carbon Neutrality Consulting',
        description: 'Develop strategies to achieve net-zero emissions'
      },
      sustainableFinance: {
        title: 'Sustainable Finance',
        description: 'Access green financing solutions for your climate projects'
      },
      climateStrategy: {
        title: 'Climate Strategy',
        description: 'Build comprehensive climate action plans aligned with your business goals'
      }
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our climate experts',
      form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company',
        position: 'Position',
        country: 'Country',
        inquiryType: 'Inquiry Type',
        message: 'Message',
        agreeToTerms: 'I agree to the terms and conditions',
        subscribeNewsletter: 'Subscribe to our newsletter',
        submit: 'Send Message',
        submitting: 'Sending...',
        success: 'Thank you for your message. We will get back to you soon.',
        error: 'Failed to send message. Please try again.'
      },
      inquiryTypes: {
        general: 'General Inquiry',
        services: 'Services Information',
        partnership: 'Partnership Opportunity',
        media: 'Media Inquiry',
        careers: 'Career Opportunity',
        other: 'Other'
      }
    },
    footer: {
      company: 'Company',
      quickLinks: 'Quick Links',
      connect: 'Connect',
      newsletter: 'Newsletter',
      newsletterDesc: 'Subscribe to receive the latest climate insights',
      emailPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
      followUs: 'Follow Us',
      allRightsReserved: 'All rights reserved',
      madeWith: 'Made with',
      by: 'by'
    },
    admin: {
      dashboard: 'Dashboard',
      contentManagement: 'Content Management',
      userManagement: 'User Management',
      fileManagement: 'File Management',
      formSubmissions: 'Form Submissions',
      emailManagement: 'Email Management',
      analytics: 'Analytics',
      settings: 'Settings',
      logout: 'Logout',
      welcome: 'Welcome',
      totalUsers: 'Total Users',
      totalContent: 'Total Content',
      totalSubmissions: 'Total Submissions',
      recentActivity: 'Recent Activity'
    },
    errors: {
      'notFound': 'Page Not Found',
      'notFoundDescription': 'The page you are looking for does not exist.',
      'serverError': 'Internal Server Error',
      'serverErrorDescription': 'Something went wrong on our end.',
      'backToHome': 'Back to Home',
      'tryAgain': 'Try Again'
    }
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
      delete: '删除',
      edit: '编辑',
      view: '查看',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      refresh: '刷新',
      export: '导出',
      import: '导入',
      download: '下载',
      upload: '上传',
      yes: '是',
      no: '否',
      ok: '确定',
      clear: '清除',
      reset: '重置',
      apply: '应用',
      learnMore: '了解更多',
      readMore: '阅读更多',
      showMore: '显示更多',
      showLess: '显示更少',
      noData: '暂无数据',
      noResults: '未找到结果',
      required: '必填',
      optional: '选填',
      success: '成功',
      warning: '警告',
      info: '信息',
      contactUs: '联系我们',
      aboutUs: '关于我们',
      services: '服务',
      products: '产品',
      solutions: '解决方案',
      resources: '资源',
      blog: '博客',
      news: '新闻',
      events: '活动',
      careers: '招聘',
      partners: '合作伙伴',
      privacy: '隐私政策',
      terms: '服务条款',
      copyright: '© 2024 South Pole. 版权所有。',
      cookieNotice: '本网站使用Cookie以确保您获得最佳体验。',
      acceptCookies: '接受',
      declineCookies: '拒绝',
      language: '语言',
      changeLanguage: '切换语言',
      selectLanguage: '选择语言'
    },
    nav: {
      home: '首页',
      about: '关于',
      services: '服务',
      projects: '项目',
      insights: '洞察',
      contact: '联系',
      adminDashboard: '管理后台',
      login: '登录',
      logout: '退出',
      profile: '个人资料',
      settings: '设置'
    },
    hero: {
      title: '引领气候解决方案之路',
      subtitle: '通过创新的碳管理策略，助力企业实现净零排放',
      cta: '立即开始',
      learnMore: '了解更多'
    },
    services: {
      title: '我们的服务',
      subtitle: '为您的企业提供全面的气候解决方案',
      carbonFootprint: {
        title: '碳足迹评估',
        description: '精确测量和分析您组织的碳排放'
      },
      carbonNeutrality: {
        title: '碳中和咨询',
        description: '制定实现净零排放的策略'
      },
      sustainableFinance: {
        title: '可持续金融',
        description: '为您的气候项目获取绿色融资解决方案'
      },
      climateStrategy: {
        title: '气候战略',
        description: '制定与您业务目标一致的全面气候行动计划'
      }
    },
    contact: {
      title: '联系我们',
      subtitle: '与我们的气候专家取得联系',
      form: {
        firstName: '名字',
        lastName: '姓氏',
        email: '邮箱',
        phone: '电话',
        company: '公司',
        position: '职位',
        country: '国家',
        inquiryType: '咨询类型',
        message: '留言',
        agreeToTerms: '我同意条款和条件',
        subscribeNewsletter: '订阅我们的通讯',
        submit: '发送消息',
        submitting: '发送中...',
        success: '感谢您的留言。我们会尽快回复您。',
        error: '发送失败，请重试。'
      },
      inquiryTypes: {
        general: '一般咨询',
        services: '服务信息',
        partnership: '合作机会',
        media: '媒体咨询',
        careers: '职业机会',
        other: '其他'
      }
    },
    footer: {
      company: '公司',
      quickLinks: '快速链接',
      connect: '联系',
      newsletter: '通讯订阅',
      newsletterDesc: '订阅以接收最新的气候洞察',
      emailPlaceholder: '输入您的邮箱',
      subscribe: '订阅',
      followUs: '关注我们',
      allRightsReserved: '版权所有',
      madeWith: '用心制作',
      by: '由'
    },
    admin: {
      dashboard: '仪表板',
      contentManagement: '内容管理',
      userManagement: '用户管理',
      fileManagement: '文件管理',
      formSubmissions: '表单提交',
      emailManagement: '邮件管理',
      analytics: '数据分析',
      settings: '设置',
      logout: '退出登录',
      welcome: '欢迎',
      totalUsers: '总用户数',
      totalContent: '总内容数',
      totalSubmissions: '总提交数',
      recentActivity: '最近活动'
    },
    errors: {
      'notFound': '页面未找到',
      'notFoundDescription': '您访问的页面不存在。',
      'serverError': '服务器内部错误',
      'serverErrorDescription': '服务器出现了问题。',
      'backToHome': '返回首页',
      'tryAgain': '重试'
    }
  }
}

// 获取嵌套翻译值的辅助函数
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// 格式化翻译字符串（支持简单的变量替换）
function formatString(str: string, params?: Record<string, any>): string {
  if (!params) return str
  
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
  }, str)
}

/**
 * 轻量级国际化类
 */
export class I18nLite {
  private locale: Locale = DEFAULT_LOCALE
  private changeListeners: ((locale: Locale) => void)[] = []

  constructor() {
    // 从localStorage读取保存的语言设置
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale
      if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
        this.locale = savedLocale
      }
    }
  }

  /**
   * 获取当前语言
   */
  getLocale(): Locale {
    return this.locale
  }

  /**
   * 设置语言
   */
  setLocale(locale: Locale): void {
    if (!SUPPORTED_LOCALES.includes(locale)) {
      console.warn(`Unsupported locale: ${locale}`)
      return
    }

    this.locale = locale
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale)
    }

    // 通知所有监听器
    this.changeListeners.forEach(listener => listener(locale))
  }

  /**
   * 监听语言变化
   */
  onChange(listener: (locale: Locale) => void): () => void {
    this.changeListeners.push(listener)
    
    // 返回取消监听的函数
    return () => {
      const index = this.changeListeners.indexOf(listener)
      if (index > -1) {
        this.changeListeners.splice(index, 1)
      }
    }
  }

  /**
   * 获取翻译
   */
  t(key: string, params?: Record<string, any>): string {
    const translation = getNestedValue(translations[this.locale], key)
    
    if (translation === undefined) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }

    return formatString(translation, params)
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const locale = this.locale === 'zh' ? 'zh-CN' : 'en-US'
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options })
      .format(new Date(date))
  }

  /**
   * 格式化数字
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.locale === 'zh' ? 'zh-CN' : 'en-US'
    return new Intl.NumberFormat(locale, options).format(number)
  }

  /**
   * 格式化货币
   */
  formatCurrency(amount: number, currency: string = 'USD', options?: Intl.NumberFormatOptions): string {
    const locale = this.locale === 'zh' ? 'zh-CN' : 'en-US'
    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency
    }
    
    return new Intl.NumberFormat(locale, { ...defaultOptions, ...options })
      .format(amount)
  }

  /**
   * 获取相对时间
   */
  formatRelativeTime(date: Date | string | number): string {
    const locale = this.locale === 'zh' ? 'zh-CN' : 'en-US'
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    
    const now = Date.now()
    const then = new Date(date).getTime()
    const diff = then - now
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    
    if (Math.abs(years) >= 1) return rtf.format(years, 'year')
    if (Math.abs(months) >= 1) return rtf.format(months, 'month')
    if (Math.abs(weeks) >= 1) return rtf.format(weeks, 'week')
    if (Math.abs(days) >= 1) return rtf.format(days, 'day')
    if (Math.abs(hours) >= 1) return rtf.format(hours, 'hour')
    if (Math.abs(minutes) >= 1) return rtf.format(minutes, 'minute')
    return rtf.format(seconds, 'second')
  }
}

// 创建单例实例
export const i18n = new I18nLite()