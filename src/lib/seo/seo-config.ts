export const defaultSEO = {
  titleTemplate: '%s | South Pole - 气候解决方案领导者',
  defaultTitle: 'South Pole - 全球领先的气候解决方案提供商',
  description: '为企业提供全方位的碳中和解决方案，包括碳足迹测算、减排项目投资、可持续发展战略咨询等服务',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
    url: 'https://www.southpole.com',
    siteName: 'South Pole',
    images: [
      {
        url: 'https://www.southpole.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'South Pole - 气候解决方案',
      },
    ],
  },
  twitter: {
    handle: '@southpole',
    site: '@southpole',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
    {
      name: 'theme-color',
      content: '#002145',
    },
    {
      name: 'application-name',
      content: 'South Pole',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};

// 页面特定SEO配置
export const pageSEO = {
  home: {
    title: '首页',
    description: 'South Pole是全球领先的气候解决方案提供商，致力于帮助企业实现碳中和目标，应对气候变化挑战',
    keywords: ['碳中和', '气候解决方案', '碳足迹', '减排项目', '可持续发展', 'ESG'],
  },
  services: {
    title: '我们的服务',
    description: '提供碳足迹测算、减排项目开发、碳抵消、可持续发展战略咨询等全方位气候解决方案服务',
    keywords: ['碳足迹测算', '减排项目', '碳抵消', '可持续发展咨询', '气候风险评估'],
  },
  news: {
    title: '新闻资讯',
    description: '获取最新的气候变化资讯、政策解读、行业趋势分析和South Pole的项目动态',
    keywords: ['气候新闻', '政策解读', '行业趋势', '项目动态', '可持续发展'],
  },
  about: {
    title: '关于我们',
    description: 'South Pole成立于2006年，是全球领先的碳市场项目开发商和气候解决方案提供商',
    keywords: ['South Pole', '公司介绍', '气候专家', '碳市场', '企业历史'],
  },
};

// 动态SEO数据生成
export const generateSEO = (page: string, data?: any) => {
  const baseSEO = pageSEO[page as keyof typeof pageSEO] || pageSEO.home;
  
  if (data) {
    return {
      title: data.title || baseSEO.title,
      description: data.description || data.excerpt || baseSEO.description,
      keywords: data.tags || data.keywords || baseSEO.keywords,
      image: data.featuredImage || data.image,
      article: !!data.publishedAt,
      publishedTime: data.publishedAt,
      modifiedTime: data.updatedAt,
      author: data.author?.name,
    };
  }
  
  return baseSEO;
};