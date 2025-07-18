'use client';

import React from 'react';
import { motion } from '@/lib/modern-animations';
import Link from 'next/link';
import { ArrowRightOutlined } from '@ant-design/icons';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';

interface AlternatingServicesProps {
  className?: string;
}

const services = [
  {
    id: 'carbon-asset-management',
    title: '碳资产管理',
    subtitle: '专业的碳资产开发与管理',
    description: '从碳足迹核算到碳资产开发，再到碳交易管理，我们提供全链条的碳资产管理服务，助力企业实现碳资产价值最大化。',
    specialistIn: ['碳足迹核算与认证', '碳资产开发', '碳交易管理', '碳市场策略'],
    href: '/service-types/carbon-asset-management',
    image: '/images/carbon-asset-management-hero.jpg',
    ctaText: '了解更多'
  },
  {
    id: 'methane-removal-investment',
    title: '甲烷清除投资',
    subtitle: '25-84倍减排效果的突破性技术',
    description: '甲烷的温室效应是CO₂的25-84倍，我们专注于甲烷减排投资，通过创新技术和投资策略，为企业提供最高效的碳中和解决方案。',
    specialistIn: ['甲烷检测技术', '减排投资策略', '项目开发管理', '效果评估认证'],
    href: '/service-types/methane-removal-investment',
    image: '/images/methane-removal-hero.jpg',
    ctaText: '探索机会',
    featured: true
  },
  {
    id: 'esg-carbon-consulting',
    title: 'ESG与碳咨询',
    subtitle: '可持续发展的全方位支持',
    description: '从双碳战略规划到ESG报告编制，从可持续发展咨询到绿色转型实施，我们为企业提供全方位的ESG与碳管理咨询服务。',
    specialistIn: ['双碳战略规划', 'ESG报告编制', '可持续发展咨询', '绿色转型指导'],
    href: '/service-types/esg-carbon-consulting',
    image: '/images/esg-consulting-hero.jpg',
    ctaText: '获取方案'
  },
  {
    id: 'green-supply-chain',
    title: '绿色供应链',
    subtitle: '构建可持续供应链生态',
    description: '通过供应商碳管理、产品碳足迹追踪、绿色采购体系建设，帮助企业构建完整的可持续供应链生态系统。',
    specialistIn: ['供应商碳管理', '产品碳足迹', '绿色采购体系', '供应链优化'],
    href: '/service-types/green-supply-chain',
    image: '/images/green-supply-chain-hero.jpg',
    ctaText: '查看详情'
  }
];

export const AlternatingServices: React.FC<AlternatingServicesProps> = ({ className }) => {
  return (
    <React.Fragment>
      <section className={cn('py-24 bg-white', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="fadeIn"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-green-600 font-semibold mb-4 text-sm uppercase tracking-wide font-sans">
              核心服务
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
              四大专业领域，一流的解决方案
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-sans leading-relaxed">
              凭借专业的团队和丰富的经验，我们在全球范围内为企业提供碳中和解决方案，以对企业、社会和地球都有益的方式创造全球影响力
            </p>
          </motion.div>

          {/* Services */}
          <div className="space-y-32">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={service.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                  initial="hidden"
                  whileInView="fadeIn"
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {/* Content Side */}
                  <div className={cn(
                    'space-y-8',
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  )}>
                    {/* Featured Badge */}
                    {service.featured && (
                      <motion.div
                        initial="hiddenScale"
                        whileInView="scaleIn"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-blue-100 text-green-800">
                          ⭐ 重点服务
                        </span>
                      </motion.div>
                    )}

                    {/* Text Content - Position based on layout */}
                    <motion.div
                      className={cn(
                        'space-y-6',
                        isEven ? '' : 'lg:mt-16' // Add top margin for right side content
                      )}
                      initial="hiddenLeft"
                      whileInView="fadeIn"
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-sans">
                          {service.title}
                        </h3>
                        <p className="text-xl text-green-600 font-semibold mb-6 font-sans">
                          {service.subtitle}
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed font-sans">
                          {service.description}
                        </p>
                      </div>

                      {/* Specialist Areas */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide font-sans">
                          专业领域
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.specialistIn.map((area, areaIndex) => (
                            <motion.div
                              key={areaIndex}
                              className="flex items-center text-gray-700 font-sans"
                              initial="hidden"
                              whileInView="fadeIn"
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.6 + areaIndex * 0.1 }}
                            >
                              <div className="w-2 h-2 bg-green-600 rounded-full mr-3 flex-shrink-0"></div>
                              <span className="text-sm">{area}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.div
                        initial="hiddenScale"
                        whileInView="scaleIn"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <Link
                          href={service.href}
                          className="inline-flex items-center bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 group"
                        >
                          {service.ctaText}
                          <ArrowRightOutlined className="ml-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Image Side */}
                  <motion.div
                    className={cn(
                      'relative',
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    )}
                    initial={isEven ? "hiddenRight" : "hiddenLeft"}
                    whileInView="fadeIn"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {/* Image positioned based on layout */}
                    <div className={cn(
                      'relative rounded-2xl overflow-hidden shadow-2xl',
                      isEven ? 'lg:mt-16' : 'lg:mb-16' // Image position offset
                    )}>
                      <OptimizedImage
                        src={service.image}
                        alt={`${service.title} - 专业服务`}
                        width={600}
                        height={400}
                        className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      
                      {/* Floating badge */}
                      {service.featured && (
                        <div className="absolute top-6 right-6">
                          <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            核心优势
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-20 pt-16 border-t border-gray-200"
            initial="hidden"
            whileInView="fadeIn"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-sans">
              为什么选择我们？
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <motion.div
                className="text-center"
                initial="hiddenUp"
                whileInView="fadeIn"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 font-sans">专业经验</h4>
                <p className="text-gray-600 text-sm font-sans">专注甲烷减排投资，拥有丰富的行业经验</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial="hiddenUp"
                whileInView="fadeIn"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🏆</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 font-sans">专业团队</h4>
                <p className="text-gray-600 text-sm font-sans">碳管理不是我们的业务之一，而是我们的核心业务</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial="hiddenUp"
                whileInView="fadeIn"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">🌍</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 font-sans">全球影响</h4>
                <p className="text-gray-600 text-sm font-sans">全球思维，本土行动，创造可持续的全球影响力</p>
              </motion.div>
            </div>

            <Link
              href="/service-types"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors group"
            >
              探索全部服务
              <ArrowRightOutlined className="ml-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AlternatingServices;