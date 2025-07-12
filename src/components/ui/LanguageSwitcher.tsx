'use client';

import React from 'react';
import { Dropdown, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { 
  changeLanguage, 
  getCurrentLanguage, 
  languageNames, 
  supportedLanguages,
  type SupportedLanguage 
} from '@/lib/i18n';
import { cn } from '@/lib/utils';

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
  const { t } = useTranslation('common');
  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language !== currentLanguage) {
      await changeLanguage(language);
      // No need to reload - URL navigation and i18n context will handle the update
    }
  };

  const menuItems = supportedLanguages.map((lang) => ({
    key: lang,
    label: (
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {lang === 'en' ? '🇺🇸' : '🇨🇳'}
        </span>
        <span>{languageNames[lang]}</span>
        {lang === currentLanguage && (
          <span className="text-primary">✓</span>
        )}
      </div>
    ),
    onClick: () => handleLanguageChange(lang),
  }));

  const getCurrentLanguageFlag = () => {
    return currentLanguage === 'en' ? '🇺🇸' : '🇨🇳';
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
            {languageNames[currentLanguage]}
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
  const currentLanguage = getCurrentLanguage();
  
  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language !== currentLanguage) {
      await changeLanguage(language);
      // No need to reload - URL navigation and i18n context will handle the update
    }
  };

  const menuItems = supportedLanguages.map((lang) => ({
    key: lang,
    label: (
      <div className="flex items-center justify-between gap-3 min-w-[120px]">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {lang === 'en' ? '🇺🇸' : '🇨🇳'}
          </span>
          <span className="font-medium">{languageNames[lang]}</span>
        </div>
        {lang === currentLanguage && (
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
          {currentLanguage === 'en' ? '🇺🇸' : '🇨🇳'}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {languageNames[currentLanguage]}
        </span>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;