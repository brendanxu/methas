'use client';

import React, { useState } from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { Section } from '@/components/ui/Section';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { StatCard } from '@/components/ui/StatCard';
import { BaseCard } from '@/components/ui/BaseCard';
import { useThemeColors } from '@/app/providers';

const SectionDemo = () => {
  const colors = useThemeColors();
  const [selectedConfig, setSelectedConfig] = useState({
    spacing: 'normal',
    background: 'white',
    width: 'container',
    pattern: 'none',
    dividers: false,
  });

  // Sample content for demonstrations
  const sampleServices = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Carbon Strategy",
      description: "Comprehensive carbon reduction planning and implementation for sustainable business operations.",
      href: "/services/carbon-strategy"
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Climate Analytics",
      description: "Data-driven insights and analytics to measure, monitor, and optimize your climate impact.",
      href: "/services/analytics"
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Renewable Energy",
      description: "Transition to clean energy sources with customized renewable energy solutions and implementation.",
      href: "/services/renewable"
    }
  ];

  const sampleStats = [
    {
      title: "CO₂ Reduced",
      value: 2500000,
      suffix: " tons",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: { direction: "up" as const, percentage: 23.5, label: "this year" }
    },
    {
      title: "Projects",
      value: 850,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      trend: { direction: "up" as const, percentage: 12.3, label: "completed" }
    },
    {
      title: "Countries",
      value: 45,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      showTrend: false
    },
    {
      title: "Partners",
      value: 120,
      suffix: "+",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      trend: { direction: "neutral" as const, percentage: 2.1, label: "growing" }
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Section
        background="gradient"
        spacing="large"
        width="container"
        gradientFrom={colors.primary}
        gradientTo={colors.secondary}
        title="Section Component Demo"
        subtitle="Layout System"
        description="Explore our flexible Section component with various backgrounds, spacing, and layout options for creating beautiful page sections."
        centered
      />

      {/* Configuration Panel */}
      <Section
        background="white"
        spacing="normal"
        width="container"
        title="Interactive Configuration"
        subtitle="Customize"
        description="Adjust the settings below to see how different Section configurations work together."
      >
        <BaseCard padding="large" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Spacing Control */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.foreground }}>
                Spacing
              </label>
              <select
                value={selectedConfig.spacing}
                onChange={(e) => setSelectedConfig(prev => ({ ...prev, spacing: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Background Control */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.foreground }}>
                Background
              </label>
              <select
                value={selectedConfig.background}
                onChange={(e) => setSelectedConfig(prev => ({ ...prev, background: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
              >
                <option value="white">White</option>
                <option value="gray">Gray</option>
                <option value="dark">Dark</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>

            {/* Width Control */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.foreground }}>
                Width
              </label>
              <select
                value={selectedConfig.width}
                onChange={(e) => setSelectedConfig(prev => ({ ...prev, width: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
              >
                <option value="full">Full Width</option>
                <option value="container">Container</option>
                <option value="narrow">Narrow</option>
              </select>
            </div>

            {/* Pattern Control */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.foreground }}>
                Pattern
              </label>
              <select
                value={selectedConfig.pattern}
                onChange={(e) => setSelectedConfig(prev => ({ ...prev, pattern: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
              >
                <option value="none">None</option>
                <option value="dots">Dots</option>
                <option value="grid">Grid</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedConfig.dividers}
                onChange={(e) => setSelectedConfig(prev => ({ ...prev, dividers: e.target.checked }))}
                className="rounded"
              />
              <span style={{ color: colors.foreground }}>Show dividers</span>
            </label>
          </div>
        </BaseCard>
      </Section>

      {/* Demo Section with Selected Configuration */}
      <Section
        spacing={selectedConfig.spacing as 'compact' | 'normal' | 'large'}
        background={selectedConfig.background as 'white' | 'gray' | 'dark' | 'gradient'}
        width={selectedConfig.width as 'full' | 'container' | 'narrow'}
        pattern={selectedConfig.pattern as 'none' | 'dots' | 'grid'}
        topDivider={selectedConfig.dividers}
        bottomDivider={selectedConfig.dividers}
        title="Configurable Demo Section"
        subtitle="Live Preview"
        description="This section updates based on your configuration choices above. You can see how different combinations work together."
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleServices.map((service, index) => (
            <ServiceCard
              key={index}
              {...service}
              iconVariant={selectedConfig.background === 'dark' ? 'secondary' : 'primary'}
            />
          ))}
        </div>
      </Section>

      {/* Services Section */}
      <Section
        background="gray"
        spacing="large"
        width="container"
        title="Our Climate Solutions"
        subtitle="Services"
        description="Comprehensive sustainability services designed to help organizations achieve their environmental goals and build a more sustainable future."
        pattern="dots"
        topDivider
        bottomDivider
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ServiceCard {...service} iconVariant="gradient" />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Statistics Section */}
      <Section
        background="dark"
        spacing="large"
        width="container"
        title="Our Global Impact"
        subtitle="Numbers that matter"
        description="Real results from our sustainability initiatives around the world, demonstrating the power of collective climate action."
        centered
        pattern="grid"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StatCard
                {...stat}
                iconVariant="success"
                size="medium"
              />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Background Image Section */}
      <Section
        backgroundImage="https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        spacing="large"
        width="narrow"
        title="Antarctica: Our Research Foundation"
        subtitle="Scientific Excellence"
        description="From the pristine Antarctic wilderness, we conduct cutting-edge climate research that informs our global sustainability strategies and solutions."
        centered
      />

      {/* Narrow Width Section */}
      <Section
        background="white"
        spacing="normal"
        width="narrow"
        title="Why Choose South Pole?"
        subtitle="Our Advantage"
        description="We combine scientific rigor with practical solutions, delivering measurable environmental impact for organizations worldwide. Our comprehensive approach ensures that sustainability initiatives are both effective and economically viable."
        centered
      >
        <div className="prose prose-lg mx-auto" style={{ color: colors.mutedForeground }}>
          <p>
            Our team of climate scientists, sustainability experts, and technology innovators work together 
            to create solutions that make a real difference. From carbon reduction strategies to renewable 
            energy implementation, we provide the expertise and tools needed for successful environmental stewardship.
          </p>
        </div>
      </Section>

      {/* Code Examples */}
      <Section
        background="gray"
        spacing="normal"
        width="container"
        title="Usage Examples"
        subtitle="Implementation"
        description="Here are some common Section component usage patterns and code examples."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BaseCard padding="medium">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
              Basic Section
            </h3>
            <pre 
              className="p-4 rounded-lg text-sm overflow-x-auto"
              style={{ 
                backgroundColor: colors.muted,
                color: colors.mutedForeground 
              }}
            >
{`<Section 
  title="Section Title"
  subtitle="Section Subtitle"
  description="Section description text"
>
  {children}
</Section>`}
            </pre>
          </BaseCard>

          <BaseCard padding="medium">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
              Advanced Section
            </h3>
            <pre 
              className="p-4 rounded-lg text-sm overflow-x-auto"
              style={{ 
                backgroundColor: colors.muted,
                color: colors.mutedForeground 
              }}
            >
{`<Section 
  background="gradient"
  spacing="large"
  width="narrow"
  pattern="dots"
  topDivider
  bottomDivider
  centered
  gradientFrom="#0066CC"
  gradientTo="#00A86B"
>
  {children}
</Section>`}
            </pre>
          </BaseCard>
        </div>
      </Section>
    </div>
  );
};

export default SectionDemo;