'use client';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// 页面浏览追踪
export const pageview = (url: string): void => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      custom_map: {
        custom_dimension_1: 'user_engagement_level',
        custom_dimension_2: 'page_load_time',
      },
    });
  }
};

// 事件追踪
interface EventProps {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const event = ({ action, category, label, value, custom_parameters }: EventProps): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...custom_parameters,
    });
  }
};

// 用户属性设置
export const setUserProperties = (properties: Record<string, any>): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      user_properties: properties,
    });
  }
};

// 转化事件追踪
export const trackConversion = (conversionType: string, value?: number, currency: string = 'CNY'): void => {
  event({
    action: 'conversion',
    category: 'Conversion',
    label: conversionType,
    value,
    custom_parameters: {
      currency,
      conversion_type: conversionType,
    },
  });
};

// 电商事件追踪
export const trackPurchase = (transactionId: string, value: number, items: any[]): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'CNY',
      items: items,
    });
  }
};

// 文件下载追踪
export const trackDownload = (fileName: string, fileUrl: string): void => {
  event({
    action: 'file_download',
    category: 'Downloads',
    label: fileName,
    custom_parameters: {
      file_name: fileName,
      file_url: fileUrl,
    },
  });
};

// 外部链接点击追踪
export const trackOutboundLink = (url: string, linkText?: string): void => {
  event({
    action: 'click',
    category: 'Outbound Links',
    label: url,
    custom_parameters: {
      link_text: linkText,
      link_url: url,
    },
  });
};

// 搜索事件追踪
export const trackSiteSearch = (searchTerm: string, resultsCount: number): void => {
  event({
    action: 'search',
    category: 'Site Search',
    label: searchTerm,
    value: resultsCount,
    custom_parameters: {
      search_term: searchTerm,
      results_count: resultsCount,
    },
  });
};

// 视频播放追踪
export const trackVideoPlay = (videoTitle: string, videoDuration: number): void => {
  event({
    action: 'video_play',
    category: 'Video',
    label: videoTitle,
    custom_parameters: {
      video_title: videoTitle,
      video_duration: videoDuration,
    },
  });
};

// 滚动深度追踪
export const trackScrollDepth = (percentage: number): void => {
  event({
    action: 'scroll',
    category: 'Engagement',
    label: `${percentage}%`,
    value: percentage,
    custom_parameters: {
      scroll_depth: percentage,
    },
  });
};

// 表单交互追踪
export const trackFormInteraction = (formName: string, action: 'start' | 'complete' | 'abandon', step?: string): void => {
  event({
    action: `form_${action}`,
    category: 'Form Interaction',
    label: formName,
    custom_parameters: {
      form_name: formName,
      form_step: step,
    },
  });
};

// 页面停留时间追踪
export const trackTimeOnPage = (timeSeconds: number): void => {
  event({
    action: 'timing_complete',
    category: 'User Timing',
    label: 'time_on_page',
    value: timeSeconds,
    custom_parameters: {
      time_on_page: timeSeconds,
    },
  });
};

// 错误追踪
export const trackError = (errorType: string, errorMessage: string, errorUrl?: string): void => {
  event({
    action: 'exception',
    category: 'Error',
    label: errorType,
    custom_parameters: {
      error_type: errorType,
      error_message: errorMessage,
      error_url: errorUrl || window.location.href,
      fatal: false,
    },
  });
};

// 性能指标追踪
export const trackPerformance = (metricName: string, value: number, unit: string = 'ms'): void => {
  event({
    action: 'timing_complete',
    category: 'Performance',
    label: metricName,
    value: Math.round(value),
    custom_parameters: {
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
    },
  });
};