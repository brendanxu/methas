'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// 加载中组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const LoadingCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-48 w-full mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const LoadingSection = () => (
  <div className="animate-pulse space-y-4 p-8">
    <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  </div>
);

// 首屏组件 - 不需要懒加载
export const Hero = dynamic(() => import('@/components/sections/home/Hero'), {
  loading: () => <LoadingSection />,
  ssr: true,
});

// 非首屏组件 - 懒加载
export const Services = dynamic(
  () => import('@/components/sections/home/Services').then(mod => ({ default: mod.Services })),
  {
    loading: () => <LoadingSection />,
    ssr: false,
  }
);

export const CaseStudies = dynamic(
  () => import('@/components/sections/home/CaseStudies').then(mod => ({ default: mod.CaseStudies })),
  {
    loading: () => <LoadingSection />,
    ssr: false,
  }
);

// Features component is not implemented yet
// export const Features = dynamic(
//   () => import('@/components/sections/home/Features').then(mod => ({ default: mod.Features })),
//   {
//     loading: () => <LoadingSection />,
//     ssr: false,
//   }
// );

// CTA component is not implemented yet
// export const CTA = dynamic(
//   () => import('@/components/sections/home/CTA').then(mod => ({ default: mod.CTA })),
//   {
//     loading: () => <LoadingSpinner />,
//     ssr: false,
//   }
// );

// 表单组件 - 按需加载
export const ContactForm = dynamic(
  () => import('@/components/forms/ContactForm'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const NewsletterForm = dynamic(
  () => import('@/components/forms/NewsletterForm'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const DownloadForm = dynamic(
  () => import('@/components/forms/DownloadForm'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// 重型组件 - 延迟加载 (未实现的组件已注释)
// export const ThemeShowcase = dynamic(
//   () => import('@/components/demo/ThemeShowcase'),
//   {
//     loading: () => <LoadingSpinner />,
//     ssr: false,
//   }
// );

// export const ComponentDemo = dynamic(
//   () => import('@/components/demo/ComponentDemo'),
//   {
//     loading: () => <LoadingSpinner />,
//     ssr: false,
//   }
// );

// 图表组件 - 仅在需要时加载 (未实现的组件已注释)
// export const PerformanceChart = dynamic(
//   () => import('@/components/charts/PerformanceChart'),
//   {
//     loading: () => <LoadingSpinner />,
//     ssr: false,
//   }
// );

// export const AnalyticsChart = dynamic(
//   () => import('@/components/charts/AnalyticsChart'),
//   {
//     loading: () => <LoadingSpinner />,
//     ssr: false,
//   }
// );

// 模态框组件 - 用户交互时加载 (未实现的组件已注释)
// export const Modal = dynamic(
//   () => import('@/components/ui/Modal'),
//   {
//     loading: () => <LoadingSpinner />,
//     ssr: false,
//   }
// );

// export const ImageGallery = dynamic(
//   () => import('@/components/ui/ImageGallery'),
//   {
//     loading: () => <LoadingSpinner />,
//     ssr: false,
//   }
// );

// 第三方组件包装器
export const LazyAntdComponents = {
  DatePicker: dynamic(() => import('antd').then(mod => ({ default: mod.DatePicker })), {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }),
  Table: dynamic(() => import('antd').then(mod => ({ default: mod.Table })), {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }),
  Charts: dynamic(() => import('antd').then(mod => ({ default: mod.Watermark })), {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }),
};

// 高阶组件：添加懒加载和错误边界
export function withLazyLoading(
  Component: React.ComponentType<any>,
  options: {
    loading?: React.ComponentType;
    ssr?: boolean;
    errorFallback?: React.ComponentType<{ error: Error }>;
  } = {}
) {
  const {
    loading: LoadingComponent = LoadingSpinner,
    ssr = false,
    errorFallback: ErrorFallback
  } = options;

  const LazyComponent = dynamic(() => Promise.resolve({ default: Component }), {
    loading: () => <LoadingComponent />,
    ssr,
  });

  const WrappedComponent = React.forwardRef<any, any>((props, ref) => {
    if (ErrorFallback) {
      return (
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense fallback={<LoadingComponent />}>
            <LazyComponent {...props} ref={ref} />
          </Suspense>
        </ErrorBoundary>
      );
    }

    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    );
  });

  WrappedComponent.displayName = `LazyWrapped(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}

// 错误边界组件
class ErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    fallback: React.ComponentType<{ error: Error }>;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('LazyComponent Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}