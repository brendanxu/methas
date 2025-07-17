'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from '@/lib/modern-animations';
import { megaMenuData, MegaMenuData } from '@/data/megaMenuData';

interface MegaMenuProps {
  isOpen: boolean;
  activeMenu: string | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface MegaMenuCardProps {
  card: {
    id: string;
    title: string;
    description: string;
    image?: string;
    href: string;
    ctaText: string;
    badge?: string;
  };
}

const MegaMenuCard: React.FC<MegaMenuCardProps> = ({ card }) => {
  return (
    <Link
      href={card.href}
      className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex space-x-4">
        {card.image && (
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={card.image}
                alt={card.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 
              className="text-lg font-semibold mb-2 line-clamp-2"
              style={{ color: 'var(--text-dark)', fontWeight: '600' }}
            >
              {card.title}
            </h3>
            {card.badge && (
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2"
                style={{ 
                  backgroundColor: 'var(--primary-blue)',
                  color: 'var(--white)'
                }}
              >
                {card.badge}
              </span>
            )}
          </div>
          
          <p 
            className="text-sm mb-3 line-clamp-3"
            style={{ color: 'var(--text-gray)' }}
          >
            {card.description}
          </p>
          
          <div className="flex items-center space-x-2">
            <span 
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--primary-blue)' }}
            >
              {card.ctaText}
            </span>
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: 'var(--primary-blue)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  activeMenu,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!isOpen || !activeMenu) return null;

  const menuData = megaMenuData[activeMenu];
  if (!menuData) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-full left-0 w-full z-50 bg-white border-t-2 border-gray-100"
        style={{ 
          boxShadow: 'var(--shadow-medium)',
          borderTopColor: 'var(--border-light)'
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-0">
            {/* 左侧子菜单列表 (1/3 宽度) */}
            <div 
              className="col-span-1 p-10"
              style={{ backgroundColor: 'var(--bg-light-gray)' }}
            >
              <nav className="space-y-4">
                {menuData.menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-white transition-colors duration-200 group"
                    onClick={onClose}
                  >
                    <span 
                      className="text-base font-medium"
                      style={{ color: 'var(--primary-dark-blue)' }}
                    >
                      {item.label}
                    </span>
                    <svg 
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--primary-dark-blue)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </nav>
            </div>

            {/* 右侧内容展示区 (2/3 宽度) */}
            <div 
              className="col-span-2 p-10"
              style={{ backgroundColor: 'var(--white)' }}
            >
              <div className="space-y-6">
                {menuData.cards.map((card) => (
                  <MegaMenuCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MegaMenu;