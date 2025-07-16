'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { motion } from '@/lib/modern-animations';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface HeroVideoProps {
  /** 视频背景URL */
  videoUrl?: string;
  /** 视频poster图片URL */
  posterUrl?: string;
  /** 后备静态图片URL */
  fallbackImageUrl?: string;
  /** 是否启用视频背景 */
  enableVideo?: boolean;
  /** 移动端是否禁用视频 */
  disableVideoOnMobile?: boolean;
  /** 自定义标题 */
  title?: string;
  /** 自定义副标题 */
  subtitle?: string;
  /** 自定义描述 */
  description?: string;
  /** CTA按钮文案 */
  ctaText?: string;
  /** CTA按钮链接 */
  ctaLink?: string;
  /** 是否显示滚动提示 */
  showScrollHint?: boolean;
  className?: string;
}

const HeroVideo: React.FC<HeroVideoProps> = ({
  videoUrl = '/videos/southpole-hero.mp4',
  posterUrl = '/images/hero-poster.jpg',
  fallbackImageUrl = '/images/homepage-main-hero-option-3_640x1036.jpg',
  enableVideo = true,
  disableVideoOnMobile = true,
  title = "It's time for a net zero world.",
  subtitle = "Hello, we're South Pole. The Climate Company.",
  description = "We've been helping organisations decarbonise and navigate the complexities of climate since 2006.",
  ctaText = "Learn more",
  ctaLink = "/what-we-do",
  showScrollHint = true,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');
  const [isIntersecting, setIsIntersecting] = useState(false);

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 网络速度检测
  useEffect(() => {
    const detectNetworkSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          // 基于有效带宽判断网络速度
          if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            setNetworkSpeed('slow');
          } else if (connection.effectiveType === '3g' || connection.effectiveType === '4g') {
            setNetworkSpeed('fast');
          }
        }
      }
    };

    detectNetworkSpeed();
  }, []);

  // Intersection Observer 控制视频播放
  useEffect(() => {
    const heroRef = document.getElementById('hero-video-section');
    if (!heroRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(heroRef);
    return () => observer.disconnect();
  }, []);

  // 视频播放控制
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enableVideo || (isMobile && disableVideoOnMobile)) return;

    if (isIntersecting && !hasVideoError) {
      video.play().catch((error) => {
        console.warn('Video autoplay failed:', error);
        setHasVideoError(true);
      });
    } else {
      video.pause();
    }
  }, [isIntersecting, hasVideoError, enableVideo, isMobile, disableVideoOnMobile]);

  // 视频事件处理
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoError = () => {
    setHasVideoError(true);
    setIsVideoLoaded(false);
  };

  // 判断是否应该显示视频
  const shouldShowVideo = enableVideo && 
                         !hasVideoError && 
                         !(isMobile && disableVideoOnMobile) && 
                         networkSpeed !== 'slow';

  return (
    <section 
      id="hero-video-section"
      className={`relative w-full h-screen overflow-hidden bg-black ${className}`}
    >
      {/* 背景媒体 */}
      <div className="absolute inset-0 w-full h-full">
        {shouldShowVideo ? (
          <>
            {/* 视频背景 */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay
              muted
              loop
              playsInline
              poster={posterUrl}
              onLoadedData={handleVideoLoaded}
              onPlay={handleVideoPlay}
              onError={handleVideoError}
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
              Your browser does not support the video tag.
            </video>
            
            {/* 视频加载占位符 */}
            {!isVideoLoaded && (
              <div className="absolute inset-0 w-full h-full">
                <OptimizedImage
                  src={posterUrl}
                  alt="Loading video..."
                  fill
                  className="object-cover"
                  priority
                />
                {/* 加载指示器 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* 后备静态图片 */
          <OptimizedImage
            src={fallbackImageUrl}
            alt="Net Zero World"
            fill
            className="object-cover object-center"
            priority
          />
        )}
        
        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            {/* 主标题 */}
            <motion.h1 
              className="newhome-hero__title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial="hidden"
              animate="fadeIn"
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {title}
            </motion.h1>

            {/* 副标题 */}
            <motion.p 
              className="newhome-hero__subtitle text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-white/90"
              initial="hidden"
              animate="fadeIn"
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {subtitle}
            </motion.p>

            {/* 描述文字 */}
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-white/80"
              initial="hidden"
              animate="fadeIn"
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {description}
            </motion.p>

            {/* CTA按钮 */}
            <motion.div
              initial="hiddenScale"
              animate="scaleIn"
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Button 
                type="primary"
                size="large"
                className="bg-[#00A651] hover:bg-[#008A44] border-none text-white font-semibold px-8 py-6 h-auto text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.open(ctaLink, '_self')}
                icon={<ArrowRightOutlined className="ml-2" />}
                iconPosition="end"
              >
                {ctaText}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 滚动提示 */}
      {showScrollHint && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 网络状态指示器 (开发环境) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 text-white/60 text-xs">
          <div>Video: {shouldShowVideo ? 'On' : 'Off'}</div>
          <div>Network: {networkSpeed}</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
        </div>
      )}
    </section>
  );
};

export default HeroVideo;