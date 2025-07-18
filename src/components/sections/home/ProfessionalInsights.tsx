'use client';

import React from 'react';
import { motion } from '@/lib/modern-animations';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ArrowRightOutlined, CalendarOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';

interface ProfessionalInsightsProps {
  className?: string;
}

// 模拟的专家团队信息
const experts = {
  'zhang-wei': {
    name: '张伟',
    title: '首席碳管理专家',
    avatar: '/images/experts/zhang-wei.jpg',
    bio: '15年碳管理经验，甲烷减排技术专家'
  },
  'li-ming': {
    name: '李明',
    title: 'ESG咨询总监',
    avatar: '/images/experts/li-ming.jpg',
    bio: '国际ESG标准制定参与者，双碳战略专家'
  },
  'wang-lei': {
    name: '王磊',
    title: '技术创新主管',
    avatar: '/images/experts/wang-lei.jpg',
    bio: '前沿减排技术研究员，项目开发专家'
  }
};

// 文章分类
const categories = {
  'enterprise-practice': { name: '企业实践', color: 'green' },
  'industry-insights': { name: '行业洞察', color: 'blue' },
  'technology-frontier': { name: '技术前沿', color: 'purple' },
  'policy-analysis': { name: '政策解读', color: 'orange' }
};

// 精选文章
const featuredArticles = [
  {
    id: 'methane-investment-trends-2024',
    title: '2024年甲烷减排投资趋势：机遇与挑战并存',
    excerpt: '深度分析全球甲烷减排投资市场的最新动态，探讨技术突破、政策支持和市场机制如何共同推动这一关键减排领域的发展。',
    category: 'industry-insights',
    author: 'zhang-wei',
    publishDate: '2024-01-20',
    readTime: '8分钟阅读',
    image: '/images/insights/methane-investment-2024.jpg',
    featured: true
  },
  {
    id: 'enterprise-carbon-management-best-practices',
    title: '制造业巨头的碳中和实践：从战略到执行的全程解析',
    excerpt: '通过深入分析某知名制造企业的碳中和转型历程，为其他企业提供可复制的实践经验和策略指导。',
    category: 'enterprise-practice',
    author: 'li-ming',
    publishDate: '2024-01-18',
    readTime: '12分钟阅读',
    image: '/images/insights/manufacturing-carbon-neutral.jpg'
  },
  {
    id: 'methane-detection-breakthrough',
    title: '甲烷检测技术重大突破：新一代传感器技术的应用前景',
    excerpt: '最新的甲烷检测传感器技术在精度、成本和部署便利性方面取得突破性进展，为大规模甲烷减排提供技术支撑。',
    category: 'technology-frontier',
    author: 'wang-lei',
    publishDate: '2024-01-15',
    readTime: '10分钟阅读',
    image: '/images/insights/methane-detection-tech.jpg'
  }
];

// 热门文章
const popularArticles = [
  {
    id: 'carbon-market-outlook-2024',
    title: '2024年全球碳市场展望：政策驱动下的新机遇',
    category: 'industry-insights',
    publishDate: '2024-01-12',
    readCount: '2.3k'
  },
  {
    id: 'esg-reporting-guide',
    title: 'ESG报告编制完整指南：从数据收集到披露实践',
    category: 'enterprise-practice',
    publishDate: '2024-01-10',
    readCount: '1.8k'
  },
  {
    id: 'supply-chain-decarbonization',
    title: '供应链脱碳策略：三步实现绿色供应链转型',
    category: 'enterprise-practice',
    publishDate: '2024-01-08',
    readCount: '1.5k'
  },
  {
    id: 'methane-policy-update',
    title: '全球甲烷减排政策最新动态及影响分析',
    category: 'policy-analysis',
    publishDate: '2024-01-05',
    readCount: '1.2k'
  }
];

const getCategoryStyles = (categoryKey: string) => {
  const category = categories[categoryKey as keyof typeof categories];
  const colorMap = {
    green: 'text-green-600 bg-green-50 border-green-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200'
  };
  
  return {
    name: category?.name || '未分类',
    className: colorMap[category?.color as keyof typeof colorMap] || colorMap.green
  };
};

export const ProfessionalInsights: React.FC<ProfessionalInsightsProps> = ({ className }) => {
  return (
    <section className={cn('py-24 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="fadeIn"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-green-600 font-semibold mb-4 text-sm uppercase tracking-wide font-sans">
            专业洞察
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
            碳智观察
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-sans leading-relaxed">
            获取来自我们内部专家和客座作者的独到见解与观点。阅读来自全球气候保护项目和合作伙伴的振奋人心的故事。
          </p>
        </motion.div>

        {/* Featured Article */}
        {featuredArticles.filter(article => article.featured).map((article, index) => {
          const expert = experts[article.author as keyof typeof experts];
          const categoryStyle = getCategoryStyles(article.category);
          
          return (
            <motion.div
              key={article.id}
              className="mb-20"
              initial="hidden"
              whileInView="fadeIn"
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative h-64 lg:h-auto">
                    <OptimizedImage
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold border',
                        categoryStyle.className
                      )}>
                        {categoryStyle.name}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    {/* Author & Date */}
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <OptimizedImage
                          src={expert.avatar}
                          alt={expert.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 font-sans">{expert.name}</p>
                        <p className="text-sm text-gray-500 font-sans">{expert.title}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-sm text-gray-500 font-sans">{article.publishDate}</p>
                        <p className="text-xs text-gray-400 font-sans">{article.readTime}</p>
                      </div>
                    </div>
                    
                    {/* Article Content */}
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-sans leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-6 font-sans leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    <Link
                      href={`/carbon-intelligence/${article.category}/${article.id}`}
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors group"
                    >
                      阅读完整文章
                      <ArrowRightOutlined className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Article Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Recent Articles */}
          <div className="lg:col-span-2">
            <motion.div
              className="mb-8"
              initial="hidden"
              whileInView="fadeIn"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-sans">最新观察</h3>
            </motion.div>
            
            <div className="space-y-8">
              {featuredArticles.filter(article => !article.featured).map((article, index) => {
                const expert = experts[article.author as keyof typeof experts];
                const categoryStyle = getCategoryStyles(article.category);
                
                return (
                  <motion.div
                    key={article.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    initial="hidden"
                    whileInView="fadeIn"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
                        <OptimizedImage
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className={cn(
                            'px-2 py-1 rounded text-xs font-semibold',
                            categoryStyle.className
                          )}>
                            {categoryStyle.name}
                          </span>
                          <span className="text-sm text-gray-500 font-sans">{article.readTime}</span>
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-900 mb-3 font-sans line-clamp-2">
                          {article.title}
                        </h4>
                        
                        <p className="text-gray-600 text-sm mb-4 font-sans line-clamp-2">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                              <OptimizedImage
                                src={expert.avatar}
                                alt={expert.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 font-sans">{expert.name}</p>
                              <p className="text-xs text-gray-500 font-sans">{article.publishDate}</p>
                            </div>
                          </div>
                          
                          <Link
                            href={`/carbon-intelligence/${article.category}/${article.id}`}
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            <ArrowRightOutlined />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Articles */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial="hiddenRight"
              whileInView="fadeIn"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">热门文章</h3>
              <div className="space-y-4">
                {popularArticles.map((article, index) => {
                  const categoryStyle = getCategoryStyles(article.category);
                  
                  return (
                    <motion.div
                      key={article.id}
                      className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                      initial="hidden"
                      whileInView="fadeIn"
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-semibold mb-2 inline-block',
                        categoryStyle.className
                      )}>
                        {categoryStyle.name}
                      </span>
                      <h4 className="font-semibold text-gray-900 mb-2 font-sans text-sm line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-sans">{article.publishDate}</span>
                        <span className="font-sans">{article.readCount} 阅读</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100"
              initial="hiddenRight"
              whileInView="fadeIn"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-sans">碳智资讯订阅</h3>
              <p className="text-sm text-gray-600 mb-4 font-sans">
                订阅我们的月度资讯，获取最新的气候趋势、政策和创新资讯。
              </p>
              <Link
                href="/carbon-intelligence"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors group"
              >
                立即订阅
                <ArrowRightOutlined className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="fadeIn"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-sans">
              探索更多专业洞察
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto font-sans">
              访问我们的完整知识库，获取最新的行业分析、技术趋势和实践指南
            </p>
            <Link
              href="/carbon-intelligence"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors group"
            >
              查看全部文章
              <ArrowRightOutlined className="ml-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfessionalInsights;