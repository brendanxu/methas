'use client';

import React, { useState, useEffect } from 'react';
import {  motion, useAnimation, useInView  } from '@/lib/mock-framer-motion';
import { Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { formatNumber } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// TypeScript type definitions
export interface HeroProps {
  /** Hero background type */
  backgroundType?: 'image' | 'video' | 'gradient';
  /** Background image URL */
  backgroundImage?: string;
  /** Background video URL */
  backgroundVideo?: string;
  /** Enable statistics section */
  showStatistics?: boolean;
  /** Custom CTA button text */
  primaryCTAText?: string;
  /** Custom secondary CTA text */
  secondaryCTAText?: string;
  /** Primary CTA click handler */
  onPrimaryCTA?: () => void;
  /** Secondary CTA click handler */
  onSecondaryCTA?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// Statistics data interface
interface StatisticData {
  value: number;
  title: string;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
}

/**
 * Hero - Full-screen hero section for homepage based on Tailwind UI Salient design
 * Features split layout, gradient text, animations, and integrated statistics
 */
export const Hero: React.FC<HeroProps> = ({
  backgroundType = 'image',
  backgroundImage = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  backgroundVideo,
  showStatistics = true,
  primaryCTAText,
  secondaryCTAText,
  onPrimaryCTA,
  onSecondaryCTA,
  className,
}) => {
  const { t } = useTranslation(['home', 'common']);
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [heroRef, isInView] = useInView({ once: true });
  const controls = useAnimation();

  // Statistics data with translations
  const statisticsData: StatisticData[] = [
    {
      value: 1000,
      title: t('home:hero.stats.projects'),
      suffix: '+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      value: 50000000,
      title: t('home:hero.stats.emissions'),
      suffix: '+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: 100,
      title: t('home:hero.stats.countries'),
      suffix: '+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: 5000,
      title: t('home:hero.stats.clients'),
      suffix: '+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };


  // Handle scroll detection for scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollIndicator(scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger animations when in view
  useEffect(() => {
    if (isInView) {
      controls.start();
    }
  }, [isInView, controls]);

  // Custom statistic formatter with abbreviations
  const formatStatistic = (value: number, suffix?: string) => {
    if (value >= 1000000) {
      return `${formatNumber(value / 1000000, { maximumFractionDigits: 0 })}M${suffix || ''}`;
    } else if (value >= 1000) {
      return `${formatNumber(value / 1000, { maximumFractionDigits: 0 })}K${suffix || ''}`;
    }
    return `${formatNumber(value)}${suffix || ''}`;
  };

  // Render background
  const renderBackground = () => {
    if (backgroundType === 'video' && backgroundVideo) {
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      );
    }

    if (backgroundType === 'image' && backgroundImage) {
      return (
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <OptimizedImage
            src={backgroundImage}
            alt="Climate action background"
            fill
            priority
            className="object-cover"
            quality={90}
            sizes="100vw"
            placeholder="blur"
            autoBlur={true}
            animate={true}
            style={{ objectFit: 'cover' }}
          />
        </motion.div>
      );
    }

    // Gradient background
    return (
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        }}
      />
    );
  };

  // Render decorative geometric shapes
  const renderDecorations = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating circles */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
        style={{ backgroundColor: colors.primary }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-5"
        style={{ backgroundColor: colors.secondary }}
        animate={{
          y: [0, 20, 0],
          scale: [1, 0.95, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );

  // Render scroll indicator
  const renderScrollIndicator = () => {
    if (!showScrollIndicator || settings.reducedMotion) return null;

    return (
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center space-y-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-sm font-medium opacity-80">{t('common:scrollToExplore', 'Scroll to explore')}</span>
          <motion.svg
            className="w-6 h-6 opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section
      ref={heroRef as any}
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Background */}
      {renderBackground()}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      
      {/* Decorative elements */}
      {renderDecorations()}

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* Left side - Text content */}
          <motion.div
            className="text-white space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Subtitle */}
            <motion.p
              className="text-sm md:text-base font-semibold uppercase tracking-wider"
              style={{ color: '#60A5FA' }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t('home:hero.subtitle')}
            </motion.p>

            {/* Main title with gradient */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="block">{t('home:hero.title')}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl leading-relaxed text-gray-200 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {t('home:hero.description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Button
                size="large"
                variant="primary"
                className="text-lg px-8 py-4"
                onClick={onPrimaryCTA}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }
                iconPosition="right"
              >
                {primaryCTAText || t('home:hero.primaryCTA')}
              </Button>
              <Button
                size="large"
                variant="secondary"
                className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={onSecondaryCTA}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                iconPosition="left"
              >
                {secondaryCTAText || t('home:hero.secondaryCTA')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Visual element placeholder */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <div className="relative aspect-square">
              {/* Main visual container */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
                  <motion.div
                    className="text-center text-white"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <svg className="w-24 h-24 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold opacity-90">Climate Innovation</h3>
                    <p className="text-sm opacity-70 mt-2">Sustainable Future</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Statistics section */}
        {showStatistics && (
          <motion.div
            className="mt-20 pt-12 border-t border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statisticsData.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center text-white"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'rgba(96, 165, 250, 0.2)' }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <Statistic
                      value={stat.value}
                      formatter={(value) => formatStatistic(Number(value), stat.suffix)}
                      valueStyle={{
                        color: '#FFFFFF',
                        fontSize: 'inherit',
                        fontWeight: 'bold',
                      }}
                    />
                  </div>
                  <p className="text-gray-300 font-medium">{stat.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      {renderScrollIndicator()}
    </section>
  );
};

export default Hero;