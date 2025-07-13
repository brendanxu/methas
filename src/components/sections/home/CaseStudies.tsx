'use client';

import React, { useState, useRef } from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { useInView } from 'react-intersection-observer';
import { Carousel, Tag, Skeleton, Statistic } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { LeftOutlined, RightOutlined, ArrowRightOutlined } from '@/lib/antd-optimized';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useThemeColors } from '@/app/providers';

// 类型定义
interface CaseStudy {
  id: string;
  clientName: string;
  clientLogo: string;
  projectImage: string;
  title: string;
  industry: 'energy' | 'manufacturing' | 'retail' | 'finance';
  emissionReduction: number;
  energySaved: number;
  description: string;
  href: string;
}

// 模拟数据
const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    clientName: 'TechCorp Industries',
    clientLogo: 'https://via.placeholder.com/120x60/0066CC/FFFFFF?text=TechCorp',
    projectImage: 'https://images.unsplash.com/photo-1497436072909-f5e4be1713b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: '通过可再生能源集成减少40%碳足迹',
    industry: 'manufacturing',
    emissionReduction: 15000,
    energySaved: 2.5,
    description: '帮助 TechCorp 实现全面的可持续发展转型，通过整合太阳能和风能解决方案，显著降低运营成本的同时实现环保目标。',
    href: '/case-studies/techcorp-renewable'
  },
  {
    id: 'case-2',
    clientName: 'GreenMart Retail',
    clientLogo: 'https://via.placeholder.com/120x60/00875A/FFFFFF?text=GreenMart',
    projectImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: '零售连锁店供应链碳中和计划',
    industry: 'retail',
    emissionReduction: 22000,
    energySaved: 3.8,
    description: '为 GreenMart 设计并实施全供应链碳中和策略，覆盖500+门店，建立行业可持续发展新标杆。',
    href: '/case-studies/greenmart-supply-chain'
  },
  {
    id: 'case-3',
    clientName: 'Global Finance Bank',
    clientLogo: 'https://via.placeholder.com/120x60/FF8B00/FFFFFF?text=GFB',
    projectImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: '金融机构ESG合规与绿色投资组合',
    industry: 'finance',
    emissionReduction: 8500,
    energySaved: 1.2,
    description: '协助 Global Finance Bank 建立ESG投资框架，管理超过50亿美元的绿色投资组合，推动金融业可持续发展。',
    href: '/case-studies/gfb-esg-compliance'
  },
  {
    id: 'case-4',
    clientName: 'PowerGen Energy',
    clientLogo: 'https://via.placeholder.com/120x60/002145/FFFFFF?text=PowerGen',
    projectImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: '传统能源公司向清洁能源转型',
    industry: 'energy',
    emissionReduction: 50000,
    energySaved: 12.5,
    description: 'PowerGen Energy 的清洁能源转型项目，从传统化石燃料发电转向风能和太阳能，实现业务模式的根本性变革。',
    href: '/case-studies/powergen-transition'
  },
  {
    id: 'case-5',
    clientName: 'AutoMaker Plus',
    clientLogo: 'https://via.placeholder.com/120x60/6B7280/FFFFFF?text=AutoMaker',
    projectImage: 'https://images.unsplash.com/photo-1563258251-d0eac3a08c4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: '汽车制造商电动化转型战略',
    industry: 'manufacturing',
    emissionReduction: 35000,
    energySaved: 8.2,
    description: 'AutoMaker Plus 电动化转型计划，包括生产线改造、供应商网络重构和全生命周期碳足迹管理。',
    href: '/case-studies/automaker-electrification'
  },
  {
    id: 'case-6',
    clientName: 'SmartRetail Chain',
    clientLogo: 'https://via.placeholder.com/120x60/8B5CF6/FFFFFF?text=SmartRetail',
    projectImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: '智能零售网络能效优化项目',
    industry: 'retail',
    emissionReduction: 18000,
    energySaved: 4.5,
    description: 'SmartRetail Chain 智能能源管理系统，通过IoT技术和AI优化，实现全国门店能耗智能管控。',
    href: '/case-studies/smartretail-energy-optimization'
  }
];

// 行业筛选选项
const industryFilters = [
  { key: 'all', label: '全部', color: 'default' as const },
  { key: 'energy', label: '能源', color: 'blue' as const },
  { key: 'manufacturing', label: '制造业', color: 'green' as const },
  { key: 'retail', label: '零售', color: 'orange' as const },
  { key: 'finance', label: '金融', color: 'purple' as const },
];

// 案例卡片组件
const CaseStudyCard: React.FC<{ caseStudy: CaseStudy; loading?: boolean }> = ({ 
  caseStudy, 
  loading = false 
}) => {
  const colors = useThemeColors();

  if (loading) {
    return (
      <div 
        className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border h-[480px]"
        style={{ backgroundColor: colors.card }}
      >
        <Skeleton.Image className="w-full h-48" active />
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border h-[480px] group cursor-pointer"
      style={{ backgroundColor: colors.card }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 项目图片 */}
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={caseStudy.projectImage}
          alt={caseStudy.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          quality={85}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* 客户Logo */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
          <OptimizedImage
            src={caseStudy.clientLogo}
            alt={caseStudy.clientName}
            width={80}
            height={32}
            className="h-8 w-auto object-contain"
            quality={90}
          />
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-6 flex flex-col h-[288px]">
        {/* 行业标签 */}
        <div className="mb-3">
          <Tag 
            color={industryFilters.find(f => f.key === caseStudy.industry)?.color}
            className="text-xs"
          >
            {industryFilters.find(f => f.key === caseStudy.industry)?.label}
          </Tag>
        </div>

        {/* 项目标题 */}
        <h3 
          className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300"
          style={{ color: colors.foreground }}
        >
          {caseStudy.title}
        </h3>

        {/* 成果数据 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <Statistic
              value={caseStudy.emissionReduction}
              suffix="吨"
              valueStyle={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: colors.primary 
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">CO₂减排量</p>
          </div>
          <div className="text-center">
            <Statistic
              value={caseStudy.energySaved}
              suffix="MW"
              valueStyle={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: colors.success 
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">节能量</p>
          </div>
        </div>

        {/* 描述 */}
        <p 
          className="text-sm line-clamp-2 mb-4 flex-grow"
          style={{ color: colors.mutedForeground }}
        >
          {caseStudy.description}
        </p>

        {/* 查看详情链接 */}
        <Button
          variant="ghost"
          size="small"
          icon={<ArrowRightOutlined />}
          iconPosition="right"
          className="self-start"
          onClick={() => window.location.href = caseStudy.href}
        >
          查看详情
        </Button>
      </div>
    </motion.div>
  );
};

export const CaseStudies: React.FC = () => {
  const colors = useThemeColors();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<CarouselRef>(null);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 筛选案例
  const filteredCases = selectedIndustry === 'all' 
    ? caseStudies 
    : caseStudies.filter(cs => cs.industry === selectedIndustry);

  // 处理筛选
  const handleIndustryFilter = (industry: string) => {
    if (industry === selectedIndustry) return;
    
    setLoading(true);
    setSelectedIndustry(industry);
    
    // 模拟加载效果
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // 轮播设置
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Section
      id="case-studies"
      className="py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-medium mb-4">Success Stories</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            看看我们如何帮助企业实现可持续发展
          </h2>
        </motion.div>

        {/* 筛选标签 */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {industryFilters.map((filter) => (
            <Tag.CheckableTag
              key={filter.key}
              checked={selectedIndustry === filter.key}
              onChange={() => handleIndustryFilter(filter.key)}
              className="px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: selectedIndustry === filter.key ? colors.primary : 'transparent',
                color: selectedIndustry === filter.key ? 'white' : colors.foreground,
                border: `2px solid ${selectedIndustry === filter.key ? colors.primary : colors.border}`,
              }}
            >
              {filter.label}
            </Tag.CheckableTag>
          ))}
        </motion.div>

        {/* 轮播区域 */}
        <motion.div
          ref={ref}
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* 自定义导航按钮 */}
          <div className="hidden lg:block">
            <Button
              variant="ghost"
              size="large"
              icon={<LeftOutlined />}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => carouselRef.current?.prev()}
            />
            <Button
              variant="ghost"
              size="large"
              icon={<RightOutlined />}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => carouselRef.current?.next()}
            />
          </div>

          {/* 轮播组件 */}
          <Carousel
            ref={carouselRef}
            {...carouselSettings}
            className="case-studies-carousel"
          >
            {loading 
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="px-3">
                    <CaseStudyCard caseStudy={{} as CaseStudy} loading={true} />
                  </div>
                ))
              : filteredCases.map((caseStudy) => (
                  <div key={caseStudy.id} className="px-3">
                    <CaseStudyCard caseStudy={caseStudy} />
                  </div>
                ))
            }
          </Carousel>
        </motion.div>

        {/* 查看更多按钮 */}
        <motion.div
          className="text-center mt-12"
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
            onClick={() => window.location.href = '/case-studies'}
          >
            查看所有案例
          </Button>
        </motion.div>
      </div>

      {/* 自定义样式 */}
      <style jsx global>{`
        .case-studies-carousel .ant-carousel .ant-carousel-dots {
          bottom: -40px;
        }
        
        .case-studies-carousel .ant-carousel .ant-carousel-dots li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${colors.border};
          opacity: 0.5;
        }
        
        .case-studies-carousel .ant-carousel .ant-carousel-dots li.ant-carousel-dots-li-active button {
          background: ${colors.primary};
          opacity: 1;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Section>
  );
};

export default CaseStudies;