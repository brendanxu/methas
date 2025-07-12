'use client';

import React from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { useInView } from 'react-intersection-observer';
import { Section } from '@/components/ui/Section';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/Button';
import { ArrowRightOutlined } from '@ant-design/icons';

const services = [
  {
    id: 'carbon-footprint',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
        />
      </svg>
    ),
    title: '碳足迹测算',
    description: '精确计算企业碳排放量，提供详细的碳足迹报告和分析，帮助企业了解自身环境影响。',
    href: '/services/carbon-footprint'
  },
  {
    id: 'carbon-reduction',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
    ),
    title: '减排项目投资',
    description: '投资高质量的碳减排项目，包括可再生能源、森林保护和技术创新等领域。',
    href: '/services/carbon-reduction'
  },
  {
    id: 'strategy-consulting',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
    ),
    title: '战略咨询',
    description: '制定全面的可持续发展战略，协助企业实现长期环境目标和商业价值的平衡。',
    href: '/services/strategy-consulting'
  },
  {
    id: 'carbon-neutral',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
        />
      </svg>
    ),
    title: '碳中和认证',
    description: '提供权威的碳中和认证服务，帮助企业获得国际认可的环保资质。',
    href: '/services/carbon-neutral-certification'
  },
  {
    id: 'supply-chain',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
        />
      </svg>
    ),
    title: '可持续供应链',
    description: '优化供应链管理，减少整体碳足迹，提升供应链透明度和可持续性。',
    href: '/services/sustainable-supply-chain'
  },
  {
    id: 'esg-reporting',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
    ),
    title: 'ESG报告',
    description: '编制专业的ESG报告，展示企业在环境、社会和治理方面的卓越表现。',
    href: '/services/esg-reporting'
  }
];

export const Services: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <Section
      id="services"
      className="py-24"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-medium mb-4">Our Solutions</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            全方位的气候解决方案
          </h2>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              custom={index}
              className="group"
            >
              <ServiceCard
                icon={
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    {service.icon}
                  </motion.div>
                }
                title={service.title}
                description={service.description}
                href={service.href}
                iconVariant="gradient"
                size="medium"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            variant="primary"
            size="large"
            icon={
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ArrowRightOutlined />
              </motion.div>
            }
            iconPosition="right"
            onClick={() => window.location.href = '/services'}
          >
            查看所有服务
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};