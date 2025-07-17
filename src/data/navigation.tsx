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
  StockOutlined,
  ArrowRightOutlined,
  DropboxOutlined
} from '@ant-design/icons';

// 导航菜单数据配置 - 完全基于 South Pole 官网结构
export const navigationMenuData = {
  aboutUs: {
    sections: [
      {
        id: 'about-us',
        title: 'About us',
        links: [
          {
            label: 'About us',
            href: '/about-us',
            description: 'Learn about South Pole and our mission',
            icon: React.createElement(TeamOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Mission',
            href: '/about-us/mission',
            description: 'Our mission to accelerate climate action',
            icon: React.createElement(AimOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Leadership',
            href: '/about-us/our-leadership-team',
            description: 'Meet our experienced leadership team',
            icon: React.createElement(CrownOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Locations',
            href: '/about-us/south-pole-offices',
            description: 'Our global presence in 30+ countries',
            icon: React.createElement(GlobalOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Our commitment to integrity',
            href: '/about-us/our-commitment-to-integrity',
            description: 'How we drive integrity in carbon markets',
            icon: React.createElement(SafetyOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'what-we-do',
        title: 'What we do',
        links: [
          {
            label: 'What we do',
            href: '/what-we-do',
            description: 'Overview of our climate solutions',
            icon: React.createElement(BulbOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Climate Consulting',
            href: '/what-we-do/climate-consulting',
            description: 'Strategic climate advisory services',
            icon: React.createElement(BarChartOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Environmental Certificates',
            href: '/what-we-do/environmental-certificates',
            description: 'Carbon credits and environmental certificates',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Project Finance',
            href: '/what-we-do/project-finance',
            description: 'Finance decarbonisation at scale',
            icon: React.createElement(FundOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'work-impact',
        title: 'Work & impact',
        links: [
          {
            label: 'Work & impact',
            href: '/work-and-impact',
            description: 'Our impact and client success stories',
            icon: React.createElement(TrophyOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'South Pole at work',
            href: '/work',
            description: 'Client case studies and success stories',
            icon: React.createElement(HeartOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Discover our projects',
            href: '/projects',
            description: 'Explore our climate projects worldwide',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'South Pole\'s 2023 Sustainability Report',
            href: '/publications/south-poles-2023-sustainability-report',
            description: 'Our annual sustainability report',
            icon: React.createElement(FileTextOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'The 2025 South Pole Net Zero Report',
            href: '/publications/south-pole-net-zero-report-2025',
            description: 'Latest insights on net zero transition',
            icon: React.createElement(BookOutlined, { className: "w-5 h-5" })
          }
        ]
      }
    ],
    features: [
      {
        id: 'integrity-commitment',
        title: 'Our commitment to integrity',
        description: 'Discover how South Pole drives integrity in the carbon market with robust risk management, enhanced quality controls, and strict compliance protocols.',
        image: '/images/integrity-commitment.jpg',
        href: '/about-us/our-commitment-to-integrity',
        ctaText: 'Read more',
        badge: 'Featured'
      }
    ]
  },
  
  services: {
    sections: [
      {
        id: 'climate-consulting',
        title: 'Climate Consulting',
        links: [
          {
            label: 'Climate Consulting',
            href: '/what-we-do/climate-consulting',
            description: 'Ready your business for a sustainable future',
            icon: React.createElement(BarChartOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Navigate regulations, measure & report impact & risks',
            href: '/sustainability-solutions/navigate-regulations-measure-report-impact-and-risks',
            description: 'Comprehensive compliance and risk assessment',
            icon: React.createElement(AuditOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Set targets & roadmaps, mitigate risks & build resilience',
            href: '/sustainability-solutions/set-targets-roadmaps-mitigate-risks-build-resilience',
            description: 'Strategic planning for climate resilience',
            icon: React.createElement(AimOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Act on value chain, engage stakeholders',
            href: '/sustainability-solutions/act-on-value-chain-engage-internal-external-stakeholders',
            description: 'Supply chain and stakeholder engagement',
            icon: React.createElement(LinkOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'environmental-certificates',
        title: 'Environmental Certificates',
        links: [
          {
            label: 'Environmental Certificates',
            href: '/what-we-do/environmental-certificates',
            description: 'Find and fund a world of projects',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Understand markets and plan a future-ready portfolio',
            href: '/sustainability-solutions/understand-markets-plan-future-ready-portfolio',
            description: 'Strategic portfolio planning',
            icon: React.createElement(PieChartOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Purchase-ready carbon credits & environmental certificates',
            href: '/sustainability-solutions/purchase-ready-carbon-credits-environmental-certificates',
            description: 'Ready-to-purchase certificates',
            icon: React.createElement(ShoppingCartOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Secure a long-term stream of carbon credits',
            href: '/sustainability-solutions/invest-in-a-long-term-stream-of-carbon-credits',
            description: 'Long-term investment solutions',
            icon: React.createElement(StockOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'project-finance',
        title: 'Project Finance',
        links: [
          {
            label: 'Project Finance',
            href: '/what-we-do/project-finance',
            description: 'Finance decarbonisation at scale',
            icon: React.createElement(FundOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Finance decarbonisation at scale',
            href: '/what-we-do/project-finance',
            description: 'Large-scale decarbonisation financing',
            icon: React.createElement(BuildOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Discover our projects',
            href: '/projects',
            description: 'Explore our climate project portfolio',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" })
          }
        ]
      }
    ],
    features: [
      {
        id: 'carbon-credits',
        title: 'Purchase carbon credits and finance climate action',
        description: 'Explore our portfolio of high-quality carbon credits to support your climate action.',
        image: '/images/carbon-credits-feature.jpg',
        href: '/sustainability-solutions/carbon-credits',
        ctaText: 'Find out more',
        badge: 'Featured'
      }
    ]
  },
  
  workAndImpact: {
    sections: [
      {
        id: 'south-pole-at-work',
        title: 'South Pole at work',
        links: [
          {
            label: 'South Pole at work',
            href: '/work',
            description: 'Client case studies and success stories',
            icon: React.createElement(TrophyOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Driving net zero plastic to nature for Bentley',
            href: '/work/bentley-achieving-net-zero-plastic-to-nature',
            description: 'How Bentley achieved plastic neutrality',
            icon: React.createElement(CarOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Building a net zero roadmap for Nestlé',
            href: '/work/nestle-how-they-built-a-roadmap-to-net-zero',
            description: 'Nestlé\'s journey to net zero',
            icon: React.createElement(AimOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Insuring a greener future with Singlife',
            href: '/work/singlife-insuring-a-greener-future',
            description: 'Sustainable insurance solutions',
            icon: React.createElement(SafetyOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'A roadmap for delivering emission reductions with Sendle',
            href: '/work/sendle-a-roadmap-for-delivering-emission-reductions',
            description: 'Logistics emission reduction strategy',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'View all',
            href: '/work',
            description: 'See all our client success stories',
            icon: React.createElement(ArrowRightOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'who-we-work-with',
        title: 'Who we work with',
        links: [
          {
            label: 'Who we work with',
            href: '/sectors',
            description: 'Industries and sectors we serve',
            icon: React.createElement(TeamOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Aviation and airlines',
            href: '/sectors/sustainable-aviation-solutions',
            description: 'Sustainable aviation solutions',
            icon: React.createElement(CarOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Fashion Industry',
            href: '/sectors/decarbonising-the-fashion-industry',
            description: 'Decarbonising fashion',
            icon: React.createElement(ShopOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Financial Sector',
            href: '/sectors/sustainable-finance-solutions-financial-sector',
            description: 'Sustainable finance solutions',
            icon: React.createElement(BankOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Public Sector',
            href: '/sectors/public-sector',
            description: 'Government and public sector solutions',
            icon: React.createElement(HomeOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Philanthropy Partnerships',
            href: '/sectors/philanthropies',
            description: 'Philanthropic climate initiatives',
            icon: React.createElement(HeartOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'View all',
            href: '/work',
            description: 'See all sectors we work with',
            icon: React.createElement(ArrowRightOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'discover-projects',
        title: 'Discover our projects',
        links: [
          {
            label: 'Discover our projects',
            href: '/projects',
            description: 'Explore our climate project portfolio',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Nature Based Solutions',
            href: '/projects#topic=2&',
            description: 'Forest and ecosystem protection',
            icon: React.createElement(EnvironmentOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Community and Clean Water',
            href: '/projects#topic=3&',
            description: 'Community-based water projects',
            icon: React.createElement(DropboxOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Renewable Energy',
            href: '/projects#topic=5&',
            description: 'Solar, wind and renewable projects',
            icon: React.createElement(ThunderboltOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Waste to Energy',
            href: '/projects#topic=4&',
            description: 'Converting waste to clean energy',
            icon: React.createElement(ReconciliationOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Plastic Solutions',
            href: '/projects#topic=7&',
            description: 'Innovative plastic reduction solutions',
            icon: React.createElement(ReconciliationOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'View all',
            href: '/projects',
            description: 'See all our climate projects',
            icon: React.createElement(ArrowRightOutlined, { className: "w-5 h-5" })
          }
        ]
      }
    ],
    features: [
      {
        id: 'south-pole-net-zero-report',
        title: 'The South Pole Net Zero Report 2025',
        description: 'Download our latest insights on net zero transition trends and strategies.',
        image: '/images/net-zero-report-2025.jpg',
        href: '/publications/south-pole-net-zero-report-2025',
        ctaText: 'Download now',
        badge: 'Latest'
      },
      {
        id: 'sustainability-report',
        title: 'South Pole\'s 2023 Sustainability Report',
        description: 'Learn about our impact and sustainability commitments.',
        image: '/images/sustainability-report-2023.jpg',
        href: '/publications/south-poles-2023-sustainability-report',
        ctaText: 'Download now',
        badge: 'Annual report'
      }
    ]
  },
  
  insights: {
    sections: [
      {
        id: 'news',
        title: 'News',
        links: [
          {
            label: 'News',
            href: '/news',
            description: 'Latest climate and sustainability news',
            icon: React.createElement(SoundOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Latest News',
            href: '/news/listings',
            description: 'Stay updated with recent developments',
            icon: React.createElement(FileTextOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Press releases',
            href: '/news/listings?type=press_release&',
            description: 'Official press releases and announcements',
            icon: React.createElement(SoundOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'events',
        title: 'Events',
        links: [
          {
            label: 'Events',
            href: '/events',
            description: 'Conferences, webinars and climate events',
            icon: React.createElement(CalendarOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Upcoming events',
            href: '/upcoming-events',
            description: 'Join our upcoming events',
            icon: React.createElement(CalendarOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Past events',
            href: '/past-events',
            description: 'Review recordings and materials',
            icon: React.createElement(HistoryOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Behind the Draft: A CEO Dialogue on SBTi\'s Evolving Net Zero Framework',
            href: '/events/sbti-ceo-dialogue',
            description: 'CEO dialogue on SBTi framework',
            icon: React.createElement(TeamOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'penguin-perspectives-blog',
        title: 'Penguin Perspectives Blog',
        links: [
          {
            label: 'Penguin Perspectives Blog',
            href: '/blog',
            description: 'Expert insights and climate industry analysis',
            icon: React.createElement(BulbOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Is your net zero strategy keeping you competitive?',
            href: '/blog/what-financial-institutions-are-signalling-to-businesses-in-2025',
            description: 'Financial institutions and net zero',
            icon: React.createElement(BankOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Carbon markets: A vital tool for emerging economies',
            href: '/blog/carbon-markets-a-tool-for-emerging-economies',
            description: 'Carbon markets in emerging economies',
            icon: React.createElement(GlobalOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'There is no net zero without a high integrity, functioning carbon market',
            href: '/blog/net-zero-and-high-integrity-functioning-carbon-market',
            description: 'Integrity in carbon markets',
            icon: React.createElement(SafetyOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Getting ready for CSRD compliance',
            href: '/blog/csrd-compliance-identify-risks-opportunities-climate-change-your-business',
            description: 'CSRD compliance guidance',
            icon: React.createElement(AuditOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Reducing Scope 2 emissions - the evolving role of Energy Attribute Certificates (EACs) in corporate decarbonisation',
            href: '/blog/scope-2-energy-attribute-certificates-in-corporate-decarbonisation',
            description: 'EACs and Scope 2 emissions',
            icon: React.createElement(ThunderboltOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'View all',
            href: '/blog',
            description: 'See all blog posts',
            icon: React.createElement(ArrowRightOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'latest-downloads',
        title: 'Latest Downloads',
        links: [
          {
            label: 'Latest Downloads',
            href: '/publications',
            description: 'White papers, reports and guides',
            icon: React.createElement(BookOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'The 2025 South Pole Net Zero Report',
            href: '/publications/south-pole-net-zero-report-2025',
            description: 'Latest net zero insights',
            icon: React.createElement(FileTextOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'The 2025 Carbon Market Buyer\'s Guide',
            href: '/publications/2025-carbon-market-buyers-guide',
            description: 'Carbon market trends and guidance',
            icon: React.createElement(BookOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'A Quick Guide to Climate Transition Plans',
            href: '/publications/quickguide-climate-transition-plans',
            description: 'Climate transition planning guide',
            icon: React.createElement(InfoCircleOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'A Quick Guide to the CSRD (Corporate Sustainability Reporting Directive)',
            href: '/publications/quick-guide-to-csrd',
            description: 'CSRD compliance guide',
            icon: React.createElement(FileSearchOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'A Quick Guide to Article 6',
            href: '/publications/quick-guide-to-article-6',
            description: 'Article 6 of the Paris Agreement',
            icon: React.createElement(GlobalOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'View all',
            href: '/publications',
            description: 'See all publications',
            icon: React.createElement(ArrowRightOutlined, { className: "w-5 h-5" })
          }
        ]
      },
      {
        id: 'trending-topics',
        title: 'Trending Topics',
        links: [
          {
            label: 'Trending Topics',
            href: '/blog',
            description: 'Hot topics in climate and sustainability',
            icon: React.createElement(RiseOutlined, { className: "w-5 h-5" }),
            isFeatured: true
          },
          {
            label: 'Article 6: Driving international cooperation and emission reduction',
            href: '/sustainability-solutions/article-6-driving-international-cooperation-emission-reduction',
            description: 'International cooperation mechanisms',
            icon: React.createElement(GlobalOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Compliance and Reporting',
            href: '/sustainability-solutions/compliance-and-reporting',
            description: 'Regulatory compliance solutions',
            icon: React.createElement(AuditOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'Decarbonise your supply chain and reduce scope 3 emissions',
            href: '/sustainability-solutions/decarbonise-supply-chain-reduce-scope-3-emissions',
            description: 'Supply chain decarbonisation',
            icon: React.createElement(LinkOutlined, { className: "w-5 h-5" })
          },
          {
            label: 'View all',
            href: '/blog',
            description: 'See all trending topics',
            icon: React.createElement(ArrowRightOutlined, { className: "w-5 h-5" })
          }
        ]
      }
    ],
    features: [
      {
        id: 'net-zero-report-2025',
        title: 'The South Pole Net Zero Report 2025',
        description: 'Download our latest insights on net zero transition trends and strategies for 2025.',
        image: '/images/net-zero-report-2025.jpg',
        href: '/publications/south-pole-net-zero-report-2025',
        ctaText: 'Download now',
        badge: 'Latest'
      },
      {
        id: 'carbon-market-guide-2025',
        title: 'The 2025 Carbon Market Buyer\'s Guide',
        description: 'Explore key carbon market trends, compliance and integrity updates.',
        image: '/images/carbon-market-guide-2025.jpg',
        href: '/publications/2025-carbon-market-buyers-guide',
        ctaText: 'Read more',
        badge: 'Popular'
      }
    ]
  }
};

export default navigationMenuData;