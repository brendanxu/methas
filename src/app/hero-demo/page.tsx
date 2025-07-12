'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DynamicHomeHero } from '@/lib/dynamic-imports';
import { Section } from '@/components/ui/Section';
import { BaseCard } from '@/components/ui/BaseCard';
import { useThemeColors } from '@/app/providers';

const HeroDemo = () => {
  const colors = useThemeColors();
  const [heroConfig, setHeroConfig] = useState({
    backgroundType: 'image',
    showStatistics: true,
    primaryCTAText: 'Get Started',
    secondaryCTAText: 'Learn More',
  });

  const [backgroundOptions] = useState({
    image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    alternativeImage: 'https://images.unsplash.com/photo-1497436072909-f5e4be1713b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  });

  const handlePrimaryCTA = () => {
    alert('Primary CTA clicked! This would normally navigate to the main action page.');
  };

  const handleSecondaryCTA = () => {
    alert('Secondary CTA clicked! This would normally open more information.');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <DynamicHomeHero
        backgroundType={heroConfig.backgroundType as 'image' | 'video' | 'gradient'}
        backgroundImage={heroConfig.backgroundType === 'image' ? backgroundOptions.image : undefined}
        backgroundVideo={heroConfig.backgroundType === 'video' ? backgroundOptions.video : undefined}
        showStatistics={heroConfig.showStatistics}
        primaryCTAText={heroConfig.primaryCTAText}
        secondaryCTAText={heroConfig.secondaryCTAText}
        onPrimaryCTA={handlePrimaryCTA}
        onSecondaryCTA={handleSecondaryCTA}
      />

      {/* Configuration Panel */}
      <Section
        background="white"
        spacing="normal"
        width="container"
        title="Hero Component Configuration"
        subtitle="Customization"
        description="Adjust the settings below to see how different Hero configurations affect the layout and visual presentation."
      >
        <BaseCard padding="large" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Background Type Control */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.foreground }}>
                Background Type
              </label>
              <select
                value={heroConfig.backgroundType}
                onChange={(e) => setHeroConfig(prev => ({ ...prev, backgroundType: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>

            {/* Primary CTA Text */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.foreground }}>
                Primary CTA Text
              </label>
              <input
                type="text"
                value={heroConfig.primaryCTAText}
                onChange={(e) => setHeroConfig(prev => ({ ...prev, primaryCTAText: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
                placeholder="Get Started"
              />
            </div>

            {/* Secondary CTA Text */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.foreground }}>
                Secondary CTA Text
              </label>
              <input
                type="text"
                value={heroConfig.secondaryCTAText}
                onChange={(e) => setHeroConfig(prev => ({ ...prev, secondaryCTAText: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
                placeholder="Learn More"
              />
            </div>

            {/* Statistics Toggle */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.foreground }}>
                Show Statistics
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={heroConfig.showStatistics}
                  onChange={(e) => setHeroConfig(prev => ({ ...prev, showStatistics: e.target.checked }))}
                  className="rounded"
                />
                <span style={{ color: colors.foreground }}>Display statistics section</span>
              </label>
            </div>
          </div>
        </BaseCard>
      </Section>

      {/* Features Overview */}
      <Section
        background="gray"
        spacing="large"
        width="container"
        title="Hero Component Features"
        subtitle="What's Included"
        description="The Hero component is packed with features to create impactful landing pages that engage users and drive action."
        pattern="dots"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Animation Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <BaseCard padding="medium" hoverable className="h-full">
              <div className="text-center space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: colors.primary }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: colors.foreground }}>
                  Advanced Animations
                </h3>
                <p style={{ color: colors.mutedForeground }}>
                  Smooth Framer Motion animations with staggered text reveals, button slide-ins, and image transitions that respect reduced motion preferences.
                </p>
              </div>
            </BaseCard>
          </motion.div>

          {/* Responsive Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <BaseCard padding="medium" hoverable className="h-full">
              <div className="text-center space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.success}15` }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: colors.success }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: colors.foreground }}>
                  Responsive Design
                </h3>
                <p style={{ color: colors.mutedForeground }}>
                  Mobile-first responsive layout that adapts from split-screen desktop to stacked mobile layout with optimized text sizing and spacing.
                </p>
              </div>
            </BaseCard>
          </motion.div>

          {/* Multiple Backgrounds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <BaseCard padding="medium" hoverable className="h-full">
              <div className="text-center space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.secondary}15` }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: colors.secondary }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: colors.foreground }}>
                  Flexible Backgrounds
                </h3>
                <p style={{ color: colors.mutedForeground }}>
                  Support for images, videos, and gradients with automatic overlays and decorative geometric elements for enhanced visual appeal.
                </p>
              </div>
            </BaseCard>
          </motion.div>

          {/* Integrated Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <BaseCard padding="medium" hoverable className="h-full">
              <div className="text-center space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: colors.primary }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: colors.foreground }}>
                  Integrated Statistics
                </h3>
                <p style={{ color: colors.mutedForeground }}>
                  Built-in Ant Design Statistics with automatic number formatting, animated counting, and customizable data points to showcase achievements.
                </p>
              </div>
            </BaseCard>
          </motion.div>

          {/* Accessibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <BaseCard padding="medium" hoverable className="h-full">
              <div className="text-center space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.success}15` }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: colors.success }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: colors.foreground }}>
                  Accessibility First
                </h3>
                <p style={{ color: colors.mutedForeground }}>
                  Full accessibility support with proper ARIA labels, keyboard navigation, reduced motion respect, and high contrast compatibility.
                </p>
              </div>
            </BaseCard>
          </motion.div>

          {/* Interactive Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <BaseCard padding="medium" hoverable className="h-full">
              <div className="text-center space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors.secondary}15` }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: colors.secondary }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: colors.foreground }}>
                  Interactive Elements
                </h3>
                <p style={{ color: colors.mutedForeground }}>
                  Animated scroll indicator, floating geometric shapes, customizable CTA buttons, and hover effects that enhance user engagement.
                </p>
              </div>
            </BaseCard>
          </motion.div>
        </div>
      </Section>

      {/* Technical Implementation */}
      <Section
        background="white"
        spacing="normal"
        width="container"
        title="Technical Implementation"
        subtitle="Code Overview"
        description="Understanding the technical architecture and implementation details of the Hero component."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BaseCard padding="medium">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
              Basic Usage
            </h3>
            <pre 
              className="p-4 rounded-lg text-sm overflow-x-auto"
              style={{ 
                backgroundColor: colors.muted,
                color: colors.mutedForeground 
              }}
            >
{`import { Hero } from '@/components/sections/home/Hero';

<Hero
  backgroundType="image"
  primaryCTAText="Get Started"
  secondaryCTAText="Learn More"
  onPrimaryCTA={() => console.log('Primary')}
  onSecondaryCTA={() => console.log('Secondary')}
/>`}
            </pre>
          </BaseCard>

          <BaseCard padding="medium">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
              Advanced Configuration
            </h3>
            <pre 
              className="p-4 rounded-lg text-sm overflow-x-auto"
              style={{ 
                backgroundColor: colors.muted,
                color: colors.mutedForeground 
              }}
            >
{`<Hero
  backgroundType="video"
  backgroundVideo="/path/to/video.mp4"
  showStatistics={true}
  primaryCTAText="开始体验"
  secondaryCTAText="了解更多"
  className="custom-hero-styles"
/>`}
            </pre>
          </BaseCard>
        </div>

        <BaseCard padding="medium" className="mt-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2" style={{ color: colors.foreground }}>
                Animation System
              </h4>
              <ul className="space-y-1 text-sm" style={{ color: colors.mutedForeground }}>
                <li>• Framer Motion integration</li>
                <li>• Staggered text animations</li>
                <li>• Smooth scroll indicator</li>
                <li>• Reduced motion support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: colors.foreground }}>
                Background Options
              </h4>
              <ul className="space-y-1 text-sm" style={{ color: colors.mutedForeground }}>
                <li>• Image backgrounds</li>
                <li>• Video backgrounds</li>
                <li>• Gradient backgrounds</li>
                <li>• Automatic overlays</li>
              </ul>
            </div>
          </div>
        </BaseCard>
      </Section>
    </div>
  );
};

export default HeroDemo;