'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from '@/lib/modern-animations';
import { useThemeColors } from '@/app/providers';
import { useAccessibility } from '@/hooks/useAccessibility';
import UnifiedButton from '@/components/ui/UnifiedButton';
import { cn } from '@/lib/utils';
import { ArrowRightOutlined } from '@ant-design/icons';

// 导航数据结构
interface MegaMenuSection {
  id: string;
  title: string;
  links: {
    label: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
    isNew?: boolean;
    isFeatured?: boolean;
  }[];
}

interface MegaMenuFeature {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  ctaText: string;
  badge?: string;
}

interface MegaMenuProps {
  menuKey: string;
  sections: MegaMenuSection[];
  features?: MegaMenuFeature[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// 智能鼠标移动检测
const useMouseMovement = (callback: () => void, delay: number = 300) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(callback, delay);
  };
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return { handleMouseLeave, handleMouseEnter };
};

// 单个菜单项组件
const MegaMenuItem: React.FC<{
  item: MegaMenuSection['links'][0];
  onClose: () => void;
}> = ({ item, onClose }) => {
  const colors = useThemeColors();
  
  return (
    <Link 
      href={item.href}
      className={cn(
        'group block p-4 rounded-lg transition-all duration-200',
        'hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
      )}
      onClick={onClose}
    >
      <div className="flex items-start space-x-3">
        {item.icon && (
          <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
            {item.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.label}
            </h3>
            {item.isNew && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                New
              </span>
            )}
            {item.isFeatured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                Featured
              </span>
            )}
          </div>
          {item.description && (
            <p className="mt-1 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
              {item.description}
            </p>
          )}
        </div>
        <ArrowRightOutlined className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-200 transform translate-x-1 group-hover:translate-x-0" />
      </div>
    </Link>
  );
};

// 特色内容组件
const MegaMenuFeature: React.FC<{
  feature: MegaMenuFeature;
  onClose: () => void;
}> = ({ feature, onClose }) => {
  const colors = useThemeColors();
  
  return (
    <Link 
      href={feature.href}
      className={cn(
        'group block p-6 rounded-xl border border-border/50 transition-all duration-300',
        'hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
      )}
      onClick={onClose}
    >
      <div className="aspect-[4/3] mb-4 overflow-hidden rounded-lg">
        <Image 
          src={feature.image} 
          alt={feature.title}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {feature.title}
          </h3>
          {feature.badge && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {feature.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
          {feature.description}
        </p>
        <div className="flex items-center space-x-2 text-primary text-sm font-medium">
          <span>{feature.ctaText}</span>
          <ArrowRightOutlined className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

// 主要 MegaMenu 组件
export const MegaMenu: React.FC<MegaMenuProps> = ({
  menuKey,
  sections,
  features = [],
  isOpen,
  onClose,
  className
}) => {
  const colors = useThemeColors();
  const { settings } = useAccessibility();
  const { handleMouseLeave, handleMouseEnter } = useMouseMovement(onClose, 300);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={menuKey}
        className={cn(
          'absolute top-full left-0 w-full z-50 border-t border-border/50',
          className
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: settings.reducedMotion ? 0 : 0.2,
          ease: [0.4, 0, 0.2, 1]
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 背景和模糊效果 */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
        
        {/* 装饰性渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* 主要内容 */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* 左侧导航区域 */}
              <div className="col-span-12 lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: settings.reducedMotion ? 0 : 0.3,
                        delay: settings.reducedMotion ? 0 : index * 0.1
                      }}
                      className="space-y-4"
                    >
                      <h2 className="text-base font-bold text-foreground border-b border-border/30 pb-3">
                        {section.title}
                      </h2>
                      <div className="space-y-1">
                        {section.links.map((link, linkIndex) => (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              duration: settings.reducedMotion ? 0 : 0.2,
                              delay: settings.reducedMotion ? 0 : (index * 0.1) + (linkIndex * 0.05)
                            }}
                          >
                            <MegaMenuItem item={link} onClose={onClose} />
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* 查看全部链接 */}
                      <div className="pt-2 border-t border-border/20">
                        <UnifiedButton
                          variant="ghost"
                          size="small"
                          className="w-full justify-start text-primary hover:text-primary"
                          icon={<ArrowRightOutlined />}
                          iconPosition="right"
                        >
                          查看全部 {section.title}
                        </UnifiedButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* 右侧特色内容区域 */}
              {features.length > 0 && (
                <div className="col-span-12 lg:col-span-4">
                  <div className="space-y-6">
                    <h2 className="text-base font-bold text-foreground border-b border-border/30 pb-3">
                      特色内容
                    </h2>
                    <div className="space-y-6">
                      {features.map((feature, index) => (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: settings.reducedMotion ? 0 : 0.3,
                            delay: settings.reducedMotion ? 0 : 0.2 + (index * 0.1)
                          }}
                        >
                          <MegaMenuFeature feature={feature} onClose={onClose} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </motion.div>
    </AnimatePresence>
  );
};

export default MegaMenu;