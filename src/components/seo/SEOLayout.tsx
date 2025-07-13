'use client';

import { ReactNode } from 'react';
import { EnhancedSEOHead } from './EnhancedSEOHead';
import { StructuredData, organizationSchema, commonFAQs } from './StructuredData';
import { useSEO } from '@/hooks/useSEO';

interface SEOLayoutProps {
  children: ReactNode;
  pageData?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    publishedAt?: string;
    updatedAt?: string;
    author?: string;
    noindex?: boolean;
    canonical?: string;
  };
  structuredData?: {
    type: 'Organization' | 'Article' | 'FAQPage' | 'Service' | 'BreadcrumbList';
    data: any;
  };
  includeFAQ?: boolean;
  includeBreadcrumbs?: boolean;
}

export const SEOLayout: React.FC<SEOLayoutProps> = ({
  children,
  pageData = {},
  structuredData,
  includeFAQ = false,
  includeBreadcrumbs = true,
}) => {
  const { seoData, structuredDataType, breadcrumbs } = useSEO({
    data: pageData
  });

  return (
    <>
      {/* Enhanced SEO Head */}
      <EnhancedSEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        article={seoData.article}
        publishedTime={seoData.publishedTime}
        modifiedTime={seoData.modifiedTime}
        author={seoData.author}
        noindex={pageData.noindex}
        canonical={pageData.canonical}
      />

      {/* Organization Schema (always include) */}
      <StructuredData
        type="Organization"
        data={organizationSchema}
      />

      {/* Page-specific Structured Data */}
      {structuredData && (
        <StructuredData
          type={structuredData.type}
          data={structuredData.data}
        />
      )}

      {/* Auto-detected Structured Data */}
      {!structuredData && structuredDataType !== 'Organization' && (
        <StructuredData
          type={structuredDataType as any}
          data={seoData}
        />
      )}

      {/* Breadcrumbs Schema */}
      {includeBreadcrumbs && breadcrumbs.length > 1 && (
        <StructuredData
          type="BreadcrumbList"
          data={{ breadcrumbs }}
        />
      )}

      {/* FAQ Schema */}
      {includeFAQ && (
        <StructuredData
          type="FAQPage"
          data={{ faqs: commonFAQs }}
        />
      )}

      {children}
    </>
  );
};

// 预定义的页面SEO配置
export const pageConfigs = {
  home: {
    includeFAQ: true,
    structuredData: {
      type: 'Organization' as const,
      data: {
        ...organizationSchema,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "气候解决方案服务",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "碳足迹测算",
                description: "全面的温室气体排放量计算和分析"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "碳抵消项目",
                description: "高质量的碳信用额度和抵消解决方案"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "可持续发展咨询",
                description: "ESG战略制定和可持续发展实施指导"
              }
            }
          ]
        }
      }
    }
  },
  services: {
    structuredData: {
      type: 'Service' as const,
      data: {
        name: "气候解决方案服务",
        description: "为企业提供全方位的碳中和和可持续发展解决方案",
        serviceType: "环境咨询",
        services: [
          { name: "碳足迹测算", description: "全面的温室气体排放量计算" },
          { name: "减排项目开发", description: "识别和实施减排机会" },
          { name: "碳抵消解决方案", description: "高质量碳信用额度获取" },
          { name: "可持续发展战略", description: "ESG框架和实施路径" }
        ]
      }
    }
  }
};

// 便捷的页面级SEO组件
export const HomeSEOLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <SEOLayout {...pageConfigs.home}>
    {children}
  </SEOLayout>
);

export const ServicesSEOLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <SEOLayout {...pageConfigs.services}>
    {children}
  </SEOLayout>
);

export const ArticleSEOLayout: React.FC<{
  children: ReactNode;
  article: {
    title: string;
    description: string;
    image?: string;
    publishedAt: string;
    updatedAt?: string;
    author: string;
    keywords?: string[];
  };
}> = ({ children, article }) => (
  <SEOLayout
    pageData={{
      title: article.title,
      description: article.description,
      image: article.image,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      author: article.author,
      keywords: article.keywords
    }}
    structuredData={{
      type: 'Article',
      data: article
    }}
    includeBreadcrumbs={true}
  >
    {children}
  </SEOLayout>
);