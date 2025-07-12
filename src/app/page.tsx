'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Hero } from '@/components/sections/Hero';
import { ThemeShowcase } from '@/components/sections/ThemeShowcase';
import { Services } from '@/components/sections/home/Services';
import { CaseStudies } from '@/components/sections/home/CaseStudies';

// Metadata will be handled by layout.tsx with i18n

export default function Home() {
  const { t } = useTranslation(['home']);

  return (
    <>
      
        <div>
          {/* Add padding-top to account for fixed header */}
          <div className="pt-20">
            <Hero />
          </div>
          <Services />
          <CaseStudies />
          <ThemeShowcase />
          
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
