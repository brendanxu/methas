'use client';

import React from 'react';
import { 
  SouthPoleContainer, 
  SouthPoleSection, 
  SouthPoleGrid,
  SouthPoleHero 
} from '@/components/layout/SouthPoleLayout';
import { SouthPoleCard } from '@/components/ui/SouthPoleCard';
import { SouthPoleButton } from '@/components/ui/SouthPoleButton';
import { useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation';
import { SEOHead } from '@/components/seo/SEOHead';
import { HOME_SEO } from '@/lib/seo-config';
import { getDefaultSchemas } from '@/lib/structured-data';

// South Pole services data
const servicesData = [
  {
    id: 'environmental-certificates',
    title: 'Environmental Certificates',
    description: 'Find and fund a world of projects',
    details: 'Carbon credits, Energy Attribute Certificates, Biodiversity & other environmental credits',
    image: '/images/hero-poster.jpg',
    href: '/what-we-do/environmental-certificates',
    ctaText: 'Learn more',
    category: 'Certificates',
    badge: 'Popular',
  },
  {
    id: 'climate-consulting',
    title: 'Climate Consulting',
    description: 'Ready your business for a sustainable future',
    details: 'Measure & report impact, opportunities & risks. Set targets & net zero roadmaps. Act on value chain & engage stakeholders',
    image: '/images/hero-poster.jpg',
    href: '/what-we-do/climate-consulting',
    ctaText: 'Learn more',
    category: 'Consulting',
  },
  {
    id: 'project-finance',
    title: 'Project Finance',
    description: 'Finance decarbonisation at scale',
    details: 'Evaluate feasibility, establish methodology. Design, action & certify your project. Commercialise voluntary or Article 6 credits',
    image: '/images/hero-poster.jpg',
    href: '/what-we-do/project-finance',
    ctaText: 'Learn more',
    category: 'Finance',
  },
];

// Case studies data
const caseStudiesData = [
  {
    id: 'nestle-net-zero',
    title: 'Building a net zero roadmap for Nestlé',
    description: 'With a significant agricultural value chain, including multiple brands with individual greenhouse gas footprints, achieving Net Zero for Nestle is a complicated process. Nestle needed a roadmap to get there.',
    image: '/images/hero-poster.jpg',
    href: '/work/nestle-how-they-built-a-roadmap-to-net-zero',
    ctaText: 'Read more',
  },
  {
    id: 'bentley-plastic',
    title: 'Driving net zero plastic to nature for Bentley',
    description: 'With South Pole\'s help, Bentley Motors has set an unprecedented standard in the luxury car industry: Net Zero Plastic to Nature.',
    image: '/images/hero-poster.jpg',
    href: '/work/bentley-achieving-net-zero-plastic-to-nature',
    ctaText: 'Read more',
  },
  {
    id: 'philips-renewable',
    title: 'Sourcing long term renewable energy for Philips',
    description: 'South Pole supports Philips to secure long-term renewable electricity from an innovative fishery-solar plant in China.',
    image: '/images/hero-poster.jpg',
    href: '/news/south-pole-supports-philips-secure-renewable-electricity-agreement',
    ctaText: 'Learn more',
  },
];

// Publications data
const publicationsData = [
  {
    id: 'carbon-market-guide',
    title: 'The 2025 Carbon Market Buyer\'s Guide',
    description: 'Explore key carbon market trends, compliance, and integrity updates. Download the 2025 Buyer\'s Guide for expert insights on carbon credits and Article 6.',
    image: '/images/hero-poster.jpg',
    href: '/publications/2025-carbon-market-buyers-guide',
    ctaText: 'Download now',
    badge: 'Latest',
  },
  {
    id: 'article-6-guide',
    title: 'A Quick Guide to Article 6',
    description: 'This 20-minute guide explains Article 6 of the Paris Agreement, why it is important, how it helps countries and companies meet their climate targets, and more.',
    image: '/images/hero-poster.jpg',
    href: '/publications/quick-guide-to-article-6',
    ctaText: 'Read more',
  },
  {
    id: 'sbti-update',
    title: 'Summary of the July 2024 SBTi Update on Scope 3 Emissions Target',
    description: 'Download our summary of the recent SBTi update on scope 3 emissions target and environmental attribute certificates (EACs). Get key insights, actionable takeaways, and expert perspectives.',
    image: '/images/hero-poster.jpg',
    href: '/publications/briefing-on-sbti-update',
    ctaText: 'Find out more',
  },
];

export default function SouthPoleHomePage() {
  const { ref: servicesRef, visibleItems: servicesVisible } = useStaggeredScrollAnimation(servicesData.length, {
    threshold: 0.2,
    delay: 200,
  });

  const { ref: caseStudiesRef, visibleItems: caseStudiesVisible } = useStaggeredScrollAnimation(caseStudiesData.length, {
    threshold: 0.2,
    delay: 300,
  });

  const { ref: publicationsRef, visibleItems: publicationsVisible } = useStaggeredScrollAnimation(publicationsData.length, {
    threshold: 0.2,
    delay: 400,
  });

  return (
    <>
      <SEOHead 
        config={HOME_SEO}
        basePath="/"
        schemaData={getDefaultSchemas()}
      />
      
      {/* Hero Section */}
      <SouthPoleHero
        backgroundImage="/images/homepage-main-hero-option-3_640x1036.jpg"
        overlay={true}
        overlayOpacity={0.5}
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
              It's time for a net zero world.
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
              Hello, we're South Pole. The Climate Company.
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
              We've been helping organisations decarbonise and navigate the complexities of climate since 2006.
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
                maxWidth: '900px',
                margin: '0 auto',
                lineHeight: 'var(--sp-leading-relaxed)',
              }}
            >
              With over 800 employees in more than 20 countries, we create global impact by helping organisations decarbonise and navigate the complexities of climate in ways that are good for business, people and planet.
            </p>
          </div>

          <div ref={servicesRef}>
            <SouthPoleGrid columns={3} gap="xl">
              {servicesData.map((service, index) => (
                <div
                  key={service.id}
                  className={`sp-hover-lift ${
                    servicesVisible[index] ? 'sp-animate-fade-in-up' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <SouthPoleCard
                    id={service.id}
                    title={service.title}
                    description={service.details}
                    image={service.image}
                    href={service.href}
                    ctaText={service.ctaText}
                    category={service.category}
                    badge={service.badge}
                    variant="default"
                  />
                </div>
              ))}
            </SouthPoleGrid>
          </div>
        </SouthPoleContainer>
      </SouthPoleSection>

      {/* Case Studies Section */}
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

          <div ref={caseStudiesRef}>
            <SouthPoleGrid columns={3} gap="xl">
              {caseStudiesData.map((caseStudy, index) => (
                <div
                  key={caseStudy.id}
                  className={`sp-hover-lift ${
                    caseStudiesVisible[index] ? 'sp-animate-fade-in-up' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                  }}
                >
                  <SouthPoleCard
                    id={caseStudy.id}
                    title={caseStudy.title}
                    description={caseStudy.description}
                    image={caseStudy.image}
                    href={caseStudy.href}
                    ctaText={caseStudy.ctaText}
                    variant="default"
                  />
                </div>
              ))}
            </SouthPoleGrid>
          </div>
        </SouthPoleContainer>
      </SouthPoleSection>

      {/* Publications Section */}
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
              Learning and insights
            </h2>
            
            <p
              className="sp-scroll-reveal sp-animation-delay-200"
              style={{
                fontSize: 'var(--sp-text-lg)',
                color: 'var(--sp-text-secondary)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 'var(--sp-leading-relaxed)',
              }}
            >
              The complexities of climate, simplified
            </p>
          </div>

          <div ref={publicationsRef}>
            <SouthPoleGrid columns={3} gap="xl">
              {publicationsData.map((publication, index) => (
                <div
                  key={publication.id}
                  className={`sp-hover-lift ${
                    publicationsVisible[index] ? 'sp-animate-fade-in-up' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                  }}
                >
                  <SouthPoleCard
                    id={publication.id}
                    title={publication.title}
                    description={publication.description}
                    image={publication.image}
                    href={publication.href}
                    ctaText={publication.ctaText}
                    badge={publication.badge}
                    variant="default"
                  />
                </div>
              ))}
            </SouthPoleGrid>
          </div>
        </SouthPoleContainer>
      </SouthPoleSection>

      {/* Commitment Section */}
      <SouthPoleSection background="primary" padding="2xl">
        <SouthPoleContainer>
          <SouthPoleGrid columns={2} gap="xl">
            <div className="sp-scroll-reveal">
              <SouthPoleCard
                id="integrity-commitment"
                title="Our commitment to integrity"
                description="Discover how South Pole drives integrity in the carbon market with robust risk management, enhanced quality controls, and strict compliance protocols. Learn about our commitment to transparency and ethical practices."
                image="/images/hero-poster.jpg"
                href="/about-us/our-commitment-to-integrity"
                ctaText="Read more"
                variant="featured"
                imageAspectRatio="1:1"
              />
            </div>

            <div className="sp-scroll-reveal sp-animation-delay-300">
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                height: '100%',
                padding: 'var(--sp-space-8)',
              }}>
                <h3
                  style={{
                    fontSize: 'var(--sp-text-3xl)',
                    fontWeight: 'var(--sp-fw-semibold)',
                    fontFamily: 'var(--sp-font-condensed)',
                    marginBottom: 'var(--sp-space-4)',
                    color: 'var(--sp-text-primary)',
                  }}
                >
                  Why South Pole?
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-space-6)' }}>
                  <div>
                    <h4 style={{ 
                      fontSize: 'var(--sp-text-xl)', 
                      fontWeight: 'var(--sp-fw-medium)',
                      marginBottom: 'var(--sp-space-2)',
                      color: 'var(--sp-text-primary)',
                    }}>
                      Unique experience
                    </h4>
                    <p style={{ 
                      fontSize: 'var(--sp-text-base)', 
                      color: 'var(--sp-text-secondary)',
                      lineHeight: 'var(--sp-leading-relaxed)',
                    }}>
                      With over 18 years experience, we can help you navigate challenges and changes in the market.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ 
                      fontSize: 'var(--sp-text-xl)', 
                      fontWeight: 'var(--sp-fw-medium)',
                      marginBottom: 'var(--sp-space-2)',
                      color: 'var(--sp-text-primary)',
                    }}>
                      Specialist expertise
                    </h4>
                    <p style={{ 
                      fontSize: 'var(--sp-text-base)', 
                      color: 'var(--sp-text-secondary)',
                      lineHeight: 'var(--sp-leading-relaxed)',
                    }}>
                      Climate is not something we do, it's what we do.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ 
                      fontSize: 'var(--sp-text-xl)', 
                      fontWeight: 'var(--sp-fw-medium)',
                      marginBottom: 'var(--sp-space-2)',
                      color: 'var(--sp-text-primary)',
                    }}>
                      Global presence
                    </h4>
                    <p style={{ 
                      fontSize: 'var(--sp-text-base)', 
                      color: 'var(--sp-text-secondary)',
                      lineHeight: 'var(--sp-leading-relaxed)',
                    }}>
                      With offices and representations in over 30 countries, we think global and act local.
                    </p>
                  </div>
                </div>
              </div>
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
    </>
  );
}