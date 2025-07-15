'use client';

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from '@/lib/mock-framer-motion';
import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';

const services = [
  {
    id: 'carbon-footprint',
    title: 'Carbon Footprint Assessment',
    description: 'Comprehensive analysis of your organization\'s carbon emissions',
    details: 'Our advanced assessment tools analyze Scope 1, 2, and 3 emissions across your entire value chain.',
    benefits: ['Detailed emission breakdown', 'Benchmarking analysis', 'Reduction recommendations'],
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
        />
      </svg>
    )
  },
  {
    id: 'carbon-reduction',
    title: 'Carbon Reduction Solutions',
    description: 'Strategic implementation of emission reduction measures',
    details: 'Tailored reduction strategies that align with your business goals and budget constraints.',
    benefits: ['Cost-effective solutions', 'Implementation support', 'Performance tracking'],
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
    )
  },
  {
    id: 'strategy-consulting',
    title: 'Climate Strategy Consulting',
    description: 'Expert guidance for long-term climate strategy development',
    details: 'Develop comprehensive climate strategies that drive business value and environmental impact.',
    benefits: ['Strategic planning', 'Risk assessment', 'Stakeholder engagement'],
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
    )
  }
];

export default function InteractiveServices() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive climate solutions tailored to your business needs
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-card rounded-lg p-6 shadow-soft border transition-all duration-300 cursor-pointer ${
                activeService === service.id 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              }`}
              onClick={() => setActiveService(activeService === service.id ? null : service.id)}
            >
              <div className="flex items-center mb-4">
                <div className="text-primary mr-3">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>

              {activeService === service.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-border pt-4 mt-4"
                >
                  <p className="text-sm text-muted-foreground mb-3">
                    {service.details}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Benefits:</h4>
                    {service.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <CheckCircleOutlined className="text-primary mr-2 text-xs" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-primary font-medium">
                  {activeService === service.id ? 'Click to collapse' : 'Click to learn more'}
                </span>
                <ArrowRightOutlined 
                  className={`text-primary transition-transform duration-300 ${
                    activeService === service.id ? 'rotate-90' : ''
                  }`} 
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300">
            View All Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}