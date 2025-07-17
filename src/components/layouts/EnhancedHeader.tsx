'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/modern-animations';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalSearch } from '@/components/layout/GlobalSearch';
import { LanguageSwitcherFull } from '@/components/ui/LanguageSwitcher';
import UnifiedButton from '@/components/ui/UnifiedButton';
import { MegaMenu } from './MegaMenu';
import { navigationMenuData } from '@/data/navigation';
import { cn } from '@/lib/utils';

// South Pole 品牌颜色配置
const SOUTH_POLE_COLORS = {
  primary: '#002145',
  secondary: '#00875A',
  text: {
    light: '#FFFFFF',
    dark: '#374151'
  },
  background: {
    transparent: 'rgba(255, 255, 255, 0)',
    solid: 'rgba(255, 255, 255, 0.95)'
  }
};

// 对比度感知的颜色工具
const getAccessibleTextColor = (isScrolled: boolean) => {
  return isScrolled ? SOUTH_POLE_COLORS.text.dark : SOUTH_POLE_COLORS.text.light;
};

// 对比度感知的次要文字颜色
const getAccessibleMutedColor = (isScrolled: boolean) => {
  return isScrolled ? 'rgba(55, 65, 81, 0.7)' : 'rgba(255, 255, 255, 0.85)';
};

// 主导航项配置 - 完全按照 South Pole 网站结构
interface NavItem {
  id: string;
  label: string;
  href?: string;
  hasSubmenu?: boolean;
  submenuKey?: keyof typeof navigationMenuData;
}

const mainNavItems: NavItem[] = [
  {
    id: 'about',
    label: 'About us',
    hasSubmenu: true,
    submenuKey: 'aboutUs'
  },
  {
    id: 'services',
    label: 'What we do',
    hasSubmenu: true,
    submenuKey: 'services'
  },
  {
    id: 'work',
    label: 'Our work & impact',
    hasSubmenu: true,
    submenuKey: 'workAndImpact'
  },
  {
    id: 'insights',
    label: 'News & insights',
    hasSubmenu: true,
    submenuKey: 'insights'
  }
];

// 智能悬停检测Hook
const useSmartHover = (onOpen: () => void, onClose: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isHovering = useRef(false);
  const elementRef = useRef<HTMLElement>();
  
  const handleMouseEnter = () => {
    isHovering.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onOpen();
  };
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    isHovering.current = false;
    
    // 检查鼠标是否真的离开了元素区域
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const { clientX, clientY } = e;
    
    // 如果鼠标在元素边界内，不关闭菜单
    const inBounds = clientX >= rect.left && clientX <= rect.right && 
                    clientY >= rect.top && clientY <= rect.bottom + 20; // 增加20px的容错区域
    
    if (!inBounds) {
      timeoutRef.current = setTimeout(() => {
        if (!isHovering.current) {
          onClose();
        }
      }, 300); // 增加延迟时间
    }
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return { handleMouseEnter, handleMouseLeave };
};

interface EnhancedHeaderProps {
  className?: string;
}

export const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  
  const { t } = useTranslation(['nav', 'common']);
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const { openSearch } = useGlobalSearch();
  
  // 智能悬停控制
  const { handleMouseEnter: handleHeaderMouseEnter, handleMouseLeave: handleHeaderMouseLeave } = useSmartHover(
    () => {}, // 保持当前状态
    () => setActiveMegaMenu(null)
  );
  
  // 滚动效果
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setIsScrolled(scrollPosition > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 阻止body滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleNavItemHover = (itemId: string, submenuKey?: keyof typeof navigationMenuData) => {
    if (submenuKey) {
      setActiveMegaMenu(itemId);
    }
  };
  
  const closeMegaMenu = () => {
    setActiveMegaMenu(null);
  };
  
  // 获取当前激活的菜单数据
  const getActiveMegaMenuData = () => {
    const activeItem = mainNavItems.find(item => item.id === activeMegaMenu);
    if (activeItem && activeItem.submenuKey && navigationMenuData[activeItem.submenuKey]) {
      const menuData = navigationMenuData[activeItem.submenuKey];
      // 确保数据结构完整
      return {
        sections: menuData.sections || [],
        features: menuData.features || []
      };
    }
    // 返回默认空数据而不是null
    return { sections: [], features: [] };
  };

  return (
    <div className="relative">
      {/* 顶部导航栏 - 完全参照 South Pole 网站设计 */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs">
            {/* 左侧语言切换 */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcherFull />
            </div>
            
            {/* 右侧快捷链接 */}
            <div className="flex items-center space-x-6 text-gray-600">
              <Link 
                href="https://careers.southpole.com/" 
                className="hover:text-gray-900 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Careers
              </Link>
              <Link 
                href="https://shop.southpole.com/" 
                className="hover:text-gray-900 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Purchase credits directly in our Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>

      <motion.header
        className={cn(
          'fixed top-10 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg shadow-black/5' 
            : 'bg-transparent',
          className
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={handleHeaderMouseEnter}
        onMouseLeave={handleHeaderMouseLeave}
      >
        {/* 主导航栏 */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo - 完全参照 South Pole 网站设计 */}
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded-lg p-2"
                  aria-label="South Pole - Climate solutions for a net zero future"
                >
                  {/* South Pole Logo SVG */}
                  <div className="flex items-center">
                    <svg 
                      width="40" 
                      height="32" 
                      viewBox="0 0 40 32" 
                      fill="none"
                      className="transition-all duration-300"
                    >
                      <path
                        d="M8 4 C8 4 16 12 24 4 C24 4 32 12 24 20 C24 20 16 28 8 20 C8 20 0 12 8 4 Z"
                        fill={getAccessibleTextColor(isScrolled)}
                        fillOpacity="0.9"
                      />
                      <circle
                        cx="20"
                        cy="16"
                        r="3"
                        fill={SOUTH_POLE_COLORS.primary}
                      />
                    </svg>
                    <div className="ml-3 flex flex-col">
                      <span 
                        className="text-lg font-bold tracking-tight transition-colors duration-300"
                        style={{ color: getAccessibleTextColor(isScrolled) }}
                      >
                        south pole
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* 桌面导航 - 完全参照 South Pole 网站设计 */}
              <nav className="hidden lg:flex items-center space-x-8">
                {mainNavItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleNavItemHover(item.id, item.submenuKey)}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-200',
                          'hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
                          activeMegaMenu === item.id && 'opacity-70'
                        )}
                        style={{
                          color: getAccessibleTextColor(isScrolled),
                        }}
                      >
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        className={cn(
                          'flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-200',
                          'hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
                          activeMegaMenu === item.id && 'opacity-70'
                        )}
                        style={{
                          color: getAccessibleTextColor(isScrolled),
                        }}
                        aria-expanded={activeMegaMenu === item.id}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        {item.hasSubmenu && (
                          <motion.svg
                            className="w-4 h-4 ml-1 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ rotate: activeMegaMenu === item.id ? 180 : 0 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </nav>

              {/* 右侧操作区域 - 完全参照 South Pole 网站设计 */}
              <div className="flex items-center space-x-6">
                {/* 搜索按钮 */}
                <button
                  onClick={openSearch}
                  className="hidden sm:flex items-center justify-center w-8 h-8 transition-opacity duration-200 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded-md"
                  style={{ color: getAccessibleTextColor(isScrolled) }}
                  aria-label="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* CTA按钮 - 完全参照 South Pole 网站设计 */}
                <div className="hidden sm:block">
                  <Link href="/contact-us">
                    <motion.button
                      className="px-6 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
                      style={{ backgroundColor: SOUTH_POLE_COLORS.primary }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Contact us
                    </motion.button>
                  </Link>
                </div>

                {/* 移动端菜单按钮 */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden flex items-center justify-center w-8 h-8 transition-opacity duration-200 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded-md"
                  style={{ color: getAccessibleTextColor(isScrolled) }}
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                >
                  <motion.div
                    animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </motion.div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MegaMenu */}
        <AnimatePresence>
          {activeMegaMenu && (() => {
            const menuData = getActiveMegaMenuData();
            return (
              <MegaMenu
                key={activeMegaMenu}
                menuKey={activeMegaMenu}
                sections={menuData.sections}
                features={menuData.features}
                isOpen={!!activeMegaMenu}
                onClose={closeMegaMenu}
              />
            );
          })()}
        </AnimatePresence>
      </motion.header>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 背景遮罩 */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMobileMenu} />
            
            {/* 移动端菜单内容 */}
            <motion.div
              className="fixed top-30 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 overflow-y-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-7xl mx-auto px-4 py-6">
                <nav className="space-y-6">
                  {mainNavItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.1
                      }}
                      className="border-b border-gray-200 pb-6"
                    >
                      <Link
                        href={item.href || '#'}
                        className="block text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        onClick={toggleMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                
                {/* 移动端CTA */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link href="/contact-us" className="block">
                    <motion.button
                      className="w-full px-6 py-3 text-sm font-medium text-white rounded-md transition-all duration-200"
                      style={{ backgroundColor: SOUTH_POLE_COLORS.primary }}
                      onClick={toggleMobileMenu}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Contact us
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedHeader;