'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage, getLocalizedPath } from '@/lib/i18n';

interface DynamicHeadProps {
  basePath?: string;
}

export const DynamicHead: React.FC<DynamicHeadProps> = ({ basePath = '/' }) => {
  const { i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  useEffect(() => {
    // Update document lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  // Generate hreflang links
  const generateHreflangLinks = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
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

  return (
    <Head>
      {/* Language-specific meta tags */}
      <meta name="language" content={currentLanguage} />
      <meta name="content-language" content={currentLanguage} />
      
      {/* Hreflang tags */}
      {generateHreflangLinks()}
      
      {/* Additional i18n meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    </Head>
  );
};