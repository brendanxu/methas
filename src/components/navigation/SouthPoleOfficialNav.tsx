'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/modern-animations';

interface NavItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

interface DropdownItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

interface SouthPoleOfficialNavProps {
  className?: string;
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
      { id: 'green-supply-chain', label: '绿色供应链', href: '/service-types/green-supply-chain', description: '供应商碳管理、产品碳足迹、绿色采购体系' }
    ]
  },
  { 
    id: 'solutions', 
    label: '解决方案', 
    href: '/solutions',
    hasDropdown: true,
    dropdownItems: [
      { id: 'solution-overview', label: '方案概览', href: '/solutions/overview', description: '按行业分类的解决方案' },
      { id: 'energy-industry', label: '能源行业解决方案', href: '/solutions/energy-industry', description: '传统能源向清洁能源转型' },
      { id: 'manufacturing', label: '制造业解决方案', href: '/solutions/manufacturing', description: '智能制造与碳减排' },
      { id: 'retail', label: '零售业解决方案', href: '/solutions/retail', description: '供应链碳中和计划' },
      { id: 'finance', label: '金融业解决方案', href: '/solutions/finance', description: 'ESG合规与绿色投资组合' },
      { id: 'implementation-results', label: '实施成果', href: '/solutions/results', description: '客户成功案例与关键数据展示' }
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
      { id: 'technology-frontier', label: '技术前沿', href: '/carbon-intelligence/technology-frontier', description: '碳管理技术、创新解决方案、甲烷减排技术' },
      { id: 'carbon-intelligence-reports', label: '碳智报告', href: '/carbon-intelligence/reports', description: '研究报告与白皮书下载' }
    ]
  },
  { 
    id: 'about', 
    label: '关于我们', 
    href: '/about-us',
    hasDropdown: true,
    dropdownItems: [
      { id: 'company-introduction', label: '公司介绍', href: '/about-us', description: '专注双碳目标的科技公司' },
      { id: 'mission-vision', label: '使命愿景', href: '/about-us/mission', description: '推动碳中和事业发展' },
      { id: 'team', label: '团队介绍', href: '/about-us/team', description: '专业的碳管理专家团队' },
      { id: 'partners', label: '合作伙伴', href: '/about-us/partners', description: '全球合作伙伴网络' },
      { id: 'contact', label: '联系我们', href: '/contact-us', description: '与我们取得联系' }
    ]
  },
];

export const SouthPoleOfficialNav: React.FC<SouthPoleOfficialNavProps> = ({ 
  className = '' 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const scrollAnimationRef = useRef<number>();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollY = useRef(0);

  // 滚动监听 - 使用 requestAnimationFrame 优化性能
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 防抖：只有滚动距离变化超过阈值才更新
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current);
        }
        
        scrollAnimationRef.current = requestAnimationFrame(() => {
          const shouldBeScrolled = currentScrollY > 50;
          if (shouldBeScrolled !== isScrolled) {
            setIsScrolled(shouldBeScrolled);
          }
          lastScrollY.current = currentScrollY;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [isScrolled]);

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

  // 下拉菜单悬停处理 - 优化延迟和状态管理
  const handleDropdownEnter = (itemId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = undefined;
    }
    setActiveDropdown(itemId);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 增加延迟到200ms，减少闪烁
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = undefined;
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
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
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)', // 更流畅的过渡
          height: '72px',
          willChange: 'box-shadow, border-bottom', // 优化重绘
          transform: 'translate3d(0, 0, 0)' // 硬件加速
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
              <div 
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0"
              >
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
              <span className="text-xl font-medium text-gray-900">
                South Pole
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleDropdownEnter(item.id)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors relative ${
                      activeDropdown === item.id ? 'text-gray-900' : ''
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <svg
                        className={`ml-1 inline w-4 h-4 transition-transform ${
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

                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ 
                            duration: 0.3, 
                            ease: [0.23, 1, 0.32, 1], // 更流畅的贝塞尔曲线
                            scale: { duration: 0.2 }
                          }}
                          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200"
                          style={{ 
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transform: 'translate3d(0, 0, 0)' // 硬件加速
                          }}
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="p-4">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.id}
                                href={dropdownItem.href}
                                className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="font-medium text-gray-900 mb-1">
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}

              {/* Contact CTA Button */}
              <Link
                href="/contact-us"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ 
              duration: 0.4, 
              ease: [0.23, 1, 0.32, 1], // 更流畅的贝塞尔曲线
              x: { type: 'spring', stiffness: 300, damping: 30 }
            }}
            className="fixed inset-0 z-40 bg-white"
            style={{ 
              paddingTop: '72px',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)' // 硬件加速
            }}
          >
            <div className="p-4 overflow-y-auto h-full">
              {/* Mobile Menu Items */}
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4">
                    <Link
                      href={item.href}
                      onClick={toggleMobileMenu}
                      className="block text-xl font-medium text-gray-900 mb-3"
                    >
                      {item.label}
                    </Link>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="pl-4 space-y-2">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.id}
                            href={dropdownItem.href}
                            onClick={toggleMobileMenu}
                            className="block text-gray-600 hover:text-gray-900 py-1"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Contact CTA */}
              <div className="mt-8">
                <Link
                  href="/contact-us"
                  onClick={toggleMobileMenu}
                  className="block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
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

export default SouthPoleOfficialNav;