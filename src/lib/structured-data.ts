/**
 * Structured Data (JSON-LD) Utilities
 * 
 * Generates Schema.org structured data for better SEO
 */

export interface OrganizationSchema {
  '@context': string;
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: Array<{
    '@type': 'ContactPoint';
    telephone?: string;
    contactType?: string;
    email?: string;
  }>;
  sameAs?: string[];
  foundingDate?: string;
  founders?: Array<{
    '@type': 'Person';
    name: string;
  }>;
}

export interface WebsiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: {
    '@type': 'Organization';
    name: string;
  };
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface ArticleSchema {
  '@context': string;
  '@type': 'Article';
  headline: string;
  description?: string;
  image?: string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
  articleSection?: string;
  keywords?: string[];
}

export interface FAQSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface ServiceSchema {
  '@context': string;
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  areaServed?: string;
  category?: string;
  offers?: {
    '@type': 'Offer';
    description?: string;
    category?: string;
  };
}

export interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  worksFor?: {
    '@type': 'Organization';
    name: string;
  };
  description?: string;
  image?: string;
  sameAs?: string[];
}

// Schema generators
export const createOrganizationSchema = (): OrganizationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'South Pole',
  url: 'https://southpole.com',
  logo: 'https://southpole.com/logo.png',
  description: 'Leading climate solutions provider helping organizations achieve carbon neutrality and sustainable development goals.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Zurich',
    addressCountry: 'Switzerland',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@southpole.com',
    },
  ],
  sameAs: [
    'https://www.linkedin.com/company/south-pole',
    'https://twitter.com/southpole',
    'https://www.facebook.com/southpole.carbon',
  ],
  foundingDate: '2006',
});

export const createWebsiteSchema = (): WebsiteSchema => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'South Pole',
  url: 'https://southpole.com',
  description: 'Climate solutions and sustainability consulting services.',
  publisher: {
    '@type': 'Organization',
    name: 'South Pole',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://southpole.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>): BreadcrumbSchema => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const createArticleSchema = (options: {
  headline: string;
  description?: string;
  image?: string[];
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
  section?: string;
  keywords?: string[];
}): ArticleSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: options.headline,
  description: options.description,
  image: options.image,
  datePublished: options.datePublished,
  dateModified: options.dateModified || options.datePublished,
  author: {
    '@type': 'Person',
    name: options.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'South Pole',
    logo: {
      '@type': 'ImageObject',
      url: 'https://southpole.com/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': options.url,
  },
  articleSection: options.section,
  keywords: options.keywords,
});

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>): FAQSchema => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const createServiceSchema = (options: {
  name: string;
  description: string;
  category?: string;
  areaServed?: string;
}): ServiceSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: options.name,
  description: options.description,
  provider: {
    '@type': 'Organization',
    name: 'South Pole',
  },
  areaServed: options.areaServed || 'Worldwide',
  category: options.category || 'Climate Solutions',
  offers: {
    '@type': 'Offer',
    description: options.description,
    category: options.category,
  },
});

export const createPersonSchema = (options: {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}): PersonSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: options.name,
  jobTitle: options.jobTitle,
  worksFor: {
    '@type': 'Organization',
    name: 'South Pole',
  },
  description: options.description,
  image: options.image,
  sameAs: options.sameAs,
});

// Common combinations
export const getDefaultSchemas = () => [
  createOrganizationSchema(),
  createWebsiteSchema(),
];

export const getPageSchemas = (breadcrumbs: Array<{ name: string; url: string }>) => [
  ...getDefaultSchemas(),
  createBreadcrumbSchema(breadcrumbs),
];

export const getArticleSchemas = (
  breadcrumbs: Array<{ name: string; url: string }>,
  articleOptions: Parameters<typeof createArticleSchema>[0]
) => [
  ...getPageSchemas(breadcrumbs),
  createArticleSchema(articleOptions),
];

export const getServiceSchemas = (
  breadcrumbs: Array<{ name: string; url: string }>,
  serviceOptions: Parameters<typeof createServiceSchema>[0]
) => [
  ...getPageSchemas(breadcrumbs),
  createServiceSchema(serviceOptions),
];

export const getFAQSchemas = (
  breadcrumbs: Array<{ name: string; url: string }>,
  faqs: Array<{ question: string; answer: string }>
) => [
  ...getPageSchemas(breadcrumbs),
  createFAQSchema(faqs),
];