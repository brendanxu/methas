'use client';

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from '@/lib/mock-framer-motion';
import { ArrowRightOutlined, TrophyOutlined, GlobalOutlined, DollarOutlined } from '@ant-design/icons';

const caseStudies = [
  {
    id: 'tech-company',
    title: 'Global Tech Company',
    subtitle: 'Carbon Neutral in 18 Months',
    description: 'Helped a Fortune 500 technology company achieve carbon neutrality across all operations.',
    results: {
      emissions: '85% reduction in CO2 emissions',
      savings: '$2.3M annual cost savings',
      timeline: '18 months to carbon neutral'
    },
    image: '/images/case-study-tech.jpg',
    tags: ['Technology', 'Carbon Neutral', 'Cost Savings']
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Corporation',
    subtitle: 'Sustainable Supply Chain',
    description: 'Transformed supply chain operations to reduce environmental impact by 60%.',
    results: {
      emissions: '60% supply chain emission reduction',
      savings: '$5.1M operational savings',
      timeline: '24 months implementation'
    },
    image: '/images/case-study-manufacturing.jpg',
    tags: ['Manufacturing', 'Supply Chain', 'Efficiency']
  },
  {
    id: 'financial',
    title: 'Financial Services',
    subtitle: 'Green Investment Portfolio',
    description: 'Developed sustainable investment strategies that outperformed traditional portfolios.',
    results: {
      emissions: '100% renewable energy transition',
      savings: '12% higher returns',
      timeline: '12 months to implementation'
    },
    image: '/images/case-study-financial.jpg',
    tags: ['Finance', 'Investment', 'Renewable Energy']
  }
];

export default function InteractiveCaseStudies() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [activeCase, setActiveCase] = useState<string>(caseStudies[0].id);

  const activeCaseStudy = caseStudies.find(cs => cs.id === activeCase) || caseStudies[0];

  return (
    <section ref={ref} className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-world impact through our comprehensive climate solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 案例列表 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {caseStudies.map((caseStudy, index) => (
              <div
                key={caseStudy.id}
                className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                  activeCase === caseStudy.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-background hover:bg-card hover:shadow-md'
                }`}
                onClick={() => setActiveCase(caseStudy.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{caseStudy.title}</h3>
                  <ArrowRightOutlined 
                    className={`transition-transform duration-300 ${
                      activeCase === caseStudy.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                <p className="font-medium mb-2">{caseStudy.subtitle}</p>
                <p className={`text-sm ${
                  activeCase === caseStudy.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {caseStudy.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {caseStudy.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-xs ${
                        activeCase === caseStudy.id
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* 详细结果 */}
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-background rounded-lg p-8 shadow-soft"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activeCaseStudy.title}</h3>
              <p className="text-primary font-semibold text-lg mb-4">
                {activeCaseStudy.subtitle}
              </p>
              <p className="text-muted-foreground">
                {activeCaseStudy.description}
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-semibold text-lg mb-4">Key Results</h4>
              
              <div className="grid gap-4">
                <div className="flex items-center p-4 bg-muted rounded-lg">
                  <GlobalOutlined className="text-green-600 mr-3 text-xl" />
                  <div>
                    <p className="font-medium">Environmental Impact</p>
                    <p className="text-sm text-muted-foreground">{activeCaseStudy.results.emissions}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-muted rounded-lg">
                  <DollarOutlined className="text-blue-600 mr-3 text-xl" />
                  <div>
                    <p className="font-medium">Financial Benefits</p>
                    <p className="text-sm text-muted-foreground">{activeCaseStudy.results.savings}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-muted rounded-lg">
                  <TrophyOutlined className="text-orange-600 mr-3 text-xl" />
                  <div>
                    <p className="font-medium">Implementation</p>
                    <p className="text-sm text-muted-foreground">{activeCaseStudy.results.timeline}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300">
                Read Full Case Study
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}