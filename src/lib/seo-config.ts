/**
 * SEO Configuration Templates
 * 
 * Centralized SEO configurations for different page types
 */

import { SEOConfig } from '@/lib/seo-metadata';

// Base configuration
const BASE_CONFIG: Partial<SEOConfig> = {
  author: 'South Pole',
  openGraph: {
    siteName: 'South Pole',
    type: 'website',
  },
  twitter: {
    site: '@SouthPole',
    card: 'summary_large_image',
  },
};

// Homepage SEO
export const HOME_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'South Pole - Leading Climate Solutions Provider',
  description: 'South Pole helps organizations achieve carbon neutrality and sustainability goals through innovative climate solutions, carbon offset projects, and environmental consulting.',
  keywords: [
    'climate solutions',
    'carbon neutrality',
    'carbon offsets',
    'sustainability consulting',
    'environmental consulting',
    'climate action',
    'net zero',
    'ESG',
    'carbon footprint',
    'renewable energy',
  ],
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: 'South Pole - Leading Climate Solutions Provider',
    description: 'Transform your business with proven climate solutions. Achieve carbon neutrality and drive sustainable growth with South Pole.',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'South Pole Climate Solutions',
      },
    ],
  },
  twitter: {
    ...BASE_CONFIG.twitter,
    title: 'South Pole - Leading Climate Solutions Provider',
    description: 'Transform your business with proven climate solutions.',
  },
};

// Services page SEO
export const SERVICES_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'Climate Solutions & Sustainability Services | South Pole',
  description: 'Comprehensive climate solutions including carbon footprint assessment, offset projects, renewable energy, and sustainability strategy consulting.',
  keywords: [
    'climate services',
    'sustainability consulting',
    'carbon footprint assessment',
    'offset projects',
    'renewable energy solutions',
    'climate strategy',
    'environmental consulting',
    'ESG advisory',
  ],
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: 'Climate Solutions & Sustainability Services',
    description: 'Comprehensive climate solutions for your business transformation.',
  },
};

// News/Blog SEO
export const NEWS_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'Climate News & Insights | South Pole',
  description: 'Latest climate news, sustainability insights, and expert analysis on carbon markets, renewable energy, and environmental policy.',
  keywords: [
    'climate news',
    'sustainability insights',
    'carbon market',
    'environmental policy',
    'climate research',
    'sustainability trends',
    'climate technology',
  ],
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: 'Climate News & Insights',
    description: 'Stay informed with the latest climate and sustainability news.',
  },
};

// About page SEO
export const ABOUT_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'About South Pole - Climate Solutions Pioneer Since 2006',
  description: 'Learn about South Pole\'s mission to accelerate the transition to a climate-positive world through innovative solutions and global partnerships.',
  keywords: [
    'South Pole company',
    'climate solutions pioneer',
    'sustainability leader',
    'environmental consulting',
    'climate expertise',
    'carbon market leader',
  ],
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: 'About South Pole - Climate Solutions Pioneer',
    description: 'Accelerating the transition to a climate-positive world since 2006.',
  },
};

// Contact page SEO
export const CONTACT_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'Contact South Pole - Get Climate Solutions Support',
  description: 'Contact South Pole for expert climate solutions, sustainability consulting, and carbon offset project support. Reach our global team today.',
  keywords: [
    'contact South Pole',
    'climate solutions support',
    'sustainability consulting',
    'carbon offset support',
    'climate expertise',
  ],
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: 'Contact South Pole',
    description: 'Get in touch for expert climate solutions and sustainability support.',
  },
};

// Service detail page template
export const createServiceSEO = (service: {
  name: string;
  description: string;
  slug: string;
  keywords?: string[];
}): SEOConfig => ({
  ...BASE_CONFIG,
  title: `${service.name} | South Pole Climate Solutions`,
  description: service.description,
  keywords: service.keywords || [
    service.name.toLowerCase(),
    'climate solutions',
    'sustainability',
    'South Pole',
  ],
  canonical: `/services/${service.slug}`,
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: service.name,
    description: service.description,
    type: 'website',
  },
});

// Article/News detail page template
export const createArticleSEO = (article: {
  title: string;
  description: string;
  slug: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  category?: string;
  image?: string;
}): SEOConfig => ({
  ...BASE_CONFIG,
  title: `${article.title} | South Pole`,
  description: article.description,
  keywords: article.tags || [],
  canonical: `/news/${article.slug}`,
  author: article.author,
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: article.title,
    description: article.description,
    type: 'article',
    images: article.image ? [
      {
        url: article.image,
        width: 1200,
        height: 630,
        alt: article.title,
      },
    ] : undefined,
  },
  article: {
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
    author: article.author ? [article.author] : undefined,
    section: article.category,
    tags: article.tags,
  },
});

// Search page SEO
export const SEARCH_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'Search Climate Solutions | South Pole',
  description: 'Search South Pole\'s climate solutions, sustainability services, and environmental resources.',
  keywords: [
    'search climate solutions',
    'find sustainability services',
    'South Pole search',
  ],
  noindex: true, // Prevent indexing of search results
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: 'Search Climate Solutions',
    description: 'Find the climate solutions you need.',
  },
};

// 404 page SEO
export const NOT_FOUND_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'Page Not Found | South Pole',
  description: 'The page you\'re looking for doesn\'t exist. Explore our climate solutions and sustainability services.',
  noindex: true,
  openGraph: {
    ...BASE_CONFIG.openGraph,
    title: 'Page Not Found',
    description: 'Explore our climate solutions and sustainability services.',
  },
};

// Error page SEO
export const ERROR_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'Error | South Pole',
  description: 'Something went wrong. Please try again or contact our support team.',
  noindex: true,
  nofollow: true,
};

// Demo pages (development only)
export const DEMO_SEO: SEOConfig = {
  ...BASE_CONFIG,
  title: 'Component Demo | South Pole',
  description: 'South Pole component demonstration and design system showcase.',
  noindex: true,
  nofollow: true,
  keywords: ['demo', 'components', 'design system'],
};

// Utility functions
export const getSEOForPath = (path: string): SEOConfig => {
  switch (path) {
    case '/':
      return HOME_SEO;
    case '/services':
      return SERVICES_SEO;
    case '/news':
      return NEWS_SEO;
    case '/about':
      return ABOUT_SEO;
    case '/contact':
      return CONTACT_SEO;
    case '/search':
      return SEARCH_SEO;
    default:
      if (path.includes('demo')) {
        return DEMO_SEO;
      }
      return HOME_SEO; // fallback
  }
};

export const createLocalizedSEO = (
  baseSEO: SEOConfig,
  locale: string,
  translations: {
    title?: string;
    description?: string;
    keywords?: string[];
  }
): SEOConfig => ({
  ...baseSEO,
  title: translations.title || baseSEO.title,
  description: translations.description || baseSEO.description,
  keywords: translations.keywords || baseSEO.keywords,
  openGraph: {
    ...baseSEO.openGraph,
    title: translations.title || baseSEO.openGraph?.title,
    description: translations.description || baseSEO.openGraph?.description,
    locale,
  },
  twitter: {
    ...baseSEO.twitter,
    title: translations.title || baseSEO.twitter?.title,
    description: translations.description || baseSEO.twitter?.description,
  },
});