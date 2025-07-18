// ===== Global Animation Configuration =====

import { EASING } from './animation-system';

export interface GlobalAnimationConfig {
  // 性能设置
  performance: {
    enabled: boolean;
    targetFrameRate: number;
    maxConcurrentAnimations: number;
    autoOptimize: boolean;
    reducedMotionRespect: boolean;
  };
  
  // 默认时长设置
  durations: {
    fast: number;
    normal: number;
    slow: number;
    pageTransition: number;
  };
  
  // 默认缓动设置
  easings: {
    entrance: string;
    exit: string;
    hover: string;
    tap: string;
    page: string;
  };
  
  // 交错动画设置
  stagger: {
    fast: number;
    normal: number;
    slow: number;
  };
  
  // 视口设置
  viewport: {
    margin: string;
    threshold: number;
    once: boolean;
  };
}

// ===== 默认配置 =====

export const DEFAULT_ANIMATION_CONFIG: GlobalAnimationConfig = {
  performance: {
    enabled: true,
    targetFrameRate: 60,
    maxConcurrentAnimations: 12,
    autoOptimize: true,
    reducedMotionRespect: true,
  },
  
  durations: {
    fast: 0.2,
    normal: 0.6,
    slow: 1.0,
    pageTransition: 0.8,
  },
  
  easings: {
    entrance: EASING.smooth,
    exit: EASING.swiftOut,
    hover: EASING.swift,
    tap: EASING.swiftIn,
    page: EASING.dramatic,
  },
  
  stagger: {
    fast: 50,
    normal: 100,
    slow: 200,
  },
  
  viewport: {
    margin: '0px 0px -100px 0px',
    threshold: 0.1,
    once: true,
  },
};

// ===== 主题特定配置 =====

export const THEME_ANIMATIONS = {
  // 南极风格 - 流畅、优雅
  southpole: {
    ...DEFAULT_ANIMATION_CONFIG,
    easings: {
      entrance: EASING.elastic,
      exit: EASING.dramatic,
      hover: EASING.spring,
      tap: EASING.bounce,
      page: EASING.smooth,
    },
    durations: {
      fast: 0.3,
      normal: 0.8,
      slow: 1.2,
      pageTransition: 1.0,
    },
  },
  
  // 商务风格 - 快速、专业
  business: {
    ...DEFAULT_ANIMATION_CONFIG,
    easings: {
      entrance: EASING.swift,
      exit: EASING.swiftOut,
      hover: EASING.swiftIn,
      tap: EASING.linear,
      page: EASING.ease,
    },
    durations: {
      fast: 0.15,
      normal: 0.4,
      slow: 0.6,
      pageTransition: 0.5,
    },
  },
  
  // 节能模式 - 最小动画
  minimal: {
    ...DEFAULT_ANIMATION_CONFIG,
    performance: {
      ...DEFAULT_ANIMATION_CONFIG.performance,
      maxConcurrentAnimations: 5,
    },
    durations: {
      fast: 0.1,
      normal: 0.2,
      slow: 0.3,
      pageTransition: 0.2,
    },
    easings: {
      entrance: EASING.linear,
      exit: EASING.linear,
      hover: EASING.linear,
      tap: EASING.linear,
      page: EASING.linear,
    },
  },
};

// ===== 预设动画组合 =====

export const ANIMATION_PRESETS = {
  // 页面入场动画
  pageEnter: {
    initial: 'hiddenDown',
    animate: 'fadeIn',
    transition: {
      duration: DEFAULT_ANIMATION_CONFIG.durations.pageTransition,
      easing: DEFAULT_ANIMATION_CONFIG.easings.page,
    },
  },
  
  // 卡片入场动画
  cardEnter: {
    initial: 'hiddenScale',
    animate: 'scaleIn',
    transition: {
      duration: DEFAULT_ANIMATION_CONFIG.durations.normal,
      easing: DEFAULT_ANIMATION_CONFIG.easings.entrance,
    },
  },
  
  // 文字入场动画
  textEnter: {
    initial: 'hidden',
    animate: 'slideUp',
    transition: {
      duration: DEFAULT_ANIMATION_CONFIG.durations.normal,
      easing: DEFAULT_ANIMATION_CONFIG.easings.entrance,
    },
  },
  
  // 按钮交互动画
  buttonInteractive: {
    whileHover: 'lift',
    whileTap: 'tap',
    transition: {
      duration: DEFAULT_ANIMATION_CONFIG.durations.fast,
      easing: DEFAULT_ANIMATION_CONFIG.easings.hover,
    },
  },
  
  // 导航动画
  navigation: {
    initial: 'hiddenUp',
    animate: 'slideDown',
    transition: {
      duration: DEFAULT_ANIMATION_CONFIG.durations.fast,
      easing: DEFAULT_ANIMATION_CONFIG.easings.entrance,
    },
  },
  
  // 英雄区域动画
  hero: {
    initial: 'hiddenBlur',
    animate: 'zoomIn',
    transition: {
      duration: DEFAULT_ANIMATION_CONFIG.durations.slow,
      easing: DEFAULT_ANIMATION_CONFIG.easings.entrance,
    },
  },
  
  // 交错列表动画
  staggerList: {
    staggerDelay: DEFAULT_ANIMATION_CONFIG.stagger.normal,
    initial: 'hiddenLeft',
    animate: 'slideRight',
    transition: {
      duration: DEFAULT_ANIMATION_CONFIG.durations.normal,
      easing: DEFAULT_ANIMATION_CONFIG.easings.entrance,
    },
  },
};

// ===== 响应式动画配置 =====

export const RESPONSIVE_ANIMATIONS: Record<string, Partial<GlobalAnimationConfig>> = {
  // 移动端优化
  mobile: {
    performance: {
      enabled: true,
      targetFrameRate: 60,
      maxConcurrentAnimations: 6,
      autoOptimize: true,
      reducedMotionRespect: true,
    },
    durations: {
      fast: 0.15,
      normal: 0.4,
      slow: 0.6,
      pageTransition: 0.5,
    },
    stagger: {
      fast: 30,
      normal: 60,
      slow: 100,
    },
  },
  
  // 平板端优化
  tablet: {
    performance: {
      enabled: true,
      targetFrameRate: 60,
      maxConcurrentAnimations: 8,
      autoOptimize: true,
      reducedMotionRespect: true,
    },
    durations: {
      fast: 0.2,
      normal: 0.5,
      slow: 0.8,
      pageTransition: 0.6,
    },
  },
  
  // 桌面端优化
  desktop: {
    performance: {
      enabled: true,
      targetFrameRate: 60,
      maxConcurrentAnimations: 12,
      autoOptimize: true,
      reducedMotionRespect: true,
    },
  },
};

// ===== 配置获取工具 =====

export const getAnimationConfig = (
  theme: keyof typeof THEME_ANIMATIONS = 'southpole',
  deviceType?: 'mobile' | 'tablet' | 'desktop'
): GlobalAnimationConfig => {
  let config: GlobalAnimationConfig = THEME_ANIMATIONS[theme] || DEFAULT_ANIMATION_CONFIG;
  
  // 应用响应式配置
  if (deviceType && RESPONSIVE_ANIMATIONS[deviceType]) {
    const responsiveConfig = RESPONSIVE_ANIMATIONS[deviceType];
    
    config = {
      performance: {
        ...config.performance,
        ...(responsiveConfig.performance || {}),
      },
      durations: {
        ...config.durations,
        ...(responsiveConfig.durations || {}),
      },
      easings: {
        ...config.easings,
        ...(responsiveConfig.easings || {}),
      },
      stagger: {
        ...config.stagger,
        ...(responsiveConfig.stagger || {}),
      },
      viewport: {
        ...config.viewport,
        ...(responsiveConfig.viewport || {}),
      },
    };
  }
  
  return config;
};

// ===== 动画质量等级 =====

export const QUALITY_LEVELS = {
  high: {
    enableParallax: true,
    enableMagnetic: true,
    enableComplexEasing: true,
    maxStaggerChildren: 20,
    enableShadowAnimations: true,
    enableFilterAnimations: true,
  },
  
  medium: {
    enableParallax: false,
    enableMagnetic: false,
    enableComplexEasing: true,
    maxStaggerChildren: 10,
    enableShadowAnimations: true,
    enableFilterAnimations: false,
  },
  
  low: {
    enableParallax: false,
    enableMagnetic: false,
    enableComplexEasing: false,
    maxStaggerChildren: 5,
    enableShadowAnimations: false,
    enableFilterAnimations: false,
  },
};

export default DEFAULT_ANIMATION_CONFIG;