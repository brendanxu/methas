import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // Edge Runtime 配置
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Edge Runtime 特定配置
    beforeSend(event, hint) {
      // Edge Runtime 错误过滤
      if (event.exception) {
        const error = hint.originalException;
        
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);
          // 跳过某些 Edge Runtime 特定错误
          if (message.includes('dynamic code evaluation')) {
            return null;
          }
        }
      }
      
      return event;
    },
    
    // 添加 Edge Runtime 上下文
    initialScope: {
      tags: {
        component: 'edge',
        runtime: 'edge',
      },
    },
  });
}