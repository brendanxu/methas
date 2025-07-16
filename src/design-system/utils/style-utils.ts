/**
 * 统一的样式工具函数
 * 消除重复的样式逻辑，提供一致的样式生成方法
 */

import { DESIGN_TOKENS } from '../tokens'
import { cssVar } from '../css-generator'

// 类名合并工具 - 替换多个重复的cn函数
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 颜色工具函数
export const colorUtils = {
  // 获取颜色变量
  getColor: (color: string) => cssVar(color),
  
  // 获取透明度颜色
  getColorWithOpacity: (color: string, opacity: number) => {
    const colorValue = cssVar(color)
    return `rgba(${colorValue}, ${opacity})`
  },
  
  // 获取主题颜色
  getThemeColor: (color: 'primary' | 'secondary' | 'success' | 'warning' | 'error', opacity?: number) => {
    const colorValue = cssVar(color)
    return opacity ? `rgba(${colorValue}, ${opacity})` : colorValue
  },
  
  // 检查是否为暗色主题
  isDarkTheme: () => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  },
  
  // 根据主题获取颜色
  getColorByTheme: (lightColor: string, darkColor: string) => {
    return colorUtils.isDarkTheme() ? darkColor : lightColor
  },
  
  // 生成颜色变体
  generateColorVariants: (baseColor: string) => ({
    50: `${baseColor}0D`,  // 5%
    100: `${baseColor}1A`, // 10%
    200: `${baseColor}33`, // 20%
    300: `${baseColor}4D`, // 30%
    400: `${baseColor}66`, // 40%
    500: `${baseColor}80`, // 50%
    600: `${baseColor}99`, // 60%
    700: `${baseColor}B3`, // 70%
    800: `${baseColor}CC`, // 80%
    900: `${baseColor}E6`, // 90%
  }),
}

// 间距工具函数
export const spacingUtils = {
  // 获取间距值
  getSpacing: (size: keyof typeof DESIGN_TOKENS.spacing) => DESIGN_TOKENS.spacing[size],
  
  // 生成padding样式
  getPadding: (size: keyof typeof DESIGN_TOKENS.spacing) => ({
    padding: DESIGN_TOKENS.spacing[size],
  }),
  
  // 生成margin样式
  getMargin: (size: keyof typeof DESIGN_TOKENS.spacing) => ({
    margin: DESIGN_TOKENS.spacing[size],
  }),
  
  // 生成垂直间距
  getVerticalSpacing: (size: keyof typeof DESIGN_TOKENS.spacing) => ({
    marginTop: DESIGN_TOKENS.spacing[size],
    marginBottom: DESIGN_TOKENS.spacing[size],
  }),
  
  // 生成水平间距
  getHorizontalSpacing: (size: keyof typeof DESIGN_TOKENS.spacing) => ({
    marginLeft: DESIGN_TOKENS.spacing[size],
    marginRight: DESIGN_TOKENS.spacing[size],
  }),
  
  // 生成响应式间距
  getResponsiveSpacing: (sizes: Record<string, keyof typeof DESIGN_TOKENS.spacing>) => {
    const styles: Record<string, any> = {}
    
    Object.entries(sizes).forEach(([breakpoint, size]) => {
      const breakpointValue = DESIGN_TOKENS.breakpoints[breakpoint as keyof typeof DESIGN_TOKENS.breakpoints]
      if (breakpointValue) {
        styles[`@media (min-width: ${breakpointValue})`] = {
          padding: DESIGN_TOKENS.spacing[size],
        }
      }
    })
    
    return styles
  },
}

// 字体工具函数
export const typographyUtils = {
  // 获取字体大小
  getFontSize: (size: keyof typeof DESIGN_TOKENS.typography.fontSize) => 
    DESIGN_TOKENS.typography.fontSize[size],
  
  // 获取字体权重
  getFontWeight: (weight: keyof typeof DESIGN_TOKENS.typography.fontWeight) => 
    DESIGN_TOKENS.typography.fontWeight[weight],
  
  // 获取行高
  getLineHeight: (height: keyof typeof DESIGN_TOKENS.typography.lineHeight) => 
    DESIGN_TOKENS.typography.lineHeight[height],
  
  // 生成标题样式
  getHeadingStyle: (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const sizeMap = {
      1: 'xl',
      2: 'lg',
      3: 'base',
      4: 'sm',
      5: 'xs',
      6: 'xs',
    } as const
    
    return {
      fontSize: DESIGN_TOKENS.typography.fontSize[sizeMap[level]],
      fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
      lineHeight: DESIGN_TOKENS.typography.lineHeight.tight,
      color: cssVar('foreground'),
    }
  },
  
  // 生成段落样式
  getParagraphStyle: () => ({
    fontSize: DESIGN_TOKENS.typography.fontSize.base,
    fontWeight: DESIGN_TOKENS.typography.fontWeight.normal,
    lineHeight: DESIGN_TOKENS.typography.lineHeight.relaxed,
    color: cssVar('foreground'),
    marginBottom: DESIGN_TOKENS.spacing[4],
  }),
  
  // 生成截断文本样式
  getTruncateStyle: (lines: number = 1) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
  }),
}

// 布局工具函数
export const layoutUtils = {
  // Flexbox 布局
  getFlex: (direction: 'row' | 'column' = 'row', align: string = 'center', justify: string = 'center') => ({
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
  }),
  
  // Grid 布局
  getGrid: (columns: number, gap: keyof typeof DESIGN_TOKENS.spacing = 4) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: DESIGN_TOKENS.spacing[gap],
  }),
  
  // 响应式Grid
  getResponsiveGrid: (breakpoints: Record<string, number>) => {
    const styles: Record<string, any> = {}
    
    Object.entries(breakpoints).forEach(([breakpoint, columns]) => {
      const breakpointValue = DESIGN_TOKENS.breakpoints[breakpoint as keyof typeof DESIGN_TOKENS.breakpoints]
      if (breakpointValue) {
        styles[`@media (min-width: ${breakpointValue})`] = {
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }
      }
    })
    
    return styles
  },
  
  // 居中布局
  getCenterLayout: () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  
  // 容器布局
  getContainer: (maxWidth: string = '1200px') => ({
    maxWidth,
    margin: '0 auto',
    padding: `0 ${DESIGN_TOKENS.spacing[4]}`,
  }),
}

// 动画工具函数
export const animationUtils = {
  // 获取过渡效果
  getTransition: (property: string = 'all', duration: keyof typeof DESIGN_TOKENS.animations.duration = 'normal') => ({
    transition: `${property} ${DESIGN_TOKENS.animations.duration[duration]} ${DESIGN_TOKENS.animations.easing.easeInOut}`,
  }),
  
  // 获取悬停效果
  getHoverEffect: (scale: number = 1.05, shadow: keyof typeof DESIGN_TOKENS.shadows = 'md') => ({
    ...animationUtils.getTransition('transform'),
    '&:hover': {
      transform: `scale(${scale})`,
      boxShadow: DESIGN_TOKENS.shadows[shadow],
    },
  }),
  
  // 获取淡入动画
  getFadeInAnimation: (duration: keyof typeof DESIGN_TOKENS.animations.duration = 'normal') => ({
    animation: `sp-fade-in ${DESIGN_TOKENS.animations.duration[duration]} ${DESIGN_TOKENS.animations.easing.easeOut}`,
  }),
  
  // 获取滑动动画
  getSlideAnimation: (direction: 'up' | 'down' | 'left' | 'right' = 'up', duration: keyof typeof DESIGN_TOKENS.animations.duration = 'normal') => ({
    animation: `sp-slide-${direction} ${DESIGN_TOKENS.animations.duration[duration]} ${DESIGN_TOKENS.animations.easing.easeOut}`,
  }),
  
  // 获取弹跳动画
  getBounceAnimation: (duration: keyof typeof DESIGN_TOKENS.animations.duration = 'normal') => ({
    animation: `sp-bounce ${DESIGN_TOKENS.animations.duration[duration]} ${DESIGN_TOKENS.animations.easing.bounce}`,
  }),
}

// 阴影工具函数
export const shadowUtils = {
  // 获取阴影
  getShadow: (size: keyof typeof DESIGN_TOKENS.shadows) => ({
    boxShadow: DESIGN_TOKENS.shadows[size],
  }),
  
  // 获取品牌阴影
  getBrandShadow: (color: 'primary' | 'secondary') => ({
    boxShadow: DESIGN_TOKENS.shadows[color],
  }),
  
  // 获取悬停阴影
  getHoverShadow: (normalShadow: keyof typeof DESIGN_TOKENS.shadows = 'sm', hoverShadow: keyof typeof DESIGN_TOKENS.shadows = 'lg') => ({
    boxShadow: DESIGN_TOKENS.shadows[normalShadow],
    transition: `box-shadow ${DESIGN_TOKENS.animations.duration.normal} ${DESIGN_TOKENS.animations.easing.easeInOut}`,
    '&:hover': {
      boxShadow: DESIGN_TOKENS.shadows[hoverShadow],
    },
  }),
}

// 响应式工具函数
export const responsiveUtils = {
  // 媒体查询
  breakpoint: (size: keyof typeof DESIGN_TOKENS.breakpoints) => 
    `@media (min-width: ${DESIGN_TOKENS.breakpoints[size]})`,
  
  // 生成响应式样式
  responsive: (styles: Record<string, any>) => {
    const responsiveStyles: Record<string, any> = {}
    
    Object.entries(styles).forEach(([breakpoint, style]) => {
      const breakpointValue = DESIGN_TOKENS.breakpoints[breakpoint as keyof typeof DESIGN_TOKENS.breakpoints]
      if (breakpointValue) {
        responsiveStyles[`@media (min-width: ${breakpointValue})`] = style
      } else {
        responsiveStyles[breakpoint] = style
      }
    })
    
    return responsiveStyles
  },
  
  // 隐藏元素
  hideOn: (breakpoint: keyof typeof DESIGN_TOKENS.breakpoints) => ({
    [responsiveUtils.breakpoint(breakpoint)]: {
      display: 'none',
    },
  }),
  
  // 显示元素
  showOn: (breakpoint: keyof typeof DESIGN_TOKENS.breakpoints) => ({
    display: 'none',
    [responsiveUtils.breakpoint(breakpoint)]: {
      display: 'block',
    },
  }),
}

// 边框工具函数
export const borderUtils = {
  // 获取圆角
  getBorderRadius: (size: keyof typeof DESIGN_TOKENS.borderRadius) => ({
    borderRadius: DESIGN_TOKENS.borderRadius[size],
  }),
  
  // 获取边框
  getBorder: (color: string = cssVar('border'), width: string = '1px', style: string = 'solid') => ({
    border: `${width} ${style} ${color}`,
  }),
  
  // 获取焦点边框
  getFocusBorder: (color: string = cssVar('ring')) => ({
    outline: 'none',
    '&:focus': {
      borderColor: color,
      boxShadow: `0 0 0 2px ${color}25`,
    },
  }),
}

// 状态工具函数
export const stateUtils = {
  // 禁用状态
  getDisabledState: () => ({
    opacity: 0.6,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  }),
  
  // 加载状态
  getLoadingState: () => ({
    opacity: 0.8,
    cursor: 'wait',
  }),
  
  // 选中状态
  getSelectedState: (color: string = cssVar('primary')) => ({
    backgroundColor: color,
    color: cssVar('white'),
    borderColor: color,
  }),
  
  // 错误状态
  getErrorState: () => ({
    borderColor: cssVar('error'),
    color: cssVar('error'),
    '&:focus': {
      borderColor: cssVar('error'),
      boxShadow: `0 0 0 2px ${cssVar('error')}25`,
    },
  }),
}

// 层级工具函数
export const zIndexUtils = {
  // 获取层级
  getZIndex: (layer: keyof typeof DESIGN_TOKENS.zIndex) => ({
    zIndex: DESIGN_TOKENS.zIndex[layer],
  }),
  
  // 获取相对层级
  getRelativeZIndex: (baseLayer: keyof typeof DESIGN_TOKENS.zIndex, offset: number = 1) => ({
    zIndex: DESIGN_TOKENS.zIndex[baseLayer] + offset,
  }),
}

// 导出所有工具函数
export const styleUtils = {
  cn,
  color: colorUtils,
  spacing: spacingUtils,
  typography: typographyUtils,
  layout: layoutUtils,
  animation: animationUtils,
  shadow: shadowUtils,
  responsive: responsiveUtils,
  border: borderUtils,
  state: stateUtils,
  zIndex: zIndexUtils,
}

// 默认导出
export default styleUtils