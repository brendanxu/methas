'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

// 高质量的客户端专用组件加载器
const createClientOnlyComponent = (
  importFn: () => Promise<any>,
  componentName: string
) => {
  return dynamic(importFn, {
    ssr: false,
    loading: () => null,
  });
};

// 动态导入预加载组件，只在客户端运行
const PreloadProvider = createClientOnlyComponent(
  () => import('./PreloadProvider').then(mod => ({ default: mod.PreloadProvider })),
  'PreloadProvider'
);

const PreloadStrategy = createClientOnlyComponent(
  () => import('./PreloadStrategy').then(mod => ({ default: mod.PreloadStrategy })),
  'PreloadStrategy'
);

const PreloadMonitor = createClientOnlyComponent(
  () => import('./PreloadProvider').then(mod => ({ default: mod.PreloadMonitor })),
  'PreloadMonitor'
);

const RoutePreloader = createClientOnlyComponent(
  () => import('./PreloadStrategy').then(mod => ({ default: mod.RoutePreloader })),
  'RoutePreloader'
);

interface ClientOnlyPreloadProps {
  children: React.ReactNode;
}

export function ClientOnlyPreload({ children }: ClientOnlyPreloadProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 确保只在客户端执行
    setIsClient(true);
  }, []);

  // 服务器端或客户端尚未准备好时，只渲染子组件
  if (!isClient) {
    return <>{children}</>;
  }

  // 客户端渲染时，包装预加载功能
  return (
    <Suspense fallback={children}>
      {/* @ts-ignore - Dynamic component type issues */}
      <PreloadProvider>
        {/* @ts-ignore - Dynamic component type issues */}
        <PreloadStrategy>
          {children}
          {/* @ts-ignore - Dynamic component type issues */}
          <PreloadMonitor />
          {/* @ts-ignore - Dynamic component type issues */}
          <RoutePreloader />
        </PreloadStrategy>
      </PreloadProvider>
    </Suspense>
  );
}