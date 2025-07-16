'use client';

import React, { useState } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

// 筛选标签数据
const filterTags = [
  { key: 'all', label: '全部', color: 'primary' },
  { key: 'energy', label: '能源', color: 'blue' },
  { key: 'manufacturing', label: '制造业', color: 'green' },
  { key: 'retail', label: '零售', color: 'orange' },
  { key: 'finance', label: '金融', color: 'purple' },
];

// 案例数据
const successStories = [
  {
    id: 1,
    category: 'energy',
    industryLabel: '能源',
    industryColor: 'blue',
    title: '传统能源公司向清洁能源转型',
    co2Reduction: '50,000',
    energySaving: '12.5',
    description: 'PowerGen Energy 的清洁能源转型项目，从传统化石燃料发电转向风能和太阳能，实现业务模式的根本性变革。',
    image: '/api/placeholder/400/240'
  },
  {
    id: 2,
    category: 'manufacturing',
    industryLabel: '制造业',
    industryColor: 'green',
    title: '汽车制造商电动化转型战略',
    co2Reduction: '35,000',
    energySaving: '8.2',
    description: 'AutoMaker Plus 电动化转型计划，包括生产线改造、供应商网络重构和全生命周期碳足迹管理。',
    image: '/api/placeholder/400/240'
  },
  {
    id: 3,
    category: 'retail',
    industryLabel: '零售',
    industryColor: 'orange',
    title: '智能零售网络能效优化项目',
    co2Reduction: '18,000',
    energySaving: '4.5',
    description: 'SmartRetail Chain 智能能源管理系统，通过IoT技术和AI优化，实现全国门店能耗智能管控。',
    image: '/api/placeholder/400/240'
  },
  {
    id: 4,
    category: 'finance',
    industryLabel: '金融',
    industryColor: 'purple',
    title: '绿色金融数字化创新平台',
    co2Reduction: '25,000',
    energySaving: '6.8',
    description: 'GreenBank 绿色金融创新平台，通过数字化工具促进可持续投资和绿色信贷业务发展。',
    image: '/api/placeholder/400/240'
  }
];

// 行业标签颜色映射
const industryColors = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500'
};

export default function SuccessStories() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  // 根据筛选条件过滤案例
  const filteredStories = activeFilter === 'all' 
    ? successStories 
    : successStories.filter(story => story.category === activeFilter);

  // 处理左右切换
  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? filteredStories.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === filteredStories.length - 1 ? 0 : prev + 1
    );
  };

  // 获取当前显示的案例（响应式：移动端1个，桌面端3个）
  const getVisibleStories = () => {
    const stories = filteredStories;
    const visibleCount = 3; // 桌面端显示3个
    
    if (stories.length <= visibleCount) return stories;
    
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % stories.length;
      result.push(stories[index]);
    }
    return result;
  };

  const visibleStories = getVisibleStories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 标题部分 */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Success Stories
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          看看我们如何帮助企业实现可持续发展
        </p>
      </div>

      {/* 筛选标签 */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filterTags.map((tag) => (
          <Button
            key={tag.key}
            type={activeFilter === tag.key ? 'primary' : 'default'}
            size="large"
            className={`filter-tag rounded-full px-6 py-2 font-medium ${
              activeFilter === tag.key
                ? 'bg-primary text-white border-primary shadow-lg'
                : 'bg-muted text-muted-foreground border-border hover:bg-muted-hover'
            }`}
            onClick={() => {
              setActiveFilter(tag.key);
              setCurrentIndex(0); // 重置索引
            }}
          >
            {tag.label}
          </Button>
        ))}
      </div>

      {/* 案例卡片展示区 */}
      <div className="relative">
        {/* 左右切换按钮 */}
        {filteredStories.length > 3 && (
          <>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
              onClick={handlePrevious}
            />
            <Button
              type="text"
              icon={<ArrowRightOutlined />}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
              onClick={handleNext}
            />
          </>
        )}

        {/* 案例卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-8">
          {visibleStories.map((story, index) => (
            <div
              key={`${story.id}-${activeFilter}`}
              className="success-stories-card bg-card rounded-lg shadow-soft border border-border overflow-hidden"
            >
              {/* 图片占位区域 */}
              <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center">
                <div className="text-6xl text-muted-foreground opacity-50">
                  📊
                </div>
              </div>

              {/* 卡片内容 */}
              <div className="p-6">
                {/* 行业标签 */}
                <div className="mb-4">
                  <span className={`industry-tag inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${
                    industryColors[story.industryColor as keyof typeof industryColors]
                  }`}>
                    {story.industryLabel}
                  </span>
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-semibold text-foreground mb-4 line-clamp-2">
                  {story.title}
                </h3>

                {/* 数据展示 */}
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {story.co2Reduction}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        CO2减排量 (吨)
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">
                        {story.energySaving}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        节能量 (MW)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 描述 */}
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {story.description}
                </p>

                {/* 查看详情按钮 */}
                <Button
                  type="link"
                  className="p-0 text-primary hover:text-primary-hover font-medium"
                  icon={<ArrowRightOutlined className="ml-1" />}
                  iconPosition="end"
                >
                  查看详情
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 查看所有案例按钮 */}
      <div className="text-center mt-12">
        <Button
          type="primary"
          size="large"
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium shadow-lg"
        >
          查看所有案例
        </Button>
      </div>
    </div>
  );
}