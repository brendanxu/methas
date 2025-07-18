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
    id: 'about', 
    label: 'About us', 
    href: '/about-us',
    hasDropdown: true,
    dropdownItems: [
      { id: 'about-us', label: 'About us', href: '/about-us', description: 'Leading climate impact since 2006' },
      { id: 'mission', label: 'Mission', href: '/about-us/mission', description: 'Our mission and values' },
      { id: 'leadership', label: 'Leadership', href: '/about-us/leadership', description: 'Meet our CEO, Chair, Board and team' },
      { id: 'locations', label: 'Locations', href: '/about-us/locations', description: 'Over 800 employees in 30+ countries' },
      { id: 'integrity', label: 'Our commitment to integrity', href: '/about-us/integrity', description: 'Driving integrity in the carbon market' }
    ]
  },
  { 
    id: 'what-we-do', 
    label: 'What we do', 
    href: '/what-we-do',
    hasDropdown: true,
    dropdownItems: [
      { id: 'environmental-certificates', label: 'Environmental Certificates', href: '/what-we-do/environmental-certificates', description: 'Carbon credits, Energy Attribute Certificates, Biodiversity credits' },
      { id: 'climate-consulting', label: 'Climate Consulting', href: '/what-we-do/climate-consulting', description: 'Environmental footprint & net zero, Reporting & compliance, Value chain & renewables' },
      { id: 'project-finance', label: 'Project Finance', href: '/what-we-do/project-finance', description: 'Heavy industry, Nature-based removals, Tech-based removals' }
    ]
  },
  { 
    id: 'work-impact', 
    label: 'Our work & impact', 
    href: '/work-and-impact',
    hasDropdown: true,
    dropdownItems: [
      { id: 'case-studies', label: 'Case Studies', href: '/work-and-impact/case-studies', description: 'Real-world climate solutions and client success stories' },
      { id: 'impact-reports', label: 'Impact Reports', href: '/work-and-impact/reports', description: 'Annual impact and sustainability reports' },
      { id: 'client-stories', label: 'Client Stories', href: '/work-and-impact/stories', description: 'Success stories from our clients' },
      { id: 'projects', label: 'Projects', href: '/work-and-impact/projects', description: 'Discover our certified climate action projects' }
    ]
  },
  { 
    id: 'news', 
    label: 'News & insights', 
    href: '/news-insights',
    hasDropdown: true,
    dropdownItems: [
      { id: 'latest-news', label: 'Latest News', href: '/news-insights/news', description: 'Latest industry updates and announcements' },
      { id: 'insights', label: 'Insights', href: '/news-insights/insights', description: 'Expert analysis and commentary' },
      { id: 'reports', label: 'Reports', href: '/news-insights/reports', description: 'In-depth market reports and publications' },
      { id: 'events', label: 'Events', href: '/news-insights/events', description: 'Upcoming events and webinars' },
      { id: 'media-center', label: 'Media Center', href: '/news-insights/media', description: 'Press releases and media resources' }
    ]
  },
];

export const SouthPoleOfficialNav: React.FC<SouthPoleOfficialNavProps> = ({ 
  className = '' 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolled(window.scrollY > 50);
      }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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

  // 下拉菜单悬停处理
  const handleDropdownEnter = (itemId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(itemId);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
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
          transition: 'all 0.3s ease',
          height: '72px'
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
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200"
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
                Contact us
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-white"
            style={{ paddingTop: '72px' }}
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
                  Contact us
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