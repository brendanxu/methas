'use client';

import React from 'react';
import { Metadata } from 'next';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage, getLocalizedPath } from '@/lib/i18n';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  
  // Open Graph
  openGraph?: {
    title?: string;
    description?: string;
    type?: 'website' | 'article' | 'video' | 'music';
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    siteName?: string;
    locale?: string;
    url?: string;
  };
  
  // Twitter
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
  
  // Article specific
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    author?: string[];
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

interface SEOHeadProps {
  config: SEOConfig;
  basePath?: string;
  schemaData?: Record<string, any>[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  config, 
  basePath = '/', 
  schemaData = [] 
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  
  // Generate canonical URL
  const canonicalUrl = config.canonical || `${baseUrl}${basePath}`;
  
  // Default values
  const siteName = 'South Pole';
  const defaultImage = `${baseUrl}/og-default.jpg`;
  
  // Merge config with defaults
  const seoConfig = {
    ...config,
    openGraph: {
      siteName,
      locale: currentLanguage,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: defaultImage, width: 1200, height: 630, alt: config.title }],
      ...config.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@SouthPole',
      ...config.twitter,
    },
  };

  // Generate hreflang links
  const generateHreflangLinks = () => {
    const links = [];
    
    // Add language-specific URLs
    ['en', 'zh'].forEach((locale) => {
      links.push(
        <link
          key={`hreflang-${locale}`}
          rel="alternate"
          hrefLang={locale}
          href={`${baseUrl}${getLocalizedPath(basePath, locale as any)}`}
        />
      );
    });

    // Add x-default
    links.push(
      <link
        key="hreflang-default"
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${getLocalizedPath(basePath, 'en')}`}
      />
    );

    return links;
  };

  // Generate robots meta content
  const generateRobotsContent = () => {
    const parts = [];
    
    if (seoConfig.noindex) {
      parts.push('noindex');
    } else {
      parts.push('index');
    }
    
    if (seoConfig.nofollow) {
      parts.push('nofollow');
    } else {
      parts.push('follow');
    }
    
    parts.push('max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1');
    
    return parts.join(', ');
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      {seoConfig.keywords && (
        <meta name="keywords" content={seoConfig.keywords.join(', ')} />
      )}
      {seoConfig.author && <meta name="author" content={seoConfig.author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      <meta name="robots" content={generateRobotsContent()} />
      <meta name="googlebot" content={generateRobotsContent()} />
      
      {/* Language and Content */}
      <meta name="language" content={currentLanguage} />
      <meta name="content-language" content={currentLanguage} />
      <meta httpEquiv="content-language" content={currentLanguage} />
      
      {/* Hreflang Links */}
      {generateHreflangLinks()}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={seoConfig.openGraph.title || seoConfig.title} />
      <meta property="og:description" content={seoConfig.openGraph.description || seoConfig.description} />
      <meta property="og:type" content={seoConfig.openGraph.type} />
      <meta property="og:url" content={seoConfig.openGraph.url} />
      <meta property="og:site_name" content={seoConfig.openGraph.siteName} />
      <meta property="og:locale" content={seoConfig.openGraph.locale} />
      
      {/* Open Graph Images */}
      {seoConfig.openGraph.images?.map((image, index) => (
        <React.Fragment key={index}>
          <meta property="og:image" content={image.url} />
          {image.width && <meta property="og:image:width" content={image.width.toString()} />}
          {image.height && <meta property="og:image:height" content={image.height.toString()} />}
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
        </React.Fragment>
      ))}
      
      {/* Article Meta Tags */}
      {seoConfig.article && (
        <>
          {seoConfig.article.publishedTime && (
            <meta property="article:published_time" content={seoConfig.article.publishedTime} />
          )}
          {seoConfig.article.modifiedTime && (
            <meta property="article:modified_time" content={seoConfig.article.modifiedTime} />
          )}
          {seoConfig.article.expirationTime && (
            <meta property="article:expiration_time" content={seoConfig.article.expirationTime} />
          )}
          {seoConfig.article.author?.map((author, index) => (
            <meta key={index} property="article:author" content={author} />
          ))}
          {seoConfig.article.section && (
            <meta property="article:section" content={seoConfig.article.section} />
          )}
          {seoConfig.article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={seoConfig.twitter.card} />
      {seoConfig.twitter.site && <meta name="twitter:site" content={seoConfig.twitter.site} />}
      {seoConfig.twitter.creator && <meta name="twitter:creator" content={seoConfig.twitter.creator} />}
      <meta name="twitter:title" content={seoConfig.twitter.title || seoConfig.title} />
      <meta name="twitter:description" content={seoConfig.twitter.description || seoConfig.description} />
      
      {/* Twitter Images */}
      {seoConfig.twitter.images?.map((image, index) => (
        <meta key={index} name="twitter:image" content={image} />
      )) || seoConfig.openGraph.images?.slice(0, 1).map((image, index) => (
        <meta key={index} name="twitter:image" content={image.url} />
      ))}
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#002145" />
      <meta name="msapplication-TileColor" content="#002145" />
      
      {/* Custom Meta Tags */}
      {seoConfig.customMeta?.map((meta, index) => (
        <meta
          key={index}
          {...(meta.name ? { name: meta.name } : {})}
          {...(meta.property ? { property: meta.property } : {})}
          content={meta.content}
        />
      ))}
      
      {/* Structured Data */}
      {schemaData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </Head>
  );
};

// Helper function to generate metadata for Next.js App Router
export const generateMetadata = (config: SEOConfig): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
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
      site: config.twitter?.site || '@SouthPole',
      creator: config.twitter?.creator,
      title: config.twitter?.title || config.title,
      description: config.twitter?.description || config.description,
      images: config.twitter?.images || config.openGraph?.images?.map(img => img.url),
    },
    
    robots: {
      index: !config.noindex,
      follow: !config.nofollow,
      googleBot: {
        index: !config.noindex,
        follow: !config.nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    alternates: {
      canonical: config.canonical,
    },
  };
};

export default SEOHead;