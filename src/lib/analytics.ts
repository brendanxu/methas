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
  
  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.debug = process.env.NODE_ENV === 'development';
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
      console.log('📊 Page View:', pageData);
    }

    // 未来在这里集成真实的分析服务
    // 例如：gtag('event', 'page_view', pageData);
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
      console.log('📊 Event:', enrichedData);
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