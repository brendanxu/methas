'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useParams, usePathname } from 'next/navigation';
import { defaultSEO } from '@/lib/seo/seo-config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noindex?: boolean;
  canonical?: string;
  locale?: string;
}

export const EnhancedSEOHead: React.FC<SEOProps> = ({
  title,
  description,
  image,
  article = false,
  publishedTime,
  modifiedTime,
  author,
  keywords,
  noindex = false,
  canonical,
  locale = 'zh-CN',
}) => {
  const pathname = usePathname();
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.southpole.com';
  const currentUrl = `${siteUrl}${pathname}`;
  const canonicalUrl = canonical || currentUrl;

  const finalTitle = title 
    ? `${title} | South Pole - 气候解决方案领导者`
    : defaultSEO.defaultTitle;
    
  const finalDescription = description || defaultSEO.description;
  const finalImage = image || defaultSEO.openGraph.images[0].url;

  // 生成hreflang链接
  const generateHrefLangs = () => {
    const languages = [
      { code: 'zh-CN', url: `${siteUrl}/zh${pathname}` },
      { code: 'en-US', url: `${siteUrl}${pathname}` },
    ];
    
    return languages.map(({ code, url }) => (
      <link key={code} rel="alternate" hrefLang={code} href={url} />
    ));
  };

  return (
    <Head>
      {/* 基础 Meta 标签 */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* 多语言标签 */}
      {generateHrefLangs()}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${pathname}`} />

      {/* Open Graph */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="South Pole" />
      <meta property="og:locale" content={locale} />
      
      {article && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          <meta property="article:section" content="气候解决方案" />
          {keywords && keywords.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@southpole" />
      <meta name="twitter:creator" content="@southpole" />

      {/* 结构化数据预览 */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* 性能和缓存提示 */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
      <meta name="generator" content="Next.js" />
      
      {/* 移动优化 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* DNS预取 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* 预连接重要资源 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon和应用图标 */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#002145" />
      <meta name="msapplication-TileColor" content="#002145" />
    </Head>
  );
};