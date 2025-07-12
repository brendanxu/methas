import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string | string[];
  author?: string;
  canonicalUrl?: string;
  canonical?: string; // Legacy field
  noindex?: boolean;
  nofollow?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    type?: 'website' | 'article' | 'video' | 'music';
    url?: string;
    siteName?: string;
    locale?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
    images?: string[];
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
    };
  };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    author?: string | string[];
    section?: string;
    tags?: string[];
  };
  
  // Custom meta tags
  customMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

// Helper function to generate metadata for Next.js App Router
export const generateMetadata = (config: SEOConfig): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  
  return {
    title: config.title,
    description: config.description,
    keywords: Array.isArray(config.keywords) ? config.keywords.join(', ') : config.keywords,
    authors: config.author ? [{ name: config.author }] : undefined,
    
    openGraph: {
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      type: (config.openGraph?.type === 'article' ? 'article' : 'website') as 'article' | 'website',
      siteName: config.openGraph?.siteName || 'South Pole',
      locale: config.openGraph?.locale || 'en',
      url: config.openGraph?.url,
      images: config.openGraph?.images || [
        {
          url: `${baseUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    
    twitter: {
      card: config.twitter?.card || 'summary_large_image',
      site: config.twitter?.site || '@southpole',
      creator: config.twitter?.creator,
      title: config.twitter?.title || config.title,
      description: config.twitter?.description || config.description,
      images: config.twitter?.image ? [config.twitter.image] : config.openGraph?.images?.map(img => img.url),
    },
    
    robots: {
      index: config.robots?.index !== false && !config.noindex,
      follow: config.robots?.follow !== false && !config.nofollow,
      googleBot: {
        index: config.robots?.googleBot?.index !== false && !config.noindex,
        follow: config.robots?.googleBot?.follow !== false && !config.nofollow,
      },
    },
    
    alternates: {
      canonical: config.canonicalUrl || config.canonical,
    },
    
    other: {
      // Article meta tags
      ...(config.article?.publishedTime && {
        'article:published_time': config.article.publishedTime,
      }),
      ...(config.article?.modifiedTime && {
        'article:modified_time': config.article.modifiedTime,
      }),
      ...(config.article?.author && {
        'article:author': config.article.author,
      }),
      ...(config.article?.section && {
        'article:section': config.article.section,
      }),
      ...(config.article?.tags && {
        'article:tag': config.article.tags.join(','),
      }),
    },
  };
};