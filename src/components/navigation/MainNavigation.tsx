'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/modern-animations';

// 导航项数据类型
interface NavItem {
  id: string;
  label: string;
  href: string;
  hasSubmenu?: boolean;
  isActive?: boolean;
}

// 导航项数据
const navItems: NavItem[] = [
  {
    id: 'about',
    label: 'About us',
    href: '/about-us',
    hasSubmenu: true,
  },
  {
    id: 'what-we-do',
    label: 'What we do',
    href: '/what-we-do',
    hasSubmenu: true,
  },
  {
    id: 'work-impact',
    label: 'Our work & impact',
    href: '/work-and-impact',
    hasSubmenu: true,
  },
  {
    id: 'news',
    label: 'News & insights',
    href: '/news-insights',
    hasSubmenu: true,
  },
];

interface MainNavigationProps {
  className?: string;
  onMenuHover?: (menuId: string | null) => void;
  activeMenu?: string | null;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  className = '',
  onMenuHover,
  activeMenu
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = (itemId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredItem(itemId);
    if (onMenuHover) {
      onMenuHover(itemId);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
      if (onMenuHover) {
        onMenuHover(null);
      }
    }, 200); // 200ms 延迟关闭
  };

  const handleMenuKeepOpen = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav 
      className={`hidden lg:flex items-center space-x-8 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={item.href}
            className={`
              relative px-3 py-2 text-base font-normal transition-colors duration-200
              hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md
              ${item.isActive ? 'text-blue-600' : 'text-gray-800'}
            `}
            style={{
              color: item.isActive ? 'var(--primary-blue)' : 'var(--primary-dark-blue)',
              fontSize: '15px',
              fontWeight: '400'
            }}
            aria-expanded={item.hasSubmenu ? (activeMenu === item.id) : undefined}
            aria-haspopup={item.hasSubmenu ? 'true' : undefined}
          >
            {item.label}
            
            {/* 活跃状态下划线 */}
            {item.isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                style={{ backgroundColor: 'var(--primary-blue)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            {/* 悬停状态下划线 */}
            {!item.isActive && hoveredItem === item.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 opacity-50"
                style={{ backgroundColor: 'var(--primary-blue)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default MainNavigation;