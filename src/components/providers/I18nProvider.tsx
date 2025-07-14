'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const initI18n = async () => {
      try {
        // 等待i18n初始化完成
        if (!i18n.isInitialized) {
          // 如果还未初始化，等待最多500ms
          let attempts = 0;
          while (!i18n.isInitialized && attempts < 50 && mounted) {
            await new Promise(resolve => setTimeout(resolve, 10));
            attempts++;
          }
        }
        
        if (mounted) {
          setIsReady(true);
          setError(null);
        }
      } catch (err) {
        console.warn('I18n initialization error:', err);
        if (mounted) {
          setError('Translation system failed to load');
          // 仍然设置为ready，使用fallback
          setIsReady(true);
        }
      }
    };

    initI18n();
    
    return () => {
      mounted = false;
    };
  }, []);

  // 服务端直接渲染，避免hydration问题
  if (typeof window === 'undefined') {
    return (
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    );
  }

  // 客户端等待初始化完成
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 错误状态显示警告但仍然渲染
  if (error) {
    console.warn('I18n Provider Error:', error);
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};