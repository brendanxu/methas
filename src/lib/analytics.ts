// 基础分析追踪库
// 这个文件为未来集成 Google Analytics、百度统计等做准备

interface AnalyticsEvent {
  event: string;
  page?: string;
  section?: string;
  action?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean | string[]>;
}

interface PageView {
  page_title: string;
  page_location: string;
  page_path: string;
  referrer?: string;
  user_agent?: string;
}

class Analytics {
  private isEnabled: boolean;
  private debug: boolean;
  private isInitialized: boolean;
  private eventQueue: Array<{ type: string; data: any }>;
  
  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.debug = process.env.NODE_ENV === 'development';
    this.isInitialized = false;
    this.eventQueue = [];
  }

  // 异步初始化分析服务
  async init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // 延迟加载 Google Analytics
      if (this.isEnabled && process.env.NEXT_PUBLIC_GA_ID) {
        await this.loadGoogleAnalytics();
      }

      this.isInitialized = true;

      // 处理队列中的事件
      this.processEventQueue();
      
      if (this.debug) {
        // Debug log removed for production
      }
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }

  // 加载 Google Analytics
  private async loadGoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return;

    // 动态加载 GA 脚本
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // 等待脚本加载
    await new Promise((resolve) => {
      script.onload = resolve;
    });

    // 初始化 gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    
    gtag('js', new Date());
    gtag('config', gaId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // 挂载到 window 对象
    (window as any).gtag = gtag;
  }

  // 处理事件队列
  private processEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.sendToAnalytics(event.type, event.data);
      }
    }
  }

  // 页面浏览追踪
  trackPageView(data: Partial<PageView> = {}) {
    if (typeof window === 'undefined') return;

    const pageData: PageView = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      ...data,
    };

    if (this.debug) {
      // Debug log removed for production
    }

    // 如果尚未初始化，添加到队列
    if (!this.isInitialized) {
      this.eventQueue.push({ type: 'page_view', data: pageData });
      return;
    }

    this.sendToAnalytics('page_view', pageData);
  }

  // 事件追踪
  trackEvent(eventData: AnalyticsEvent) {
    if (typeof window === 'undefined') return;

    const enrichedData = {
      ...eventData,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      session_id: this.getSessionId(),
    };

    if (this.debug) {
      // Debug log removed for production
    }

    // 如果尚未初始化，添加到队列
    if (!this.isInitialized) {
      this.eventQueue.push({ type: 'custom_event', data: enrichedData });
      return;
    }

    this.sendToAnalytics('custom_event', enrichedData);
  }

  // 用户交互追踪
  trackInteraction(element: string, action: string, details: Record<string, string | number | boolean> = {}) {
    this.trackEvent({
      event: 'user_interaction',
      action,
      label: element,
      custom_parameters: details,
    });
  }

  // 表单提交追踪
  trackFormSubmission(formName: string, formData: Record<string, string | number | boolean> = {}) {
    this.trackEvent({
      event: 'form_submission',
      action: 'submit',
      label: formName,
      custom_parameters: {
        form_fields: Object.keys(formData),
        form_name: formName,
      },
    });
  }

  // 错误追踪
  trackError(error: Error, context: string = 'unknown') {
    this.trackEvent({
      event: 'error',
      action: 'javascript_error',
      label: context,
      custom_parameters: {
        error_message: error.message,
        error_stack: error.stack || 'No stack trace available',
        error_context: context,
      },
    });
  }

  // 业务事件追踪
  trackBusinessEvent(eventName: string, properties: Record<string, string | number | boolean> = {}) {
    this.trackEvent({
      event: 'business_event',
      action: eventName,
      custom_parameters: properties,
    });
  }

  // 获取或生成会话ID
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // 发送数据到分析服务
  private sendToAnalytics(eventType: string, data: Record<string, unknown> | PageView | AnalyticsEvent) {
    if (!this.isEnabled) return;

    // 简单的本地存储，用于开发和测试
    try {
      const analyticsData = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      analyticsData.push({
        type: eventType,
        data,
        timestamp: new Date().toISOString(),
      });
      
      // 只保留最近100条记录
      if (analyticsData.length > 100) {
        analyticsData.splice(0, analyticsData.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(analyticsData));
    } catch (error) {
      console.warn('Analytics storage failed:', error);
    }

    // 未来集成真实服务：
    // 1. Google Analytics: gtag('event', eventType, data);
    // 2. 百度统计: _hmt.push(['_trackEvent', ...]);
    // 3. 自定义 API: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({eventType, data}) });
  }

  // 获取存储的分析数据（仅用于开发和调试）
  getStoredAnalytics(): Record<string, unknown>[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch {
      return [];
    }
  }

  // 清除存储的分析数据
  clearStoredAnalytics() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_events');
      sessionStorage.removeItem('analytics_session_id');
    }
  }
}

// 单例实例
export const analytics = new Analytics();

// React Hook 用于页面浏览追踪
export const usePageTracking = () => {
  if (typeof window !== 'undefined') {
    // 自动追踪页面浏览
    analytics.trackPageView();
  }
};

// 便捷的事件追踪函数
export const trackClick = (element: string, details?: Record<string, string | number | boolean>) => {
  analytics.trackInteraction(element, 'click', details);
};

export const trackFormSubmit = (formName: string, formData?: Record<string, string | number | boolean>) => {
  analytics.trackFormSubmission(formName, formData);
};

export const trackBusinessGoal = (goalName: string, value?: number, properties?: Record<string, string | number | boolean>) => {
  const eventProperties: Record<string, string | number | boolean> = { ...properties };
  if (value !== undefined) {
    eventProperties.value = value;
  }
  analytics.trackBusinessEvent(goalName, eventProperties);
};

export default analytics;