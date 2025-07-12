import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com';
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    rules: [
      // General rules for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API endpoints
          '/admin/',         // Admin pages
          '/_next/',         // Next.js internal files
          '/private/',       // Private content
          '/temp/',          // Temporary files
          '/draft/',         // Draft content
          '/*.json$',        // JSON files
          '/*?*utm_*',       // URLs with UTM parameters
          '/*?*ref=*',       // URLs with referral parameters
          '/search*',        // Search result pages
          '/404',            // Error pages
          '/500',            // Error pages
          ...(isProduction ? [] : ['/*-demo']), // Block demo pages in production
        ],
      },
      
      // Specific rules for major search engines
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-Video'],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/search*',
        ],
        crawlDelay: 1,
      },
      
      // Bing crawler
      {
        userAgent: ['Bingbot'],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/search*',
        ],
        crawlDelay: 2,
      },
      
      // Yahoo/Slurp crawler
      {
        userAgent: ['Slurp'],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/search*',
        ],
        crawlDelay: 3,
      },
      
      // Social media crawlers (more permissive)
      {
        userAgent: ['facebookexternalhit', 'Twitterbot', 'LinkedInBot'],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
      
      // Block aggressive crawlers
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
        ],
        disallow: '/',
      },
      
      // Allow specific bots for monitoring and analytics
      {
        userAgent: [
          'Lighthouse',
          'PageSpeed',
          'GTmetrix',
          'Pingdom',
        ],
        allow: '/',
        crawlDelay: 5,
      },
    ],
    
    // Sitemap reference
    sitemap: `${baseUrl}/sitemap.xml`,
    
    // Host specification
    host: baseUrl,
  }
}