interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternateLanguages?: {
    language: string;
    url: string;
  }[];
}

interface SitemapConfig {
  siteUrl: string;
  defaultChangeFreq: 'daily' | 'weekly' | 'monthly';
  defaultPriority: number;
  languages: string[];
}

const defaultConfig: SitemapConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.southpole.com',
  defaultChangeFreq: 'weekly',
  defaultPriority: 0.7,
  languages: ['zh-CN', 'en-US'],
};

// 静态页面配置
const staticPages = [
  {
    path: '/',
    priority: 1.0,
    changeFrequency: 'weekly' as const,
    languages: ['zh-CN', 'en-US']
  },
  {
    path: '/services',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
    languages: ['zh-CN', 'en-US']
  },
  {
    path: '/services/carbon-footprint',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
    languages: ['zh-CN', 'en-US']
  },
  {
    path: '/services/carbon-offset',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
    languages: ['zh-CN', 'en-US']
  },
  {
    path: '/services/sustainability-consulting',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
    languages: ['zh-CN', 'en-US']
  },
  {
    path: '/about',
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    languages: ['zh-CN', 'en-US']
  },
  {
    path: '/news',
    priority: 0.8,
    changeFrequency: 'daily' as const,
    languages: ['zh-CN', 'en-US']
  },
  {
    path: '/contact',
    priority: 0.6,
    changeFrequency: 'monthly' as const,
    languages: ['zh-CN', 'en-US']
  },
  {
    path: '/careers',
    priority: 0.6,
    changeFrequency: 'weekly' as const,
    languages: ['zh-CN', 'en-US']
  }
];

export class SitemapGenerator {
  private config: SitemapConfig;

  constructor(config?: Partial<SitemapConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  // 生成静态页面sitemap条目
  generateStaticEntries(): SitemapEntry[] {
    const entries: SitemapEntry[] = [];

    staticPages.forEach(page => {
      // 为每种语言生成条目
      page.languages.forEach(language => {
        const isDefaultLanguage = language === 'zh-CN';
        const languagePrefix = isDefaultLanguage ? '' : `/${language.toLowerCase()}`;
        const url = `${this.config.siteUrl}${languagePrefix}${page.path}`;

        // 生成替代语言链接
        const alternateLanguages = page.languages
          .filter(lang => lang !== language)
          .map(lang => ({
            language: lang,
            url: `${this.config.siteUrl}${lang === 'zh-CN' ? '' : `/${lang.toLowerCase()}`}${page.path}`
          }));

        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: page.changeFrequency,
          priority: page.priority,
          alternateLanguages
        });
      });
    });

    return entries;
  }

  // 生成动态内容sitemap条目（新闻、博客等）
  generateDynamicEntries(content: Array<{
    slug: string;
    updatedAt?: string;
    publishedAt?: string;
    priority?: number;
    type: 'news' | 'blog' | 'case-study';
  }>): SitemapEntry[] {
    const entries: SitemapEntry[] = [];

    content.forEach(item => {
      this.config.languages.forEach(language => {
        const isDefaultLanguage = language === 'zh-CN';
        const languagePrefix = isDefaultLanguage ? '' : `/${language.toLowerCase()}`;
        const url = `${this.config.siteUrl}${languagePrefix}/${item.type}/${item.slug}`;

        const alternateLanguages = this.config.languages
          .filter(lang => lang !== language)
          .map(lang => ({
            language: lang,
            url: `${this.config.siteUrl}${lang === 'zh-CN' ? '' : `/${lang.toLowerCase()}`}/${item.type}/${item.slug}`
          }));

        entries.push({
          url,
          lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(item.publishedAt!),
          changeFrequency: 'monthly',
          priority: item.priority || 0.6,
          alternateLanguages
        });
      });
    });

    return entries;
  }

  // 生成完整的sitemap XML
  generateSitemapXML(entries: SitemapEntry[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const sitemapOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    const sitemapClose = '</urlset>';

    const urlEntries = entries.map(entry => {
      const alternateLinks = entry.alternateLanguages
        ?.map(alt => `    <xhtml:link rel="alternate" hreflang="${alt.language}" href="${alt.url}" />`)
        .join('\n') || '';

      return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${entry.changeFrequency || this.config.defaultChangeFreq}</changefreq>
    <priority>${entry.priority || this.config.defaultPriority}</priority>
${alternateLinks}
  </url>`;
    }).join('\n');

    return [xmlHeader, sitemapOpen, urlEntries, sitemapClose].join('\n');
  }

  // 生成sitemap索引文件
  generateSitemapIndex(sitemaps: Array<{ url: string; lastModified?: Date }>): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const indexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const indexClose = '</sitemapindex>';

    const sitemapEntries = sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.url}</loc>
    <lastmod>${sitemap.lastModified?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n');

    return [xmlHeader, indexOpen, sitemapEntries, indexClose].join('\n');
  }
}

// 预配置的sitemap生成器实例
export const sitemapGenerator = new SitemapGenerator();

// 生成robots.txt内容
export function generateRobotsTxt(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.southpole.com';
  
  return `User-agent: *
Allow: /

# 特定爬虫优化
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

User-agent: Baiduspider
Allow: /
Crawl-delay: 3

# 阻止访问敏感目录
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/
Disallow: *.json$
Disallow: /temp/

# Sitemap位置
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-news.xml
Sitemap: ${siteUrl}/sitemap-pages.xml

# 爬虫延迟设置
Crawl-delay: 1

# 访问时间限制（减少服务器负载）
Request-rate: 1/10s

# SEO友好的注释
# South Pole官方网站 - 气候解决方案
# 更新频率：每日更新新闻和项目信息
# 联系方式：info@southpole.com`;
}

// 辅助函数：获取页面优先级
export function getPagePriority(path: string): number {
  const priorityMap: Record<string, number> = {
    '/': 1.0,
    '/services': 0.9,
    '/about': 0.7,
    '/news': 0.8,
    '/contact': 0.6,
    '/careers': 0.6,
  };

  return priorityMap[path] || 0.5;
}

// 辅助函数：获取更新频率
export function getChangeFrequency(path: string): 'daily' | 'weekly' | 'monthly' | 'yearly' {
  if (path.includes('/news') || path.includes('/blog')) return 'daily';
  if (path === '/' || path.includes('/services')) return 'weekly';
  return 'monthly';
}