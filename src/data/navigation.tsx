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

// 导航菜单数据配置 - 完全基于 South Pole 官网结构
export const navigationMenuData = {
  aboutUs: {
    sections: [
      {
        id: 'company',
        title: 'Company',
        links: [
          {
            label: 'Who we are',
            href: '/about/who-we-are',
            description: 'Learn about South Pole\'s mission to accelerate the world\'s transition to a climate-positive future',
            icon: React.createElement(TeamOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'What we believe',
            href: '/about/what-we-believe',
            description: 'Our core values and commitment to climate action',
            icon: React.createElement(AimOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Leadership',
            href: '/about/leadership',
            description: 'Meet our experienced leadership team',
            icon: React.createElement(CrownOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Advisory board',
            href: '/about/advisory-board',
            description: 'Our distinguished advisory board members',
            icon: React.createElement(TeamOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'commitments',
        title: 'Our commitments',
        links: [
          {
            label: 'Integrity Commitment',
            href: '/about/integrity-commitment',
            description: 'Our commitment to integrity in carbon markets',
            icon: React.createElement(SafetyOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Justice, Equity, Diversity & Inclusion',
            href: '/about/diversity-inclusion',
            description: 'Our JEDI commitments and initiatives',
            icon: React.createElement(HeartOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Human rights',
            href: '/about/human-rights',
            description: 'Protecting and promoting human rights',
            icon: React.createElement(SafetyOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Anti-corruption',
            href: '/about/anti-corruption',
            description: 'Our anti-corruption policies and practices',
            icon: React.createElement(AuditOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'careers',
        title: 'Careers',
        links: [
          {
            label: 'Working at South Pole',
            href: '/careers',
            description: 'Join our team and make a difference in climate action',
            icon: React.createElement(RocketOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Open positions',
            href: '/careers/positions',
            description: 'Explore current job opportunities',
            icon: React.createElement(FileSearchOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'governance',
        title: 'Governance',
        links: [
          {
            label: 'Board of Directors',
            href: '/about/board-directors',
            description: 'Our board of directors and governance structure',
            icon: React.createElement(BankOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Locations',
            href: '/about/locations',
            description: 'Our global presence across 20+ countries',
            icon: React.createElement(GlobalOutlined, { className: "w-5 h-5" })
          }
        ]
      }
    ],
    features: [
      {
        id: 'integrity-commitment',
        title: 'Integrity Commitment',
        description: 'Learn how we drive integrity in carbon markets through robust risk management, quality controls, and compliance protocols.',
        image: '/images/integrity-commitment.jpg',
        href: '/about/integrity-commitment',
        ctaText: 'Learn more',
        badge: 'Featured'
      }
    ]
  },
  
  services: {
    sections: [
      {
        id: 'climate-solutions',
        title: 'Climate solutions for every organisation',
        links: [
          {
            label: 'Measure',
            href: '/services/measure',
            description: 'Comprehensive GHG accounting and carbon footprint assessments',
            icon: React.createElement(BarChartOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Reduce',
            href: '/services/reduce',
            description: 'Science-based targets and decarbonisation strategies',
            icon: React.createElement(AimOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Contribute',
            href: '/services/contribute',
            description: 'Climate finance and carbon credit solutions',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Report',
            href: '/services/report',
            description: 'Sustainability reporting and ESG disclosure',
            icon: React.createElement(FileTextOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'environmental-commodities',
        title: 'Environmental commodities',
        links: [
          {
            label: 'Carbon credits',
            href: '/services/carbon-credits',
            description: 'High-quality carbon credits from verified projects',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Renewable energy certificates',
            href: '/services/renewable-energy-certificates',
            description: 'RECs and energy attribute certificates',
            icon: React.createElement(ThunderboltOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Biodiversity credits',
            href: '/services/biodiversity-credits',
            description: 'Investing in nature protection and restoration',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Plastic credits',
            href: '/services/plastic-credits',
            description: 'Innovative credits to address plastic pollution',
            icon: React.createElement(ReconciliationOutlined, { className: "w-5 h-5" }),
            isNew: true
          }
        ]
      },
      {
        id: 'project-development',
        title: 'Project development',
        links: [
          {
            label: 'Project development',
            href: '/services/project-development',
            description: 'End-to-end climate project development',
            icon: React.createElement(BuildOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Methodology development',
            href: '/services/methodology-development',
            description: 'Creating new carbon project methodologies',
            icon: React.createElement(ExperimentOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Project verification',
            href: '/services/project-verification',
            description: 'Third-party verification and certification',
            icon: React.createElement(CheckCircleOutlined, { className: "w-5 h-5" })
          }
        ]
      }
    ],
    features: [
      {
        id: 'carbon-credits-marketplace',
        title: 'Purchase carbon credits',
        description: 'Explore our portfolio of high-quality carbon credits to support your climate action.',
        image: '/images/carbon-credits-feature.jpg',
        href: '/marketplace',
        ctaText: 'Visit marketplace',
        badge: 'Popular'
      }
    ]
  },
  
  workAndImpact: {
    sections: [
      {
        id: 'sectors',
        title: 'Sectors',
        links: [
          {
            label: 'Financial services',
            href: '/sectors/financial-services',
            description: 'Climate solutions for financial institutions',
            icon: React.createElement(BankOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Fashion',
            href: '/sectors/fashion',
            description: 'Sustainable solutions for the fashion industry',
            icon: React.createElement(ShopOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Aviation',
            href: '/sectors/aviation',
            description: 'Decarbonisation pathways for aviation',
            icon: React.createElement(CarOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Public sector',
            href: '/sectors/public-sector',
            description: 'Climate action for governments and cities',
            icon: React.createElement(HomeOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'case-studies',
        title: 'Case studies',
        links: [
          {
            label: 'Client stories',
            href: '/work/client-stories',
            description: 'How we help organisations achieve their climate goals',
            icon: React.createElement(TrophyOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Nestlé net-zero roadmap',
            href: '/work/nestle-net-zero',
            description: 'Building a comprehensive net-zero strategy for Nestlé',
            icon: React.createElement(AimOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Bentley plastic-neutral',
            href: '/work/bentley-plastic-neutral',
            description: 'Helping Bentley achieve plastic neutrality',
            icon: React.createElement(CarOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Philips renewable energy',
            href: '/work/philips-renewable',
            description: 'Securing long-term renewable energy for Philips',
            icon: React.createElement(ThunderboltOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'project-portfolio',
        title: 'Project portfolio',
        links: [
          {
            label: 'Nature-based solutions',
            href: '/projects/nature-based-solutions',
            description: 'Forest protection and restoration projects',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Renewable energy',
            href: '/projects/renewable-energy',
            description: 'Solar, wind and other renewable energy projects',
            icon: React.createElement(ThunderboltOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Community projects',
            href: '/projects/community',
            description: 'Projects that benefit local communities',
            icon: React.createElement(TeamOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Technology projects',
            href: '/projects/technology',
            description: 'Innovative technology-based climate projects',
            icon: React.createElement(BulbOutlined, { className: "w-5 h-5" })
          }
        ]
      }
    ],
    features: [
      {
        id: 'impact-report',
        title: 'Impact Report 2023',
        description: 'Learn how we drove climate action and sustainable development in 2023.',
        image: '/images/impact-report-2023.jpg',
        href: '/publications/impact-report-2023',
        ctaText: 'Download report',
        badge: 'Annual review'
      },
      {
        id: 'project-map',
        title: 'Global project map',
        description: 'Explore our climate projects and impact worldwide.',
        image: '/images/global-project-map.jpg',
        href: '/projects/global-map',
        ctaText: 'View map',
        badge: 'Interactive'
      }
    ]
  },
  
  insights: {
    sections: [
      {
        id: 'publications',
        title: 'Publications',
        links: [
          {
            label: 'White papers',
            href: '/publications/white-papers',
            description: 'In-depth analysis on climate-related topics',
            icon: React.createElement(BookOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Reports',
            href: '/publications/reports',
            description: 'Latest climate research and market analysis',
            icon: React.createElement(FileSearchOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Quick guides',
            href: '/publications/guides',
            description: 'Practical guides for climate action',
            icon: React.createElement(InfoCircleOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Carbon market updates',
            href: '/publications/market-updates',
            description: 'Regular updates on carbon market developments',
            icon: React.createElement(StockOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'news',
        title: 'News',
        links: [
          {
            label: 'Latest news',
            href: '/news',
            description: 'Stay updated with our latest climate and sustainability news',
            icon: React.createElement(SoundOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Press releases',
            href: '/news/press-releases',
            description: 'Official press releases and company announcements',
            icon: React.createElement(FileTextOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Media coverage',
            href: '/news/media-coverage',
            description: 'Media coverage and interviews',
            icon: React.createElement(DesktopOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Newsletter',
            href: '/newsletter',
            description: 'Subscribe to our climate insights newsletter',
            icon: React.createElement(SoundOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'events',
        title: 'Events',
        links: [
          {
            label: 'Upcoming events',
            href: '/events/upcoming',
            description: 'Join our upcoming conferences, webinars and events',
            icon: React.createElement(CalendarOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Past events',
            href: '/events/past',
            description: 'Review recordings and materials from past events',
            icon: React.createElement(HistoryOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Webinars',
            href: '/events/webinars',
            description: 'Professional climate-focused webinars',
            icon: React.createElement(DesktopOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'COP meetings',
            href: '/events/cop',
            description: 'Our involvement in UN Climate Change Conferences',
            icon: React.createElement(GlobalOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'blog',
        title: 'Blog',
        links: [
          {
            label: 'Penguin Perspectives',
            href: '/blog',
            description: 'Expert insights and climate industry analysis',
            icon: React.createElement(BulbOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Climate policy',
            href: '/blog/climate-policy',
            description: 'Analysis of climate policies and regulations',
            icon: React.createElement(AuditOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Carbon markets',
            href: '/blog/carbon-markets',
            description: 'Latest developments in carbon markets',
            icon: React.createElement(StockOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Sustainability trends',
            href: '/blog/sustainability-trends',
            description: 'Emerging trends in sustainability',
            icon: React.createElement(RiseOutlined, { className: "w-5 h-5" })
          }
        ]
      }
    ],
    features: [
      {
        id: 'carbon-market-guide',
        title: 'Carbon Market Buyers Guide 2025',
        description: 'Explore key carbon market trends, compliance and integrity updates. Download the 2025 Buyers Guide.',
        image: '/images/carbon-market-guide-2025.jpg',
        href: '/publications/carbon-market-guide-2025',
        ctaText: 'Download now',
        badge: 'Latest release'
      },
      {
        id: 'penguin-perspectives',
        title: 'Penguin Perspectives Blog',
        description: 'Read expert insights and climate industry analysis from our team.',
        image: '/images/penguin-perspectives-blog.jpg',
        href: '/blog',
        ctaText: 'Read blog',
        badge: 'Expert insights'
      }
    ]
  }
};

export default navigationMenuData;