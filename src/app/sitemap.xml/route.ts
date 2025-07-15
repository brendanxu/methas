import { NextResponse } from 'next/server';
import { sitemapGenerator } from '@/lib/seo/sitemap';

export async function GET() {

// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
  try {
    // 生成静态页面条目
    const staticEntries = sitemapGenerator.generateStaticEntries();
    
    // 这里可以添加动态内容的获取逻辑
    // 例如从CMS或数据库获取新闻、博客等内容
    const dynamicContent = [
      // 示例动态内容
      {
        slug: 'carbon-neutral-solutions-2024',
        publishedAt: '2024-01-15',
        updatedAt: '2024-06-01',
        type: 'news' as const,
        priority: 0.7
      },
      {
        slug: 'esg-reporting-guide',
        publishedAt: '2024-02-10',
        updatedAt: '2024-05-15',
        type: 'blog' as const,
        priority: 0.6
      },
      {
        slug: 'renewable-energy-project-success',
        publishedAt: '2024-03-05',
        type: 'case-study' as const,
        priority: 0.8
      }
    ];

    const dynamicEntries = sitemapGenerator.generateDynamicEntries(dynamicContent);
    
    // 合并所有条目
    const allEntries = [...staticEntries, ...dynamicEntries];
    
    // 生成sitemap XML
    const sitemapXML = sitemapGenerator.generateSitemapXML(allEntries);

    return new NextResponse(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24小时缓存
      },
    });
  } catch (error) {
    logError('生成sitemap时发生错误:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}