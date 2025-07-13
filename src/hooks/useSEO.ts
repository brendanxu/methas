'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { generateSEO } from '@/lib/seo/seo-config';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  canonical?: string;
  noindex?: boolean;
  locale?: string;
}

interface UseSEOOptions {
  page?: string;
  data?: any;
  override?: Partial<SEOData>;
}

export function useSEO(options: UseSEOOptions = {}) {
  const pathname = usePathname();
  const { page, data, override } = options;

  const seoData = useMemo(() => {
    // 根据路径自动检测页面类型
    const autoPage = page || detectPageType(pathname);
    
    // 生成基础SEO数据
    const baseSEO = generateSEO(autoPage, data);
    
    // 应用覆盖设置
    const finalSEO = {
      ...baseSEO,
      ...override
    };

    return finalSEO;
  }, [pathname, page, data, override]);

  const structuredDataType = useMemo(() => {
    if (seoData.article) return 'Article';
    if (pathname === '/') return 'Organization';
    if (pathname.includes('/services')) return 'Service';
    if (pathname.includes('/faq')) return 'FAQPage';
    return 'Organization';
  }, [pathname, seoData.article]);

  const breadcrumbs = useMemo(() => {
    return generateBreadcrumbs(pathname);
  }, [pathname]);

  return {
    seoData,
    structuredDataType,
    breadcrumbs,
    pathname
  };
}

// 根据路径自动检测页面类型
function detectPageType(pathname: string): string {
  const pathSegments = pathname.split('/').filter(Boolean);
  
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/services')) return 'services';
  if (pathname.startsWith('/news')) return 'news';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/contact')) return 'contact';
  if (pathname.startsWith('/careers')) return 'careers';
  
  // 对于动态路由，使用第一个路径段
  return pathSegments[0] || 'home';
}

// 生成面包屑导航数据
function generateBreadcrumbs(pathname: string) {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: '首页', url: '/' }
  ];

  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // 路径段名称映射
    const segmentNames: Record<string, string> = {
      'services': '我们的服务',
      'news': '新闻资讯',
      'about': '关于我们',
      'contact': '联系我们',
      'careers': '职业机会',
      'case-studies': '案例研究',
      'carbon-footprint': '碳足迹测算',
      'carbon-offset': '碳抵消',
      'sustainability-consulting': '可持续发展咨询'
    };

    const name = segmentNames[segment] || segment.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
    
    breadcrumbs.push({
      name,
      url: index === pathSegments.length - 1 ? '' : currentPath // 最后一项不设置链接
    });
  });

  return breadcrumbs;
}

// 用于页面级别的SEO数据管理
export function usePageSEO(pageData: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
}) {
  const pathname = usePathname();
  
  return useSEO({
    data: {
      title: pageData.title,
      description: pageData.description,
      keywords: pageData.keywords,
      image: pageData.image,
      publishedTime: pageData.publishedAt,
      modifiedTime: pageData.updatedAt,
      author: pageData.author
    }
  });
}

// 用于文章/博客的SEO数据管理
export function useArticleSEO(article: {
  title: string;
  description?: string;
  excerpt?: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  category?: string;
}) {
  return useSEO({
    data: {
      title: article.title,
      description: article.description || article.excerpt,
      keywords: article.tags,
      image: article.image,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      author: article.author,
      article: true
    }
  });
}

// 性能优化：预加载关键SEO资源
export function preloadSEOResources() {
  if (typeof window !== 'undefined') {
    // 预加载关键字体
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);

    // 预加载关键图片
    const logoPreload = document.createElement('link');
    logoPreload.rel = 'preload';
    logoPreload.href = '/logo.png';
    logoPreload.as = 'image';
    document.head.appendChild(logoPreload);

    // 预连接到重要的外部域
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com'
    ];

    preconnects.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
}

// SEO监控：收集Core Web Vitals数据
export function initSEOMonitoring() {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      const sendToAnalytics = ({ name, value, id }: { name: string; value: number; id: string }) => {
        // 发送到分析服务
        if ((window as any).gtag) {
          (window as any).gtag('event', name, {
            event_category: 'Web Vitals',
            event_label: id,
            value: Math.round(name === 'CLS' ? value * 1000 : value),
            non_interaction: true,
          });
        }
      };

      onCLS(sendToAnalytics);
      onINP(sendToAnalytics); // 使用 onINP 替代已废弃的 onFID
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    });
  }
}