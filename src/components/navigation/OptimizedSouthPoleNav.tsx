'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';

// ===== 类型定义 =====
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

// ===== 导航数据 =====
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
      { id: 'finance', label: '金融业解决方案', href: '/solutions/finance', description: 'ESG合规与绿色投资组合' }
    ],
    featuredItems: [
      {
        id: 'energy-solution',
        title: '能源行业碳中和',
        description: '助力传统能源企业实现清洁转型',
        href: '/solutions/energy-industry',
        image: '/images/energy-solution-hero.jpg',
        cta: '查看案例'
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
      { id: 'locations', label: '办公地点', href: '/about-us/locations', description: '全球服务网络' }
    ],
    featuredItems: [
      {
        id: 'company-intro',
        title: '关于我们',
        description: '专注于甲烷减排投资的领先碳中和解决方案提供商',
        href: '/about-us',
        image: '/images/about-us-hero.jpg',
        cta: '了解更多'
      }
    ]
  },
];

// ===== 优化的动画配置 =====
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -15,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1] as const,
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as const
    }
  }
};

const dropdownItemVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1] as const
    }
  }
};

interface OptimizedSouthPoleNavProps {
  className?: string;
}

export const OptimizedSouthPoleNav: React.FC<OptimizedSouthPoleNavProps> = ({ 
  className = '' 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // 优化的滚动监听
  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      ticking = false;
    };

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hover处理 - 更流畅的延迟
  const handleMouseEnter = (itemId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // 立即显示，无延迟
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    // 延迟关闭，允许用户移动到下拉菜单
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // 移动端菜单控制
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 阻止背景滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header 
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        className
      )}
    >
      <nav 
        className={cn(
          'bg-white transition-all duration-300',
          isScrolled ? [
            'shadow-lg border-b border-gray-200',
            'backdrop-blur-xl bg-white/90'
          ] : 'border-b border-transparent'
        )}
        style={{ height: '72px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
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
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative"
                  onMouseEnter={() => item.hasDropdown ? handleMouseEnter(item.id) : undefined}
                  onMouseLeave={() => item.hasDropdown ? handleMouseLeave() : undefined}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'text-gray-700 hover:text-gray-900 px-4 py-3 text-sm font-medium',
                      'transition-all duration-200 relative inline-flex items-center rounded-lg',
                      'hover:bg-gray-50',
                      activeDropdown === item.id && 'bg-gray-100 text-gray-900'
                    )}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <motion.svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{
                          rotate: activeDropdown === item.id ? 180 : 0,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: [0.4, 0, 0.2, 1] as const
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    )}
                  </Link>

                  {/* Dropdown Menu with AnimatePresence */}
                  <AnimatePresence>
                    {item.hasDropdown && activeDropdown === item.id && (
                      <motion.div
                        className="absolute top-full left-1/2 mt-2 w-[800px] bg-white rounded-2xl border border-gray-200 overflow-hidden"
                        style={{
                          transform: 'translateX(-50%)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        }}
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {/* Dropdown arrow */}
                        <div 
                          className="absolute -top-[7px] left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-white border-l border-t border-gray-200 rotate-45"
                        />
                        
                        <div className="flex">
                          {/* 左侧链接列表 */}
                          <motion.div 
                            className="w-1/2 p-8 border-r border-gray-100"
                            variants={{
                              visible: {
                                transition: {
                                  staggerChildren: 0.03,
                                  delayChildren: 0.05
                                }
                              }
                            }}
                          >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                              {item.label}
                            </h3>
                            <div className="space-y-1">
                              {item.dropdownItems?.map((dropdownItem) => (
                                <motion.div
                                  key={dropdownItem.id}
                                  variants={dropdownItemVariants}
                                >
                                  <Link
                                    href={dropdownItem.href}
                                    className="block p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                                  >
                                    <div className="font-medium text-gray-900 group-hover:text-blue-600 mb-1 transition-colors">
                                      {dropdownItem.label}
                                    </div>
                                    {dropdownItem.description && (
                                      <div className="text-sm text-gray-500">
                                        {dropdownItem.description}
                                      </div>
                                    )}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                            
                            <Link
                              href={item.href}
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-6 transition-colors group"
                            >
                              查看全部
                              <svg 
                                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </motion.div>
                          
                          {/* 右侧特色内容 */}
                          <motion.div 
                            className="w-1/2 p-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          >
                            <div className="space-y-6">
                              {item.featuredItems?.map((featuredItem) => (
                                <Link
                                  key={featuredItem.id}
                                  href={featuredItem.href}
                                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                                >
                                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                                    <OptimizedImage
                                      src={featuredItem.image}
                                      alt={featuredItem.title}
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-1 transition-colors">
                                      {featuredItem.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                      {featuredItem.description}
                                    </p>
                                    <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700 inline-flex items-center transition-colors">
                                      {featuredItem.cta} →
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Contact CTA Button */}
              <Link
                href="/contact-us"
                className={cn(
                  'bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl',
                  'text-sm font-medium transition-all duration-200',
                  'hover:shadow-lg hover:scale-105',
                  'inline-flex items-center gap-2'
                )}
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
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
            className="lg:hidden bg-white border-b border-gray-200 overflow-hidden"
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
    </header>
  );
};

export default OptimizedSouthPoleNav;