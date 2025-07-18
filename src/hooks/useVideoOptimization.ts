import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface VideoOptimizationOptions {
  enableVideo?: boolean;
  disableOnMobile?: boolean;
  disableOnSlowNetwork?: boolean;
  preloadStrategy?: 'none' | 'metadata' | 'auto';
  maxRetries?: number;
  retryDelay?: number;
}

export interface VideoState {
  isLoaded: boolean;
  isPlaying: boolean;
  hasError: boolean;
  canAutoplay: boolean;
  networkSpeed: 'slow' | 'fast' | 'unknown';
  isMobile: boolean;
  shouldPlayVideo: boolean;
  retry: () => void;
  forcePlay: () => Promise<void>;
  pause: () => void;
}

export const useVideoOptimization = (
  videoRef: React.RefObject<HTMLVideoElement>,
  options: VideoOptimizationOptions = {}
): VideoState => {
  const {
    enableVideo = true,
    disableOnMobile = true,
    disableOnSlowNetwork = true,
    preloadStrategy = 'metadata',
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  // 状态管理
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');
  const [isMobile, setIsMobile] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // 内部状态
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 检测网络速度
  useEffect(() => {
    const detectNetworkSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const { effectiveType, downlink, saveData } = connection;
          
          // 如果开启了数据节省模式，认为是慢网络
          if (saveData) {
            setNetworkSpeed('slow');
            return;
          }
          
          // 基于有效类型和下载速度判断
          if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
            setNetworkSpeed('slow');
          } else if (effectiveType === '3g' && downlink < 1.5) {
            setNetworkSpeed('slow');
          } else {
            setNetworkSpeed('fast');
          }
        }
      } else {
        // 没有网络信息API，使用简单的测试
        const startTime = Date.now();
        const testImage = new Image();
        testImage.onload = () => {
          const loadTime = Date.now() - startTime;
          setNetworkSpeed(loadTime < 200 ? 'fast' : 'slow');
        };
        testImage.onerror = () => setNetworkSpeed('slow');
        testImage.src = '/images/network-test.png?' + Date.now();
      }
    };

    detectNetworkSpeed();
  }, []);

  // 自动播放能力检测
  useEffect(() => {
    const testAutoplay = async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        // 创建一个临时的静音视频测试自动播放
        const testVideo = document.createElement('video');
        testVideo.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC7QYF//+l3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2MiByMzA4MSBhM2Y0NDA3IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAABWWWIhAA3//728P4FNjuY0JcRzMheBA==';
        testVideo.muted = true;
        testVideo.playsInline = true;
        
        await testVideo.play();
        setCanAutoplay(true);
        testVideo.remove();
      } catch (error) {
        setCanAutoplay(false);
      }
    };

    testAutoplay();
  }, [videoRef]);

  // 重试机制
  const retry = useCallback(() => {
    if (retryCount >= maxRetries) return;
    
    setHasError(false);
    setIsLoaded(false);
    setRetryCount(prev => prev + 1);
    
    // 延迟重试
    retryTimeoutRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.load();
      }
    }, retryDelay);
  }, [retryCount, maxRetries, retryDelay, videoRef]);

  // 强制播放
  const forcePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.warn('Force play failed:', error);
      setHasError(true);
    }
  }, [videoRef]);

  // 暂停播放
  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  }, [videoRef]);

  // 视频事件处理
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
      
      // 自动重试
      if (retryCount < maxRetries) {
        setTimeout(() => retry(), retryDelay);
      }
    };

    const handleStalled = () => {
      console.warn('Video stalled, network might be slow');
    };

    // 添加事件监听
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('stalled', handleStalled);

    // 设置预加载策略
    video.preload = preloadStrategy;

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('stalled', handleStalled);
    };
  }, [retryCount, maxRetries, retryDelay, retry, preloadStrategy, videoRef]);

  // Intersection Observer 设置
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    intersectionObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasError && canAutoplay) {
          forcePlay();
        } else {
          pause();
        }
      },
      { threshold: 0.1 }
    );

    intersectionObserverRef.current.observe(video);

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [hasError, canAutoplay, forcePlay, pause, videoRef]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // 计算是否应该播放视频
  const shouldPlayVideo = useMemo(() => {
    if (!enableVideo) return false;
    if (isMobile && disableOnMobile) return false;
    if (networkSpeed === 'slow' && disableOnSlowNetwork) return false;
    if (hasError) return false;
    
    return true;
  }, [enableVideo, isMobile, disableOnMobile, networkSpeed, disableOnSlowNetwork, hasError]);

  return {
    isLoaded,
    isPlaying,
    hasError,
    canAutoplay,
    networkSpeed,
    isMobile,
    shouldPlayVideo,
    retry,
    forcePlay,
    pause
  };
};