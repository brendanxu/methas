import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetailPage from './ServiceDetailPage';

// 服务数据类型定义
export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  category: string;
  overview: {
    title: string;
    description: string;
    valuePoints: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  details: {
    content: {
      title: string;
      sections: {
        subtitle: string;
        content: string;
        features?: string[];
      }[];
    };
    process: {
      title: string;
      steps: {
        step: number;
        title: string;
        description: string;
        duration?: string;
      }[];
    };
    cases: {
      title: string;
      description: string;
      caseStudies: {
        client: string;
        industry: string;
        challenge: string;
        solution: string;
        results: string[];
      }[];
    };
    faq: {
      title: string;
      questions: {
        question: string;
        answer: string;
      }[];
    };
  };
  statistics: {
    title: string;
    data: {
      value: string | number;
      label: string;
      suffix?: string;
      prefix?: string;
    }[];
  };
  certifications: {
    name: string;
    logo: string;
    description: string;
  }[];
  relatedCases: string[];
  ctaForm: {
    title: string;
    subtitle: string;
    fields: string[];
  };
}

// 模拟服务数据
const mockServices: Service[] = [
  {
    id: 'carbon-footprint-assessment',
    slug: 'carbon-footprint-assessment',
    name: '碳足迹评估',
    description: '全面的企业碳排放量化评估服务，帮助企业精确掌握碳排放现状，制定科学的减排策略。',
    heroImage: 'https://images.unsplash.com/photo-1497436072909-f5e4be1713b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: '碳足迹评估服务',
    category: '评估服务',
    overview: {
      title: '精准量化，科学减排',
      description: '基于国际标准的碳足迹评估方法，为企业提供全面、准确的碳排放数据分析。',
      valuePoints: [
        {
          icon: 'BarChartOutlined',
          title: '精准量化',
          description: '采用ISO 14064和GHG Protocol国际标准，确保数据的准确性和可比性'
        },
        {
          icon: 'TrophyOutlined',
          title: '专业团队',
          description: '拥有国际认证的碳管理专家，提供专业的技术支持和咨询服务'
        },
        {
          icon: 'RocketOutlined',
          title: '快速交付',
          description: '标准化流程配合AI技术，大幅缩短评估周期，快速交付评估报告'
        },
        {
          icon: 'SafetyOutlined',
          title: '持续支持',
          description: '提供长期的碳管理咨询和技术支持，确保减排目标的实现'
        }
      ]
    },
    details: {
      content: {
        title: '服务内容',
        sections: [
          {
            subtitle: '企业碳足迹评估',
            content: '全面评估企业直接和间接碳排放，包括能源消耗、生产过程、供应链等各个环节的碳排放量化。',
            features: [
              'Scope 1: 直接排放评估',
              'Scope 2: 间接能源排放评估', 
              'Scope 3: 价值链排放评估',
              '产品生命周期碳足迹分析',
              '碳排放热点识别',
              '减排潜力分析'
            ]
          },
          {
            subtitle: '数据收集与验证',
            content: '建立完善的数据收集体系，确保碳排放数据的准确性和完整性。',
            features: [
              '数据收集方法论设计',
              '现场数据核查',
              '第三方数据验证',
              '不确定性分析',
              '质量保证体系'
            ]
          },
          {
            subtitle: '报告与建议',
            content: '提供符合国际标准的碳足迹评估报告，并制定个性化的减排建议。',
            features: [
              '碳足迹评估报告',
              '减排路径规划',
              '成本效益分析',
              '实施时间表',
              '监测体系设计'
            ]
          }
        ]
      },
      process: {
        title: '实施流程',
        steps: [
          {
            step: 1,
            title: '需求调研',
            description: '深入了解企业现状，确定评估范围和边界，制定评估计划。',
            duration: '1-2周'
          },
          {
            step: 2,
            title: '数据收集',
            description: '建立数据收集体系，收集企业各环节的活动数据和排放因子。',
            duration: '2-4周'
          },
          {
            step: 3,
            title: '计算分析',
            description: '运用专业工具和方法，计算企业碳足迹，进行不确定性分析。',
            duration: '1-2周'
          },
          {
            step: 4,
            title: '验证审核',
            description: '第三方独立验证，确保计算结果的准确性和可靠性。',
            duration: '1周'
          },
          {
            step: 5,
            title: '报告交付',
            description: '编制碳足迹评估报告，制定减排建议和实施路径。',
            duration: '1周'
          },
          {
            step: 6,
            title: '持续支持',
            description: '提供后续的技术支持和咨询服务，确保减排目标的实现。',
            duration: '持续'
          }
        ]
      },
      cases: {
        title: '成功案例',
        description: '我们已为众多企业提供专业的碳足迹评估服务，帮助客户实现减排目标。',
        caseStudies: [
          {
            client: '某大型制造企业',
            industry: '制造业',
            challenge: '企业希望了解自身碳排放现状，制定2030年碳中和路径。',
            solution: '采用ISO 14064标准，对企业进行全面碳足迹评估，识别减排热点。',
            results: [
              '完成Scope 1-3全面评估',
              '识别出15个减排机会点',
              '制定了详细的碳中和路径',
              '预计可减排35%的碳排放'
            ]
          },
          {
            client: '跨国零售集团',
            industry: '零售业',
            challenge: '需要评估全球供应链的碳足迹，满足投资者ESG要求。',
            solution: '建立全球化的碳足迹评估体系，涵盖供应链各个环节。',
            results: [
              '覆盖20个国家的供应链',
              '建立了标准化评估流程',
              '获得第三方验证认证',
              '提升了ESG评级'
            ]
          }
        ]
      },
      faq: {
        title: '常见问题',
        questions: [
          {
            question: '碳足迹评估需要多长时间？',
            answer: '根据企业规模和复杂程度，通常需要6-12周完成。我们会在项目开始前提供详细的时间计划。'
          },
          {
            question: '评估结果是否可以用于对外披露？',
            answer: '是的，我们的评估严格按照国际标准进行，结果可用于ESG报告、CDP披露等对外报告。'
          },
          {
            question: '评估费用如何计算？',
            answer: '费用基于企业规模、评估范围和复杂程度确定。我们提供免费的初步咨询和报价服务。'
          },
          {
            question: '是否提供持续的碳管理服务？',
            answer: '是的，我们提供年度碳足迹更新、减排项目实施支持、碳管理体系建设等持续服务。'
          }
        ]
      }
    },
    statistics: {
      title: '服务成果',
      data: [
        { value: 500, label: '服务企业', suffix: '+' },
        { value: '2.5M', label: '减排量', suffix: '吨CO₂' },
        { value: 98, label: '客户满意度', suffix: '%' },
        { value: 15, label: '平均减排潜力', suffix: '%' }
      ]
    },
    certifications: [
      {
        name: 'ISO 14064',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        description: '温室气体量化和验证国际标准'
      },
      {
        name: 'GHG Protocol',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        description: '全球温室气体核算标准'
      },
      {
        name: 'CDP认证',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        description: '全球环境信息披露系统认证'
      }
    ],
    relatedCases: ['case-1', 'case-2', 'case-3'],
    ctaForm: {
      title: '准备开始您的碳足迹评估？',
      subtitle: '立即联系我们，获取专业的碳足迹评估服务',
      fields: ['name', 'company', 'email', 'phone', 'message']
    }
  },
  {
    id: 'carbon-neutrality-consulting',
    slug: 'carbon-neutrality-consulting',
    name: '碳中和咨询',
    description: '为企业制定全面的碳中和策略，提供从目标设定到实施执行的全流程咨询服务。',
    heroImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: '碳中和咨询服务',
    category: '咨询服务',
    overview: {
      title: '全流程碳中和解决方案',
      description: '基于科学减排目标(SBTi)，为企业量身定制碳中和路径和实施方案。',
      valuePoints: [
        {
          icon: 'BulbOutlined',
          title: '科学方法',
          description: '基于SBTi科学减排目标，制定符合1.5°C温控目标的减排路径'
        },
        {
          icon: 'TeamOutlined',
          title: '全程陪伴',
          description: '从策略制定到实施执行，提供全程专业指导和技术支持'
        },
        {
          icon: 'LineChartOutlined',
          title: '持续优化',
          description: '定期评估和调整策略，确保碳中和目标按计划实现'
        },
        {
          icon: 'GlobalOutlined',
          title: '国际标准',
          description: '严格遵循国际碳中和标准和最佳实践'
        }
      ]
    },
    details: {
      content: {
        title: '服务内容',
        sections: [
          {
            subtitle: '碳中和策略制定',
            content: '基于企业现状和发展目标，制定科学的碳中和战略和实施路径。',
            features: [
              '碳中和目标设定',
              '减排路径规划',
              'SBTi目标制定',
              '技术路线图设计',
              '投资计划制定'
            ]
          }
        ]
      },
      process: {
        title: '实施流程',
        steps: [
          {
            step: 1,
            title: '现状评估',
            description: '全面评估企业碳排放现状和减排基础。',
            duration: '2-3周'
          }
        ]
      },
      cases: {
        title: '成功案例',
        description: '成功帮助众多企业制定和实施碳中和策略。',
        caseStudies: []
      },
      faq: {
        title: '常见问题',
        questions: []
      }
    },
    statistics: {
      title: '服务成果',
      data: [
        { value: 200, label: '咨询企业', suffix: '+' },
        { value: 85, label: '成功率', suffix: '%' },
        { value: 12, label: '平均周期', suffix: '个月' },
        { value: 30, label: '减排幅度', suffix: '%' }
      ]
    },
    certifications: [],
    relatedCases: [],
    ctaForm: {
      title: '开始您的碳中和之旅',
      subtitle: '联系我们，制定专属的碳中和策略',
      fields: ['name', 'company', 'email', 'phone', 'message']
    }
  }
];

// 获取相关服务
function getRelatedServices(currentSlug: string, count: number = 3): Service[] {
  return mockServices
    .filter(service => service.slug !== currentSlug)
    .slice(0, count);
}

// 根据 slug 获取服务
async function getServiceBySlug(slug: string): Promise<Service | null> {
  // 模拟 API 调用延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const service = mockServices.find(service => service.slug === slug);
  return service || null;
}

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ service: string }> 
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = await getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: '服务未找到 | South Pole',
      description: '抱歉，您访问的服务页面不存在。'
    };
  }

  return {
    title: `${service.name} | South Pole`,
    description: service.description,
    keywords: [service.name, service.category, '碳中和', '可持续发展', 'South Pole'],
    openGraph: {
      title: service.name,
      description: service.description,
      type: 'website',
      images: [
        {
          url: service.heroImage,
          width: 1200,
          height: 630,
          alt: service.heroImageAlt,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.name,
      description: service.description,
      images: [service.heroImage],
    },
  };
}

// 生成静态参数
export async function generateStaticParams() {
  return mockServices.map((service) => ({
    service: service.slug,
  }));
}

// 页面组件
export default async function ServicePage({ 
  params 
}: { 
  params: Promise<{ service: string }> 
}) {
  const { service: slug } = await params;
  const service = await getServiceBySlug(slug);
  
  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(slug);

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "South Pole",
      "url": "https://southpole.com"
    },
    "serviceType": service.category,
    "areaServed": "Global",
    "url": `https://southpole.com/services/${service.slug}`
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* 服务详情页面组件 */}
      <ServiceDetailPage 
        service={service} 
        relatedServices={relatedServices} 
      />
    </>
  );
}