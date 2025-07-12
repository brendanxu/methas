'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 追踪页面浏览
    analytics.trackPageView({
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname, searchParams]);

  // 这个组件不渲染任何内容
  return null;
}

export default PageTracker;