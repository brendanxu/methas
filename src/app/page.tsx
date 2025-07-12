import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ThemeShowcase } from '@/components/sections/ThemeShowcase';
import { Services } from '@/components/sections/home/Services';
import { CaseStudies } from '@/components/sections/home/CaseStudies';

export const metadata: Metadata = {
  title: 'South Pole - 全球领先的碳中和解决方案提供商',
  description: '南极碳中和咨询公司为全球企业和政府提供专业的碳足迹评估、碳中和策略制定、碳信用交易等气候解决方案。助力企业实现净零排放目标，共建可持续未来。',
  keywords: [
    '碳中和',
    '碳足迹评估',
    '碳信用',
    '可持续发展',
    '气候解决方案',
    '净零排放',
    '环境咨询',
    'ESG',
    '绿色金融',
    'South Pole'
  ],
  openGraph: {
    title: 'South Pole - 全球领先的碳中和解决方案提供商',
    description: '专业的碳足迹评估、碳中和策略制定、碳信用交易等气候解决方案',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'South Pole 碳中和解决方案',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'South Pole - 全球领先的碳中和解决方案提供商',
    description: '专业的碳足迹评估、碳中和策略制定、碳信用交易等气候解决方案',
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  // 结构化数据
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "South Pole",
    "alternateName": "南极碳中和咨询",
    "url": "https://southpole.com",
    "logo": "https://southpole.com/logo.png",
    "description": "全球领先的碳中和解决方案提供商，专业提供碳足迹评估、碳中和策略制定、碳信用交易等气候解决方案",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CN",
      "addressLocality": "北京",
      "addressRegion": "北京市"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+86-400-123-4567",
      "contactType": "customer service",
      "email": "contact@southpole.com"
    },
    "sameAs": [
      "https://www.linkedin.com/company/southpole",
      "https://twitter.com/southpole"
    ],
    "foundingDate": "2006",
    "numberOfEmployees": "500+",
    "industry": "Environmental Consulting",
    "services": [
      "碳足迹评估",
      "碳中和咨询",
      "碳信用交易",
      "可持续发展策略",
      "ESG咨询"
    ]
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "South Pole Official",
    "url": "https://southpole.com",
    "description": "South Pole官方网站，提供专业的碳中和解决方案",
    "inLanguage": "zh-CN",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://southpole.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      
        <div>
          {/* Add padding-top to account for fixed header */}
          <div className="pt-20">
            <Hero />
          </div>
          <Services />
          <CaseStudies />
          <ThemeShowcase />
          
          {/* Test content to verify scroll effects */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-8">Climate Solutions for a Better Tomorrow</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 shadow-soft border border-border">
                  <h3 className="text-xl font-semibold mb-4">Solution {i}</h3>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Additional content for scroll testing */}
          <div className="bg-muted py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-background rounded-lg p-6 shadow-soft">
                    <h3 className="text-lg font-semibold mb-2">Impact Story {i}</h3>
                    <p className="text-muted-foreground">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
