import React from 'react';
import Link from 'next/link';
import { Button as AntButton, Result } from 'antd';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '页面未找到 | South Pole',
  description: '抱歉，您访问的页面不存在。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
        
        <motion.div
          className="mt-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>
      </motion.div>
    </div>
  );
}