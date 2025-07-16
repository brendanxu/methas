'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/mock-framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalSearch } from '@/components/layout/GlobalSearch';
import { LanguageSwitcherFull } from '@/components/ui/LanguageSwitcher';
import UnifiedButton from '@/components/ui/UnifiedButton';
import { MegaMenu } from './MegaMenu';
import { navigationMenuData } from '@/data/navigation';
import { cn } from '@/lib/utils';

// 主导航项配置
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
    label: '关于我们',
    hasSubmenu: true,
    submenuKey: 'aboutUs'
  },
  {
    id: 'services',
    label: '我们的服务',
    hasSubmenu: true,
    submenuKey: 'services'
  },
  {
    id: 'solutions',
    label: '解决方案',
    hasSubmenu: true,
    submenuKey: 'solutions'
  },
  {
    id: 'impact',
    label: '影响力',
    hasSubmenu: true,
    submenuKey: 'impact'
  },
  {
    id: 'insights',
    label: '洞察资源',
    hasSubmenu: true,
    submenuKey: 'insights'
  }
];

// 智能悬停检测Hook
const useSmartHover = (onOpen: () => void, onClose: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isHovering = useRef(false);
  
  const handleMouseEnter = () => {
    isHovering.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onOpen();
  };
  
  const handleMouseLeave = () => {
    isHovering.current = false;
    timeoutRef.current = setTimeout(() => {
      if (!isHovering.current) {
        onClose();
      }
    }, 150);
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
    if (activeItem && activeItem.submenuKey) {
      return navigationMenuData[activeItem.submenuKey];
    }
    return null;
  };

  return (
    <div className="relative">
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5' 
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
              {/* Logo */}
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded-lg p-2"
                  aria-label="South Pole - 首页"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style={{ backgroundColor: colors.primary }}
                  >
                    SP
                  </div>
                  <div className="hidden sm:block">
                    <div 
                      className="text-xl font-bold transition-colors duration-300"
                      style={{ color: isScrolled ? colors.foreground : '#FFFFFF' }}
                    >
                      South Pole
                    </div>
                    <div 
                      className="text-xs font-medium transition-colors duration-300"
                      style={{ 
                        color: isScrolled 
                          ? colors.mutedForeground 
                          : 'rgba(255, 255, 255, 0.8)' 
                      }}
                    >
                      Climate Solutions
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* 桌面导航 */}
              <nav className="hidden lg:flex items-center space-x-1">
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
                          'flex items-center space-x-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                          'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
                          activeMegaMenu === item.id && 'bg-white/10'
                        )}
                        style={{
                          color: isScrolled ? colors.foreground : '#FFFFFF',
                        }}
                      >
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        className={cn(
                          'flex items-center space-x-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                          'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
                          activeMegaMenu === item.id && 'bg-white/10'
                        )}
                        style={{
                          color: isScrolled ? colors.foreground : '#FFFFFF',
                        }}
                        aria-expanded={activeMegaMenu === item.id}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        {item.hasSubmenu && (
                          <motion.svg
                            className="w-4 h-4 transition-transform duration-200"
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

              {/* 右侧操作区域 */}
              <div className="flex items-center space-x-4">
                {/* 搜索按钮 */}
                <UnifiedButton
                  variant="ghost"
                  size="small"
                  onClick={openSearch}
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>}
                  customColor={isScrolled ? colors.foreground : '#FFFFFF'}
                  aria-label={t('common:search')}
                  className="hidden sm:inline-flex"
                >
                  <span className="hidden md:inline">{t('common:search')}</span>
                  <span className="hidden lg:inline text-xs opacity-60 ml-2">
                    {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘K' : 'Ctrl+K'}
                  </span>
                </UnifiedButton>

                {/* 语言切换 */}
                <div className="hidden sm:block">
                  <LanguageSwitcherFull />
                </div>

                {/* CTA按钮 */}
                <div className="hidden sm:block">
                  <Link href="/contact">
                    <UnifiedButton
                      variant="primary"
                      size="medium"
                      className="font-semibold"
                      customColor={colors.primary}
                      shadow="medium"
                    >
                      {t('common:scheduleCall')}
                    </UnifiedButton>
                  </Link>
                </div>

                {/* 移动端菜单按钮 */}
                <UnifiedButton
                  variant="ghost"
                  size="small"
                  onClick={toggleMobileMenu}
                  className="lg:hidden"
                  customColor={isScrolled ? colors.foreground : '#FFFFFF'}
                  aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
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
                </UnifiedButton>
              </div>
            </div>
          </div>
        </div>

        {/* MegaMenu */}
        <AnimatePresence>
          {activeMegaMenu && (
            <MegaMenu
              key={activeMegaMenu}
              menuKey={activeMegaMenu}
              sections={getActiveMegaMenuData()?.sections || []}
              features={getActiveMegaMenuData()?.features || []}
              isOpen={!!activeMegaMenu}
              onClose={closeMegaMenu}
            />
          )}
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
              className="fixed top-20 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-xl border-t border-border/50 overflow-y-auto"
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
                      className="border-b border-border/30 pb-6"
                    >
                      <Link
                        href={item.href || '#'}
                        className="block text-lg font-semibold text-foreground hover:text-primary transition-colors"
                        onClick={toggleMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                
                {/* 移动端CTA */}
                <div className="mt-8 pt-6 border-t border-border/30">
                  <Link href="/contact" className="block">
                    <UnifiedButton
                      variant="primary"
                      size="large"
                      onClick={toggleMobileMenu}
                      className="w-full font-semibold"
                      customColor={colors.primary}
                      shadow="medium"
                    >
                      {t('common:scheduleCall')}
                    </UnifiedButton>
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