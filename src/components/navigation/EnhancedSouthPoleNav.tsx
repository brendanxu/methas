'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/modern-animations';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface NavItem {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  featuredItems?: FeaturedItem[];
}

interface DropdownItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  cta: string;
}

const navItems: NavItem[] = [
  { 
    id: 'home', 
    label: '首页', 
    href: '/',
    hasDropdown: false
  },
  { 
    id: 'service-types', 
    label: '服务类型', 
    href: '/service-types',
    hasDropdown: true,
    dropdownItems: [
      { id: 'carbon-asset-management', label: '碳资产管理', href: '/service-types/carbon-asset-management', description: '碳足迹核算、碳资产开发、碳交易管理' },
      { id: 'methane-removal-investment', label: '甲烷清除投资', href: '/service-types/methane-removal-investment', description: '减排效果是CO₂的25-84倍' },
      { id: 'esg-carbon-consulting', label: 'ESG与碳咨询', href: '/service-types/esg-carbon-consulting', description: '双碳战略规划、ESG报告编制、可持续发展咨询' },
      { id: 'green-supply-chain', label: '绿色供应链', href: '/service-types/green-supply-chain', description: '供应链碳管理、产品碳足迹、绿色采购体系' }
    ],
    featuredItems: [
      {
        id: 'methane-focus',
        title: '甲烷清除投资解决方案',
        description: '减排效果是CO₂的25-84倍，我们的核心差异化服务',
        href: '/service-types/methane-removal-investment',
        image: '/images/methane-removal-hero.jpg',
        cta: '了解更多'
      },
      {
        id: 'carbon-management',
        title: '碳资产管理',
        description: '全链条碳资产开发与管理服务',
        href: '/service-types/carbon-asset-management',
        image: '/images/carbon-management-hero.jpg',
        cta: '查看详情'
      },
      {
        id: 'esg-consulting',
        title: 'ESG咨询服务',
        description: '专业的ESG战略规划与实施',
        href: '/service-types/esg-carbon-consulting',
        image: '/images/esg-consulting-hero.jpg',
        cta: '获取方案'
      }
    ]
  },
  { 
    id: 'solutions', 
    label: '解决方案', 
    href: '/solutions',
    hasDropdown: true,
    dropdownItems: [
      { id: 'energy-industry', label: '能源行业解决方案', href: '/solutions/energy-industry', description: '传统能源向清洁能源转型' },
      { id: 'manufacturing', label: '制造业解决方案', href: '/solutions/manufacturing', description: '智能制造与碳减排' },
      { id: 'retail', label: '零售业解决方案', href: '/solutions/retail', description: '供应链碳中和计划' },
      { id: 'finance', label: '金融业解决方案', href: '/solutions/finance', description: 'ESG合规与绿色投资组合' },
      { id: 'results', label: '实施成果', href: '/solutions/results', description: '客户成功案例与关键数据展示' }
    ],
    featuredItems: [
      {
        id: 'energy-solution',
        title: '能源行业碳中和',
        description: '助力传统能源企业实现清洁转型',
        href: '/solutions/energy-industry',
        image: '/images/energy-solution-hero.jpg',
        cta: '查看案例'
      },
      {
        id: 'manufacturing-solution',
        title: '制造业智能减排',
        description: '智能制造与碳减排一体化解决方案',
        href: '/solutions/manufacturing',
        image: '/images/manufacturing-solution-hero.jpg',
        cta: '了解详情'
      },
      {
        id: 'results-showcase',
        title: '成功案例展示',
        description: '查看我们为客户创造的价值',
        href: '/solutions/results',
        image: '/images/results-showcase-hero.jpg',
        cta: '查看成果'
      }
    ]
  },
  { 
    id: 'carbon-intelligence', 
    label: '碳智观察', 
    href: '/carbon-intelligence',
    hasDropdown: true,
    dropdownItems: [
      { id: 'enterprise-practice', label: '企业实践', href: '/carbon-intelligence/enterprise-practice', description: '各行业碳管理实践案例' },
      { id: 'industry-insights', label: '行业洞察', href: '/carbon-intelligence/industry-insights', description: '政策解读、市场分析、趋势预测' },
      { id: 'technology-frontier', label: '技术前沿', href: '/carbon-intelligence/technology-frontier', description: '碳管理技术、创新解决方案' },
      { id: 'reports', label: '碳智报告', href: '/carbon-intelligence/reports', description: '研究报告与白皮书下载' }
    ],
    featuredItems: [
      {
        id: 'latest-insights',
        title: '最新行业洞察',
        description: '2024年碳市场发展趋势分析',
        href: '/carbon-intelligence/industry-insights',
        image: '/images/industry-insights-hero.jpg',
        cta: '阅读更多'
      },
      {
        id: 'technology-report',
        title: '甲烷减排技术报告',
        description: '最新甲烷检测与减排技术白皮书',
        href: '/carbon-intelligence/reports',
        image: '/images/methane-tech-report.jpg',
        cta: '免费下载'
      },
      {
        id: 'enterprise-cases',
        title: '企业实践案例',
        description: '制造业巨头的碳中和之路',
        href: '/carbon-intelligence/enterprise-practice',
        image: '/images/enterprise-practice-hero.jpg',
        cta: '查看案例'
      }
    ]
  },
  { 
    id: 'about', 
    label: '关于我们', 
    href: '/about-us',
    hasDropdown: true,
    dropdownItems: [
      { id: 'company', label: '公司介绍', href: '/about-us', description: '专注双碳目标的科技公司' },
      { id: 'mission', label: '使命愿景', href: '/about-us/mission', description: '推动碳中和事业发展' },
      { id: 'leadership', label: '团队领导', href: '/about-us/leadership', description: '专业的碳管理专家团队' },
      { id: 'locations', label: '办公地点', href: '/about-us/locations', description: '全球服务网络' },
      { id: 'integrity', label: '诚信承诺', href: '/about-us/integrity', description: '我们的价值观与承诺' }
    ],
    featuredItems: [
      {
        id: 'company-intro',
        title: '关于我们',
        description: '专注于甲烷减排投资的领先碳中和解决方案提供商',
        href: '/about-us',
        image: '/images/about-us-hero.jpg',
        cta: '了解更多'
      },
      {
        id: 'team-expertise',
        title: '专业团队',
        description: '汇聚全球顶尖的碳管理与甲烷减排专家',
        href: '/about-us/leadership',
        image: '/images/team-hero.jpg',
        cta: '认识团队'
      },
      {
        id: 'integrity-commitment',
        title: '诚信承诺',
        description: '我们致力于高质量、高标准的碳管理服务',
        href: '/about-us/integrity',
        image: '/images/integrity-hero.jpg',
        cta: '查看承诺'
      }
    ]
  },
];

interface EnhancedSouthPoleNavProps {
  className?: string;
}

export const EnhancedSouthPoleNav: React.FC<EnhancedSouthPoleNavProps> = ({ 
  className = '' 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 移动端菜单控制
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 阻止移动端菜单时的背景滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // 下拉菜单悬停处理 - 修复悬停bug
  const handleNavItemEnter = (itemId: string) => {
    // 清除所有现有的超时
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = undefined;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = undefined;
    }
    
    setActiveDropdown(itemId);
  };

  const handleNavItemLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isDropdownHovered) {
        setActiveDropdown(null);
      }
    }, 150);
  };

  const handleDropdownEnter = () => {
    setIsDropdownHovered(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = undefined;
    }
  };

  const handleDropdownLeave = () => {
    setIsDropdownHovered(false);
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
        style={{
          backgroundColor: 'white',
          borderBottom: isScrolled ? '1px solid #e5e7eb' : '1px solid transparent',
          boxShadow: isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'all 0.3s ease',
          height: '72px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link 
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              aria-label="South Pole - The Climate Company"
            >
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    fill="currentColor"
                  />
                  <circle cx="12" cy="16" r="2" fill="currentColor" />
                  <path
                    d="M12 2v8M2 12h20"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                </svg>
              </div>
              
              {/* Logo Text */}
              <span className="text-xl font-semibold text-gray-900">
                South Pole
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleNavItemEnter(item.id)}
                  onMouseLeave={() => item.hasDropdown && handleNavItemLeave()}
                >
                  <Link
                    href={item.href}
                    className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors relative inline-flex items-center ${
                      activeDropdown === item.id ? 'text-gray-900' : ''
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* 复刻southpole.com的下拉菜单设计 */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[800px] bg-white rounded-lg shadow-xl border border-gray-200"
                          onMouseEnter={handleDropdownEnter}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="flex">
                            {/* 左侧链接列表 */}
                            <div className="w-1/2 p-6 border-r border-gray-100">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {item.label}
                              </h3>
                              <div className="space-y-1">
                                {item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.id}
                                    href={dropdownItem.href}
                                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                  >
                                    <div className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                                      {dropdownItem.label}
                                    </div>
                                    {dropdownItem.description && (
                                      <div className="text-sm text-gray-500">
                                        {dropdownItem.description}
                                      </div>
                                    )}
                                  </Link>
                                ))}
                              </div>
                              <Link
                                href={item.href}
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4"
                              >
                                查看全部
                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                            
                            {/* 右侧特色内容 */}
                            <div className="w-1/2 p-6">
                              <div className="space-y-4">
                                {item.featuredItems?.map((featuredItem) => (
                                  <Link
                                    key={featuredItem.id}
                                    href={featuredItem.href}
                                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                  >
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                      <OptimizedImage
                                        src={featuredItem.image}
                                        alt={featuredItem.title}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1 line-clamp-1">
                                        {featuredItem.title}
                                      </h4>
                                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                        {featuredItem.description}
                                      </p>
                                      <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                                        {featuredItem.cta} →
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}

              {/* Contact CTA Button */}
              <Link
                href="/contact-us"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                联系我们
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white border-b border-gray-200 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <Link
                      href={item.href}
                      className="block text-gray-700 hover:text-gray-900 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.id}
                            href={dropdownItem.href}
                            className="block text-gray-600 hover:text-gray-800 py-1 text-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href="/contact-us"
                  className="block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center font-medium mt-6"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  联系我们
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedSouthPoleNav;