'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView, Parallax, Magnetic } from '@/lib/modern-animations';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

// TypeScript type definitions
export interface HeroProps {
  /** Hero background type */
  backgroundType?: 'image' | 'video' | 'gradient';
  /** Background image URL */
  backgroundImage?: string;
  /** Background video URL */
  backgroundVideo?: string;
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


/**
 * Hero - Full-screen hero section for homepage based on Tailwind UI Salient design
 * Features split layout, gradient text, and animations
 */
export const Hero: React.FC<HeroProps> = ({
  backgroundType = 'image',
  backgroundImage = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  backgroundVideo,
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
      {/* Floating circles with modern animations */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 animate-modern-float"
        style={{ backgroundColor: colors.primary }}
      />
      <Parallax speed={0.3}>
        <div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 animate-modern-pulse"
          style={{ backgroundColor: colors.secondary }}
        />
      </Parallax>
      
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
          {/* Left side - Text content with modern animations */}
          <div className="text-white space-y-8">
            {/* Subtitle with modern entrance */}
            <motion.p
              className="text-sm md:text-base font-semibold uppercase tracking-wider animate-modern-fade-in animate-delay-300"
              style={{ color: '#60A5FA' }}
              initial="hiddenLeft"
              whileInView="fadeIn"
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {t('home:hero.subtitle')}
            </motion.p>

            {/* Main title with gradient and modern effect */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gradient-modern animate-modern-slide-up animate-delay-500"
              initial="hidden"
              whileInView="slideUp"
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="block">{t('home:hero.title')}</span>
            </motion.h1>

            {/* Description with stagger effect */}
            <motion.p
              className="text-lg md:text-xl leading-relaxed text-gray-200 max-w-2xl animate-modern-fade-in animate-delay-700"
              initial="hidden"
              whileInView="fadeIn"
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
            >
              {t('home:hero.description')}
            </motion.p>

            {/* CTA Buttons with magnetic effect */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 animate-modern-scale-in animate-delay-800"
              initial="hiddenScale"
              whileInView="scaleIn"
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <Magnetic strength={0.2}>
                <Button
                  size="large"
                  variant="primary"
                  className="text-lg px-8 py-4 btn-modern hover-glow"
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
              </Magnetic>
              
              <Magnetic strength={0.15}>
                <Button
                  size="large"
                  variant="secondary"
                  className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 btn-modern glass-morphism"
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
              </Magnetic>
            </motion.div>
          </div>

          {/* Right side - Modern visual element */}
          <motion.div
            className="hidden lg:block relative animate-modern-scale-in animate-delay-500"
            initial="hiddenScale"
            whileInView="scaleIn"
            transition={{ duration: 1.2, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative aspect-square">
              {/* Modern glass morphism container */}
              <Parallax speed={0.2}>
                <div className="absolute inset-0 rounded-2xl glass-morphism-dark border border-white/20 hover-tilt">
                  <div className="absolute inset-4 rounded-xl gradient-modern-primary gradient-animated flex items-center justify-center">
                    <Magnetic strength={0.1}>
                      <div className="text-center text-white">
                        <div className="relative mb-6">
                          <svg className="w-24 h-24 mx-auto opacity-80 animate-modern-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {/* Floating particles */}
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-modern-bounce"></div>
                          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-400 rounded-full animate-modern-float"></div>
                        </div>
                        <h3 className="text-xl font-semibold opacity-90 mb-2">Climate Innovation</h3>
                        <p className="text-sm opacity-70">Sustainable Future</p>
                        {/* Progress indicators */}
                        <div className="mt-4 space-y-2">
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white/60 rounded-full animate-modern-shimmer" style={{ width: '75%' }}></div>
                          </div>
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white/40 rounded-full animate-modern-shimmer" style={{ width: '60%', animationDelay: '0.5s' }}></div>
                          </div>
                        </div>
                      </div>
                    </Magnetic>
                  </div>
                </div>
              </Parallax>
              
              {/* Additional floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/30 rounded-full animate-modern-float animate-delay-300"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-500/30 rounded-full animate-modern-pulse animate-delay-500"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      {renderScrollIndicator()}
    </section>
  );
};

export default Hero;