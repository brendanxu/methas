'use client';

import { SEOHead } from '@/components/seo/SEOHead';
import { HOME_SEO } from '@/lib/seo-config';
import { getDefaultSchemas } from '@/lib/structured-data';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import dynamic from 'next/dynamic';

// 动态导入需要交互的组件
const DynamicHomeHero = dynamic(() => import('@/components/sections/home/Hero'), {
  loading: () => <div className="pt-20 min-h-[50vh] animate-pulse bg-muted" />
});

const DynamicInteractiveServices = dynamic(() => import('@/components/sections/home/InteractiveServices'), {
  loading: () => <div className="min-h-[40vh] animate-pulse bg-muted" />
});

const DynamicInteractiveCaseStudies = dynamic(() => import('@/components/sections/home/InteractiveCaseStudies'), {
  loading: () => <div className="min-h-[40vh] animate-pulse bg-muted" />
});

const DynamicInteractiveNewsletterForm = dynamic(() => import('@/components/forms/InteractiveNewsletterForm'), {
  loading: () => <div className="min-h-[200px] animate-pulse bg-muted rounded-lg" />
});

// 静态内容组件（服务端渲染）
function StaticClimateSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold mb-8">Climate Solutions</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Carbon Offset",
            description: "Comprehensive carbon offset solutions for your business"
          },
          {
            title: "Renewable Energy",
            description: "Transition to sustainable renewable energy sources"
          },
          {
            title: "Climate Strategy",
            description: "Strategic planning for climate-positive operations"
          }
        ].map((solution, i) => (
          <div key={i} className="bg-card rounded-lg p-6 shadow-soft border border-border">
            <h3 className="text-xl font-semibold mb-4">{solution.title}</h3>
            <p className="text-muted-foreground">
              {solution.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaticImpactSection() {
  return (
    <div className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
        <div className="space-y-4">
          {[
            "Reduced 2M+ tons of CO2 emissions globally",
            "Partnered with 500+ companies worldwide",
            "Implemented solutions across 50+ countries",
            "Generated $100M+ in carbon credit revenue"
          ].map((impact, i) => (
            <div key={i} className="bg-background rounded-lg p-6 shadow-soft">
              <h3 className="text-lg font-semibold mb-2">Impact Milestone {i + 1}</h3>
              <p className="text-muted-foreground">{impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePageClient() {
  return (
    <>
      <SEOHead 
        config={HOME_SEO}
        basePath="/"
        schemaData={getDefaultSchemas()}
      />
      
      <div>
        {/* 动态交互英雄区块 */}
        <ErrorBoundary fallback={<div className="pt-20 min-h-[50vh] flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Failed to load hero section</p>
        </div>}>
          <div className="pt-20">
            <DynamicHomeHero />
          </div>
        </ErrorBoundary>
        
        {/* 静态气候解决方案区块 - 服务端渲染 */}
        <StaticClimateSection />
        
        {/* 动态交互服务区块 */}
        <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Failed to load services section</p>
        </div>}>
          <DynamicInteractiveServices />
        </ErrorBoundary>
        
        {/* 静态影响力区块 - 服务端渲染 */}
        <StaticImpactSection />
        
        {/* 动态交互案例研究区块 */}
        <ErrorBoundary fallback={<div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Failed to load case studies section</p>
        </div>}>
          <DynamicInteractiveCaseStudies />
        </ErrorBoundary>
        
        {/* Newsletter订阅区块 - 静态+动态混合 */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* 静态介绍内容 - 服务端渲染 */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
                <p className="text-xl text-primary-foreground/80 mb-6">
                  Get the latest climate insights, industry trends, and actionable sustainability strategies delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-primary-foreground/20 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-foreground text-sm">✓</span>
                    </div>
                    <span className="text-primary-foreground/90">Weekly climate insights and market updates</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary-foreground/20 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-foreground text-sm">✓</span>
                    </div>
                    <span className="text-primary-foreground/90">Exclusive access to research and case studies</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary-foreground/20 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-foreground text-sm">✓</span>
                    </div>
                    <span className="text-primary-foreground/90">Early invitations to webinars and events</span>
                  </div>
                </div>
              </div>
              
              {/* 动态Newsletter表单 */}
              <ErrorBoundary fallback={<div className="min-h-[200px] flex items-center justify-center bg-background/10 rounded-lg">
                <p className="text-primary-foreground/60">Failed to load newsletter form</p>
              </div>}>
                <DynamicInteractiveNewsletterForm 
                  variant="card" 
                  showInterests={true}
                  className="bg-background text-foreground"
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}