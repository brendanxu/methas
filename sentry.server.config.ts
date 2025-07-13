import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // 服务端性能监控
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // 自定义配置
    beforeSend(event, hint) {
      // 服务端错误过滤
      if (event.exception) {
        const error = hint.originalException;
        
        // 跳过某些常见的无关错误
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);
          if (message.includes('ECONNRESET')) {
            return null;
          }
          if (message.includes('socket hang up')) {
            return null;
          }
        }
      }
      
      // 过滤敏感的请求信息
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers['x-api-key'];
        }
      }
      
      return event;
    },
    
    // 添加服务端上下文
    initialScope: {
      tags: {
        component: 'server',
        runtime: 'nodejs',
      },
      contexts: {
        runtime: {
          name: 'node',
          version: process.version,
        },
      },
    },
  });
}