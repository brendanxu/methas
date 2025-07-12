import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '页面未找到 | South Pole',
  description: '抱歉，您访问的页面不存在。',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">页面未找到</h2>
          <p className="text-gray-600 mb-8">抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。</p>
          <div className="space-x-4">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>如果您认为这是一个错误，请联系我们的客服团队。</p>
          <p className="mt-2">
            邮箱：
            <a 
              href="mailto:contact@southpole.com" 
              className="text-primary hover:underline"
            >
              contact@southpole.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}