'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { event, trackFormInteraction, trackSiteSearch, trackScrollDepth, trackDownload, trackOutboundLink } from '@/lib/analytics/google-analytics';

interface TrackEventProps {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const useAnalytics = () => {
  // 事件追踪
  const trackEvent = useCallback((props: TrackEventProps) => {
    event(props);
    
    // 同时发送到其他分析服务（如Mixpanel, Amplitude等）
    if (typeof window !== 'undefined') {
      // Mixpanel集成示例
      if ((window as any).mixpanel) {
        (window as any).mixpanel.track(props.action, {
          category: props.category,
          label: props.label,
          value: props.value,
          ...props.custom_parameters,
        });
      }
      
      // Facebook Pixel集成示例
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', props.action, {
          category: props.category,
          label: props.label,
          value: props.value,
        });
      }
    }
  }, []);

  // 点击事件追踪
  const trackClick = useCallback((
    elementName: string,
    elementType: 'button' | 'link' | 'card' | 'menu' | 'tab' = 'button',
    additionalData?: Record<string, any>
  ) => {
    trackEvent({
      action: 'click',
      category: 'User Interaction',
      label: `${elementType}_${elementName}`,
      custom_parameters: {
        element_type: elementType,
        element_name: elementName,
        ...additionalData,
      },
    });
  }, [trackEvent]);

  // 表单提交追踪
  const trackFormSubmit = useCallback((
    formName: string, 
    success: boolean, 
    errorMessage?: string,
    formData?: Record<string, any>
  ) => {
    trackFormInteraction(formName, success ? 'complete' : 'abandon');
    
    trackEvent({
      action: 'form_submit',
      category: 'Form',
      label: formName,
      value: success ? 1 : 0,
      custom_parameters: {
        form_name: formName,
        success,
        error_message: errorMessage,
        form_fields: formData ? Object.keys(formData) : undefined,
      },
    });
  }, [trackEvent]);

  // 搜索事件追踪
  const trackSearch = useCallback((
    searchTerm: string, 
    resultsCount: number,
    searchType: 'site' | 'product' | 'document' = 'site',
    filters?: Record<string, any>
  ) => {
    trackSiteSearch(searchTerm, resultsCount);
    
    trackEvent({
      action: 'search',
      category: 'Search',
      label: searchTerm,
      value: resultsCount,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
        search_type: searchType,
        filters: filters,
      },
    });
  }, [trackEvent]);

  // 滚动深度追踪
  const trackScroll = useCallback((percentage: number, timeSpent?: number) => {
    trackScrollDepth(percentage);
    
    trackEvent({
      action: 'scroll',
      category: 'Engagement',
      label: `${percentage}%`,
      value: percentage,
      custom_parameters: {
        scroll_depth: percentage,
        time_spent: timeSpent,
      },
    });
  }, [trackEvent]);

  // 页面停留时间追踪
  const trackTimeOnPage = useCallback((timeSeconds: number) => {
    trackEvent({
      action: 'time_on_page',
      category: 'Engagement',
      label: window.location.pathname,
      value: timeSeconds,
      custom_parameters: {
        page_path: window.location.pathname,
        time_spent: timeSeconds,
      },
    });
  }, [trackEvent]);

  // 文件下载追踪
  const trackFileDownload = useCallback((fileName: string, fileUrl: string, fileSize?: number) => {
    trackDownload(fileName, fileUrl);
    
    trackEvent({
      action: 'file_download',
      category: 'Downloads',
      label: fileName,
      custom_parameters: {
        file_name: fileName,
        file_url: fileUrl,
        file_size: fileSize,
        file_type: fileName.split('.').pop(),
      },
    });
  }, [trackEvent]);

  // 外部链接点击追踪
  const trackExternalLink = useCallback((url: string, linkText?: string, position?: string) => {
    trackOutboundLink(url, linkText);
    
    trackEvent({
      action: 'external_link_click',
      category: 'Outbound Links',
      label: url,
      custom_parameters: {
        link_url: url,
        link_text: linkText,
        link_position: position,
      },
    });
  }, [trackEvent]);

  // 视频交互追踪
  const trackVideoInteraction = useCallback((
    action: 'play' | 'pause' | 'ended' | 'seeked',
    videoTitle: string,
    currentTime: number,
    duration?: number
  ) => {
    trackEvent({
      action: `video_${action}`,
      category: 'Video',
      label: videoTitle,
      value: Math.round(currentTime),
      custom_parameters: {
        video_title: videoTitle,
        video_current_time: currentTime,
        video_duration: duration,
        video_progress: duration ? (currentTime / duration) * 100 : 0,
      },
    });
  }, [trackEvent]);

  // 社交分享追踪
  const trackSocialShare = useCallback((
    platform: 'facebook' | 'twitter' | 'linkedin' | 'wechat' | 'weibo',
    contentType: 'article' | 'page' | 'product',
    contentTitle?: string
  ) => {
    trackEvent({
      action: 'share',
      category: 'Social',
      label: platform,
      custom_parameters: {
        share_platform: platform,
        content_type: contentType,
        content_title: contentTitle,
        content_url: window.location.href,
      },
    });
  }, [trackEvent]);

  // 错误追踪
  const trackError = useCallback((
    errorType: 'javascript' | 'network' | 'user' | 'api',
    errorMessage: string,
    errorContext?: Record<string, any>
  ) => {
    trackEvent({
      action: 'error',
      category: 'Error',
      label: errorType,
      custom_parameters: {
        error_type: errorType,
        error_message: errorMessage,
        error_url: window.location.href,
        error_context: errorContext,
      },
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackSearch,
    trackScroll,
    trackTimeOnPage,
    trackFileDownload,
    trackExternalLink,
    trackVideoInteraction,
    trackSocialShare,
    trackError,
  };
};

// 滚动深度追踪组件Hook
export const useScrollTracker = (thresholds: number[] = [25, 50, 75, 100]) => {
  const { trackScroll } = useAnalytics();
  const [trackedPercentages, setTrackedPercentages] = useState(new Set<number>());
  const startTime = useRef(Date.now());

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = window.scrollY;
          const percentage = Math.round((scrolled / scrollHeight) * 100);

          // 检查是否达到阈值
          thresholds.forEach(threshold => {
            if (percentage >= threshold && !trackedPercentages.has(threshold)) {
              const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
              trackScroll(threshold, timeSpent);
              setTrackedPercentages(prev => new Set(prev).add(threshold));
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll, trackedPercentages, thresholds]);

  return trackedPercentages;
};

// 页面停留时间追踪Hook
export const useTimeOnPageTracker = () => {
  const { trackTimeOnPage } = useAnalytics();
  const startTime = useRef(Date.now());
  const isActive = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive.current = false;
      } else {
        isActive.current = true;
        startTime.current = Date.now(); // 重置开始时间
      }
    };

    const handleBeforeUnload = () => {
      if (isActive.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackTimeOnPage(timeSpent);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackTimeOnPage]);
};

// 表单分析Hook
export const useFormAnalytics = (formName: string) => {
  const { trackFormSubmit, trackEvent } = useAnalytics();
  const [formStarted, setFormStarted] = useState(false);
  const startTime = useRef<number>();

  const trackFormStart = useCallback(() => {
    if (!formStarted) {
      setFormStarted(true);
      startTime.current = Date.now();
      trackFormInteraction(formName, 'start');
    }
  }, [formStarted, formName]);

  const trackFormComplete = useCallback((success: boolean, errorMessage?: string, formData?: Record<string, any>) => {
    const timeSpent = startTime.current ? Math.round((Date.now() - startTime.current) / 1000) : 0;
    
    trackFormSubmit(formName, success, errorMessage, {
      ...formData,
      time_spent: timeSpent,
    });
  }, [formName, trackFormSubmit]);

  const trackFieldInteraction = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackEvent({
      action: `form_field_${action}`,
      category: 'Form Interaction',
      label: `${formName}_${fieldName}`,
      custom_parameters: {
        form_name: formName,
        field_name: fieldName,
        field_action: action,
      },
    });
  }, [formName, trackEvent]);

  return {
    trackFormStart,
    trackFormComplete,
    trackFieldInteraction,
  };
};