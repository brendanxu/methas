'use client';

import React, { useRef } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { motion } from '@/lib/modern-animations';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useVideoOptimization } from '@/hooks/useVideoOptimization';
import UnifiedButton from '@/components/ui/UnifiedButton';
import { cn } from '@/lib/utils';

interface EnhancedHeroProps {
  /** 视频背景配置 */
  videoConfig?: {
    mp4Url: string;
    webmUrl?: string;
    posterUrl: string;
    enableVideo?: boolean;
    disableOnMobile?: boolean;
  };
  /** 后备背景图片 */
  backgroundImage?: string;
  /** 内容配置 */
  content?: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };
  /** 视觉配置 */
  visual?: {
    overlayOpacity?: number;
    textAlignment?: 'left' | 'center' | 'right';
    showScrollHint?: boolean;
    theme?: 'dark' | 'light';
  };
  className?: string;
}

const EnhancedHero: React.FC<EnhancedHeroProps> = ({
  videoConfig = {
    mp4Url: '/videos/southpole-hero.mp4',
    webmUrl: '/videos/southpole-hero.webm',
    posterUrl: '/images/hero-poster.jpg',
    enableVideo: true,
    disableOnMobile: true
  },
  backgroundImage = '/images/homepage-main-hero-option-3_640x1036.jpg',
  content = {
    title: "It's time for a net zero world.",
    subtitle: "Hello, we're South Pole. The Climate Company.",
    description: "We've been helping organisations decarbonise and navigate the complexities of climate since 2006.",
    ctaText: "Learn more",
    ctaLink: "/what-we-do"
  },
  visual = {
    overlayOpacity: 0.5,
    textAlignment: 'center',
    showScrollHint: true,
    theme: 'dark'
  },
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    isLoaded,
    isPlaying,
    hasError,
    shouldPlayVideo,
    networkSpeed,
    isMobile,
    retry
  } = useVideoOptimization(videoRef, {
    enableVideo: videoConfig.enableVideo,
    disableOnMobile: videoConfig.disableOnMobile,
    disableOnSlowNetwork: true,
    preloadStrategy: 'metadata',
    maxRetries: 3
  });

  // 根据主题确定文字颜色
  const textColorClass = visual.theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = visual.theme === 'dark' ? 'text-white/90' : 'text-gray-700';
  const textTertiaryClass = visual.theme === 'dark' ? 'text-white/80' : 'text-gray-600';

  // 处理CTA点击
  const handleCTAClick = () => {
    if (content.ctaLink.startsWith('http')) {
      window.open(content.ctaLink, '_blank');
    } else {
      window.location.href = content.ctaLink;
    }
  };

  return (
    <section 
      className={cn(
        'relative w-full h-screen overflow-hidden bg-black',
        className
      )}
      role="banner"
      aria-label="Hero section"
    >
      {/* 背景媒体容器 */}
      <div className="absolute inset-0 w-full h-full">
        
        {/* 视频背景 */}
        {shouldPlayVideo && (
          <video
            ref={videoRef}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            autoPlay
            muted
            loop
            playsInline
            poster={videoConfig.posterUrl}
            preload="metadata"
            aria-hidden="true"
          >
            <source src={videoConfig.mp4Url} type="video/mp4" />
            {videoConfig.webmUrl && (
              <source src={videoConfig.webmUrl} type="video/webm" />
            )}
            <track kind="captions" />
          </video>
        )}

        {/* 后备背景图片 */}
        <div 
          className={cn(
            'absolute inset-0 w-full h-full',
            shouldPlayVideo && isLoaded ? 'opacity-0' : 'opacity-100'
          )}
        >
          <OptimizedImage
            src={backgroundImage}
            alt="Net zero world - South Pole sustainability"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* 视频加载状态 */}
        {shouldPlayVideo && !isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
              <p className="text-white/60 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* 视频错误状态 */}
        {hasError && (
          <div className="absolute top-4 left-4 bg-red-500/80 text-white px-4 py-2 rounded-lg text-sm">
            <span>Video failed to load</span>
            <UnifiedButton
              variant="ghost"
              size="small"
              onClick={retry}
              className="ml-2 text-white hover:text-white"
              customColor="#FFFFFF"
            >
              Retry
            </UnifiedButton>
          </div>
        )}

        {/* 遮罩层 */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"
          style={{ opacity: visual.overlayOpacity }}
        />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div 
            className={cn(
              'max-w-4xl mx-auto',
              visual.textAlignment === 'center' && 'text-center',
              visual.textAlignment === 'left' && 'text-left',
              visual.textAlignment === 'right' && 'text-right'
            )}
          >
            
            {/* 主标题 */}
            <motion.h1 
              className={cn(
                'newhome-hero__title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight tracking-tight',
                textColorClass
              )}
              initial="hidden"
              whileInView="fadeIn"
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {content.title}
            </motion.h1>

            {/* 副标题 */}
            <motion.p 
              className={cn(
                'newhome-hero__subtitle text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 leading-relaxed',
                textSecondaryClass
              )}
              initial="hidden"
              whileInView="fadeIn"
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {content.subtitle}
            </motion.p>

            {/* 描述文字 */}
            <motion.p 
              className={cn(
                'text-lg sm:text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl leading-relaxed',
                visual.textAlignment === 'center' && 'mx-auto',
                textTertiaryClass
              )}
              initial="hidden"
              whileInView="fadeIn"
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {content.description}
            </motion.p>

            {/* CTA按钮 */}
            <motion.div
              initial="hiddenScale"
              whileInView="scaleIn"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={cn(
                visual.textAlignment === 'center' && 'flex justify-center',
                visual.textAlignment === 'right' && 'flex justify-end'
              )}
            >
              <UnifiedButton 
                variant="primary"
                size="large"
                onClick={handleCTAClick}
                className="px-8 py-6 h-auto text-lg font-semibold"
                customColor="#00A651"
                icon={<ArrowRightOutlined className="transition-transform duration-300 group-hover:translate-x-1" />}
                iconPosition="right"
                shadow="large"
              >
                {content.ctaText}
              </UnifiedButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 滚动提示 */}
      {visual.showScrollHint && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-2"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-1 h-3 bg-white/60 rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 开发环境调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg space-y-1">
          <div>Video: {shouldPlayVideo ? 'Enabled' : 'Disabled'}</div>
          <div>Loaded: {isLoaded ? 'Yes' : 'No'}</div>
          <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
          <div>Error: {hasError ? 'Yes' : 'No'}</div>
          <div>Network: {networkSpeed}</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
        </div>
      )}
    </section>
  );
};

export default EnhancedHero;