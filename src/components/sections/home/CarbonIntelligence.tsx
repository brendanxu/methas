'use client';

import React from 'react';
import { motion } from '@/lib/modern-animations';
import { ArrowRightOutlined } from '@ant-design/icons';
import UnifiedButton from '@/components/ui/UnifiedButton';
import { cn } from '@/lib/utils';

interface CarbonIntelligenceProps {
  className?: string;
}

const CarbonIntelligence: React.FC<CarbonIntelligenceProps> = ({ className }) => {
  const insightItems = [
    {
      id: 'enterprise-practice',
      title: '企业实践',
      description: '各行业碳管理实践案例',
      icon: '🏢',
      color: 'green',
      href: '/carbon-intelligence/enterprise-practice'
    },
    {
      id: 'industry-insights',
      title: '行业洞察',
      description: '政策解读、市场分析、趋势预测',
      icon: '📊',
      color: 'blue',
      href: '/carbon-intelligence/industry-insights'
    },
    {
      id: 'technology-frontier',
      title: '技术前沿',
      description: '碳管理技术、创新解决方案',
      icon: '🔬',
      color: 'purple',
      href: '/carbon-intelligence/technology-frontier'
    },
    {
      id: 'reports',
      title: '碳智报告',
      description: '研究报告与白皮书下载',
      icon: '📄',
      color: 'orange',
      href: '/carbon-intelligence/reports'
    }
  ];

  const featuredArticles = [
    {
      id: 1,
      category: '企业实践',
      title: '某制造业巨头的碳中和之路',
      description: '深度解析制造业企业如何通过技术创新实现碳中和目标',
      date: '2024-01-15',
      categoryColor: 'green'
    },
    {
      id: 2,
      category: '行业洞察',
      title: '2024年碳市场发展趋势',
      description: '分析全球碳市场最新动态和未来发展方向',
      date: '2024-01-10',
      categoryColor: 'blue'
    },
    {
      id: 3,
      category: '技术前沿',
      title: '甲烷减排技术突破',
      description: '最新甲烷检测和减排技术的应用前景',
      date: '2024-01-08',
      categoryColor: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-100',
        text: 'text-green-600',
        hover: 'hover:bg-green-100'
      },
      blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-100',
        text: 'text-blue-600',
        hover: 'hover:bg-blue-100'
      },
      purple: {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-100'
      },
      orange: {
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-100',
        text: 'text-orange-600',
        hover: 'hover:bg-orange-100'
      }
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  const getCategoryColorClasses = (color: string) => {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    return colors[color as keyof typeof colors] || 'text-green-600';
  };

  return (
    <section className={cn('py-16 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题部分 */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="fadeIn"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            碳智观察
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            深度洞察碳管理实践，引领双碳发展趋势
          </p>
        </motion.div>

        {/* 四大板块 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {insightItems.map((item, index) => {
            const colorClasses = getColorClasses(item.color);
            return (
              <motion.div
                key={item.id}
                className={cn(
                  'rounded-lg p-6 transition-all duration-300 hover:shadow-lg cursor-pointer',
                  colorClasses.bg,
                  colorClasses.hover
                )}
                initial="hidden"
                whileInView="fadeIn"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => window.location.href = item.href}
              >
                <div className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                  colorClasses.iconBg
                )}>
                  <span className={cn('text-xl', colorClasses.text)}>
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
                <div className={cn('text-sm font-medium', colorClasses.text)}>
                  查看更多 →
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 最新观察 */}
        <motion.div
          className="bg-white rounded-lg p-8 mb-12"
          initial="hidden"
          whileInView="fadeIn"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">最新观察</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                initial="hiddenUp"
                whileInView="fadeIn"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={cn(
                  'text-sm mb-2 font-medium',
                  getCategoryColorClasses(article.categoryColor)
                )}>
                  {article.category}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.date}</span>
                  <span className="text-green-600 text-xs font-medium">阅读更多</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA 部分 */}
        <motion.div
          className="text-center"
          initial="hiddenScale"
          whileInView="scaleIn"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              深入了解碳智观察
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              获取最新的碳管理洞察、行业趋势和技术前沿资讯，助力您的碳中和之路
            </p>
            <UnifiedButton
              variant="primary"
              size="large"
              onClick={() => window.location.href = '/carbon-intelligence'}
              className="px-8 py-3"
              customColor="#00A651"
              icon={<ArrowRightOutlined className="transition-transform duration-300 group-hover:translate-x-1" />}
              iconPosition="right"
              shadow="medium"
            >
              探索碳智观察
            </UnifiedButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CarbonIntelligence;