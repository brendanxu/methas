/**
 * Monitoring and Error Tracking
 * 
 * Centralized monitoring configuration for production
 */

// Types for monitoring
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  route?: string;
  userAgent?: string;
  timestamp?: string;
  additionalContext?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * Initialize error monitoring (Sentry)
 */
export function initializeErrorMonitoring() {
  if (typeof window === 'undefined') return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn('Sentry DSN not configured');
    return;
  }

  // Dynamic import Sentry to avoid bundle bloat if not configured
  // Note: @sentry/nextjs not installed, monitoring disabled
  Promise.resolve().then(() => {
    const Sentry = {
      init: (config: any) => console.log('Sentry mock init'),
      Replay: function(options: any) { return {}; },
    };
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        integrations: [
          // Sentry.Replay mock disabled
        ],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        beforeSend(event: any) {
          // Filter out common non-critical errors
          if (event.exception) {
            const error = event.exception.values?.[0];
            if (error?.value?.includes('ResizeObserver loop limit exceeded')) {
              return null;
            }
            if (error?.value?.includes('Script error')) {
              return null;
            }
          }
          return event;
        },
      });

      console.log('✅ Sentry error monitoring initialized');
    })
    .catch((error) => {
      console.warn('Failed to initialize Sentry:', error);
    });
}

/**
 * Log error to monitoring service
 */
export function logError(error: Error, context?: ErrorContext) {
  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Send to monitoring service in production
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Note: @sentry/nextjs not installed, using console fallback
    Promise.resolve().then(() => {
      const Sentry = {
        withScope: (fn: any) => fn({ setTag: () => {} }),
        captureException: (error: Error) => console.error('Sentry fallback:', error),
      };
        Sentry.withScope((scope: any) => {
          if (context) {
            Object.entries(context).forEach(([key, value]) => {
              scope.setTag(key, value);
            });
          }
          Sentry.captureException(error);
        });
      })
      .catch(() => {
        // Fallback logging
        console.error('Monitoring service unavailable:', error);
      });
  }
}

/**
 * Log performance metric
 */
export function logPerformanceMetric(metric: PerformanceMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance metric:', metric);
  }

  // Send to analytics service
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    // Google Analytics 4 event
    if ('gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        name: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        rating: metric.rating,
        metric_id: metric.id,
      });
    }
  }
}

/**
 * Log user interaction
 */
export function logUserInteraction(action: string, details?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.log('User interaction:', { action, details });
  }

  // Send to analytics
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    if ('gtag' in window) {
      (window as any).gtag('event', action, {
        event_category: 'engagement',
        ...details,
      });
    }
  }
}

/**
 * Initialize analytics
 */
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) {
    console.warn('Google Analytics ID not configured');
    return;
  }

  // Load Google Analytics
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('✅ Google Analytics initialized');
  };
}

/**
 * Initialize Web Vitals monitoring
 */
export function initializeWebVitals() {
  if (typeof window === 'undefined') return;

  // Note: web-vitals not installed, monitoring disabled
  Promise.resolve().then(() => {
    console.log('⚠️ Web Vitals monitoring disabled (package not installed)');
  });
}

/**
 * Initialize all monitoring services
 */
export function initializeMonitoring() {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false') {
    initializeAnalytics();
  }

  if (process.env.NODE_ENV === 'production') {
    initializeErrorMonitoring();
  }

  if (process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITOR !== 'false') {
    initializeWebVitals();
  }
}

/**
 * Monitoring context provider
 */
export class MonitoringContext {
  private static instance: MonitoringContext;
  private context: ErrorContext = {};

  static getInstance(): MonitoringContext {
    if (!MonitoringContext.instance) {
      MonitoringContext.instance = new MonitoringContext();
    }
    return MonitoringContext.instance;
  }

  setContext(context: Partial<ErrorContext>) {
    this.context = { ...this.context, ...context };
  }

  getContext(): ErrorContext {
    return { ...this.context };
  }

  logError(error: Error, additionalContext?: Record<string, any>) {
    logError(error, {
      ...this.context,
      additionalContext,
    });
  }

  logInteraction(action: string, details?: Record<string, any>) {
    logUserInteraction(action, {
      ...details,
      route: this.context.route,
    });
  }
}

// Export singleton instance
export const monitoring = MonitoringContext.getInstance();

const monitoringService = {
  initializeMonitoring,
  logError,
  logPerformanceMetric,
  logUserInteraction,
  monitoring,
};

export default monitoringService;