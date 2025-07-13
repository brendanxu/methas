'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// 动态导入以避免SSR问题
const Result = dynamic(() => import('antd').then(mod => ({ default: mod.Result })), { ssr: false });
const AntButton = dynamic(() => import('antd').then(mod => ({ default: mod.Button })), { ssr: false });
const Button = dynamic(() => import('@/components/ui/Button').then(mod => ({ default: mod.Button })), { ssr: false });
const SEOHead = dynamic(() => import('@/components/seo/SEOHead').then(mod => ({ default: mod.SEOHead })), { ssr: false });

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

  if (typeof window === 'undefined') {
    // 服务器端渲染时返回简单的HTML
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">页面出现错误</h1>
          <p className="text-lg text-gray-600 mb-8">抱歉，页面遇到了一些问题。请尝试刷新页面或稍后再试。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
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
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
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
          </div>
        )}
      </div>
    </div>
  );
}