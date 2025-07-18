'use client';

import React from 'react';
import { motion } from '@/lib/modern-animations';
import Link from 'next/link';
import { ArrowRightOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';

interface ServiceProps {
  className?: string;
}

const services = [
  {
    id: 'carbon-asset-management',
    title: '碳资产管理',
    description: '碳足迹核算、碳资产开发、碳交易管理，助力企业实现碳资产价值最大化',
    href: '/service-types/carbon-asset-management',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
        />
      </svg>
    ),
    color: 'blue'
  },
  {
    id: 'methane-removal-investment',
    title: '甲烷清除投资',
    description: '减排效果是CO₂的25-84倍，专注甲烷减排投资，引领碳中和未来',
    href: '/service-types/methane-removal-investment',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M13 10V3L4 14h7v7l9-11h-7z" 
        />
      </svg>
    ),
    color: 'green',
    featured: true // 标记为重点服务
  },
  {
    id: 'esg-carbon-consulting',
    title: 'ESG与碳咨询',
    description: '双碳战略规划、ESG报告编制、可持续发展咨询，全方位支持企业绿色转型',
    href: '/service-types/esg-carbon-consulting',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
    ),
    color: 'purple'
  },
  {
    id: 'green-supply-chain',
    title: '绿色供应链',
    description: '供应商碳管理、产品碳足迹、绿色采购体系，构建可持续供应链生态',
    href: '/service-types/green-supply-chain',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
        />
      </svg>
    ),
    color: 'orange'
  }
];

const getColorClasses = (color: string, featured?: boolean) => {
  const baseColors = {
    blue: {
      bg: 'bg-blue-50',
      hover: 'hover:bg-blue-100',
      icon: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      hover: 'hover:bg-green-100',
      icon: 'text-green-600',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-50',
      hover: 'hover:bg-purple-100',
      icon: 'text-purple-600',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-orange-50',
      hover: 'hover:bg-orange-100',
      icon: 'text-orange-600',
      border: 'border-orange-200'
    }
  };
  
  const colors = baseColors[color as keyof typeof baseColors] || baseColors.blue;
  
  if (featured) {
    return {
      ...colors,
      bg: 'bg-gradient-to-br from-green-50 to-blue-50',
      hover: 'hover:from-green-100 hover:to-blue-100',
      border: 'border-green-300 border-2'
    };
  }
  
  return colors;
};

export const EnhancedServices: React.FC<ServiceProps> = ({ className }) => {
  return (
    <section className={cn('py-16 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="fadeIn"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => {
            const colorClasses = getColorClasses(service.color, service.featured);
            
            return (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="fadeIn"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <Link href={service.href}>
                  <div className={cn(
                    'p-8 rounded-lg border transition-all duration-300 group-hover:shadow-lg',
                    colorClasses.bg,
                    colorClasses.hover,
                    colorClasses.border,
                    service.featured && 'ring-2 ring-green-200'
                  )}>
                    {/* 重点服务标识 */}
                    {service.featured && (
                      <div className="absolute -top-3 left-6">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          重点服务
                        </span>
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className={cn(
                      'w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-transform group-hover:scale-110',
                      colorClasses.bg === 'bg-gradient-to-br from-green-50 to-blue-50' ? 'bg-white' : 'bg-white',
                      colorClasses.icon
                    )}>
                      {service.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800 font-sans">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed font-sans">
                      {service.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center text-green-600 group-hover:text-green-700 font-medium text-sm">
                      <span className="font-sans">了解更多</span>
                      <ArrowRightOutlined className="ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial="hiddenScale"
          whileInView="scaleIn"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-sans">
              需要定制化解决方案？
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto font-sans">
              我们的专家团队将根据您的具体需求，为您量身定制最适合的碳中和解决方案
            </p>
            <Link
              href="/service-types"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors group"
            >
              查看全部服务
              <ArrowRightOutlined className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedServices;