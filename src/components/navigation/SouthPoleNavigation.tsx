'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from '@/lib/modern-animations';
import { SouthPoleLogo } from './SouthPoleLogo';
import { MainNavigation } from './MainNavigation';
import { MegaMenu } from './MegaMenu';
import { SearchButton } from './SearchButton';
import { ContactButton } from './ContactButton';

interface SouthPoleNavigationProps {
  className?: string;
}

export const SouthPoleNavigation: React.FC<SouthPoleNavigationProps> = ({ 
  className = '' 
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout>();

  // 处理菜单悬停
  const handleMenuHover = (menuId: string | null) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveMenu(menuId);
  };

  // 处理菜单关闭
  const handleMenuClose = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  // 保持菜单打开状态
  const handleMenuKeepOpen = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  // 移动端菜单切换
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

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

  return (
    <>
      <nav 
        className={`relative bg-white border-b border-gray-200 ${className}`}
        style={{ 
          borderBottomColor: 'var(--border-light)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo 区域 */}
            <SouthPoleLogo />

            {/* 主导航菜单 */}
            <MainNavigation
              onMenuHover={handleMenuHover}
              activeMenu={activeMenu}
            />

            {/* 右侧功能区 */}
            <div className="flex items-center space-x-4">
              {/* 搜索按钮 */}
              <SearchButton />

              {/* Contact us 按钮 */}
              <ContactButton />

              {/* 移动端菜单按钮 */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    isMobileMenuOpen ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--primary-dark-blue)' }}
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* MegaMenu */}
        <MegaMenu
          isOpen={!!activeMenu}
          activeMenu={activeMenu}
          onClose={handleMenuClose}
          onMouseEnter={handleMenuKeepOpen}
          onMouseLeave={handleMenuClose}
        />
      </nav>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 z-50 bg-white"
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* 移动端菜单头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <SouthPoleLogo />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: 'var(--primary-dark-blue)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 移动端菜单内容 */}
          <div className="p-4 space-y-4">
            <nav className="space-y-2">
              {['About us', 'What we do', 'Our work & impact', 'News & insights'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block py-3 px-4 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={toggleMobileMenu}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-gray-200">
              <ContactButton 
                variant="primary" 
                size="large" 
                className="w-full"
                onClick={toggleMobileMenu}
              />
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SouthPoleNavigation;