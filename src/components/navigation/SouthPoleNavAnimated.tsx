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

// SouthPole风格动画配置
const dropdownAnimations = {
  initial: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.23, 1, 0.32, 1],
    }
  }
};

const dropdownItemAnimations = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
      duration: 0.3,
    }
  }
};

const featuredItemAnimations = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
      duration: 0.4,
    }
  }
};

interface SouthPoleNavAnimatedProps {
  className?: string;
}

export const SouthPoleNavAnimated: React.FC<SouthPoleNavAnimatedProps> = ({ 
  className = '' 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // 滚动监听 - 带平滑过渡
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 高级hover处理 - SouthPole风格
  const handleMouseEnter = (itemId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setHoveredItem(itemId);
    
    // 延迟显示下拉菜单，创造更流畅的体验
    const showTimeout = setTimeout(() => {
      setActiveDropdown(itemId);
    }, 150);
    
    return () => clearTimeout(showTimeout);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleDropdownMouseEnter = (itemId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(itemId);
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // 移动端菜单控制
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 移动端菜单背景滚动锁定
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

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.6,
        }}
      >
        <motion.nav 
          className="bg-white transition-all duration-500 ease-out"
          animate={{
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 1)',
            backdropFilter: isScrolled ? 'blur(20px)' : 'none',
            borderBottomColor: isScrolled ? 'rgba(229, 231, 235, 1)' : 'transparent',
            boxShadow: isScrolled 
              ? '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
              : '0 0 0 0 rgba(0, 0, 0, 0)',
          }}
          style={{ 
            height: '72px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full">
              {/* Logo with animation */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
              >
                <Link 
                  href="/"
                  className="flex items-center gap-3 transition-opacity duration-300"
                  aria-label="South Pole - The Climate Company"
                >
                  {/* Animated Logo Icon */}
                  <motion.div 
                    className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      backgroundColor: '#059669',
                    }}
                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                  >
                    <motion.svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white"
                      whileHover={{ rotate: -5 }}
                      transition={{ type: "spring", damping: 25, stiffness: 400 }}
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
                    </motion.svg>
                  </motion.div>
                  
                  {/* Logo Text */}
                  <span className="text-xl font-semibold text-gray-900">
                    South Pole
                  </span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={() => item.hasDropdown ? handleMouseEnter(item.id) : undefined}
                    onMouseLeave={() => item.hasDropdown ? handleMouseLeave() : undefined}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                      delay: index * 0.1,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", damping: 25, stiffness: 400 }}
                    >
                      <Link
                        href={item.href}
                        className={`text-gray-700 hover:text-gray-900 px-4 py-3 text-sm font-medium transition-all duration-300 relative inline-flex items-center rounded-lg ${
                          hoveredItem === item.id ? 'bg-gray-50 text-gray-900' : ''
                        } ${
                          activeDropdown === item.id ? 'bg-gray-100 text-gray-900' : ''
                        }`}
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
                              type: "spring",
                              damping: 25,
                              stiffness: 400,
                              duration: 0.3,
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        )}
                        
                        {/* Hover underline effect */}
                        <motion.div
                          className="absolute bottom-0 left-1/2 h-0.5 bg-green-600"
                          initial={{ width: 0, x: '-50%' }}
                          animate={{
                            width: hoveredItem === item.id ? '80%' : 0,
                          }}
                          transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 400,
                            duration: 0.3,
                          }}
                        />
                      </Link>
                    </motion.div>

                    {/* Enhanced Dropdown Menu */}
                    <AnimatePresence>
                      {item.hasDropdown && activeDropdown === item.id && (
                        <motion.div
                          ref={(el) => { dropdownRefs.current[item.id] = el; }}
                          className="absolute top-full left-1/2 mt-3 w-[800px] bg-white rounded-2xl border border-gray-200"
                          style={{
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          }}
                          onMouseEnter={() => handleDropdownMouseEnter(item.id)}
                          onMouseLeave={handleDropdownMouseLeave}
                          variants={dropdownAnimations}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {/* Dropdown arrow */}
                          <div 
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"
                          />
                          
                          <div className="flex overflow-hidden rounded-2xl">
                            {/* 左侧链接列表 */}
                            <motion.div 
                              className="w-1/2 p-8 border-r border-gray-100"
                              variants={dropdownItemAnimations}
                            >
                              <motion.h3 
                                className="text-lg font-semibold text-gray-900 mb-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                {item.label}
                              </motion.h3>
                              <motion.div 
                                className="space-y-2"
                                variants={{
                                  animate: {
                                    transition: {
                                      staggerChildren: 0.05,
                                      delayChildren: 0.15,
                                    }
                                  }
                                }}
                                initial="initial"
                                animate="animate"
                              >
                                {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                                  <motion.div
                                    key={dropdownItem.id}
                                    variants={dropdownItemAnimations}
                                  >
                                    <motion.div
                                      whileHover={{ 
                                        x: 4,
                                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                      }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                    >
                                      <Link
                                        href={dropdownItem.href}
                                        className="block p-4 rounded-xl transition-colors group"
                                      >
                                        <div className="font-medium text-gray-900 group-hover:text-blue-600 mb-1 transition-colors">
                                          {dropdownItem.label}
                                        </div>
                                        {dropdownItem.description && (
                                          <div className="text-sm text-gray-500 transition-colors">
                                            {dropdownItem.description}
                                          </div>
                                        )}
                                      </Link>
                                    </motion.div>
                                  </motion.div>
                                ))}
                              </motion.div>
                              
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <motion.div
                                  whileHover={{ x: 4 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                >
                                  <Link
                                    href={item.href}
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-6 transition-colors"
                                  >
                                    查看全部
                                    <motion.svg 
                                      className="ml-2 w-4 h-4" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                      whileHover={{ x: 2 }}
                                      transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                  </Link>
                                </motion.div>
                              </motion.div>
                            </motion.div>
                            
                            {/* 右侧特色内容 */}
                            <motion.div 
                              className="w-1/2 p-8"
                              variants={featuredItemAnimations}
                            >
                              <motion.div 
                                className="space-y-6"
                                variants={{
                                  animate: {
                                    transition: {
                                      staggerChildren: 0.1,
                                      delayChildren: 0.2,
                                    }
                                  }
                                }}
                                initial="initial"
                                animate="animate"
                              >
                                {item.featuredItems?.map((featuredItem) => (
                                  <motion.div
                                    key={featuredItem.id}
                                    variants={featuredItemAnimations}
                                  >
                                    <motion.div
                                      whileHover={{ 
                                        scale: 1.02,
                                        y: -2,
                                        backgroundColor: 'rgba(249, 250, 251, 0.8)',
                                      }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                    >
                                      <Link
                                        href={featuredItem.href}
                                        className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 group"
                                      >
                                        <motion.div 
                                          className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden"
                                          whileHover={{ scale: 1.05 }}
                                          transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                        >
                                          <OptimizedImage
                                            src={featuredItem.image}
                                            alt={featuredItem.title}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                          />
                                        </motion.div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-1 transition-colors">
                                            {featuredItem.title}
                                          </h4>
                                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                            {featuredItem.description}
                                          </p>
                                          <motion.span 
                                            className="text-sm text-blue-600 font-medium group-hover:text-blue-700 inline-flex items-center transition-colors"
                                            whileHover={{ x: 2 }}
                                            transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                          >
                                            {featuredItem.cta} →
                                          </motion.span>
                                        </div>
                                      </Link>
                                    </motion.div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                {/* Enhanced Contact CTA Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    delay: navItems.length * 0.1,
                  }}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 10px 25px -3px rgba(34, 197, 94, 0.3)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                  >
                    <Link
                      href="/contact-us"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 inline-flex items-center gap-2 shadow-lg"
                    >
                      联系我们
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                      >
                        <path d="M9 5l7 7-7 7"/>
                      </motion.svg>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
              >
                <motion.svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{
                    rotate: isMobileMenuOpen ? 90 : 0,
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4,
              }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200"
              style={{ zIndex: 9998 }}
            >
              <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div 
                  className="space-y-6"
                  variants={{
                    animate: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1,
                      }
                    }
                  }}
                  initial="initial"
                  animate="animate"
                >
                  {navItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      variants={{
                        initial: { opacity: 0, x: -20 },
                        animate: { opacity: 1, x: 0 }
                      }}
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                      >
                        <Link
                          href={item.href}
                          className="block text-gray-700 hover:text-gray-900 py-3 text-lg font-medium rounded-lg px-4 hover:bg-gray-50 transition-all"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                      {item.hasDropdown && item.dropdownItems && (
                        <motion.div 
                          className="ml-6 mt-3 space-y-2"
                          variants={{
                            animate: {
                              transition: {
                                staggerChildren: 0.03,
                              }
                            }
                          }}
                        >
                          {item.dropdownItems.map((dropdownItem) => (
                            <motion.div
                              key={dropdownItem.id}
                              variants={{
                                initial: { opacity: 0, x: -10 },
                                animate: { opacity: 1, x: 0 }
                              }}
                            >
                              <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                              >
                                <Link
                                  href={dropdownItem.href}
                                  className="block text-gray-600 hover:text-gray-800 py-2 text-base rounded-lg px-4 hover:bg-gray-50 transition-all"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {dropdownItem.label}
                                </Link>
                              </motion.div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", damping: 25, stiffness: 400 }}
                    >
                      <Link
                        href="/contact-us"
                        className="block bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl text-center font-medium mt-8 transition-all shadow-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        联系我们
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default SouthPoleNavAnimated;