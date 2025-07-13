'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DynamicHomeHero,
  DynamicThemeShowcase, 
  DynamicServices,
  DynamicCaseStudies 
} from '@/lib/dynamic-imports';
import { ComponentPreloader } from '@/components/optimization/PreloadProvider';
import { SEOHead } from '@/components/seo/SEOHead';
import { HOME_SEO } from '@/lib/seo-config';
import { getDefaultSchemas } from '@/lib/structured-data';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function Home() {
  const { t } = useTranslation(['home']);

  return (
    <>
      <SEOHead 
        config={HOME_SEO}
        basePath="/"
        schemaData={getDefaultSchemas()}
      />
      
        <div>
          {/* Add padding-top to account for fixed header */}
          <ErrorBoundary fallback={<div className="pt-20 min-h-[50vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Failed to load hero section</p>
          </div>}>
            <div className="pt-20">
              <DynamicHomeHero />
            </div>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Failed to load services section</p>
          </div>}>
            <ComponentPreloader
              importFn={() => import('@/components/sections/home/Services')}
              componentName="Services"
              trigger="scroll"
              scrollThreshold={30}
            >
              <DynamicServices />
            </ComponentPreloader>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Failed to load case studies section</p>
          </div>}>
            <ComponentPreloader
              importFn={() => import('@/components/sections/home/CaseStudies')}
              componentName="CaseStudies"
              trigger="scroll"
              scrollThreshold={50}
            >
              <DynamicCaseStudies />
            </ComponentPreloader>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Failed to load theme showcase</p>
          </div>}>
            <ComponentPreloader
              importFn={() => import('@/components/sections/ThemeShowcase')}
              componentName="ThemeShowcase"
              trigger="scroll"
              scrollThreshold={70}
            >
              <DynamicThemeShowcase />
            </ComponentPreloader>
          </ErrorBoundary>
          
          {/* Test content to verify scroll effects */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-8">{t('home:sections.climateSolutions')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 shadow-soft border border-border">
                  <h3 className="text-xl font-semibold mb-4">{t('home:sections.solution')} {i}</h3>
                  <p className="text-muted-foreground">
                    {t('home:content.solutionDescription')}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Additional content for scroll testing */}
          <div className="bg-muted py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8">{t('home:sections.ourImpact')}</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-background rounded-lg p-6 shadow-soft">
                    <h3 className="text-lg font-semibold mb-2">{t('home:sections.impactStory')} {i}</h3>
                    <p className="text-muted-foreground">
                      {t('home:content.impactDescription')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
