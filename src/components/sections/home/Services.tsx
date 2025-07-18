'use client';

import React from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { Section } from '@/components/ui/Section';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/Button';
import { ArrowRightOutlined } from '@ant-design/icons';

const getServiceIcons = () => ({
  carbonAssetManagement: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
      />
    </svg>
  ),
  methaneRemovalInvestment: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M13 10V3L4 14h7v7l9-11h-7z" 
      />
    </svg>
  ),
  esgCarbonConsulting: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
      />
    </svg>
  ),
  greenSupplyChain: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
      />
    </svg>
  ),
});

export const Services: React.FC = () => {
  const { t } = useTranslation('services');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const icons = getServiceIcons();
  
  const services = [
    {
      id: 'carbon-asset-management',
      icon: icons.carbonAssetManagement,
      title: '碳资产管理',
      description: '碳足迹核算、碳资产开发、碳交易管理，助力企业实现碳资产价值最大化',
      href: '/service-types/carbon-asset-management'
    },
    {
      id: 'methane-removal-investment',
      icon: icons.methaneRemovalInvestment,
      title: '甲烷清除投资',
      description: '减排效果是CO₂的25-84倍，专注甲烷减排投资，引领碳中和未来',
      href: '/service-types/methane-removal-investment'
    },
    {
      id: 'esg-carbon-consulting',
      icon: icons.esgCarbonConsulting,
      title: 'ESG与碳咨询',
      description: '双碳战略规划、ESG报告编制、可持续发展咨询，全方位支持企业绿色转型',
      href: '/service-types/esg-carbon-consulting'
    },
    {
      id: 'green-supply-chain',
      icon: icons.greenSupplyChain,
      title: '绿色供应链',
      description: '供应商碳管理、产品碳足迹、绿色采购体系，构建可持续供应链生态',
      href: '/service-types/green-supply-chain'
    }
  ];

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
          <p className="text-primary font-medium mb-4">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            四大核心服务
          </h2>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
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
            onClick={() => window.location.href = '/service-types'}
          >
            查看全部服务
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};