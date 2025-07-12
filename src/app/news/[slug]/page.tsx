import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsArticlePage from './NewsArticlePage';

// 类型定义
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption?: string;
  publishedAt: string;
  updatedAt?: string;
  category: 'company' | 'industry' | 'events';
  author: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
    social?: {
      twitter?: string;
      linkedin?: string;
    };
  };
  readingTime: number;
  tags: string[];
  views?: number;
  featured?: boolean;
  tableOfContents?: {
    id: string;
    title: string;
    level: number;
  }[];
}

// 模拟文章数据
const mockArticles: NewsArticle[] = [
  {
    id: 'sustainability-innovation-award-2024',
    slug: 'sustainability-innovation-award-2024',
    title: 'South Pole 获得 2024 年度可持续发展创新奖',
    excerpt: '凭借在碳中和领域的突破性技术创新和卓越的客户服务，South Pole 荣获联合国环境规划署颁发的可持续发展创新奖，这是对我们在全球气候行动中贡献的重要认可。',
    content: `
## 突破性成就的认可

2024年3月15日，South Pole 在联合国环境规划署举办的全球可持续发展峰会上荣获"可持续发展创新奖"。这一荣誉不仅是对我们在碳中和领域技术创新的认可，更是对整个团队多年来不懈努力的肯定。

### 创新技术的突破

我们的获奖项目主要基于三个核心技术创新：

#### 1. AI驱动的碳排放监测平台

- **实时监测**：通过物联网传感器和卫星数据，实现24/7实时碳排放监测
- **精准预测**：运用机器学习算法，预测准确率较传统方法提升40%
- **自动化报告**：生成符合国际标准的碳排放报告，减少人工成本80%

#### 2. 区块链碳信用交易系统

我们开发的区块链平台为碳信用交易带来了革命性的变化：

> "这个平台不仅确保了碳信用的真实性和可追溯性，更重要的是为全球碳市场建立了统一的信任机制。" —— 联合国环境规划署执行主任

#### 3. 企业脱碳路径优化引擎

通过大数据分析和AI算法，我们为企业提供个性化的脱碳路径建议：

- 成本效益分析
- 实施时间规划
- 风险评估与缓解
- ROI预测模型

### 全球影响力

截至目前，我们的创新解决方案已经帮助全球超过1000家企业实现了碳中和目标：

| 行业 | 服务企业数 | 减排量(吨CO₂) | 节能量(MW) |
|------|-----------|--------------|-----------|
| 制造业 | 350 | 125,000 | 45.2 |
| 金融服务 | 200 | 38,000 | 12.8 |
| 零售业 | 280 | 67,000 | 23.1 |
| 能源 | 170 | 180,000 | 78.5 |

### 未来展望

获得这一奖项标志着 South Pole 在可持续发展领域的里程碑式成就。我们将继续致力于技术创新，为全球气候目标的实现贡献更大力量。

#### 即将推出的新功能

1. **多语言AI助手**：支持50多种语言的智能咨询服务
2. **移动端监测应用**：随时随地查看碳足迹数据
3. **社区协作平台**：连接全球环保从业者，分享最佳实践

### 致谢

这一成就的取得离不开我们客户的信任、合作伙伴的支持，以及整个团队的辛勤付出。特别感谢：

- 联合国环境规划署的专业指导
- 全球1000+企业客户的信任与支持
- South Pole 研发团队的技术创新
- 各国政府和NGO组织的政策支持

我们将继续秉承"科技推动可持续发展"的使命，为构建更加绿色、低碳的未来而努力。

---

*本文首发于 South Pole 官方网站，转载请注明出处。*
    `,
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: '2024年度可持续发展创新奖颁奖典礼现场',
    imageCaption: 'South Pole CEO 在联合国环境规划署颁奖典礼上发表获奖感言',
    publishedAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-16T14:30:00Z',
    category: 'company',
    author: {
      name: 'Sarah Chen',
      title: '首席技术官',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b79e2f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      bio: 'Sarah Chen 是 South Pole 的首席技术官，拥有超过15年的环境科技和可持续发展经验。她领导的团队专注于开发创新的碳中和解决方案，为全球企业提供专业的技术支持。',
      social: {
        twitter: 'https://twitter.com/sarahchen_sp',
        linkedin: 'https://linkedin.com/in/sarahchen-southpole'
      }
    },
    readingTime: 8,
    tags: ['企业动态', '获奖', '创新', '联合国', '碳中和', '技术'],
    views: 1250,
    featured: true,
    tableOfContents: [
      { id: 'breakthrough', title: '突破性成就的认可', level: 2 },
      { id: 'innovation', title: '创新技术的突破', level: 2 },
      { id: 'ai-platform', title: 'AI驱动的碳排放监测平台', level: 3 },
      { id: 'blockchain', title: '区块链碳信用交易系统', level: 3 },
      { id: 'optimization', title: '企业脱碳路径优化引擎', level: 3 },
      { id: 'impact', title: '全球影响力', level: 2 },
      { id: 'future', title: '未来展望', level: 2 },
      { id: 'thanks', title: '致谢', level: 2 }
    ]
  },
  {
    id: 'carbon-market-trends-q1-2024',
    slug: 'carbon-market-trends-q1-2024',
    title: '全球碳市场发展趋势报告：2024年第一季度',
    excerpt: '最新发布的全球碳市场分析显示，2024年第一季度碳信用交易量同比增长45%，价格稳定在每吨25-30美元区间。企业对高质量碳信用的需求持续强劲。',
    content: `
## 市场概况

2024年第一季度，全球碳市场呈现出强劲的增长势头。根据我们的最新分析，碳信用交易量达到了历史新高，市场信心持续增强。

### 关键数据

- **交易量增长**：同比增长45%，达到8.5亿吨CO₂当量
- **平均价格**：稳定在25-30美元/吨区间
- **活跃买家**：增加了35%的新企业买家
- **项目类型**：可再生能源项目占比60%

这些数据表明，企业对碳中和的重视程度不断提高，高质量碳信用的需求将持续增长。
    `,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: '全球碳市场发展趋势图表',
    imageCaption: '2024年第一季度全球碳信用交易数据可视化',
    publishedAt: '2024-03-12T09:00:00Z',
    category: 'industry',
    author: {
      name: 'Michael Johnson',
      title: '市场分析师',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      bio: 'Michael Johnson 是 South Pole 的资深市场分析师，专注于全球碳市场研究和趋势分析。他拥有金融和环境科学的双重背景，为客户提供专业的市场洞察。',
      social: {
        linkedin: 'https://linkedin.com/in/michaeljohnson-sp'
      }
    },
    readingTime: 6,
    tags: ['市场分析', '碳信用', '趋势报告', '数据分析'],
    views: 890,
    tableOfContents: [
      { id: 'overview', title: '市场概况', level: 2 },
      { id: 'key-data', title: '关键数据', level: 3 }
    ]
  }
];

// 获取相关文章
function getRelatedArticles(currentSlug: string, count: number = 3): NewsArticle[] {
  return mockArticles
    .filter(article => article.slug !== currentSlug)
    .slice(0, count);
}

// 根据 slug 获取文章
async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  // 模拟 API 调用延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const article = mockArticles.find(article => article.slug === slug);
  return article || null;
}

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: '文章未找到 | South Pole',
      description: '抱歉，您访问的文章不存在。'
    };
  }

  return {
    title: `${article.title} | South Pole`,
    description: article.excerpt,
    authors: [{ name: article.author.name }],
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.imageAlt,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

// 生成静态参数
export async function generateStaticParams() {
  return mockArticles.map((article) => ({
    slug: article.slug,
  }));
}

// 页面组件
export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug);

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.imageUrl,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "jobTitle": article.author.title,
      "image": article.author.avatar
    },
    "publisher": {
      "@type": "Organization",
      "name": "South Pole",
      "logo": {
        "@type": "ImageObject",
        "url": "https://southpole.com/logo.png"
      }
    },
    "articleSection": article.category,
    "keywords": article.tags.join(", "),
    "wordCount": article.content.length,
    "timeRequired": `PT${article.readingTime}M`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://southpole.com/news/${article.slug}`
    }
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* 文章页面组件 */}
      <NewsArticlePage 
        article={article} 
        relatedArticles={relatedArticles} 
      />
    </>
  );
}