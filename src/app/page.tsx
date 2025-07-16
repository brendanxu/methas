'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DynamicHomeHero,
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
    </>
  );
}
