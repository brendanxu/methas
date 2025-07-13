'use client';

import { usePathname } from 'next/navigation';

interface StructuredDataProps {
  type: 'Organization' | 'Article' | 'FAQPage' | 'Service' | 'BreadcrumbList';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const pathname = usePathname();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.southpole.com';
  
  const generateStructuredData = () => {
    const baseContext = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case 'Organization':
        return {
          ...baseContext,
          "@type": "Organization",
          name: "South Pole",
          alternateName: "South Pole Group",
          description: "全球领先的气候解决方案提供商，致力于帮助企业实现碳中和目标",
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
            width: 200,
            height: 60
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "Technoparkstrasse 1",
            addressLocality: "Zurich",
            postalCode: "8005",
            addressCountry: "CH"
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+41-43-501-35-50",
            contactType: "customer service",
            availableLanguage: ["zh", "en"]
          },
          sameAs: [
            "https://www.linkedin.com/company/south-pole-group",
            "https://twitter.com/southpole",
            "https://www.facebook.com/SouthPoleGroup"
          ],
          foundingDate: "2006",
          numberOfEmployees: {
            "@type": "QuantitativeValue",
            value: 500
          },
          industry: "气候解决方案",
          keywords: ["碳中和", "气候变化", "可持续发展", "ESG", "碳抵消", "减排"],
          serviceArea: {
            "@type": "Place",
            name: "全球"
          },
          ...data
        };

      case 'Article':
        return {
          ...baseContext,
          "@type": "Article",
          headline: data.title,
          description: data.description,
          image: data.image ? {
            "@type": "ImageObject",
            url: data.image,
            width: 1200,
            height: 630
          } : undefined,
          author: {
            "@type": "Person",
            name: data.author || "South Pole Team"
          },
          publisher: {
            "@type": "Organization",
            name: "South Pole",
            logo: {
              "@type": "ImageObject",
              url: `${siteUrl}/logo.png`,
              width: 200,
              height: 60
            }
          },
          datePublished: data.publishedTime,
          dateModified: data.modifiedTime || data.publishedTime,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}${pathname}`
          },
          articleSection: "气候解决方案",
          keywords: data.keywords?.join(", ") || "",
          inLanguage: "zh-CN",
          wordCount: data.wordCount,
          copyrightYear: new Date(data.publishedTime).getFullYear(),
          copyrightHolder: {
            "@type": "Organization",
            name: "South Pole"
          }
        };

      case 'Service':
        return {
          ...baseContext,
          "@type": "Service",
          name: data.name,
          description: data.description,
          provider: {
            "@type": "Organization",
            name: "South Pole"
          },
          serviceType: data.serviceType || "气候解决方案",
          areaServed: {
            "@type": "Place",
            name: "全球"
          },
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: `${siteUrl}${pathname}`,
            servicePhone: "+41-43-501-35-50",
            serviceSmsNumber: "+41-43-501-35-50"
          },
          category: "环境服务",
          audience: {
            "@type": "BusinessAudience",
            audienceType: "企业客户"
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "气候解决方案服务",
            itemListElement: data.services?.map((service: any, index: number) => ({
              "@type": "Offer",
              position: index + 1,
              itemOffered: {
                "@type": "Service",
                name: service.name,
                description: service.description
              }
            })) || []
          }
        };

      case 'FAQPage':
        return {
          ...baseContext,
          "@type": "FAQPage",
          mainEntity: data.faqs?.map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          })) || []
        };

      case 'BreadcrumbList':
        return {
          ...baseContext,
          "@type": "BreadcrumbList",
          itemListElement: data.breadcrumbs?.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url ? `${siteUrl}${item.url}` : undefined
          })) || []
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};

// 预定义的结构化数据模板
export const organizationSchema = {
  name: "South Pole",
  description: "全球领先的气候解决方案提供商",
  foundingDate: "2006",
  industry: "气候解决方案"
};

export const serviceSchemas = {
  carbonFootprint: {
    name: "碳足迹测算服务",
    description: "为企业提供全面的碳足迹测算和分析服务",
    serviceType: "环境咨询",
    category: "碳管理"
  },
  carbonOffset: {
    name: "碳抵消解决方案",
    description: "通过高质量的碳抵消项目帮助企业实现碳中和目标",
    serviceType: "碳抵消",
    category: "气候行动"
  },
  sustainability: {
    name: "可持续发展咨询",
    description: "为企业制定全面的可持续发展战略和ESG解决方案",
    serviceType: "战略咨询",
    category: "可持续发展"
  }
};

// 常用FAQ数据
export const commonFAQs = [
  {
    question: "什么是碳中和？",
    answer: "碳中和是指在特定时间内，通过减少温室气体排放和实施碳抵消项目，使净碳排放量为零的状态。"
  },
  {
    question: "企业为什么需要进行碳足迹测算？",
    answer: "碳足迹测算帮助企业了解其温室气体排放情况，识别减排机会，制定科学的减排目标，并满足监管要求和利益相关者期望。"
  },
  {
    question: "South Pole的碳抵消项目有哪些类型？",
    answer: "我们提供多种类型的碳抵消项目，包括可再生能源项目、森林保护和恢复项目、甲烷回收项目、以及社区发展项目等。"
  },
  {
    question: "如何确保碳抵消项目的质量？",
    answer: "所有项目都经过严格的第三方验证，符合国际标准（如VCS、Gold Standard等），确保额外性、可测量性和永久性。"
  }
];