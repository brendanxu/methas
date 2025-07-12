import { MetadataRoute } from 'next'

// Define service categories and their details
const SERVICES = [
  {
    slug: 'carbon-footprint-assessment',
    lastModified: new Date('2024-01-15'),
    priority: 0.9,
  },
  {
    slug: 'carbon-neutrality-consulting',
    lastModified: new Date('2024-01-20'),
    priority: 0.9,
  },
  {
    slug: 'renewable-energy-solutions',
    lastModified: new Date('2024-02-01'),
    priority: 0.9,
  },
  {
    slug: 'climate-risk-assessment',
    lastModified: new Date('2024-02-10'),
    priority: 0.9,
  },
  {
    slug: 'esg-advisory',
    lastModified: new Date('2024-02-15'),
    priority: 0.9,
  },
  {
    slug: 'carbon-offset-projects',
    lastModified: new Date('2024-02-20'),
    priority: 0.9,
  },
];

// Define news articles
const ARTICLES = [
  {
    slug: 'sustainability-innovation-award-2024',
    lastModified: new Date('2024-03-01'),
    priority: 0.7,
  },
  {
    slug: 'carbon-market-trends-q1-2024',
    lastModified: new Date('2024-03-15'),
    priority: 0.7,
  },
  {
    slug: 'net-zero-commitments-2024',
    lastModified: new Date('2024-03-20'),
    priority: 0.7,
  },
  {
    slug: 'climate-tech-innovations',
    lastModified: new Date('2024-03-25'),
    priority: 0.7,
  },
  {
    slug: 'green-finance-update',
    lastModified: new Date('2024-04-01'),
    priority: 0.7,
  },
];

// Get the current date for dynamic pages
const getCurrentDate = () => new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  
  // Core static pages with proper priorities and update frequencies
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Generate service pages
  const servicePages = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.lastModified,
    changeFrequency: 'weekly' as const,
    priority: service.priority,
  }));

  // Generate article pages
  const articlePages = ARTICLES.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: article.lastModified,
    changeFrequency: 'monthly' as const,
    priority: article.priority,
  }));

  // Demo pages (lower priority, for development)
  const demoPages = [
    'hero-demo',
    'services-demo',
    'button-demo',
    'cards-demo',
    'section-demo',
    'forms-demo',
    'case-studies-demo',
  ].map((demo) => ({
    url: `${baseUrl}/${demo}`,
    lastModified: new Date('2024-01-01'),
    changeFrequency: 'yearly' as const,
    priority: 0.1,
  }));

  // Localized pages (if multilingual support is needed)
  const locales = ['en', 'zh'];
  const localizedPages: MetadataRoute.Sitemap = [];
  
  // Add localized versions of main pages
  locales.forEach((locale) => {
    if (locale !== 'en') { // Skip default locale to avoid duplicates
      staticPages.forEach((page) => {
        localizedPages.push({
          url: `${baseUrl}/${locale}${page.url.replace(baseUrl, '')}`,
          lastModified: page.lastModified,
          changeFrequency: page.changeFrequency,
          priority: page.priority * 0.9, // Slightly lower priority for non-default locale
        });
      });
    }
  });

  // Combine all pages
  const allPages = [
    ...staticPages,
    ...servicePages,
    ...articlePages,
    ...demoPages,
    ...localizedPages,
  ];

  // Sort by priority (highest first) and then by URL
  return allPages
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.url.localeCompare(b.url);
    });
}