'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DynamicHomeHero,
  DynamicThemeShowcase, 
  DynamicServices,
  DynamicCaseStudies 
} from '@/lib/dynamic-imports';
import SuccessStories from '@/components/sections/home/SuccessStories';
import { ComponentPreloader } from '@/components/optimization/PreloadProvider';
import { SEOHead } from '@/components/seo/SEOHead';
import { HOME_SEO } from '@/lib/seo-config';
import { getDefaultSchemas } from '@/lib/structured-data';

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
          <div className="pt-20">
            <DynamicHomeHero />
          </div>
          <ComponentPreloader
            importFn={() => import('@/components/sections/home/Services')}
            componentName="Services"
            trigger="scroll"
            scrollThreshold={30}
          >
            <DynamicServices />
          </ComponentPreloader>
          
          <ComponentPreloader
            importFn={() => import('@/components/sections/home/CaseStudies')}
            componentName="CaseStudies"
            trigger="scroll"
            scrollThreshold={50}
          >
            <DynamicCaseStudies />
          </ComponentPreloader>
          
          <ComponentPreloader
            importFn={() => import('@/components/sections/ThemeShowcase')}
            componentName="ThemeShowcase"
            trigger="scroll"
            scrollThreshold={70}
          >
            <DynamicThemeShowcase />
          </ComponentPreloader>
          
          {/* Success Stories Section */}
          <ComponentPreloader
            importFn={() => import('@/components/sections/home/SuccessStories')}
            componentName="SuccessStories"
            trigger="scroll"
            scrollThreshold={60}
          >
            <SuccessStories />
          </ComponentPreloader>
          
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
