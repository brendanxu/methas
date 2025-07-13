'use client';

import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GA_TRACKING_ID, pageview } from '@/lib/analytics/google-analytics';

interface GoogleAnalyticsProps {
  children?: React.ReactNode;
}

export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    // 监听路由变化
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    // Next.js App Router 路由变化监听
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleRouteChange(window.location.pathname);
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      handleRouteChange(window.location.pathname);
    };

    // 监听浏览器前进后退
    window.addEventListener('popstate', () => {
      handleRouteChange(window.location.pathname);
    });

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', () => {
        handleRouteChange(window.location.pathname);
      });
    };
  }, [router]);

  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics ID not found in environment variables');
    return children || null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              send_page_view: false,
              custom_map: {
                'custom_dimension_1': 'user_type',
                'custom_dimension_2': 'content_category',
                'custom_dimension_3': 'engagement_level'
              },
              cookie_flags: 'SameSite=Strict;Secure',
              cookie_expires: 63072000 // 2 years
            });
            
            // 发送初始页面浏览
            gtag('event', 'page_view', {
              page_path: window.location.pathname,
              page_title: document.title,
              page_location: window.location.href
            });
          `,
        }}
      />
      {children}
    </>
  );
};

// 高阶组件，为页面添加Analytics
export function withAnalytics<P extends object>(Component: React.ComponentType<P>) {
  return function AnalyticsWrappedComponent(props: P) {
    return (
      <>
        <GoogleAnalytics />
        <Component {...props} />
      </>
    );
  };
}