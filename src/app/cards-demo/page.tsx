'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BaseCard } from '@/components/ui/BaseCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { CaseCard } from '@/components/ui/CaseCard';
import { NewsCard } from '@/components/ui/NewsCard';
import { StatCard } from '@/components/ui/StatCard';
import { useThemeColors } from '@/app/providers';

const CardsDemo = () => {
  const colors = useThemeColors();
  const [loadingStates, setLoadingStates] = useState({
    base: false,
    service: false,
    case: false,
    news: false,
    stat: false,
  });

  const toggleLoading = (cardType: keyof typeof loadingStates) => {
    setLoadingStates(prev => ({
      ...prev,
      [cardType]: !prev[cardType]
    }));
  };

  // Sample data
  const sampleService = {
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Carbon Consulting",
    description: "Expert guidance on carbon reduction strategies and sustainability initiatives for your organization.",
    href: "/services/carbon-consulting"
  };

  const sampleCase = {
    imageUrl: "https://images.unsplash.com/photo-1497436072909-f5e4be1713b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Renewable energy project",
    clientLogo: "https://via.placeholder.com/48x48/0066CC/FFFFFF?text=TC",
    clientName: "TechCorp Industries",
    title: "Reducing Carbon Footprint by 40% Through Renewable Energy Integration",
    summary: "A comprehensive sustainability transformation that helped TechCorp achieve significant emissions reduction while maintaining operational efficiency and cost effectiveness.",
    tags: [
      { label: "Technology", color: "primary" as const, type: "industry" as const },
      { label: "Renewable Energy", color: "success" as const, type: "service" as const },
      { label: "Europe", color: "secondary" as const, type: "region" as const },
    ],
    href: "/case-studies/techcorp-renewable"
  };

  const sampleNews = {
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Antarctic landscape",
    title: "New Antarctic Research Reveals Critical Climate Insights",
    excerpt: "Recent studies from our Antarctic research stations provide unprecedented data on ice sheet dynamics and their implications for global climate patterns.",
    publishedAt: new Date('2024-03-15'),
    category: "Research",
    readingTime: 5,
    author: "Dr. Sarah Chen",
    href: "/news/antarctic-research-insights"
  };

  const sampleStat = {
    title: "CO₂ Emissions Reduced",
    value: 125000,
    suffix: " tons",
    description: "Total carbon emissions prevented through our sustainability programs this year",
    trend: {
      direction: "up" as const,
      percentage: 15.3,
      label: "vs last year"
    },
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: colors.foreground }}
          >
            Card Components Demo
          </h1>
          <p 
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.mutedForeground }}
          >
            Explore our comprehensive card component system featuring BaseCard, ServiceCard, CaseCard, NewsCard, and StatCard with various configurations and loading states.
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <BaseCard 
            padding="medium" 
            className="mb-8"
          >
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{ color: colors.foreground }}
            >
              Loading State Controls
            </h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(loadingStates).map(([key, isLoading]) => (
                <button
                  key={key}
                  onClick={() => toggleLoading(key as keyof typeof loadingStates)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLoading 
                      ? 'text-white' 
                      : `border-2 hover:text-white`
                  }`}
                  style={{
                    backgroundColor: isLoading ? colors.primary : 'transparent',
                    borderColor: colors.primary,
                    color: isLoading ? 'white' : colors.primary,
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} Card {isLoading ? '(Loading)' : ''}
                </button>
              ))}
            </div>
          </BaseCard>
        </motion.div>

        {/* BaseCard Examples */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ color: colors.foreground }}
          >
            BaseCard Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <BaseCard 
              variant="default" 
              padding="medium" 
              hoverable 
              loading={loadingStates.base}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
                Default Card
              </h3>
              <p style={{ color: colors.mutedForeground }}>
                Standard card with subtle shadow and hover effects.
              </p>
            </BaseCard>
            <BaseCard 
              variant="bordered" 
              padding="medium" 
              hoverable 
              loading={loadingStates.base}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
                Bordered Card
              </h3>
              <p style={{ color: colors.mutedForeground }}>
                Card with prominent border styling.
              </p>
            </BaseCard>
            <BaseCard 
              variant="glass" 
              padding="medium" 
              hoverable 
              loading={loadingStates.base}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
                Glass Card
              </h3>
              <p style={{ color: colors.mutedForeground }}>
                Translucent card with backdrop blur effect.
              </p>
            </BaseCard>
          </div>
        </motion.section>

        {/* ServiceCard Examples */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ color: colors.foreground }}
          >
            ServiceCard Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard
              {...sampleService}
              iconVariant="primary"
              size="small"
              loading={loadingStates.service}
            />
            <ServiceCard
              {...sampleService}
              iconVariant="gradient"
              size="medium"
              loading={loadingStates.service}
            />
            <ServiceCard
              {...sampleService}
              iconVariant="success"
              size="large"
              loading={loadingStates.service}
            />
          </div>
        </motion.section>

        {/* CaseCard Examples */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ color: colors.foreground }}
          >
            CaseCard Example
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CaseCard
              {...sampleCase}
              loading={loadingStates.case}
            />
            <CaseCard
              {...sampleCase}
              showLogo={false}
              maxTags={2}
              loading={loadingStates.case}
            />
          </div>
        </motion.section>

        {/* NewsCard Examples */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ color: colors.foreground }}
          >
            NewsCard Layouts
          </h2>
          <div className="space-y-6">
            <NewsCard
              {...sampleNews}
              layout="horizontal"
              loading={loadingStates.news}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NewsCard
                {...sampleNews}
                layout="vertical"
                loading={loadingStates.news}
              />
              <NewsCard
                {...sampleNews}
                layout="vertical"
                showAuthor={false}
                showReadingTime={false}
                loading={loadingStates.news}
              />
            </div>
          </div>
        </motion.section>

        {/* StatCard Examples */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ color: colors.foreground }}
          >
            StatCard Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              {...sampleStat}
              size="small"
              iconVariant="success"
              loading={loadingStates.stat}
            />
            <StatCard
              title="Projects Completed"
              value={284}
              description="Successfully delivered sustainability projects"
              trend={{
                direction: "up",
                percentage: 23.1,
                label: "this quarter"
              }}
              size="medium"
              iconVariant="primary"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              loading={loadingStates.stat}
            />
            <StatCard
              title="Revenue Growth"
              value={12.5}
              suffix="%"
              description="Year-over-year revenue increase"
              trend={{
                direction: "neutral",
                percentage: 0.2,
                label: "stable"
              }}
              size="medium"
              iconVariant="warning"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
              loading={loadingStates.stat}
            />
            <StatCard
              title="Team Members"
              value={47}
              description="Dedicated sustainability experts"
              iconPosition="top"
              size="medium"
              iconVariant="secondary"
              showTrend={false}
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              loading={loadingStates.stat}
            />
          </div>
        </motion.section>

        {/* Code Examples */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ color: colors.foreground }}
          >
            Usage Examples
          </h2>
          <BaseCard padding="medium">
            <h3 
              className="text-xl font-semibold mb-4"
              style={{ color: colors.foreground }}
            >
              Quick Start
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2" style={{ color: colors.foreground }}>
                  Import Components:
                </h4>
                <pre 
                  className="p-4 rounded-lg text-sm overflow-x-auto"
                  style={{ 
                    backgroundColor: colors.muted,
                    color: colors.mutedForeground 
                  }}
                >
{`import { BaseCard, ServiceCard, CaseCard, NewsCard, StatCard } from '@/components/ui';`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2" style={{ color: colors.foreground }}>
                  Basic ServiceCard:
                </h4>
                <pre 
                  className="p-4 rounded-lg text-sm overflow-x-auto"
                  style={{ 
                    backgroundColor: colors.muted,
                    color: colors.mutedForeground 
                  }}
                >
{`<ServiceCard
  icon={<YourIcon />}
  title="Service Title"
  description="Service description"
  href="/service-link"
/>`}
                </pre>
              </div>
            </div>
          </BaseCard>
        </motion.section>
      </div>
    </div>
  );
};

export default CardsDemo;