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
    // 简化初始化流程
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100); // 给i18n一点时间初始化
    
    return () => clearTimeout(timer);
  }, []);

  // 服务端直接渲染，避免hydration问题
  if (typeof window === 'undefined') {
    return (
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    );
  }

  // 客户端等待一小段时间后渲染
  if (!isReady) {
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