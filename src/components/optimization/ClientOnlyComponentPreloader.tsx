'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

// 客户端专用的ComponentPreloader
const ComponentPreloader = dynamic(
  () => import('./PreloadProvider').then(mod => ({ default: mod.ComponentPreloader })),
  {
    ssr: false,
    loading: () => null,
  }
);

interface ClientOnlyComponentPreloaderProps {
  importFn: () => Promise<any>;
  componentName: string;
  trigger: 'hover' | 'scroll' | 'intersection' | 'immediate';
  scrollThreshold?: number;
  intersectionOptions?: IntersectionObserverInit;
  delay?: number;
  children: React.ReactNode;
}

export function ClientOnlyComponentPreloader(props: ClientOnlyComponentPreloaderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 服务器端或客户端尚未准备好时，只渲染子组件
  if (!isClient) {
    return <>{props.children}</>;
  }

  // 客户端渲染时，使用完整的ComponentPreloader功能
  return (
    <Suspense fallback={props.children}>
      <ComponentPreloader {...props} />
    </Suspense>
  );
}