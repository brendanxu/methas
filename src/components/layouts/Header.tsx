'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {  motion, AnimatePresence  } from '@/lib/mock-framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGlobalSearch } from '@/components/layout/GlobalSearch';
import { LanguageSwitcherFull } from '@/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';


// Navigation data structure
interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  description?: string;
  icon?: React.ReactNode;
}

// Navigation configuration - this will be updated to use translations
const getNavigationData = (t: any): NavItem[] => [
  {
    label: t('nav:ourServices'),
    children: [
      {
        label: t('nav:carbonFootprintAssessment'),
        href: '/services/carbon-footprint-assessment',
        description: 'Comprehensive measurement and analysis of your organization\'s greenhouse gas emissions',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        label: t('nav:carbonNeutralityConsulting'),
        href: '/services/carbon-neutrality-consulting',
        description: 'Strategic guidance and roadmap development to achieve net-zero emissions',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
      },
      {
        label: t('nav:emissionReductionStrategy'),
        href: '/services/emission-reduction',
        description: 'Tailored action plans to reduce emissions through operational improvements',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
      {
        label: t('nav:sustainabilityReporting'),
        href: '/services/sustainability-reporting',
        description: 'Comprehensive reporting solutions for ESG disclosure',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: t('nav:ourSolutions'),
    children: [
      {
        label: t('nav:netZeroStrategy'),
        href: '/solutions/net-zero',
        description: 'Comprehensive net-zero strategy development and implementation',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        label: t('nav:carbonManagement'),
        href: '/solutions/carbon-management',
        description: 'End-to-end carbon management platform and services',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        ),
      },
      {
        label: t('nav:renewableEnergyTransition'),
        href: '/solutions/renewable-energy',
        description: 'Clean energy transition support and project development',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: t('nav:circularEconomy'),
        href: '/solutions/circular-economy',
        description: 'Circular economy strategies and implementation support',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: t('nav:about'),
    href: '/about',
  },
  {
    label: t('nav:news'),
    href: '/news',
  },
  {
    label: t('nav:resources'),
    href: '/resources',
  },
];

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const { t } = useTranslation(['nav', 'common']);
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const { openSearch } = useGlobalSearch();
  
  // Get navigation data with translations
  const navigationData = getNavigationData(t);

  // Handle scroll effect with throttling for performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setIsScrolled(scrollPosition > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = (label: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b shadow-soft' 
          : 'bg-transparent',
        className
      )}
      style={{
        borderColor: isScrolled ? colors.border : 'transparent',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
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
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1"
              aria-label="South Pole - Home"
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: colors.primary }}
              >
                SP
              </div>
              <div className="hidden sm:block">
                <div 
                  className="text-xl font-bold"
                  style={{ color: isScrolled ? colors.foreground : '#FFFFFF' }}
                >
                  South Pole
                </div>
                <div 
                  className="text-xs font-medium"
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationData.map((item) => (
              <NavigationItem
                key={item.label}
                item={item}
                isScrolled={isScrolled}
                activeDropdown={activeDropdown}
                onDropdownToggle={handleDropdownToggle}
              />
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={openSearch}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
              style={{
                color: isScrolled ? colors.foreground : '#FFFFFF',
              }}
              aria-label={t('common:search')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden md:inline">{t('common:search')}</span>
              <span className="hidden lg:inline text-xs opacity-60">
                {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘K' : 'Ctrl+K'}
              </span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcherFull className="hidden sm:block" />

            {/* CTA Button */}
            <Link
              href="/contact"
              className={cn(
                'hidden sm:inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                settings.highContrast && 'border-2 font-bold'
              )}
              style={{
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                '--tw-ring-color': colors.primary,
              } as React.CSSProperties}
            >
              {t('common:scheduleCall')}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
              style={{
                color: isScrolled ? colors.foreground : '#FFFFFF',
              }}
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

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            navigationData={navigationData}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Navigation Item Component
interface NavigationItemProps {
  item: NavItem;
  isScrolled: boolean;
  activeDropdown: string | null;
  onDropdownToggle: (label: string, event: React.MouseEvent) => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isScrolled,
  activeDropdown,
  onDropdownToggle,
}) => {
  const colors = useThemeColors();
  const isActive = activeDropdown === item.label;

  if (item.children) {
    return (
      <div className="relative">
        <button
          onClick={(e) => onDropdownToggle(item.label, e)}
          className={cn(
            'flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          )}
          style={{
            color: isScrolled ? colors.foreground : '#FFFFFF',
          }}
          aria-expanded={isActive}
          aria-haspopup="true"
        >
          <span>{item.label}</span>
          <motion.svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isActive && (
            <MegaMenu
              items={item.children}
              onClose={() => onDropdownToggle(item.label, {} as React.MouseEvent)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
      style={{
        color: isScrolled ? colors.foreground : '#FFFFFF',
      }}
    >
      {item.label}
    </Link>
  );
};

// Mega Menu Component
interface MegaMenuProps {
  items: NavItem[];
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ items, onClose }) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();

  return (
    <motion.div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 z-50"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
    >
      <div 
        className="rounded-xl shadow-strong border backdrop-blur-md overflow-hidden"
        style={{
          backgroundColor: `${colors.background}95`,
          borderColor: colors.border,
        }}
      >
        <div className="p-6">
          <div className="grid gap-4">
            {items.map((item, index) => (
              <Link
                key={item.label}
                href={item.href || '#'}
                className={cn(
                  'flex items-start space-x-4 p-3 rounded-lg transition-colors',
                  'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                )}
                onClick={onClose}
              >
                {item.icon && (
                  <div 
                    className="flex-shrink-0 p-2 rounded-lg"
                    style={{ 
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary,
                    }}
                  >
                    {item.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-sm font-semibold"
                    style={{ color: colors.foreground }}
                  >
                    {item.label}
                  </h3>
                  {item.description && (
                    <p 
                      className="text-sm mt-1"
                      style={{ color: colors.mutedForeground }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Mobile Menu Component
interface MobileMenuProps {
  navigationData: NavItem[];
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  navigationData,
  onClose,
}) => {
  const { t } = useTranslation(['nav', 'common']);
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  return (
    <motion.div
      className="lg:hidden border-t backdrop-blur-md"
      style={{
        backgroundColor: `${colors.background}95`,
        borderColor: colors.border,
      }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="space-y-4">
          {navigationData.map((item, index) => (
            <MobileNavigationItem
              key={item.label}
              item={item}
              index={index}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              onClose={onClose}
            />
          ))}
        </nav>

        {/* Mobile Actions */}
        <div className="mt-8 pt-6 border-t space-y-4" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between p-3">
            <span className="text-sm font-medium" style={{ color: colors.foreground }}>
              {t('common:language')}
            </span>
            <LanguageSwitcherFull />
          </div>

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
        </div>
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
  onClose: () => void;
}

const MobileNavigationItem: React.FC<MobileNavigationItemProps> = ({
  item,
  index,
  expandedItems,
  onToggleExpanded,
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
          onClick={() => onToggleExpanded(item.label)}
          className={cn(
            'w-full flex items-center justify-between p-3 rounded-lg transition-colors',
            'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          )}
          style={{ color: colors.foreground }}
          aria-expanded={isExpanded}
        >
          <span className="text-sm font-medium">{item.label}</span>
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="ml-4 mt-2 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
            >
              {item.children.map((child) => (
                <Link
                  key={child.label}
                  href={child.href || '#'}
                  className={cn(
                    'block p-3 rounded-lg transition-colors',
                    'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  )}
                  onClick={onClose}
                >
                  <div 
                    className="text-sm font-medium"
                    style={{ color: colors.foreground }}
                  >
                    {child.label}
                  </div>
                  {child.description && (
                    <div 
                      className="text-xs mt-1"
                      style={{ color: colors.mutedForeground }}
                    >
                      {child.description}
                    </div>
                  )}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'block p-3 rounded-lg transition-colors',
        'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
      style={{ color: colors.foreground }}
      onClick={onClose}
    >
      <span className="text-sm font-medium">{item.label}</span>
    </Link>
  );
};

export default Header;