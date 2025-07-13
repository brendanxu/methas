import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing({
      // 设置追踪采样率
      tracePropagationTargets: ["localhost", /^https:\/\/yoursite\.com\/api/],
    }),
    new Sentry.Replay({
      // 用户会话重放
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // 性能监控
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 会话重放采样率
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // 自定义配置
  beforeSend(event, hint) {
    // 过滤敏感信息
    if (event.exception) {
      const error = hint.originalException;
      
      // 跳过某些错误
      if (error && error.message) {
        if (error.message.includes('ResizeObserver loop limit exceeded')) {
          return null;
        }
        if (error.message.includes('Non-Error promise rejection captured')) {
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
        version: process.env.npm_package_version,
      },
    },
  },
});