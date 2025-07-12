'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 确保 i18n 已经初始化
    const initializeI18n = async () => {
      try {
        // 等待 i18n 初始化完成
        if (!i18n.isInitialized) {
          await i18n.init();
        }
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // 即使初始化失败，也要渲染子组件以防止应用崩溃
        setIsReady(true);
      }
    };

    initializeI18n();
  }, []);

  // 在客户端环境下等待 i18n 初始化
  if (typeof window !== 'undefined' && !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};