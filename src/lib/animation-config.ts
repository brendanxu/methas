/**
 * 统一动画系统配置
 * 提供一致的动画时长、缓动函数和变换参数
 */

// 缓动函数库
export const EASING = {
  // 基础缓动
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  
  // 自定义缓动
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.46, 0.45, 0.94],
  snappy: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.1, 0.25, 1],
  
  // 物理模拟
  spring: [0.5, 1.25, 0.75, 1.25],
  elastic: [0.68, -0.55, 0.265, 1.55],
  
  // 品牌专用
  southpole: [0.25, 0.1, 0.25, 1],
} as const;

// 动画时长
export const DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
  slowest: 1000,
  
  // 语义化时长
  hover: 200,
  tooltip: 150,
  dropdown: 250,
  modal: 300,
  page: 500,
  
  // 微交互
  button: 150,
  input: 200,
  card: 250,
  section: 400,
} as const;

// 延迟时长
export const DELAY = {
  none: 0,
  tiny: 50,
  small: 100,
  medium: 200,
  large: 300,
  huge: 500,
  
  // 交错动画
  stagger: 100,
  cascade: 150,
} as const;

// 动画距离/幅度
export const DISTANCE = {
  small: 10,
  medium: 20,
  large: 40,
  huge: 80,
} as const;

// 常用动画预设
export const ANIMATIONS = {
  // 淡入淡出
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.normal / 1000, ease: EASING.ease },
  },
  
  // 滑动进入
  slideUp: {
    initial: { opacity: 0, y: DISTANCE.medium },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -DISTANCE.medium },
    transition: { duration: DURATION.normal / 1000, ease: EASING.southpole },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -DISTANCE.medium },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: DISTANCE.medium },
    transition: { duration: DURATION.normal / 1000, ease: EASING.southpole },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: DISTANCE.medium },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -DISTANCE.medium },
    transition: { duration: DURATION.normal / 1000, ease: EASING.southpole },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -DISTANCE.medium },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: DISTANCE.medium },
    transition: { duration: DURATION.normal / 1000, ease: EASING.southpole },
  },
  
  // 缩放动画
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: DURATION.normal / 1000, ease: EASING.smooth },
  },
  
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
    transition: { duration: DURATION.normal / 1000, ease: EASING.bounce },
  },
  
  // 弹性动画
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: { duration: DURATION.slow / 1000, ease: EASING.bounce },
  },
  
  // 旋转动画
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 10 },
    transition: { duration: DURATION.normal / 1000, ease: EASING.smooth },
  },
  
  // 组合动画
  slideScale: {
    initial: { opacity: 0, y: DISTANCE.medium, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -DISTANCE.medium, scale: 0.9 },
    transition: { duration: DURATION.normal / 1000, ease: EASING.southpole },
  },
  
  // 页面切换
  pageSlide: {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
    transition: { duration: DURATION.page / 1000, ease: EASING.smooth },
  },
  
  // 模态框
  modal: {
    initial: { opacity: 0, scale: 0.9, y: -20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -20 },
    transition: { duration: DURATION.modal / 1000, ease: EASING.smooth },
  },
  
  // 抽屉
  drawer: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: DURATION.normal / 1000, ease: EASING.snappy },
  },
  
  // 卡片悬停
  cardHover: {
    whileHover: { 
      y: -4, 
      scale: 1.02,
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      transition: { duration: DURATION.hover / 1000, ease: EASING.smooth }
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: DURATION.fast / 1000, ease: EASING.snappy }
    },
  },
  
  // 按钮交互
  button: {
    whileHover: { 
      scale: 1.05,
      transition: { duration: DURATION.button / 1000, ease: EASING.smooth }
    },
    whileTap: { 
      scale: 0.95,
      transition: { duration: DURATION.fast / 1000, ease: EASING.snappy }
    },
  },
} as const;

// 交错动画配置
export const STAGGER = {
  container: {
    animate: {
      transition: {
        staggerChildren: DELAY.stagger / 1000,
        delayChildren: DELAY.small / 1000,
      },
    },
  },
  
  item: {
    initial: { opacity: 0, y: DISTANCE.medium },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.normal / 1000, ease: EASING.southpole },
  },
  
  // 快速交错
  fast: {
    container: {
      animate: {
        transition: {
          staggerChildren: DELAY.tiny / 1000,
          delayChildren: 0,
        },
      },
    },
    item: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: DURATION.fast / 1000, ease: EASING.bounce },
    },
  },
  
  // 慢速交错
  slow: {
    container: {
      animate: {
        transition: {
          staggerChildren: DELAY.cascade / 1000,
          delayChildren: DELAY.medium / 1000,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: DISTANCE.large },
      animate: { opacity: 1, y: 0 },
      transition: { duration: DURATION.slow / 1000, ease: EASING.smooth },
    },
  },
};

// 手势动画配置
export const GESTURES = {
  // 拖拽
  drag: {
    drag: true,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.2,
    whileDrag: { scale: 1.05, cursor: 'grabbing' },
  },
  
  // 滑动
  swipe: {
    drag: 'x',
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 0.7,
  },
  
  // 捏合缩放
  pinch: {
    whileTap: { scale: 0.9 },
  },
};

// 路径动画配置
export const PATH_ANIMATIONS = {
  // SVG 路径绘制
  draw: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: DURATION.slow / 1000, ease: EASING.smooth },
  },
  
  // 路径擦除
  erase: {
    initial: { pathLength: 1, opacity: 1 },
    animate: { pathLength: 0, opacity: 0 },
    transition: { duration: DURATION.normal / 1000, ease: EASING.smooth },
  },
};

// 视差滚动配置
export const PARALLAX = {
  // 慢速视差
  slow: {
    y: [-20, 20],
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
  
  // 快速视差
  fast: {
    y: [-50, 50],
    transition: { type: 'spring', stiffness: 200, damping: 30 },
  },
  
  // 背景视差
  background: {
    y: [-100, 100],
    scale: [1, 1.1],
    transition: { type: 'spring', stiffness: 50, damping: 15 },
  },
};

// 性能优化配置
export const PERFORMANCE = {
  // 减少动画（用户偏好设置）
  reducedMotion: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 },
  },
  
  // GPU 优化
  gpuOptimized: {
    style: {
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      perspective: 1000,
    },
  },
  
  // 低端设备优化
  lowEnd: {
    transition: { duration: DURATION.fast / 1000 },
    style: { willChange: 'auto' },
  },
};

// 动画工具函数
export const createStaggerAnimation = (
  itemCount: number,
  baseDelay: number = DELAY.stagger
) => ({
  container: {
    animate: {
      transition: {
        staggerChildren: baseDelay / 1000,
        delayChildren: DELAY.small / 1000,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: DISTANCE.medium },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: DURATION.normal / 1000, 
      ease: EASING.southpole 
    },
  },
});

export const createCustomAnimation = (
  config: {
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    duration?: number;
    easing?: keyof typeof EASING;
    scale?: boolean;
  }
) => {
  const { direction = 'up', distance = DISTANCE.medium, duration = DURATION.normal, easing = 'southpole', scale = false } = config;
  
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };
  
  return {
    initial: { 
      opacity: 0, 
      ...directionMap[direction],
      ...(scale && { scale: 0.9 })
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      ...(scale && { scale: 1 })
    },
    exit: { 
      opacity: 0, 
      ...directionMap[direction],
      ...(scale && { scale: 0.9 })
    },
    transition: { duration: duration / 1000, ease: EASING[easing] },
  };
};

// 检测用户偏好设置
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// 检测设备性能
export const getDevicePerformance = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'medium';
  
  // 基于内存和CPU核心数判断
  const memory = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  
  if (memory >= 8 && cores >= 8) return 'high';
  if (memory >= 4 && cores >= 4) return 'medium';
  return 'low';
};

// 自适应动画配置
export const getAdaptiveAnimation = (baseAnimation: any) => {
  if (shouldReduceMotion()) {
    return PERFORMANCE.reducedMotion;
  }
  
  const performance = getDevicePerformance();
  
  switch (performance) {
    case 'low':
      return {
        ...baseAnimation,
        transition: {
          ...baseAnimation.transition,
          duration: (baseAnimation.transition?.duration || DURATION.normal / 1000) * 0.5,
        },
      };
    case 'high':
      return {
        ...baseAnimation,
        ...PERFORMANCE.gpuOptimized,
      };
    default:
      return baseAnimation;
  }
};