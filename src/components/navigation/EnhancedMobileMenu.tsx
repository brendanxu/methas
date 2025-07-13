'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/mock-framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { LanguageSwitcherFull } from '@/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  description?: string;
  icon?: React.ReactNode;
}

interface EnhancedMobileMenuProps {
  navigationData: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedMobileMenu: React.FC<EnhancedMobileMenuProps> = ({
  navigationData,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation(['nav', 'common']);
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'main' | 'submenu'>('main');
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null);

  // Swipe gesture support
  const swipeRef = useSwipeGesture<HTMLDivElement>({
    onSwipeLeft: () => {
      if (currentView === 'submenu') {
        setCurrentView('main');
        setActiveSubmenu(null);
      } else {
        onClose();
      }
    },
    onSwipeRight: () => {
      if (currentView === 'main') {
        onClose();
      } else {
        setCurrentView('main');
        setActiveSubmenu(null);
      }
    },
    threshold: 75,
  });

  // Reset state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setExpandedItems([]);
      setCurrentView('main');
      setActiveSubmenu(null);
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const openSubmenu = (item: NavItem) => {
    setActiveSubmenu(item);
    setCurrentView('submenu');
  };

  const closeSubmenu = () => {
    setCurrentView('main');
    setActiveSubmenu(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Menu Panel */}
        <motion.div
          ref={swipeRef}
          className="absolute right-0 top-0 h-full w-full max-w-sm shadow-2xl"
          style={{ backgroundColor: colors.background }}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ 
            type: 'spring',
            damping: 25,
            stiffness: 200,
            duration: settings.reducedMotion ? 0 : undefined,
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: colors.primary }}
              >
                SP
              </div>
              <div>
                <div 
                  className="text-lg font-bold"
                  style={{ color: colors.foreground }}
                >
                  South Pole
                </div>
                <div 
                  className="text-xs"
                  style={{ color: colors.mutedForeground }}
                >
                  Climate Solutions
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: colors.foreground }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {currentView === 'main' ? (
                <MainMenuView
                  key="main"
                  navigationData={navigationData}
                  expandedItems={expandedItems}
                  onToggleExpanded={toggleExpanded}
                  onOpenSubmenu={openSubmenu}
                  onClose={onClose}
                />
              ) : (
                <SubmenuView
                  key="submenu"
                  item={activeSubmenu}
                  onBack={closeSubmenu}
                  onClose={onClose}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div 
            className="p-6 border-t space-y-4"
            style={{ borderColor: colors.border }}
          >
            {/* Language Switcher */}
            <div className="flex items-center justify-between">
              <span 
                className="text-sm font-medium"
                style={{ color: colors.foreground }}
              >
                {t('common:language')}
              </span>
              <LanguageSwitcherFull />
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className={cn(
                'w-full inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                settings.highContrast && 'border-2 font-bold'
              )}
              style={{
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                '--tw-ring-color': colors.primary,
              } as React.CSSProperties}
              onClick={onClose}
            >
              {t('common:scheduleCall')}
            </Link>

            {/* Swipe Hint */}
            <div 
              className="text-center text-xs opacity-60"
              style={{ color: colors.mutedForeground }}
            >
              {currentView === 'submenu' ? '← 向左滑动返回' : '← 向左滑动关闭'}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Menu View Component
interface MainMenuViewProps {
  navigationData: NavItem[];
  expandedItems: string[];
  onToggleExpanded: (label: string) => void;
  onOpenSubmenu: (item: NavItem) => void;
  onClose: () => void;
}

const MainMenuView: React.FC<MainMenuViewProps> = ({
  navigationData,
  expandedItems,
  onToggleExpanded,
  onOpenSubmenu,
  onClose,
}) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();

  return (
    <motion.div
      className="h-full overflow-y-auto p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
    >
      <nav className="space-y-2">
        {navigationData.map((item, index) => (
          <MobileNavigationItem
            key={item.label}
            item={item}
            index={index}
            expandedItems={expandedItems}
            onToggleExpanded={onToggleExpanded}
            onOpenSubmenu={onOpenSubmenu}
            onClose={onClose}
          />
        ))}
      </nav>
    </motion.div>
  );
};

// Submenu View Component
interface SubmenuViewProps {
  item: NavItem | null;
  onBack: () => void;
  onClose: () => void;
}

const SubmenuView: React.FC<SubmenuViewProps> = ({ item, onBack, onClose }) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();

  if (!item || !item.children) return null;

  return (
    <motion.div
      className="h-full overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
    >
      {/* Submenu Header */}
      <div 
        className="sticky top-0 p-6 border-b bg-opacity-95 backdrop-blur-sm"
        style={{ 
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: colors.foreground }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 
            className="text-lg font-semibold"
            style={{ color: colors.foreground }}
          >
            {item.label}
          </h2>
        </div>
      </div>

      {/* Submenu Items */}
      <div className="p-6 space-y-4">
        {item.children.map((child, index) => (
          <motion.div
            key={child.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: settings.reducedMotion ? 0 : 0.1,
              delay: settings.reducedMotion ? 0 : index * 0.05,
            }}
          >
            <Link
              href={child.href || '#'}
              className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={onClose}
            >
              {child.icon && (
                <div 
                  className="flex-shrink-0 p-2 rounded-lg"
                  style={{ 
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                  }}
                >
                  {child.icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold mb-1"
                  style={{ color: colors.foreground }}
                >
                  {child.label}
                </h3>
                {child.description && (
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: colors.mutedForeground }}
                  >
                    {child.description}
                  </p>
                )}
              </div>
              <svg 
                className="w-5 h-5 flex-shrink-0 mt-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: colors.mutedForeground }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Mobile Navigation Item Component
interface MobileNavigationItemProps {
  item: NavItem;
  index: number;
  expandedItems: string[];
  onToggleExpanded: (label: string) => void;
  onOpenSubmenu: (item: NavItem) => void;
  onClose: () => void;
}

const MobileNavigationItem: React.FC<MobileNavigationItemProps> = ({
  item,
  index,
  expandedItems,
  onToggleExpanded,
  onOpenSubmenu,
  onClose,
}) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const isExpanded = expandedItems.includes(item.label);

  if (item.children) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: settings.reducedMotion ? 0 : 0.1,
          delay: settings.reducedMotion ? 0 : index * 0.05,
        }}
      >
        <button
          onClick={() => onOpenSubmenu(item)}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          style={{ color: colors.foreground }}
        >
          <span className="font-medium">{item.label}</span>
          <div className="flex items-center space-x-2">
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${colors.primary}15`,
                color: colors.primary,
              }}
            >
              {item.children.length}
            </span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: settings.reducedMotion ? 0 : 0.1,
        delay: settings.reducedMotion ? 0 : index * 0.05,
      }}
    >
      <Link
        href={item.href || '#'}
        className="block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        style={{ color: colors.foreground }}
        onClick={onClose}
      >
        <span className="font-medium">{item.label}</span>
      </Link>
    </motion.div>
  );
};

export default EnhancedMobileMenu;