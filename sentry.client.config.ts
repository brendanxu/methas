import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // 性能监控
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // 自定义配置
    beforeSend(event, hint) {
      // 过滤敏感信息
      if (event.exception) {
        const error = hint.originalException;
        
        // 跳过某些错误
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);
          if (message.includes('ResizeObserver loop limit exceeded')) {
            return null;
          }
          if (message.includes('Non-Error promise rejection captured')) {
            return null;
          }
        }
      }
      
      // 过滤掉本地开发环境的某些错误
      if (process.env.NODE_ENV === 'development') {
        if (event.exception?.values?.[0]?.value?.includes('HMR')) {
          return null;
        }
      }
      
      return event;
    },
    
    // 添加用户上下文
    initialScope: {
      tags: {
        component: 'client',
      },
      contexts: {
        app: {
          name: 'Southpole Official',
          version: process.env.npm_package_version || '1.0.0',
        },
      },
    },
  });
}