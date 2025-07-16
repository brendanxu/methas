/**
 * 国际化工具函数
 */

import { translations, type Locale } from './i18n-lite'

/**
 * 获取所有翻译键的类型安全路径
 */
export function getTranslationKeys(locale: Locale = 'en'): string[] {
  const keys: string[] = []
  
  function extractKeys(obj: any, prefix = ''): void {
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractKeys(obj[key], fullKey)
      } else {
        keys.push(fullKey)
      }
    })
  }
  
  extractKeys(translations[locale])
  return keys.sort()
}

/**
 * 检查翻译键是否存在
 */
export function hasTranslation(key: string, locale: Locale = 'en'): boolean {
  const keys = key.split('.')
  let current: any = translations[locale]
  
  for (const k of keys) {
    if (current[k] === undefined) {
      return false
    }
    current = current[k]
  }
  
  return typeof current === 'string'
}

/**
 * 获取缺失的翻译键
 */
export function getMissingTranslations(): {
  keysInEnButNotInZh: string[]
  keysInZhButNotInEn: string[]
} {
  const enKeys = getTranslationKeys('en')
  const zhKeys = getTranslationKeys('zh')
  
  const keysInEnButNotInZh = enKeys.filter(key => !hasTranslation(key, 'zh'))
  const keysInZhButNotInEn = zhKeys.filter(key => !hasTranslation(key, 'en'))
  
  return {
    keysInEnButNotInZh,
    keysInZhButNotInEn
  }
}

/**
 * 验证翻译完整性
 */
export function validateTranslations(): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []
  const missing = getMissingTranslations()
  
  if (missing.keysInEnButNotInZh.length > 0) {
    issues.push(`Missing Chinese translations: ${missing.keysInEnButNotInZh.join(', ')}`)
  }
  
  if (missing.keysInZhButNotInEn.length > 0) {
    issues.push(`Missing English translations: ${missing.keysInZhButNotInEn.join(', ')}`)
  }
  
  // 检查空字符串
  const enKeys = getTranslationKeys('en')
  enKeys.forEach(key => {
    const enValue = getNestedValue(translations.en, key)
    const zhValue = getNestedValue(translations.zh, key)
    
    if (typeof enValue === 'string' && enValue.trim() === '') {
      issues.push(`Empty English translation for key: ${key}`)
    }
    
    if (typeof zhValue === 'string' && zhValue.trim() === '') {
      issues.push(`Empty Chinese translation for key: ${key}`)
    }
  })
  
  return {
    isValid: issues.length === 0,
    issues
  }
}

/**
 * 获取嵌套对象值
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * 生成翻译报告
 */
export function generateTranslationReport(): {
  totalKeys: number
  completedKeys: number
  completionRate: number
  missing: ReturnType<typeof getMissingTranslations>
  validation: ReturnType<typeof validateTranslations>
} {
  const enKeys = getTranslationKeys('en')
  const zhKeys = getTranslationKeys('zh')
  const missing = getMissingTranslations()
  const validation = validateTranslations()
  
  const totalKeys = Math.max(enKeys.length, zhKeys.length)
  const completedKeys = enKeys.filter(key => hasTranslation(key, 'zh')).length
  const completionRate = totalKeys > 0 ? (completedKeys / totalKeys) * 100 : 0
  
  return {
    totalKeys,
    completedKeys,
    completionRate: Math.round(completionRate * 100) / 100,
    missing,
    validation
  }
}

/**
 * 开发模式下的翻译调试器
 */
export class I18nDebugger {
  private static loggedKeys = new Set<string>()
  
  static logMissingKey(key: string): void {
    if (process.env.NODE_ENV !== 'development') return
    
    if (!this.loggedKeys.has(key)) {
      console.warn(`[I18n] Missing translation key: ${key}`)
      this.loggedKeys.add(key)
    }
  }
  
  static logTranslationUsage(key: string, locale: Locale): void {
    if (process.env.NODE_ENV !== 'development') return
    
    console.log(`[I18n] Using translation: ${key} (${locale})`)
  }
  
  static clearLogs(): void {
    this.loggedKeys.clear()
  }
  
  static getLoggedKeys(): string[] {
    return Array.from(this.loggedKeys)
  }
}

/**
 * 翻译键提取器（用于自动化工具）
 */
export function extractTranslationKeysFromText(text: string): string[] {
  // 匹配 t('key') 或 t("key") 模式
  const regex = /t\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g
  const keys: string[] = []
  let match
  
  while ((match = regex.exec(text)) !== null) {
    keys.push(match[1])
  }
  
  return [...new Set(keys)] // 去重
}

/**
 * 自动补全建议
 */
export function getSuggestions(partialKey: string, locale: Locale = 'en'): string[] {
  const allKeys = getTranslationKeys(locale)
  return allKeys.filter(key => 
    key.toLowerCase().includes(partialKey.toLowerCase())
  ).slice(0, 10) // 限制建议数量
}

/**
 * 翻译内容搜索
 */
export function searchTranslations(searchTerm: string, locale: Locale = 'en'): Array<{
  key: string
  value: string
  score: number
}> {
  const results: Array<{ key: string; value: string; score: number }> = []
  const allKeys = getTranslationKeys(locale)
  
  allKeys.forEach(key => {
    const value = getNestedValue(translations[locale], key)
    if (typeof value === 'string') {
      let score = 0
      
      // 键名匹配
      if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
        score += 10
      }
      
      // 值匹配
      if (value.toLowerCase().includes(searchTerm.toLowerCase())) {
        score += 5
      }
      
      // 精确匹配
      if (value.toLowerCase() === searchTerm.toLowerCase()) {
        score += 20
      }
      
      if (score > 0) {
        results.push({ key, value, score })
      }
    }
  })
  
  return results.sort((a, b) => b.score - a.score)
}