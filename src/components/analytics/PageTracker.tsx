'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // 延迟加载分析脚本，避免阻塞主要内容
    const loadAnalytics = async () => {
      try {
        // 等待主要内容加载完成
        if (document.readyState === 'complete') {
          await analytics.init();
          setHasLoaded(true);
        } else {
          window.addEventListener('load', async () => {
            await analytics.init();
            setHasLoaded(true);
          });
        }
      } catch (error) {
        console.warn('Analytics loading failed:', error);
      }
    };

    // 使用 requestIdleCallback 在浏览器空闲时加载
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadAnalytics);
    } else {
      setTimeout(loadAnalytics, 2000);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    // 追踪页面浏览
    analytics.trackPageView({
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname, searchParams, hasLoaded]);

  // 这个组件不渲染任何内容
  return null;
}

export default PageTracker;