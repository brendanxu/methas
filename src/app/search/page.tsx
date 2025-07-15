import { Metadata } from 'next';
// import SearchPageClient from './SearchPageClient'; // Temporarily disabled due to module resolution issues

// 动态生成metadata，支持搜索查询的SEO优化
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;
  
  if (query) {
    return {
      title: `搜索 "${query}" - South Pole`,
      description: `在South Pole中搜索"${query}"的相关服务、新闻、案例和资源。找到您需要的碳中和和可持续发展解决方案。`,
      robots: {
        index: true,  // 允许有具体搜索内容的页面被索引
        follow: true,
      },
      openGraph: {
        title: `搜索 "${query}" - South Pole`,
        description: `在South Pole中搜索"${query}"的相关内容`,
        type: 'website',
      },
    };
  }
  
  // 无搜索查询的默认metadata
  return {
    title: '搜索 | South Pole',
    description: '搜索South Pole的服务、新闻、案例和资源。找到您需要的碳中和和可持续发展解决方案。',
    robots: {
      index: false, // 空搜索页面不需要被索引
      follow: true,
    },
  };
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">搜索功能</h1>
      <p className="text-muted-foreground">
        搜索功能正在维护中，请稍后再试。如需帮助，请联系我们的支持团队。
      </p>
    </div>
  );
}