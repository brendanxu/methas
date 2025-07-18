'use client';

import React from 'react';
import { 
  SouthPoleLayout, 
  SouthPoleContainer, 
  SouthPoleSection, 
  SouthPoleGrid,
  SouthPoleHero 
} from '@/components/layout/SouthPoleLayout';
import { SouthPoleCard } from '@/components/ui/SouthPoleCard';
import { SouthPoleButton } from '@/components/ui/SouthPoleButton';
import { useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation';

const demoCards = [
  {
    id: 'environmental-certificates',
    title: 'Environmental Certificates',
    description: 'Find and fund a world of projects with our comprehensive portfolio of carbon credits, energy attribute certificates, and biodiversity credits.',
    image: '/images/hero-poster.jpg',
    href: '/what-we-do/environmental-certificates',
    ctaText: 'Learn more',
    category: 'Certificates',
    badge: 'Popular',
  },
  {
    id: 'climate-consulting',
    title: 'Climate Consulting',
    description: 'Ready your business for a sustainable future with our comprehensive climate consulting services, including GHG measurement and net zero roadmaps.',
    image: '/images/hero-poster.jpg',
    href: '/what-we-do/climate-consulting',
    ctaText: 'Explore services',
    category: 'Consulting',
  },
  {
    id: 'project-finance',
    title: 'Project Finance',
    description: 'Finance decarbonisation at scale through our project development and certification services for voluntary and Article 6 credits.',
    image: '/images/hero-poster.jpg',
    href: '/what-we-do/project-finance',
    ctaText: 'Get started',
    category: 'Finance',
    badge: 'New',
  },
];

export default function SouthPoleDemoPage() {
  const { ref: cardsRef, visibleItems } = useStaggeredScrollAnimation<HTMLDivElement>(demoCards.length, {
    threshold: 0.2,
    delay: 200,
  });

  return (
    <SouthPoleLayout>
      {/* Hero Section */}
      <SouthPoleHero
        backgroundImage="/images/homepage-main-hero-option-3_640x1036.jpg"
        overlay={true}
        overlayOpacity={0.6}
        minHeight="100vh"
      >
        <SouthPoleContainer>
          <div style={{ color: 'var(--sp-white)', textAlign: 'center' }}>
            <h1 
              className="sp-animate-fade-in-up"
              style={{
                fontSize: 'var(--sp-text-6xl)',
                fontWeight: 'var(--sp-fw-semibold)',
                fontFamily: 'var(--sp-font-condensed)',
                marginBottom: 'var(--sp-space-6)',
                lineHeight: 'var(--sp-leading-tight)',
              }}
            >
              It&apos;s time for a net zero world.
            </h1>
            
            <p 
              className="sp-animate-fade-in-up sp-animation-delay-200"
              style={{
                fontSize: 'var(--sp-text-2xl)',
                fontWeight: 'var(--sp-fw-medium)',
                marginBottom: 'var(--sp-space-4)',
                maxWidth: '800px',
                margin: '0 auto var(--sp-space-8) auto',
              }}
            >
              Hello, we&apos;re South Pole. The Climate Company.
            </p>
            
            <p 
              className="sp-animate-fade-in-up sp-animation-delay-300"
              style={{
                fontSize: 'var(--sp-text-lg)',
                marginBottom: 'var(--sp-space-8)',
                maxWidth: '600px',
                margin: '0 auto var(--sp-space-8) auto',
                lineHeight: 'var(--sp-leading-relaxed)',
              }}
            >
              We&apos;ve been helping organisations decarbonise and navigate the complexities of climate since 2006.
            </p>
            
            <div className="sp-animate-fade-in-up sp-animation-delay-500">
              <SouthPoleButton
                href="/what-we-do"
                size="lg"
                className="sp-hover-lift"
              >
                Learn more
              </SouthPoleButton>
            </div>
          </div>
        </SouthPoleContainer>
      </SouthPoleHero>

      {/* Services Section */}
      <SouthPoleSection background="primary" padding="2xl">
        <SouthPoleContainer>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-space-16)' }}>
            <h2
              className="sp-scroll-reveal"
              style={{
                fontSize: 'var(--sp-text-4xl)',
                fontWeight: 'var(--sp-fw-semibold)',
                fontFamily: 'var(--sp-font-condensed)',
                marginBottom: 'var(--sp-space-4)',
                color: 'var(--sp-text-primary)',
              }}
            >
              Three areas of expertise. One world class offer.
            </h2>
            
            <p
              className="sp-scroll-reveal sp-animation-delay-200"
              style={{
                fontSize: 'var(--sp-text-lg)',
                color: 'var(--sp-text-secondary)',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 'var(--sp-leading-relaxed)',
              }}
            >
              With over 800 employees in more than 20 countries, we create global impact by helping organisations decarbonise and navigate the complexities of climate.
            </p>
          </div>

          <div ref={cardsRef}>
            <SouthPoleGrid columns={3} gap="xl">
              {demoCards.map((card, index) => (
                <div
                  key={card.id}
                  className={`sp-hover-lift ${
                    visibleItems[index] ? 'sp-animate-fade-in-up' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <SouthPoleCard
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    image={card.image}
                    href={card.href}
                    ctaText={card.ctaText}
                    category={card.category}
                    badge={card.badge}
                    variant="default"
                  />
                </div>
              ))}
            </SouthPoleGrid>
          </div>
        </SouthPoleContainer>
      </SouthPoleSection>

      {/* Featured Content Section */}
      <SouthPoleSection background="secondary" padding="2xl">
        <SouthPoleContainer>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-space-16)' }}>
            <h2
              className="sp-scroll-reveal"
              style={{
                fontSize: 'var(--sp-text-4xl)',
                fontWeight: 'var(--sp-fw-semibold)',
                fontFamily: 'var(--sp-font-condensed)',
                marginBottom: 'var(--sp-space-4)',
                color: 'var(--sp-text-primary)',
              }}
            >
              Our work
            </h2>
          </div>

          <SouthPoleGrid columns={2} gap="xl">
            <div className="sp-scroll-reveal sp-animation-delay-200">
              <SouthPoleCard
                id="nestle-case-study"
                title="Building a net zero roadmap for Nestlé"
                description="With a significant agricultural value chain, including multiple brands with individual greenhouse gas footprints, achieving Net Zero for Nestle is a complicated process. Nestle needed a roadmap to get there."
                image="/images/hero-poster.jpg"
                href="/work/nestle-case-study"
                ctaText="Read more"
                variant="featured"
                imageAspectRatio="1:1"
              />
            </div>

            <div className="sp-scroll-reveal sp-animation-delay-400">
              <SouthPoleCard
                id="bentley-case-study"
                title="Driving net zero plastic to nature for Bentley"
                description="With South Pole's help, Bentley Motors has set an unprecedented standard in the luxury car industry: Net Zero Plastic to Nature."
                image="/images/hero-poster.jpg"
                href="/work/bentley-case-study"
                ctaText="Read more"
                variant="featured"
                imageAspectRatio="1:1"
              />
            </div>
          </SouthPoleGrid>
        </SouthPoleContainer>
      </SouthPoleSection>

      {/* CTA Section */}
      <SouthPoleSection background="dark" padding="2xl">
        <SouthPoleContainer>
          <div style={{ textAlign: 'center' }}>
            <h2
              className="sp-scroll-reveal"
              style={{
                fontSize: 'var(--sp-text-4xl)',
                fontWeight: 'var(--sp-fw-semibold)',
                fontFamily: 'var(--sp-font-condensed)',
                marginBottom: 'var(--sp-space-4)',
                color: 'var(--sp-white)',
              }}
            >
              Ready to talk?
            </h2>
            
            <p
              className="sp-scroll-reveal sp-animation-delay-200"
              style={{
                fontSize: 'var(--sp-text-lg)',
                color: 'var(--sp-white)',
                marginBottom: 'var(--sp-space-8)',
                maxWidth: '600px',
                margin: '0 auto var(--sp-space-8) auto',
                lineHeight: 'var(--sp-leading-relaxed)',
              }}
            >
              With over 800 experts in more than 20 countries, we can help with almost all of your climate challenges.
            </p>
            
            <div className="sp-scroll-reveal sp-animation-delay-400">
              <SouthPoleButton
                href="/contact-us"
                size="lg"
                className="sp-hover-lift"
              >
                Contact us
              </SouthPoleButton>
            </div>
          </div>
        </SouthPoleContainer>
      </SouthPoleSection>

      {/* Design System Demo Section */}
      <SouthPoleSection background="light" padding="2xl">
        <SouthPoleContainer>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-space-16)' }}>
            <h2
              className="sp-scroll-reveal"
              style={{
                fontSize: 'var(--sp-text-4xl)',
                fontWeight: 'var(--sp-fw-semibold)',
                fontFamily: 'var(--sp-font-condensed)',
                marginBottom: 'var(--sp-space-4)',
                color: 'var(--sp-text-primary)',
              }}
            >
              Design System Components
            </h2>
            
            <p
              className="sp-scroll-reveal sp-animation-delay-200"
              style={{
                fontSize: 'var(--sp-text-lg)',
                color: 'var(--sp-text-secondary)',
                marginBottom: 'var(--sp-space-8)',
              }}
            >
              Demonstration of South Pole design system components
            </p>
          </div>

          <div className="sp-scroll-reveal sp-animation-delay-300">
            <SouthPoleGrid columns={2} gap="xl">
              {/* Button Variants */}
              <div 
                style={{
                  padding: 'var(--sp-space-8)',
                  backgroundColor: 'var(--sp-white)',
                  borderRadius: 'var(--sp-radius-base)',
                  boxShadow: 'var(--sp-shadow-base)',
                }}
              >
                <h3 
                  style={{
                    fontSize: 'var(--sp-text-xl)',
                    fontWeight: 'var(--sp-fw-semibold)',
                    marginBottom: 'var(--sp-space-4)',
                  }}
                >
                  Button Variants
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-space-4)' }}>
                  <SouthPoleButton variant="primary" size="md">Primary Button</SouthPoleButton>
                  <SouthPoleButton variant="secondary" size="md">Secondary Button</SouthPoleButton>
                  <SouthPoleButton variant="outline" size="md">Outline Button</SouthPoleButton>
                  <SouthPoleButton variant="ghost" size="md">Ghost Button</SouthPoleButton>
                  <SouthPoleButton variant="link" size="md">Link Button</SouthPoleButton>
                </div>
              </div>

              {/* Typography */}
              <div 
                style={{
                  padding: 'var(--sp-space-8)',
                  backgroundColor: 'var(--sp-white)',
                  borderRadius: 'var(--sp-radius-base)',
                  boxShadow: 'var(--sp-shadow-base)',
                }}
              >
                <h3 
                  style={{
                    fontSize: 'var(--sp-text-xl)',
                    fontWeight: 'var(--sp-fw-semibold)',
                    marginBottom: 'var(--sp-space-4)',
                  }}
                >
                  Typography Scale
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-space-2)' }}>
                  <h1 style={{ fontSize: 'var(--sp-text-3xl)', fontFamily: 'var(--sp-font-condensed)' }}>Heading 1</h1>
                  <h2 style={{ fontSize: 'var(--sp-text-2xl)', fontFamily: 'var(--sp-font-condensed)' }}>Heading 2</h2>
                  <h3 style={{ fontSize: 'var(--sp-text-xl)', fontFamily: 'var(--sp-font-condensed)' }}>Heading 3</h3>
                  <p style={{ fontSize: 'var(--sp-text-base)' }}>Body text paragraph</p>
                  <small style={{ fontSize: 'var(--sp-text-sm)', color: 'var(--sp-text-secondary)' }}>Small text</small>
                </div>
              </div>
            </SouthPoleGrid>
          </div>
        </SouthPoleContainer>
      </SouthPoleSection>
    </SouthPoleLayout>
  );
}