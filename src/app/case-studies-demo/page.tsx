'use client';

import React, { useState } from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { CaseStudies } from '@/components/sections/home/CaseStudies';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/app/providers';

export default function CaseStudiesDemo() {
  const colors = useThemeColors();
  const [key, setKey] = useState(0);

  const replayAnimation = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Case Studies Section Demo
          </h1>
          <p className="text-muted-foreground mb-6">
            展示案例研究轮播组件的功能和交互效果
          </p>
          
          {/* Control Panel */}
          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              onClick={replayAnimation}
            >
              重播动画
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>💡 提示：</span>
              <span>尝试筛选标签、轮播导航，在移动端体验触摸滑动</span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies Section */}
      <div key={key}>
        <CaseStudies />
      </div>

      {/* Feature Highlights */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            组件特性详解
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                🎠 轮播功能
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 桌面端显示3个卡片</li>
                <li>• 平板端显示2个卡片</li>
                <li>• 移动端显示1个卡片</li>
                <li>• 自动播放（5秒间隔）</li>
                <li>• 触摸滑动支持</li>
                <li>• 自定义导航按钮</li>
                <li>• 底部指示点</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                🏷️ 筛选系统
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 行业筛选标签</li>
                <li>• 实时切换效果</li>
                <li>• 加载状态反馈</li>
                <li>• 平滑过渡动画</li>
                <li>• 筛选结果更新</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                📊 案例卡片
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 客户Logo展示</li>
                <li>• 项目图片</li>
                <li>• 减排数据统计</li>
                <li>• 行业标签</li>
                <li>• Hover动画效果</li>
                <li>• 详情链接跳转</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                ✨ 动画效果
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 滚动触发的淡入动画</li>
                <li>• 卡片hover上移效果</li>
                <li>• 图片缩放效果</li>
                <li>• CTA按钮箭头动画</li>
                <li>• 筛选切换动画</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                📱 响应式设计
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 断点自适应布局</li>
                <li>• 移动端优化</li>
                <li>• 触摸手势支持</li>
                <li>• 导航按钮显隐</li>
                <li>• 字体大小调整</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                🔧 技术实现
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Ant Design Carousel</li>
                <li>• Framer Motion 动画</li>
                <li>• TypeScript 类型安全</li>
                <li>• react-intersection-observer</li>
                <li>• 主题系统集成</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            使用示例
          </h2>
          
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              基础用法
            </h3>
            <pre 
              className="p-4 rounded-lg text-sm overflow-x-auto"
              style={{ 
                backgroundColor: colors.muted,
                color: colors.mutedForeground 
              }}
            >
              <code>{`import { CaseStudies } from '@/components/sections/home/CaseStudies';

// 基础使用
<CaseStudies />

// 案例数据结构
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

// 轮播配置
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    // 响应式断点配置
  ]
};`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            性能优化说明
          </h2>
          
          <div className="bg-background rounded-lg p-6 shadow-soft">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>使用 useInView Hook 实现滚动触发动画，避免不必要的渲染</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>轮播组件使用 ref 控制，减少重复渲染</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>图片使用懒加载和优化的占位符</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>筛选功能使用防抖处理，避免频繁更新</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Skeleton 组件提供良好的加载体验</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>CSS-in-JS 动态主题色彩，减少样式文件大小</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}