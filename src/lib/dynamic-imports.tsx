'use client';

/**
 * Dynamic Import Utilities
 * 
 * Centralized dynamic imports for code splitting optimization
 */

import dynamic from 'next/dynamic';
import React from 'react';
import { Skeleton, Spin } from 'antd';

// Loading components
const DefaultLoadingSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

const SimpleLoading = () => (
  <div className="flex items-center justify-center p-8">
    <Spin size="large" />
  </div>
);

const CardLoading = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-48 w-full mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// ===== Ant Design Components (Heavy) =====

// Form components
export const DynamicForm = dynamic(() => import('antd/es/form'), {
  ssr: false,
  loading: () => <Skeleton active />
});

export const DynamicTable = dynamic(() => import('antd/es/table'), {
  ssr: false,
  loading: () => <Skeleton active />
});

export const DynamicDatePicker = dynamic(() => import('antd/es/date-picker'), {
  ssr: false,
  loading: () => <Skeleton.Input style={{ width: 200 }} active />
});

export const DynamicSelect = dynamic(() => import('antd/es/select'), {
  ssr: false,
  loading: () => <Skeleton.Input style={{ width: 150 }} active />
});

export const DynamicTimePicker = dynamic(() => import('antd/es/time-picker'), {
  ssr: false,
  loading: () => <Skeleton.Input style={{ width: 150 }} active />
});

export const DynamicTreeSelect = dynamic(() => import('antd/es/tree-select'), {
  ssr: false,
  loading: () => <Skeleton.Input style={{ width: 200 }} active />
});

export const DynamicCascader = dynamic(() => import('antd/es/cascader'), {
  ssr: false,
  loading: () => <Skeleton.Input style={{ width: 200 }} active />
});

// Data display components
export const DynamicCarousel = dynamic(() => import('antd/es/carousel'), {
  ssr: false,
  loading: () => <Skeleton.Image style={{ width: '100%', height: 300 }} />
});

export const DynamicCalendar = dynamic(() => import('antd/es/calendar'), {
  ssr: false,
  loading: () => <Skeleton active paragraph={{ rows: 6 }} />
});

export const DynamicTransfer = dynamic(() => import('antd/es/transfer'), {
  ssr: false,
  loading: () => <Skeleton active />
});

export const DynamicTree = dynamic(() => import('antd/es/tree'), {
  ssr: false,
  loading: () => <Skeleton active />
});

// Chart and visualization components (if used)
export const DynamicStatistic = dynamic(() => import('antd/es/statistic'), {
  ssr: false,
  loading: () => <Skeleton.Input style={{ width: 100 }} active />
});

// ===== Custom Components =====

// Hero components
export const DynamicHero = dynamic(() => import('@/components/sections/Hero'), {
  ssr: true, // Keep SSR for above-the-fold content
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-8">
          <div className="h-12 bg-gray-200 rounded w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
});

export const DynamicHomeHero = dynamic(() => import('@/components/sections/home/Hero'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/10 to-green-500/10 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="h-16 bg-gray-200 rounded w-4/5"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-gray-200 rounded w-32"></div>
              <div className="h-12 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
});

// Service components
export const DynamicServices = dynamic(() => import('@/components/sections/home/Services'), {
  ssr: false,
  loading: () => (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <CardLoading key={i} />
          ))}
        </div>
      </div>
    </div>
  )
});

export const DynamicCaseStudies = dynamic(() => import('@/components/sections/home/CaseStudies'), {
  ssr: false,
  loading: () => (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <CardLoading key={i} />
          ))}
        </div>
      </div>
    </div>
  )
});

// Demo pages (non-critical)
export const DynamicThemeShowcase = dynamic(() => import('@/components/sections/ThemeShowcase'), {
  ssr: false,
  loading: DefaultLoadingSkeleton
});

// Form components
export const DynamicContactForm = dynamic(() => import('@/components/forms/ContactForm'), {
  ssr: false,
  loading: () => <Skeleton active paragraph={{ rows: 8 }} />
});

export const DynamicNewsletterForm = dynamic(() => import('@/components/forms/NewsletterForm'), {
  ssr: false,
  loading: () => <Skeleton active paragraph={{ rows: 4 }} />
});

// Complex UI components
export const DynamicGlobalSearch = dynamic(() => import('@/components/layout/GlobalSearch'), {
  ssr: false,
  loading: SimpleLoading
});

// Future components can be added here
// Chart components (placeholder for future use)
// export const DynamicChart = dynamic(() => import('@/components/charts/Chart'), {
//   ssr: false,
//   loading: () => <Skeleton.Image style={{ width: '100%', height: 400 }} />
// });

// Admin/CMS components (placeholder for future use)
// export const DynamicAdminPanel = dynamic(() => import('@/components/admin/AdminPanel'), {
//   ssr: false,
//   loading: () => <Skeleton active paragraph={{ rows: 10 }} />
// });

// ===== Component Factory Functions =====

/**
 * Create a dynamically imported component with custom loading
 */
export function createDynamicComponent<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: {
    ssr?: boolean;
    loading?: React.ComponentType;
    suspense?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    ssr: options.ssr ?? false,
    loading: options.loading ?? DefaultLoadingSkeleton,
    ...options
  });
}

/**
 * Create a route-level dynamic component
 */
export function createDynamicRoute<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType
) {
  return dynamic(importFn, {
    ssr: false,
    loading: fallback ?? (() => (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    ))
  });
}

/**
 * Preload a dynamic component
 */
export function preloadComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>
) {
  // Preload the component during idle time
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      importFn().catch(() => {
        // Ignore preload errors
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      importFn().catch(() => {
        // Ignore preload errors
      });
    }, 2000);
  }
}

// ===== Export Utils =====

export {
  DefaultLoadingSkeleton,
  SimpleLoading,
  CardLoading
};

export default {
  // Ant Design
  DynamicForm,
  DynamicTable,
  DynamicDatePicker,
  DynamicSelect,
  DynamicCarousel,
  
  // Custom Components
  DynamicHero,
  DynamicHomeHero,
  DynamicServices,
  DynamicCaseStudies,
  DynamicThemeShowcase,
  
  // Utilities
  createDynamicComponent,
  createDynamicRoute,
  preloadComponent
};