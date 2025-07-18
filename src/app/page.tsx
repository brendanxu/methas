'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DynamicEnhancedHero,
  DynamicEnhancedServices,
  DynamicCaseStudies,
  DynamicCarbonIntelligence 
} from '@/lib/dynamic-imports';
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
          {/* Enhanced Hero - Full viewport height, no padding needed */}
          <DynamicEnhancedHero 
            videoConfig={{
              mp4Url: '/videos/southpole-hero.mp4',
              webmUrl: '/videos/southpole-hero.webm',
              posterUrl: '/images/hero-poster.jpg',
              enableVideo: true,
              disableOnMobile: true
            }}
            backgroundImage="/images/homepage-main-hero-option-3_640x1036.jpg"
            content={{
              title: "甲烷清除投资，引领碳中和未来",
              subtitle: "专业的甲烷减排解决方案",
              description: "甲烷温室效应是CO₂的25-84倍，我们专注于甲烷减排投资，为企业提供高效的碳中和解决方案。",
              ctaText: "了解甲烷减排",
              ctaLink: "/service-types/methane-removal-investment"
            }}
            visual={{
              overlayOpacity: 0.5,
              textAlignment: 'center',
              showScrollHint: true,
              theme: 'dark'
            }}
          />
          
          {/* Add padding-top to subsequent sections to account for fixed header */}
          <div className="pt-20">
          <ComponentPreloader
            importFn={() => import('@/components/sections/home/EnhancedServices')}
            componentName="EnhancedServices"
            trigger="scroll"
            scrollThreshold={30}
          >
            <DynamicEnhancedServices />
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
            importFn={() => import('@/components/sections/home/CarbonIntelligence')}
            componentName="CarbonIntelligence"
            trigger="scroll"
            scrollThreshold={70}
          >
            <DynamicCarbonIntelligence />
          </ComponentPreloader>
          
          </div>
        </div>
    </>
  );
}
