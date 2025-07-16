/**
 * 统一的设计系统 Token
 * 消除重复的样式定义，建立一致的设计语言
 */

// 品牌颜色系统 - 单一真相来源
export const BRAND_COLORS = {
  // 主色调
  primary: '#002145',
  secondary: '#00A651',
  
  // 状态颜色
  success: '#50E3C2',
  warning: '#F5A623',
  error: '#D0021B',
  
  // 中性色
  white: '#FFFFFF',
  black: '#000000',
  
  // 灰度色阶
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // 透明度变体
  opacity: {
    primary: {
      10: 'rgba(0, 33, 69, 0.1)',
      20: 'rgba(0, 33, 69, 0.2)',
      50: 'rgba(0, 33, 69, 0.5)',
      80: 'rgba(0, 33, 69, 0.8)',
    },
    white: {
      10: 'rgba(255, 255, 255, 0.1)',
      20: 'rgba(255, 255, 255, 0.2)',
      50: 'rgba(255, 255, 255, 0.5)',
      80: 'rgba(255, 255, 255, 0.8)',
    },
    black: {
      10: 'rgba(0, 0, 0, 0.1)',
      20: 'rgba(0, 0, 0, 0.2)',
      50: 'rgba(0, 0, 0, 0.5)',
      80: 'rgba(0, 0, 0, 0.8)',
    },
  }
} as const

// 间距系统
export const SPACING = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
} as const

// 字体系统
export const TYPOGRAPHY = {
  // 字体族
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'monospace'],
    serif: ['Georgia', 'Times New Roman', 'serif'],
  },
  
  // 字体大小
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '64px',
  },
  
  // 字重
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // 行高
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  // 字母间距
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const

// 圆角系统
export const BORDER_RADIUS = {
  none: '0',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '50%',
} as const

// 阴影系统
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
  
  // 品牌阴影
  primary: `0 4px 14px ${BRAND_COLORS.opacity.primary[20]}`,
  secondary: `0 4px 14px rgba(0, 166, 81, 0.2)`,
  
  // 内阴影
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const

// 层级系统
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
  max: 9999,
} as const

// 动画系统
export const ANIMATIONS = {
  // 持续时间
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // 缓动函数
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // 预设动画
  presets: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2 },
    },
  },
} as const

// 断点系统
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// 组件尺寸系统
export const COMPONENT_SIZES = {
  button: {
    small: {
      height: '32px',
      padding: '0 12px',
      fontSize: TYPOGRAPHY.fontSize.sm,
    },
    medium: {
      height: '40px',
      padding: '0 16px',
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    large: {
      height: '48px',
      padding: '0 24px',
      fontSize: TYPOGRAPHY.fontSize.lg,
    },
  },
  
  input: {
    small: {
      height: '32px',
      padding: '0 12px',
      fontSize: TYPOGRAPHY.fontSize.sm,
    },
    medium: {
      height: '40px',
      padding: '0 16px',
      fontSize: TYPOGRAPHY.fontSize.base,
    },
    large: {
      height: '48px',
      padding: '0 20px',
      fontSize: TYPOGRAPHY.fontSize.lg,
    },
  },
  
  card: {
    padding: {
      small: SPACING[4],
      medium: SPACING[6],
      large: SPACING[8],
    },
  },
} as const

// 导出所有设计token
export const DESIGN_TOKENS = {
  colors: BRAND_COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  zIndex: Z_INDEX,
  animations: ANIMATIONS,
  breakpoints: BREAKPOINTS,
  componentSizes: COMPONENT_SIZES,
} as const

// 类型定义
export type ColorToken = keyof typeof BRAND_COLORS
export type SpacingToken = keyof typeof SPACING
export type FontSizeToken = keyof typeof TYPOGRAPHY.fontSize
export type BorderRadiusToken = keyof typeof BORDER_RADIUS
export type ShadowToken = keyof typeof SHADOWS
export type AnimationDuration = keyof typeof ANIMATIONS.duration
export type AnimationEasing = keyof typeof ANIMATIONS.easing
export type Breakpoint = keyof typeof BREAKPOINTS
export type ComponentSize = 'small' | 'medium' | 'large'