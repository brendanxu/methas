'use client';

import React from 'react';
import { motion } from '@/lib/modern-animations';
import Link from 'next/link';
import { ArrowRightOutlined } from '@ant-design/icons';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { southPoleAnimations } from '@/lib/southpole-animations';

interface AlternatingServicesProps {
  className?: string;
}

const services = [
  {
    id: 'carbon-asset-management',
    title: '碳资产管理',
    description: '碳足迹核算、碳资产开发、碳交易管理，助力企业实现碳资产价值最大化。通过专业的碳排放核算体系，帮助企业建立完善的碳资产管理制度。',
    href: '/service-types/carbon-asset-management',
    image: '/images/carbon-asset-management.jpg',
    features: [
      '碳足迹精准核算',
      '碳资产开发管理',
      '碳交易策略制定',
      '碳排放监测体系'
    ],
    color: 'blue'
  },
  {
    id: 'methane-removal-investment',
    title: '甲烷清除投资',
    description: '减排效果是CO₂的25-84倍，专注甲烷减排投资，引领碳中和未来。作为我们的核心差异化服务，致力于推动全球甲烷减排技术发展。',
    href: '/service-types/methane-removal-investment',
    image: '/images/methane-removal.jpg',
    features: [
      '减排效果25-84倍CO₂',
      '前沿甲烷检测技术',
      '投资回报优化',
      '全球项目网络'
    ],
    color: 'green',
    featured: true
  },
  {
    id: 'esg-carbon-consulting',
    title: 'ESG与碳咨询',
    description: '双碳战略规划、ESG报告编制、可持续发展咨询，全方位支持企业绿色转型。结合国际最佳实践，助力企业建立可持续发展战略。',
    href: '/service-types/esg-carbon-consulting',
    image: '/images/esg-consulting.jpg',
    features: [
      '双碳战略规划',
      'ESG报告编制',
      '可持续发展咨询',
      '绿色转型指导'
    ],
    color: 'purple'
  },
  {
    id: 'green-supply-chain',
    title: '绿色供应链',
    description: '供应商碳管理、产品碳足迹、绿色采购体系，构建可持续供应链生态。打造从原材料到终端用户的全链条绿色管理体系。',
    href: '/service-types/green-supply-chain',
    image: '/images/green-supply-chain.jpg',
    features: [
      '供应商碳管理',
      '产品碳足迹追踪',
      '绿色采购体系',
      '供应链优化'
    ],
    color: 'orange'
  }
];

export const AlternatingServicesFixed: React.FC<AlternatingServicesProps> = React.memo(({ className }) => {
  return (
    <section className={cn('py-24 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          {...southPoleAnimations.scroll.fadeInOnScroll}
        >
          <p className="text-green-600 font-semibold mb-3 text-sm uppercase tracking-wide font-sans">
            核心服务
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-sans">
            四大核心服务
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-sans">
            专注甲烷减排投资，提供全方位碳中和解决方案
          </p>
        </motion.div>

        {/* Alternating Services Layout */}
        <div className="space-y-20">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={service.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    ...southPoleAnimations.timing.elegant,
                    delay: index * 0.2,
                  }
                }}
                viewport={southPoleAnimations.viewports.standard}
              >
                <div className={cn(
                  'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center',
                  !isEven && 'lg:grid-flow-col-dense'
                )}>
                  {/* Text Content */}
                  <div className={cn(
                    'space-y-6',
                    !isEven && 'lg:col-start-2'
                  )}>
                    {/* Featured Badge */}
                    {service.featured && (
                      <motion.div
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        {...southPoleAnimations.content.scaleIn}
                        transition={{ 
                          ...southPoleAnimations.timing.spring,
                          delay: index * 0.2 + 0.3,
                        }}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        核心差异化服务
                      </motion.div>
                    )}
                    
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-sans">
                        {service.title}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed font-sans">
                        {service.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          className="flex items-center space-x-3"
                          {...southPoleAnimations.content.slideInLeft}
                          transition={{ 
                            ...southPoleAnimations.timing.elegant,
                            delay: index * 0.2 + featureIndex * 0.1 + 0.4,
                          }}
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 font-sans">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <motion.div
                        whileHover={southPoleAnimations.interactions.buttonHover}
                        whileTap={southPoleAnimations.navigation.tap}
                      >
                        <Link
                          href={service.href}
                          className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors group"
                        >
                          了解更多
                          <ArrowRightOutlined className="ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className={cn(
                    'relative',
                    !isEven && 'lg:col-start-1'
                  )}>
                    <motion.div
                      className="relative overflow-hidden rounded-2xl shadow-xl"
                      {...southPoleAnimations.content.imageLoad}
                      transition={{ 
                        ...southPoleAnimations.timing.elegant,
                        delay: index * 0.2 + 0.2,
                      }}
                      whileHover={southPoleAnimations.interactions.cardHover}
                    >
                      <div className="aspect-[4/3]">
                        <OptimizedImage
                          src={service.image}
                          alt={service.title}
                          width={600}
                          height={450}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Floating elements for visual interest */}
                      <div className="absolute top-4 right-4">
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center',
                          service.color === 'green' && 'bg-green-500',
                          service.color === 'blue' && 'bg-blue-500',
                          service.color === 'purple' && 'bg-purple-500',
                          service.color === 'orange' && 'bg-orange-500'
                        )}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {service.color === 'green' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            )}
                            {service.color === 'blue' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            )}
                            {service.color === 'purple' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            )}
                            {service.color === 'orange' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            )}
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          {...southPoleAnimations.content.riseUp}
          transition={{ 
            ...southPoleAnimations.timing.layout,
            delay: 0.8,
          }}
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-sans">
              需要定制化解决方案？
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-sans">
              我们的专家团队将根据您的具体需求，为您量身定制最适合的碳中和解决方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={southPoleAnimations.interactions.buttonHover}
                whileTap={southPoleAnimations.navigation.tap}
              >
                <Link
                  href="/service-types"
                  className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors group"
                >
                  查看全部服务
                  <ArrowRightOutlined className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={southPoleAnimations.interactions.cardHover}
                whileTap={southPoleAnimations.navigation.tap}
              >
                <Link
                  href="/contact-us"
                  className="inline-flex items-center border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  联系我们
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

AlternatingServicesFixed.displayName = 'AlternatingServicesFixed';

export default AlternatingServicesFixed;