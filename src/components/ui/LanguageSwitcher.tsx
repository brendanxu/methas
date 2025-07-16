'use client';

import React from 'react';
import { Dropdown, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useI18n, useLanguage } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

// 支持的语言
const SUPPORTED_LOCALES = ['en', 'zh'] as const;
const LOCALE_NAMES = {
  en: 'English',
  zh: '中文'
} as const;

type Locale = typeof SUPPORTED_LOCALES[number];

interface LanguageSwitcherProps {
  className?: string;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'text' | 'link';
  showText?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  size = 'middle',
  type = 'text',
  showText = true,
}) => {
  const { locale, switchLanguage, getLanguageName } = useLanguage();

  const handleLanguageChange = (language: Locale) => {
    if (language !== locale) {
      switchLanguage(language);
    }
  };

  const menuItems = SUPPORTED_LOCALES.map((lang) => ({
    key: lang,
    label: (
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {lang === 'en' ? '🇺🇸' : '🇨🇳'}
        </span>
        <span>{getLanguageName(lang)}</span>
        {lang === locale && (
          <span className="text-primary">✓</span>
        )}
      </div>
    ),
    onClick: () => handleLanguageChange(lang),
  }));

  const getCurrentLanguageFlag = () => {
    return locale === 'en' ? '🇺🇸' : '🇨🇳';
  };

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
      className={cn('language-switcher', className)}
    >
      <Button
        type={type}
        size={size}
        icon={<GlobalOutlined />}
        className="flex items-center gap-1"
      >
        <span className="text-lg">{getCurrentLanguageFlag()}</span>
        {showText && (
          <span className="hidden sm:inline">
            {getLanguageName(locale)}
          </span>
        )}
      </Button>
    </Dropdown>
  );
};

// 简化版本的语言切换器，只显示图标
export const LanguageSwitcherCompact: React.FC<{ className?: string }> = ({ 
  className 
}) => {
  return (
    <LanguageSwitcher
      className={className}
      size="small"
      type="text"
      showText={false}
    />
  );
};

// 带有下拉箭头的完整版本
export const LanguageSwitcherFull: React.FC<{ className?: string }> = ({ 
  className 
}) => {
  const { locale, switchLanguage, getLanguageName } = useLanguage();
  
  const handleLanguageChange = (language: Locale) => {
    if (language !== locale) {
      switchLanguage(language);
    }
  };

  const menuItems = SUPPORTED_LOCALES.map((lang) => ({
    key: lang,
    label: (
      <div className="flex items-center justify-between gap-3 min-w-[120px]">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {lang === 'en' ? '🇺🇸' : '🇨🇳'}
          </span>
          <span className="font-medium">{getLanguageName(lang)}</span>
        </div>
        {lang === locale && (
          <span className="text-primary text-sm">✓</span>
        )}
      </div>
    ),
    onClick: () => handleLanguageChange(lang),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
      className={cn('language-switcher-full', className)}
    >
      <Button 
        type="text" 
        className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <GlobalOutlined className="text-gray-600 dark:text-gray-400" />
        <span className="text-lg">
          {locale === 'en' ? '🇺🇸' : '🇨🇳'}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getLanguageName(locale)}
        </span>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;