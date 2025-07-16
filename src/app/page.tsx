'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DynamicEnhancedHero,
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
              title: "It's time for a net zero world.",
              subtitle: "Hello, we're South Pole. The Climate Company.",
              description: "We've been helping organisations decarbonise and navigate the complexities of climate since 2006.",
              ctaText: "Learn more",
              ctaLink: "/what-we-do"
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
          
          {/* Success Stories Section */}
          <ComponentPreloader
            importFn={() => import('@/components/sections/home/SuccessStories')}
            componentName="SuccessStories"
            trigger="scroll"
            scrollThreshold={60}
          >
            <SuccessStories />
          </ComponentPreloader>
          
          </div>
        </div>
    </>
  );
}
