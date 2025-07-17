// MegaMenu 数据结构类型定义
export interface MegaMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface MegaMenuCard {
  id: string;
  title: string;
  description: string;
  image?: string;
  href: string;
  ctaText: string;
  badge?: string;
}

export interface MegaMenuData {
  menuItems: MegaMenuItem[];
  cards: MegaMenuCard[];
}

// MegaMenu 数据配置
export const megaMenuData: Record<string, MegaMenuData> = {
  'about': {
    menuItems: [
      {
        id: 'about-us',
        label: 'About us',
        href: '/about-us',
      },
      {
        id: 'what-we-do',
        label: 'What we do',
        href: '/what-we-do',
      },
      {
        id: 'work-impact',
        label: 'Work & impact',
        href: '/work-and-impact',
      },
    ],
    cards: [
      {
        id: 'integrity-commitment',
        title: 'Our commitment to integrity',
        description: 'Discover how South Pole drives integrity in the carbon market with robust risk management and quality controls.',
        image: '/images/integrity-commitment.jpg',
        href: '/about-us/integrity-commitment',
        ctaText: 'Read more',
        badge: 'Featured',
      },
      {
        id: 'net-zero-report',
        title: 'The South Pole Net Zero Report 2025',
        description: 'Download our latest insights on net zero transition trends and strategies for 2025.',
        image: '/images/net-zero-report-2025.jpg',
        href: '/reports/net-zero-2025',
        ctaText: 'Download now',
        badge: 'Latest',
      },
    ],
  },
  'what-we-do': {
    menuItems: [
      {
        id: 'climate-consulting',
        label: 'Climate Consulting',
        href: '/what-we-do/climate-consulting',
      },
      {
        id: 'environmental-certificates',
        label: 'Environmental Certificates',
        href: '/what-we-do/environmental-certificates',
      },
      {
        id: 'project-finance',
        label: 'Project Finance',
        href: '/what-we-do/project-finance',
      },
    ],
    cards: [
      {
        id: 'purchase-credits',
        title: 'Purchase carbon credits and finance climate action',
        description: 'Explore our portfolio of high-quality carbon credits to support your climate action.',
        image: '/images/carbon-credits.jpg',
        href: '/carbon-credits',
        ctaText: 'Find out more',
        badge: 'Popular',
      },
      {
        id: 'net-zero-report-2',
        title: 'The South Pole Net Zero Report 2025',
        description: 'Download our latest insights on net zero transition trends and strategies for 2025.',
        image: '/images/net-zero-report-2025.jpg',
        href: '/reports/net-zero-2025',
        ctaText: 'Download now',
        badge: 'Latest',
      },
    ],
  },
  'work-impact': {
    menuItems: [
      {
        id: 'south-pole-at-work',
        label: 'South Pole at work',
        href: '/work',
      },
      {
        id: 'case-studies',
        label: 'Case studies',
        href: '/case-studies',
      },
      {
        id: 'impact-reports',
        label: 'Impact reports',
        href: '/impact-reports',
      },
    ],
    cards: [
      {
        id: 'sustainability-report',
        title: 'South Pole\'s 2023 Sustainability Report',
        description: 'Learn about our impact and sustainability commitments in our comprehensive annual report.',
        image: '/images/sustainability-report-2023.jpg',
        href: '/reports/sustainability-2023',
        ctaText: 'Download now',
        badge: 'Annual report',
      },
      {
        id: 'client-success',
        title: 'Client Success Stories',
        description: 'Discover how we help companies achieve their sustainability goals.',
        image: '/images/client-success.jpg',
        href: '/case-studies',
        ctaText: 'View all',
      },
    ],
  },
  'news': {
    menuItems: [
      {
        id: 'latest-news',
        label: 'Latest news',
        href: '/news',
      },
      {
        id: 'insights',
        label: 'Insights',
        href: '/insights',
      },
      {
        id: 'events',
        label: 'Events',
        href: '/events',
      },
    ],
    cards: [
      {
        id: 'carbon-market-guide',
        title: 'The 2025 Carbon Market Buyer\'s Guide',
        description: 'Explore key carbon market trends, compliance updates, and integrity measures.',
        image: '/images/carbon-market-guide.jpg',
        href: '/guides/carbon-market-2025',
        ctaText: 'Read more',
        badge: 'New',
      },
      {
        id: 'latest-insights',
        title: 'Latest Industry Insights',
        description: 'Stay updated with the latest developments in climate action and sustainability.',
        image: '/images/industry-insights.jpg',
        href: '/insights',
        ctaText: 'View all',
      },
    ],
  },
};

export default megaMenuData;