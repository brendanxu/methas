'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Services } from '@/components/sections/home/Services';
import { Button } from '@/components/ui/Button';

export default function ServicesDemo() {
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
            Services Section Demo
          </h1>
          <p className="text-muted-foreground mb-6">
            展示 Services 组件的布局、动画和交互效果
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
              <span>滚动页面查看淡入效果，悬停卡片查看图标旋转</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div key={key}>
        <Services />
      </div>

      {/* Feature Highlights */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            组件特性
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                响应式网格布局
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 桌面端：3列布局</li>
                <li>• 平板端：2列布局</li>
                <li>• 移动端：1列布局</li>
                <li>• 自适应间距调整</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                动画效果
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 滚动触发的淡入动画</li>
                <li>• 错开的动画延迟</li>
                <li>• 悬停时图标360°旋转</li>
                <li>• CTA按钮箭头动画</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-background rounded-lg p-6 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                技术实现
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• react-intersection-observer</li>
                <li>• Framer Motion 动画</li>
                <li>• ServiceCard 组件复用</li>
                <li>• 主题系统集成</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            使用示例
          </h2>
          
          <div className="bg-card rounded-lg p-6 border">
            <pre className="text-sm overflow-x-auto">
              <code className="text-muted-foreground">{`import { Services } from '@/components/sections/home/Services';

// 基础使用
<Services />

// 服务数据结构
const service = {
  id: 'carbon-footprint',
  icon: <CalculatorIcon />,
  title: '碳足迹测算',
  description: '精确计算企业碳排放量...',
  href: '/services/carbon-footprint'
};

// 动画配置
- 使用 react-intersection-observer 触发
- staggerChildren 实现错开动画
- 图标悬停旋转 360°
- CTA 按钮箭头循环动画`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            性能优化
          </h2>
          
          <div className="bg-background rounded-lg p-6 shadow-soft">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>使用 triggerOnce 确保动画只执行一次</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>图标 SVG 内联避免额外的网络请求</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>使用 motion.div 包装避免重复渲染</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>响应式布局使用 CSS Grid 原生实现</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}