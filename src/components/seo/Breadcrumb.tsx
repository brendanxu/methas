'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { createBreadcrumbSchema } from '@/lib/structured-data';

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  showHome = true,
  separator = <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  
  // Prepare items for structured data
  const schemaItems = showHome 
    ? [{ name: 'Home', url: baseUrl }, ...items.map(item => ({ name: item.name, url: `${baseUrl}${item.href}` }))]
    : items.map(item => ({ name: item.name, url: `${baseUrl}${item.href}` }));

  // Generate structured data
  const breadcrumbSchema = createBreadcrumbSchema(schemaItems);

  // Prepare display items
  const displayItems = showHome 
    ? [{ name: 'Home', href: '/', current: false }, ...items]
    : items;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav 
        className={cn('flex', className)} 
        aria-label="Breadcrumb"
        role="navigation"
      >
        <ol className="flex items-center space-x-2 text-sm">
          {displayItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
              
              {item.current ? (
                <span 
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {index === 0 && showHome ? (
                    <span className="flex items-center">
                      <HomeIcon className="h-4 w-4 mr-1" />
                      {item.name}
                    </span>
                  ) : (
                    item.name
                  )}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'text-muted-foreground hover:text-foreground transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm',
                    index === 0 && showHome && 'flex items-center'
                  )}
                >
                  {index === 0 && showHome ? (
                    <>
                      <HomeIcon className="h-4 w-4 mr-1" />
                      <span className="sr-only">{item.name}</span>
                    </>
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

// Utility function to generate breadcrumbs from pathname
export const generateBreadcrumbs = (pathname: string, customLabels?: Record<string, string>): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Default labels for common paths
  const defaultLabels: Record<string, string> = {
    'services': 'Services',
    'news': 'News',
    'about': 'About',
    'contact': 'Contact',
    'case-studies': 'Case Studies',
    'search': 'Search',
    ...customLabels,
  };

  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Get label from custom labels or use formatted segment
    const label = defaultLabels[segment] || formatSegmentLabel(segment);
    
    breadcrumbs.push({
      name: label,
      href: currentPath,
      current: index === pathSegments.length - 1,
    });
  });

  return breadcrumbs;
};

// Helper function to format URL segments into readable labels
const formatSegmentLabel = (segment: string): string => {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Pre-defined breadcrumb configurations for common pages
export const BREADCRUMB_CONFIGS = {
  home: [],
  services: [
    { name: 'Services', href: '/services', current: true },
  ],
  serviceDetail: (serviceName: string, serviceSlug: string) => [
    { name: 'Services', href: '/services', current: false },
    { name: serviceName, href: `/services/${serviceSlug}`, current: true },
  ],
  news: [
    { name: 'News', href: '/news', current: true },
  ],
  newsArticle: (articleTitle: string, articleSlug: string) => [
    { name: 'News', href: '/news', current: false },
    { name: articleTitle, href: `/news/${articleSlug}`, current: true },
  ],
  about: [
    { name: 'About', href: '/about', current: true },
  ],
  contact: [
    { name: 'Contact', href: '/contact', current: true },
  ],
  search: [
    { name: 'Search', href: '/search', current: true },
  ],
} as const;

export default Breadcrumb;