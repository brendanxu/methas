'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {  motion  } from '@/lib/mock-framer-motion';
import { Form, Input, message } from 'antd';
import { useTheme, useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import UnifiedButton from '@/components/ui/UnifiedButton';
import { cn } from '@/lib/utils';


interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerData: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Investor Relations', href: '/investors' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Climate Solutions', href: '/solutions/climate' },
      { label: 'Carbon Offsetting', href: '/solutions/carbon' },
      { label: 'Renewable Energy', href: '/solutions/renewable' },
      { label: 'Sustainability Consulting', href: '/solutions/consulting' },
      { label: 'Project Development', href: '/solutions/development' },
      { label: 'Digital MRV', href: '/solutions/mrv' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Knowledge Hub', href: '/resources/hub' },
      { label: 'Blog', href: '/blog' },
      { label: 'White Papers', href: '/resources/papers' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Annual Reports', href: '/reports' },
      { label: 'Documentation', href: '/docs' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'News & Events', href: '/news' },
      { label: 'Partnerships', href: '/partnerships' },
      { label: 'Community', href: '/community' },
      { label: 'Support', href: '/support' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/southpole',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/southpole_',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/southpole_official',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-2.51 0-4.543-2.032-4.543-4.543s2.033-4.543 4.543-4.543c2.51 0 4.542 2.032 4.542 4.543s-2.032 4.543-4.542 4.543zm7.519 0c-2.51 0-4.543-2.032-4.543-4.543s2.033-4.543 4.543-4.543c2.51 0 4.542 2.032 4.542 4.543s-2.032 4.543-4.542 4.543z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/southpole',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const [newsletterForm] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const { settings } = useAccessibility();

  const handleNewsletterSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Thank you for subscribing to our newsletter!');
      newsletterForm.resetFields();
    } catch {
      message.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer 
      className={cn('relative', className)}
      style={{
        backgroundColor: colors.card,
        borderTopColor: colors.border,
      }}
    >
      {/* Main Footer Content */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: colors.primary }}
                  >
                    SP
                  </div>
                  <div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: colors.foreground }}
                    >
                      South Pole
                    </div>
                    <div 
                      className="text-sm font-medium"
                      style={{ color: colors.mutedForeground }}
                    >
                      Climate Solutions
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p 
                  className="text-base mb-8 leading-relaxed"
                  style={{ color: colors.mutedForeground }}
                >
                  Leading the transition to a climate-positive world through innovative carbon offset projects, renewable energy solutions, and comprehensive sustainability consulting.
                </p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'p-3 rounded-lg transition-all duration-200',
                        'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                      )}
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        color: colors.primary,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: settings.reducedMotion ? 0 : 0.2,
                        delay: settings.reducedMotion ? 0 : index * 0.1,
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Follow us on ${social.name}`}
                      onMouseEnter={() => {
                        // Preconnect to external domain on hover for faster navigation
                        const link = document.createElement('link');
                        link.rel = 'preconnect';
                        link.href = new URL(social.href).origin;
                        document.head.appendChild(link);
                      }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {footerData.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: settings.reducedMotion ? 0 : 0.6,
                      delay: settings.reducedMotion ? 0 : sectionIndex * 0.1,
                    }}
                  >
                    <h3 
                      className="text-lg font-semibold mb-6"
                      style={{ color: colors.foreground }}
                    >
                      {section.title}
                    </h3>
                    <ul className="space-y-4">
                      {section.links.map((link, linkIndex) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className={cn(
                              'text-sm transition-colors duration-200',
                              'hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded',
                              'hover:translate-x-1'
                            )}
                            style={{ 
                              color: colors.mutedForeground,
                              '--hover-color': colors.primary,
                            } as React.CSSProperties}
                          >
                            {link.label}
                            {link.external && (
                              <svg 
                                className="inline w-3 h-3 ml-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <motion.div
            className="mt-16 pt-12 border-t"
            style={{ borderTopColor: colors.border }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.6 }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <h3 
                className="text-2xl font-bold mb-4"
                style={{ color: colors.foreground }}
              >
                Stay Updated on Climate Action
              </h3>
              <p 
                className="text-base mb-8"
                style={{ color: colors.mutedForeground }}
              >
                Get the latest insights on climate solutions, project updates, and sustainability trends delivered to your inbox.
              </p>

              <Form
                form={newsletterForm}
                onFinish={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                  className="flex-1 mb-0"
                >
                  <Input
                    size="large"
                    placeholder="Enter your email address"
                    className={cn(
                      'rounded-lg border-2',
                      settings.highContrast && 'border-4 font-bold'
                    )}
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      color: colors.foreground,
                    }}
                  />
                </Form.Item>
                <Form.Item className="mb-0">
                  <UnifiedButton
                    variant="primary"
                    size="large"
                    htmlType="submit"
                    loading={isSubmitting}
                    className={cn(
                      'px-8 font-semibold',
                      settings.highContrast && 'border-2 font-bold'
                    )}
                    customColor={colors.primary}
                    shadow="medium"
                  >
                    Subscribe
                  </UnifiedButton>
                </Form.Item>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="border-t"
        style={{ 
          backgroundColor: isDark ? colors.muted : `${colors.muted}80`,
          borderTopColor: colors.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div 
              className="text-sm"
              style={{ color: colors.mutedForeground }}
            >
              © {new Date().getFullYear()} South Pole. All rights reserved.
            </div>
            
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={cn(
                    'text-sm transition-colors duration-200',
                    'hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
                  )}
                  style={{ color: colors.mutedForeground }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;