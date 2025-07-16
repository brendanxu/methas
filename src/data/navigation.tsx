import React from 'react';
import { 
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  GlobalOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  BulbOutlined,
  BookOutlined,
  AimOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  ReconciliationOutlined,
  FundOutlined,
  ThunderboltOutlined,
  ShoppingCartOutlined,
  SafetyOutlined,
  PieChartOutlined,
  ToolOutlined,
  HeartOutlined,
  TrophyOutlined,
  BankOutlined,
  CarOutlined,
  ShopOutlined,
  HomeOutlined,
  BuildOutlined,
  HistoryOutlined,
  FileSearchOutlined,
  DatabaseOutlined,
  LinkOutlined,
  SoundOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  RocketOutlined,
  CrownOutlined,
  GiftOutlined,
  AuditOutlined,
  RiseOutlined,
  StockOutlined
} from '@ant-design/icons';

// 导航菜单数据配置
export const navigationMenuData = {
  aboutUs: {
    sections: [
      {
        id: 'company',
        title: '公司概况',
        links: [
          {
            label: '关于我们',
            href: '/about',
            description: '了解 South Pole 的使命和愿景',
            icon: <TeamOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '我们的使命',
            href: '/about/mission',
            description: '推动全球向净零排放世界转型',
            icon: <AimOutlined className="w-5 h-5" />
          },
          {
            label: '领导团队',
            href: '/about/leadership',
            description: '认识我们的专业领导团队',
            icon: <CrownOutlined className="w-5 h-5" />
          },
          {
            label: '全球办公室',
            href: '/about/locations',
            description: '遍布全球20多个国家的办公室',
            icon: <GlobalOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'values',
        title: '企业价值',
        links: [
          {
            label: '诚信承诺',
            href: '/about/integrity',
            description: '我们对碳市场诚信的承诺',
            icon: <SafetyOutlined className="w-5 h-5" />,
            isNew: true
          },
          {
            label: '可持续发展',
            href: '/about/sustainability',
            description: '我们的可持续发展理念和实践',
            icon: <EnvironmentOutlined className="w-5 h-5" />
          },
          {
            label: '创新技术',
            href: '/about/innovation',
            description: '推动气候解决方案的技术创新',
            icon: <BulbOutlined className="w-5 h-5" />
          },
          {
            label: '社会责任',
            href: '/about/responsibility',
            description: '承担企业社会责任',
            icon: <HeartOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'career',
        title: '职业发展',
        links: [
          {
            label: '加入我们',
            href: '/careers',
            description: '在气候解决方案领域开启职业生涯',
            icon: <RocketOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '企业文化',
            href: '/careers/culture',
            description: '了解我们的工作文化和价值观',
            icon: <TeamOutlined className="w-5 h-5" />
          },
          {
            label: '培训发展',
            href: '/careers/development',
            description: '专业技能培训和职业发展机会',
            icon: <TrophyOutlined className="w-5 h-5" />
          },
          {
            label: '员工福利',
            href: '/careers/benefits',
            description: '完善的员工福利和待遇',
            icon: <GiftOutlined className="w-5 h-5" />
          }
        ]
      }
    ],
    features: [
      {
        id: 'integrity-commitment',
        title: '诚信承诺',
        description: '了解我们如何通过严格的风险管理、质量控制和合规协议在碳市场中推动诚信。',
        image: '/images/integrity-commitment.jpg',
        href: '/about/integrity',
        ctaText: '了解更多',
        badge: '重要'
      },
      {
        id: 'sustainability-report',
        title: '2023年可持续发展报告',
        description: '下载我们的年度可持续发展报告，了解我们在气候行动方面的进展。',
        image: '/images/sustainability-report-2023.jpg',
        href: '/publications/sustainability-report-2023',
        ctaText: '立即下载',
        badge: '新发布'
      }
    ]
  },
  
  services: {
    sections: [
      {
        id: 'climate-consulting',
        title: '气候咨询',
        links: [
          {
            label: '碳足迹评估',
            href: '/services/carbon-footprint',
            description: '全面测量和分析您的组织温室气体排放',
            icon: <BarChartOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '净零路线图',
            href: '/services/net-zero-roadmap',
            description: '制定实现净零排放的战略路线图',
            icon: <AimOutlined className="w-5 h-5" />
          },
          {
            label: '可持续发展报告',
            href: '/services/sustainability-reporting',
            description: 'ESG披露的综合报告解决方案',
            icon: <FileTextOutlined className="w-5 h-5" />
          },
          {
            label: '合规性评估',
            href: '/services/compliance',
            description: '帮助您满足气候相关法规要求',
            icon: <AuditOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'environmental-certificates',
        title: '环境证书',
        links: [
          {
            label: '碳信用额度',
            href: '/services/carbon-credits',
            description: '购买和投资高质量的碳信用额度',
            icon: <EnvironmentOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '能源属性证书',
            href: '/services/energy-certificates',
            description: '可再生能源证书和能源属性证书',
            icon: <ThunderboltOutlined className="w-5 h-5" />
          },
          {
            label: '生物多样性证书',
            href: '/services/biodiversity',
            description: '保护和恢复生物多样性的证书',
            icon: <EnvironmentOutlined className="w-5 h-5" />
          },
          {
            label: '塑料信用额度',
            href: '/services/plastic-credits',
            description: '解决塑料污染的创新信用额度',
            icon: <ReconciliationOutlined className="w-5 h-5" />,
            isNew: true
          }
        ]
      },
      {
        id: 'project-finance',
        title: '项目融资',
        links: [
          {
            label: '项目开发',
            href: '/services/project-development',
            description: '从概念到实施的完整项目开发',
            icon: <BuildOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '方法学开发',
            href: '/services/methodology',
            description: '开发和验证新的碳项目方法学',
            icon: <ExperimentOutlined className="w-5 h-5" />
          },
          {
            label: '项目认证',
            href: '/services/certification',
            description: '获得国际认证机构的项目认证',
            icon: <CheckCircleOutlined className="w-5 h-5" />
          },
          {
            label: '市场化运作',
            href: '/services/commercialization',
            description: '将碳信用额度成功推向市场',
            icon: <ShoppingCartOutlined className="w-5 h-5" />
          }
        ]
      }
    ],
    features: [
      {
        id: 'carbon-credits',
        title: '购买碳信用额度',
        description: '探索我们的高质量碳信用额度组合，为您的气候行动提供支持。',
        image: '/images/carbon-credits-feature.jpg',
        href: '/services/carbon-credits',
        ctaText: '了解更多',
        badge: '热门'
      },
      {
        id: 'net-zero-guide',
        title: '2025年净零报告',
        description: '下载我们的最新报告，了解净零转型的最新趋势和洞察。',
        image: '/images/net-zero-report-2025.jpg',
        href: '/publications/net-zero-report-2025',
        ctaText: '立即下载',
        badge: '新发布'
      }
    ]
  },
  
  solutions: {
    sections: [
      {
        id: 'net-zero-strategy',
        title: '净零战略',
        links: [
          {
            label: '净零战略制定',
            href: '/solutions/net-zero-strategy',
            description: '制定全面的净零战略和实施计划',
            icon: <AimOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '科学碳目标',
            href: '/solutions/science-based-targets',
            description: '基于科学的碳减排目标设定',
            icon: <ExperimentOutlined className="w-5 h-5" />
          },
          {
            label: '气候风险评估',
            href: '/solutions/climate-risk',
            description: '识别和评估气候变化相关风险',
            icon: <WarningOutlined className="w-5 h-5" />
          },
          {
            label: '韧性构建',
            href: '/solutions/resilience',
            description: '构建气候变化适应性和韧性',
            icon: <SafetyOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'carbon-management',
        title: '碳管理平台',
        links: [
          {
            label: '碳数据管理',
            href: '/solutions/carbon-data',
            description: '端到端的碳数据管理平台',
            icon: <DatabaseOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '排放监测',
            href: '/solutions/emissions-monitoring',
            description: '实时监测和跟踪碳排放',
            icon: <DesktopOutlined className="w-5 h-5" />
          },
          {
            label: '供应链脱碳',
            href: '/solutions/supply-chain',
            description: '帮助供应链实现脱碳目标',
            icon: <LinkOutlined className="w-5 h-5" />
          },
          {
            label: '碳会计',
            href: '/solutions/carbon-accounting',
            description: '精确的碳会计和报告系统',
            icon: <PieChartOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'renewable-energy',
        title: '可再生能源',
        links: [
          {
            label: '可再生能源转型',
            href: '/solutions/renewable-transition',
            description: '清洁能源转型支持和项目开发',
            icon: <ThunderboltOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '电力购买协议',
            href: '/solutions/power-purchase',
            description: '可再生能源电力购买协议',
            icon: <FundOutlined className="w-5 h-5" />
          },
          {
            label: '绿色电力证书',
            href: '/solutions/green-certificates',
            description: '绿色电力证书和可再生能源证书',
            icon: <CheckCircleOutlined className="w-5 h-5" />
          },
          {
            label: '能源效率',
            href: '/solutions/energy-efficiency',
            description: '提高能源效率和优化能源使用',
            icon: <RiseOutlined className="w-5 h-5" />
          }
        ]
      }
    ],
    features: [
      {
        id: 'digital-solutions',
        title: '数字化气候解决方案',
        description: '利用数字化技术和平台，实现更高效的碳管理和气候行动。',
        image: '/images/digital-climate-solutions.jpg',
        href: '/solutions/digital-climate',
        ctaText: '探索平台',
        badge: '创新'
      },
      {
        id: 'article-6',
        title: 'Article 6 快速指南',
        description: '了解《巴黎协定》第6条如何推动国际合作和减排。',
        image: '/images/article-6-guide.jpg',
        href: '/publications/article-6-guide',
        ctaText: '阅读指南',
        badge: '专家解读'
      }
    ]
  },
  
  impact: {
    sections: [
      {
        id: 'our-work',
        title: '我们的工作',
        links: [
          {
            label: '客户案例',
            href: '/work/case-studies',
            description: '了解我们如何帮助客户实现气候目标',
            icon: <TrophyOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '雀巢净零路线图',
            href: '/work/nestle-net-zero',
            description: '帮助雀巢构建净零排放路线图',
            icon: <AimOutlined className="w-5 h-5" />
          },
          {
            label: '宾利零塑料目标',
            href: '/work/bentley-plastic-neutral',
            description: '推动宾利实现零塑料排放',
            icon: <CarOutlined className="w-5 h-5" />
          },
          {
            label: '飞利浦可再生能源',
            href: '/work/philips-renewable',
            description: '支持飞利浦获得长期可再生能源',
            icon: <ThunderboltOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'sectors',
        title: '行业解决方案',
        links: [
          {
            label: '金融行业',
            href: '/sectors/financial',
            description: '金融行业的可持续发展解决方案',
            icon: <BankOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '时尚产业',
            href: '/sectors/fashion',
            description: '时尚产业的脱碳解决方案',
            icon: <ShopOutlined className="w-5 h-5" />
          },
          {
            label: '航空业',
            href: '/sectors/aviation',
            description: '航空业的可持续发展解决方案',
            icon: <CarOutlined className="w-5 h-5" />
          },
          {
            label: '公共部门',
            href: '/sectors/public',
            description: '政府和公共部门的气候解决方案',
            icon: <HomeOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'projects',
        title: '项目组合',
        links: [
          {
            label: '基于自然的解决方案',
            href: '/projects/nature-based',
            description: '森林保护和恢复项目',
            icon: <EnvironmentOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '可再生能源项目',
            href: '/projects/renewable-energy',
            description: '太阳能、风能等可再生能源项目',
            icon: <ThunderboltOutlined className="w-5 h-5" />
          },
          {
            label: '社区清洁水项目',
            href: '/projects/clean-water',
            description: '为社区提供清洁水资源',
            icon: <EnvironmentOutlined className="w-5 h-5" />
          },
          {
            label: '废物转能源',
            href: '/projects/waste-to-energy',
            description: '将废物转化为清洁能源',
            icon: <ReconciliationOutlined className="w-5 h-5" />
          }
        ]
      }
    ],
    features: [
      {
        id: 'impact-report',
        title: '2023年影响力报告',
        description: '了解我们在2023年如何推动全球气候行动和可持续发展。',
        image: '/images/impact-report-2023.jpg',
        href: '/publications/impact-report-2023',
        ctaText: '下载报告',
        badge: '年度总结'
      },
      {
        id: 'project-map',
        title: '全球项目地图',
        description: '探索我们在全球范围内的气候项目和影响力。',
        image: '/images/global-project-map.jpg',
        href: '/projects/global-map',
        ctaText: '查看地图',
        badge: '互动体验'
      }
    ]
  },
  
  insights: {
    sections: [
      {
        id: 'news',
        title: '新闻动态',
        links: [
          {
            label: '最新新闻',
            href: '/news',
            description: '获取最新的气候和可持续发展新闻',
            icon: <SoundOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '新闻稿',
            href: '/news/press-releases',
            description: '官方新闻稿和公司公告',
            icon: <FileTextOutlined className="w-5 h-5" />
          },
          {
            label: '媒体报道',
            href: '/news/media-coverage',
            description: '媒体对我们的报道和采访',
            icon: <DesktopOutlined className="w-5 h-5" />
          },
          {
            label: '行业动态',
            href: '/news/industry-updates',
            description: '气候行业的最新动态和趋势',
            icon: <StockOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'events',
        title: '活动会议',
        links: [
          {
            label: '即将举办',
            href: '/events/upcoming',
            description: '即将举办的会议、研讨会和活动',
            icon: <CalendarOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '往期活动',
            href: '/events/past',
            description: '回顾我们参与的重要活动',
            icon: <HistoryOutlined className="w-5 h-5" />
          },
          {
            label: '网络研讨会',
            href: '/events/webinars',
            description: '专业的气候主题网络研讨会',
            icon: <DesktopOutlined className="w-5 h-5" />
          },
          {
            label: 'COP会议',
            href: '/events/cop-meetings',
            description: '联合国气候变化大会相关活动',
            icon: <GlobalOutlined className="w-5 h-5" />
          }
        ]
      },
      {
        id: 'resources',
        title: '资源下载',
        links: [
          {
            label: '白皮书',
            href: '/publications/whitepapers',
            description: '深度分析气候相关主题的白皮书',
            icon: <BookOutlined className="w-5 h-5" />,
            isFeatured: true
          },
          {
            label: '研究报告',
            href: '/publications/research',
            description: '最新的气候研究和市场分析',
            icon: <FileSearchOutlined className="w-5 h-5" />
          },
          {
            label: '快速指南',
            href: '/publications/quick-guides',
            description: '简明易懂的气候行动指南',
            icon: <InfoCircleOutlined className="w-5 h-5" />
          },
          {
            label: '工具模板',
            href: '/resources/tools',
            description: '实用的碳管理工具和模板',
            icon: <ToolOutlined className="w-5 h-5" />
          }
        ]
      }
    ],
    features: [
      {
        id: 'carbon-market-guide',
        title: '2025年碳市场买家指南',
        description: '探索关键的碳市场趋势、合规性和诚信更新。下载2025年买家指南。',
        image: '/images/carbon-market-guide-2025.jpg',
        href: '/publications/carbon-market-guide-2025',
        ctaText: '立即下载',
        badge: '最新发布'
      },
      {
        id: 'blog',
        title: '企鹅视角博客',
        description: '阅读我们专家团队的深度见解和气候行业分析。',
        image: '/images/penguin-perspectives-blog.jpg',
        href: '/blog',
        ctaText: '阅读博客',
        badge: '专家观点'
      }
    ]
  }
};

export default navigationMenuData;