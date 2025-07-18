'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from '@/lib/modern-animations';

interface NavItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SouthPoleOfficialNavProps {
  className?: string;
}

const navItems: NavItem[] = [
  { id: 'about', label: 'About us', href: '/about-us' },
  { id: 'what-we-do', label: 'What we do', href: '/what-we-do' },
  { id: 'work-impact', label: 'Our work & impact', href: '/work-and-impact' },
  { id: 'news', label: 'News & insights', href: '/news-insights' },
];

export const SouthPoleOfficialNav: React.FC<SouthPoleOfficialNavProps> = ({ 
  className = '' 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // 滚动监听 - 防抖优化
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

  // 导航项悬停处理
  const handleNavItemHover = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handleNavItemLeave = () => {
    setActiveItem(null);
  };

  return (
    <>
      <nav 
        className={`sp-nav ${isScrolled ? 'is-sticky' : ''} ${className}`}
        style={{
          backgroundColor: 'var(--sp-bg-primary)',
          borderBottom: '1px solid var(--sp-border-light)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: isScrolled ? 'var(--sp-nav-height-sticky)' : 'var(--sp-nav-height)',
          boxShadow: isScrolled ? 'var(--sp-nav-shadow)' : 'none',
          transition: 'all var(--sp-transition-base)',
        }}
      >
        <div className="sp-container-2xl">
          <div className="sp-nav-container">
            {/* Logo */}
            <Link 
              href="/"
              className="sp-nav-logo"
              aria-label="South Pole - The Climate Company"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-space-3)',
                }}
              >
                {/* Logo Icon */}
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--sp-black)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ color: 'var(--sp-white)' }}
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
                <span
                  style={{
                    fontSize: 'var(--sp-text-xl)',
                    fontWeight: 'var(--sp-fw-medium)',
                    color: 'var(--sp-text-primary)',
                    fontFamily: 'var(--sp-font-primary)',
                  }}
                >
                  South Pole
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center" style={{ gap: 'var(--sp-space-8)' }}>
              <ul className="sp-nav-menu">
                {navItems.map((item) => (
                  <li key={item.id} className="sp-nav-item">
                    <Link
                      href={item.href}
                      className="sp-nav-link"
                      onMouseEnter={() => handleNavItemHover(item.id)}
                      onMouseLeave={handleNavItemLeave}
                      style={{
                        position: 'relative',
                        fontSize: 'var(--sp-text-base)',
                        fontWeight: 'var(--sp-fw-medium)',
                        color: 'var(--sp-text-primary)',
                        padding: 'var(--sp-space-4) 0',
                        borderBottom: `3px solid ${
                          activeItem === item.id || item.isActive 
                            ? 'var(--sp-accent)' 
                            : 'transparent'
                        }`,
                        transition: 'var(--sp-transition-base)',
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact CTA Button */}
              <Link
                href="/contact-us"
                className="sp-nav-cta"
                style={{
                  backgroundColor: 'var(--sp-accent)',
                  color: 'var(--sp-white)',
                  padding: 'var(--sp-space-3) var(--sp-space-6)',
                  borderRadius: 'var(--sp-radius-base)',
                  fontSize: 'var(--sp-text-base)',
                  fontWeight: 'var(--sp-fw-medium)',
                  transition: 'var(--sp-transition-base)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--sp-space-2)',
                }}
              >
                Contact us
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: 'currentColor' }}
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--sp-space-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sp-text-primary)',
              }}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: 'currentColor' }}
                >
                  {isMobileMenuOpen ? (
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M4 6h16M4 12h16M4 18h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </motion.div>
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
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'var(--sp-bg-primary)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--sp-space-4)',
              paddingTop: 'var(--sp-nav-height)',
            }}
          >
            {/* Mobile Menu Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--sp-space-8)',
                paddingBottom: 'var(--sp-space-4)',
                borderBottom: '1px solid var(--sp-border-light)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--sp-text-xl)',
                  fontWeight: 'var(--sp-fw-medium)',
                  color: 'var(--sp-text-primary)',
                }}
              >
                Menu
              </span>
            </div>

            {/* Mobile Menu Items */}
            <nav style={{ flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ marginBottom: 'var(--sp-space-4)' }}
                  >
                    <Link
                      href={item.href}
                      onClick={toggleMobileMenu}
                      style={{
                        display: 'block',
                        fontSize: 'var(--sp-text-2xl)',
                        fontWeight: 'var(--sp-fw-medium)',
                        color: 'var(--sp-text-primary)',
                        padding: 'var(--sp-space-4) 0',
                        borderBottom: '1px solid var(--sp-border-light)',
                        transition: 'var(--sp-transition-base)',
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Mobile Contact CTA */}
            <div style={{ marginTop: 'auto', paddingTop: 'var(--sp-space-8)' }}>
              <Link
                href="/contact-us"
                onClick={toggleMobileMenu}
                style={{
                  display: 'block',
                  backgroundColor: 'var(--sp-accent)',
                  color: 'var(--sp-white)',
                  padding: 'var(--sp-space-4) var(--sp-space-6)',
                  borderRadius: 'var(--sp-radius-base)',
                  fontSize: 'var(--sp-text-lg)',
                  fontWeight: 'var(--sp-fw-medium)',
                  textAlign: 'center',
                  transition: 'var(--sp-transition-base)',
                }}
              >
                Contact us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SouthPoleOfficialNav;