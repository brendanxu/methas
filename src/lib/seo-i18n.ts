import { Metadata } from 'next';
import { getCurrentLanguage, getLocalizedPath, type SupportedLanguage } from './i18n';

// SEO metadata for different languages
export interface SEOTranslations {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

// Default SEO content for each language
const defaultSEO: Record<SupportedLanguage, SEOTranslations> = {
  en: {
    title: 'South Pole - Leading Climate Solutions & Carbon Neutrality Consulting',
    description: 'Achieve carbon neutrality with South Pole\'s comprehensive climate solutions. Expert consulting, carbon offsetting, and sustainability services for businesses worldwide.',
    keywords: 'carbon neutrality, climate solutions, carbon offsetting, sustainability consulting, ESG, net zero, carbon footprint, greenhouse gas emissions',
    ogTitle: 'South Pole - Climate Solutions for a Sustainable Future',
    ogDescription: 'Join thousands of companies on their journey to carbon neutrality with South Pole\'s proven climate solutions and expert guidance.',
    twitterTitle: 'South Pole - Climate Solutions & Carbon Neutrality',
    twitterDescription: 'Leading climate solutions provider helping businesses achieve carbon neutrality and sustainable growth.',
  },
  zh: {
    title: 'South Pole - 领先的气候解决方案和碳中和咨询服务',
    description: '通过South Pole的全面气候解决方案实现碳中和。为全球企业提供专业咨询、碳抵消和可持续发展服务。',
    keywords: '碳中和, 气候解决方案, 碳抵消, 可持续发展咨询, ESG, 净零排放, 碳足迹, 温室气体排放',
    ogTitle: 'South Pole - 面向可持续未来的气候解决方案',
    ogDescription: '与数千家企业一起，通过South Pole经过验证的气候解决方案和专家指导踏上碳中和之旅。',
    twitterTitle: 'South Pole - 气候解决方案与碳中和',
    twitterDescription: '领先的气候解决方案提供商，帮助企业实现碳中和和可持续增长。',
  },
};

// Generate metadata for internationalization
export function generateI18nMetadata(
  pageTranslations?: Partial<Record<SupportedLanguage, SEOTranslations>>,
  basePath: string = '/'
): Metadata {
  const currentLang = getCurrentLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  
  // Merge page-specific translations with defaults
  const seoContent = {
    ...defaultSEO[currentLang],
    ...(pageTranslations?.[currentLang] || {}),
  };

  // Generate alternate language URLs
  const alternateUrls: Record<string, string> = {};
  ['en', 'zh'].forEach((lang) => {
    const langCode = lang as SupportedLanguage;
    alternateUrls[langCode] = `${baseUrl}${getLocalizedPath(basePath, langCode)}`;
  });

  return {
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords,
    
    // Open Graph
    openGraph: {
      title: seoContent.ogTitle || seoContent.title,
      description: seoContent.ogDescription || seoContent.description,
      url: alternateUrls[currentLang],
      siteName: 'South Pole',
      locale: currentLang === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image-${currentLang}.jpg`,
          width: 1200,
          height: 630,
          alt: seoContent.title,
        },
      ],
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: seoContent.twitterTitle || seoContent.title,
      description: seoContent.twitterDescription || seoContent.description,
      images: [`${baseUrl}/twitter-image-${currentLang}.jpg`],
      creator: '@SouthPole_',
    },
    
    // Language alternates
    alternates: {
      canonical: alternateUrls[currentLang],
      languages: alternateUrls,
    },
    
    // Additional metadata
    metadataBase: new URL(baseUrl),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

// Generate JSON-LD structured data for international SEO
export function generateStructuredData(
  type: 'Organization' | 'WebSite' | 'Article' | 'Service',
  data: any
) {
  const currentLang = getCurrentLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    inLanguage: currentLang === 'zh' ? 'zh-CN' : 'en-US',
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseStructuredData,
        name: 'South Pole',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: defaultSEO[currentLang].description,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-555-123-4567',
          contactType: 'customer service',
          availableLanguage: ['English', 'Chinese'],
        },
        sameAs: [
          'https://twitter.com/SouthPole_',
          'https://linkedin.com/company/southpole',
          'https://facebook.com/southpole',
        ],
        ...data,
      };

    case 'WebSite':
      return {
        ...baseStructuredData,
        name: 'South Pole',
        url: baseUrl,
        description: defaultSEO[currentLang].description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        ...data,
      };

    case 'Service':
      return {
        ...baseStructuredData,
        provider: {
          '@type': 'Organization',
          name: 'South Pole',
          url: baseUrl,
        },
        areaServed: 'Worldwide',
        serviceType: 'Climate Solutions',
        ...data,
      };

    default:
      return {
        ...baseStructuredData,
        ...data,
      };
  }
}

// Language-specific robots.txt content
export function generateRobotsTxt(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  
  return `User-agent: *
Allow: /

# Language-specific sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-en.xml
Sitemap: ${baseUrl}/sitemap-zh.xml

# Disallow search parameters
Disallow: /search?*
Disallow: /*?utm_*
Disallow: /*?ref=*

# Allow all content for major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Allow: /
`;
}

// Generate hreflang links for HTML head
export function generateHreflangLinks(basePath: string = '/'): Array<{
  rel: string;
  href: string;
  hrefLang: string;
}> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  
  return [
    {
      rel: 'alternate',
      href: `${baseUrl}${getLocalizedPath(basePath, 'en')}`,
      hrefLang: 'en',
    },
    {
      rel: 'alternate',
      href: `${baseUrl}${getLocalizedPath(basePath, 'zh')}`,
      hrefLang: 'zh',
    },
    {
      rel: 'alternate',
      href: `${baseUrl}${getLocalizedPath(basePath, 'en')}`,
      hrefLang: 'x-default',
    },
  ];
}

// Utility to get page-specific SEO translations
export const pageSEO = {
  home: {
    en: {
      title: 'Carbon Neutrality Solutions | South Pole Climate Consulting',
      description: 'Transform your business with South Pole\'s comprehensive carbon neutrality solutions. Expert climate consulting, carbon offsetting, and sustainability services for a net-zero future.',
      keywords: 'carbon neutrality, net zero, climate solutions, carbon offsetting, sustainability consulting, ESG reporting, carbon footprint assessment',
    },
    zh: {
      title: '碳中和解决方案 | South Pole 气候咨询',
      description: '通过South Pole的全面碳中和解决方案转型您的业务。专业气候咨询、碳抵消和可持续发展服务，迈向净零未来。',
      keywords: '碳中和, 净零排放, 气候解决方案, 碳抵消, 可持续发展咨询, ESG报告, 碳足迹评估',
    },
  },
  
  about: {
    en: {
      title: 'About South Pole | Leading Climate Solutions Provider',
      description: 'Learn about South Pole\'s mission to accelerate the transition to a climate-smart world. Over 15 years of experience in climate solutions and carbon markets.',
      keywords: 'about south pole, climate solutions company, carbon market expertise, sustainability leadership',
    },
    zh: {
      title: '关于 South Pole | 领先的气候解决方案提供商',
      description: '了解South Pole加速向气候智能世界转型的使命。在气候解决方案和碳市场领域拥有超过15年的经验。',
      keywords: '关于南极, 气候解决方案公司, 碳市场专业知识, 可持续发展领导力',
    },
  },
  
  services: {
    en: {
      title: 'Climate Solutions Services | Carbon Neutrality Consulting',
      description: 'Comprehensive climate services including carbon footprint assessment, emission reduction strategies, carbon offsetting, and ESG reporting solutions.',
      keywords: 'climate services, carbon footprint assessment, emission reduction, carbon offsetting, ESG consulting, sustainability reporting',
    },
    zh: {
      title: '气候解决方案服务 | 碳中和咨询',
      description: '全面的气候服务，包括碳足迹评估、减排策略、碳抵消和ESG报告解决方案。',
      keywords: '气候服务, 碳足迹评估, 减排, 碳抵消, ESG咨询, 可持续发展报告',
    },
  },
} as const;