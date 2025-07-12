'use client';

import React from 'react';
import { Button as AntButton, Result } from 'antd';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { SEOHead } from '@/components/seo/SEOHead';
import { ERROR_SEO } from '@/lib/seo-config';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // 在生产环境中记录错误（这里可以集成错误监控服务）
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // 这里可以集成如 Sentry、LogRocket 等错误监控服务
      console.error('Application Error:', {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      });
    }
  }, [error]);

  return (
    <>
      <SEOHead config={ERROR_SEO} basePath="/error" />
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Result
          status="error"
          title="页面出现错误"
          subTitle="抱歉，页面遇到了一些问题。请尝试刷新页面或稍后再试。"
          extra={[
            <Button
              key="retry"
              variant="primary"
              onClick={reset}
              className="mr-4"
            >
              重试
            </Button>,
            <AntButton
              key="home"
              onClick={() => window.location.href = '/'}
            >
              返回首页
            </AntButton>
          ]}
        />
        
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              开发环境错误信息：
            </h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-red-800 cursor-pointer">查看堆栈信息</summary>
                <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap break-words">
                  {error.stack}
                </pre>
              </details>
            )}
          </motion.div>
        )}
      </motion.div>
      </div>
    </>
  );
}