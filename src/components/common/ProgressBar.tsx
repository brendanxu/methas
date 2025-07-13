'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// 自定义NProgress样式
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

export const ProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Start loading bar when route changes
    NProgress.start();

    // Complete loading bar after a short delay to show the effect
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
};

export default ProgressBar;