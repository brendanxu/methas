'use client';

import React from 'react';
import Link from 'next/link';
import { Button as AntButton, Result } from 'antd';
import { Button } from '@/components/ui/Button';
import { SEOHead } from '@/components/seo/SEOHead';
import { NOT_FOUND_SEO } from '@/lib/seo-config';

export default function NotFound() {
  return (
    <>
      <SEOHead config={NOT_FOUND_SEO} basePath="/404" />
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <Result
          status="404"
          title="页面未找到"
          subTitle="抱歉，您访问的页面不存在或已被移动。"
          extra={[
            <Link key="home" href="/">
              <Button variant="primary">
                返回首页
              </Button>
            </Link>,
            <Link key="services" href="/services">
              <AntButton>
                查看服务
              </AntButton>
            </Link>,
            <Link key="news" href="/news">
              <AntButton>
                新闻资讯
              </AntButton>
            </Link>
          ]}
        />
        
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
    </>
  );
}