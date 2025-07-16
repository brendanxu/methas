'use client';

import React from 'react';
import { useI18n } from '@/hooks/useI18n';
import { 
  DynamicHomeHero,
  DynamicThemeShowcase, 
  DynamicServices,
  DynamicCaseStudies,
  DynamicSuccessStories
} from '@/lib/dynamic-imports';
import { ClientOnlyComponentPreloader } from '@/components/optimization/ClientOnlyComponentPreloader';
import { SEOHead } from '@/components/seo/SEOHead';
import { HOME_SEO } from '@/lib/seo-config';
import { getDefaultSchemas } from '@/lib/structured-data';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageTransition, AnimatedCard, Motion } from '@/components/animations/EnhancedMotion';

export default function HomeContent() {
  const { t } = useI18n();

  return (
    <>
      <SEOHead 
        config={HOME_SEO}
        basePath="/"
        schemaData={getDefaultSchemas()}
      />
      
      <PageTransition>
        <div>
          {/* Add padding-top to account for fixed header */}
          <ErrorBoundary fallback={<div className="pt-20 min-h-[50vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">{t('errors.heroLoadFailed', 'Failed to load hero section')}</p>
          </div>}>
            <Motion.div className="pt-20" whileInView="slideUp">
              <DynamicHomeHero />
            </Motion.div>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">{t('errors.servicesLoadFailed', 'Failed to load services section')}</p>
          </div>}>
            <ClientOnlyComponentPreloader
              importFn={() => import('@/components/sections/home/Services')}
              componentName="Services"
              trigger="scroll"
              scrollThreshold={30}
            >
              <DynamicServices />
            </ClientOnlyComponentPreloader>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Failed to load case studies section</p>
          </div>}>
            <ClientOnlyComponentPreloader
              importFn={() => import('@/components/sections/home/CaseStudies')}
              componentName="CaseStudies"
              trigger="scroll"
              scrollThreshold={50}
            >
              <DynamicCaseStudies />
            </ClientOnlyComponentPreloader>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Failed to load theme showcase</p>
          </div>}>
            <ClientOnlyComponentPreloader
              importFn={() => import('@/components/sections/ThemeShowcase')}
              componentName="ThemeShowcase"
              trigger="scroll"
              scrollThreshold={70}
            >
              <DynamicThemeShowcase />
            </ClientOnlyComponentPreloader>
          </ErrorBoundary>
          
          {/* Success Stories Section */}
          <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Failed to load success stories section</p>
          </div>}>
            <ClientOnlyComponentPreloader
              importFn={() => import('@/components/sections/home/SuccessStories')}
              componentName="SuccessStories"
              trigger="scroll"
              scrollThreshold={60}
            >
              <DynamicSuccessStories />
            </ClientOnlyComponentPreloader>
          </ErrorBoundary>
          
          {/* Our Impact Section with Enhanced Animations */}
          <Motion.div className="bg-muted py-16" whileInView="slideUp">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Motion.h2 
                className="text-3xl font-bold mb-8" 
                whileInView="slideUp"
                transition={{ delay: 100 }}
              >
                {t('home.ourImpact', 'Our Impact')}
              </Motion.h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <AnimatedCard key={i} className="bg-background rounded-lg p-6 shadow-soft" delay={i * 0.1}>
                    <h3 className="text-lg font-semibold mb-2">{t(`home.impactStory${i}`, `Impact Story ${i}`)}</h3>
                    <p className="text-muted-foreground">
                      {t('home.impactDescription', 'Real-world impact through innovative climate solutions')}
                    </p>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </Motion.div>
        </div>
      </PageTransition>
    </>
  );
}