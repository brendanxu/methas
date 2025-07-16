/**
 * 设计系统主导出文件
 * 统一导出所有设计系统组件和工具
 */

// 设计 Token
import { 
  DESIGN_TOKENS,
  BRAND_COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  Z_INDEX,
  ANIMATIONS,
  BREAKPOINTS,
  COMPONENT_SIZES,
} from './tokens'

export { 
  DESIGN_TOKENS,
  BRAND_COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  Z_INDEX,
  ANIMATIONS,
  BREAKPOINTS,
  COMPONENT_SIZES,
  type ColorToken,
  type SpacingToken,
  type FontSizeToken,
  type BorderRadiusToken,
  type ShadowToken,
  type AnimationDuration,
  type AnimationEasing,
  type Breakpoint,
  type ComponentSize,
} from './tokens'

// CSS 生成器
export {
  generateThemeVariables,
  generateCSSString,
  generateThemeToggleCSS,
  generateComponentVariables,
  generateAnimationCSS,
  createResponsiveVar,
  cssVar,
  CSSGenerators,
  type CSSVariable,
  type ThemeMode,
  type ResponsiveValues,
} from './css-generator'

// 组件接口
export {
  type BaseComponentProps,
  type InteractiveComponentProps,
  type FormComponentProps,
  type SizeVariantProps,
  type ColorVariantProps,
  type ButtonProps,
  type InputProps,
  type CardProps,
  type ModalProps,
  type TableProps,
  type TableColumn,
  type PaginationProps,
  type ListProps,
  type NavigationProps,
  type NavigationItem,
  type NotificationProps,
  type UploadProps,
  type UploadFile,
} from './component-interfaces'

// 统一组件
export {
  UnifiedButton,
  Button,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  OutlineButton,
  SuccessButton,
  WarningButton,
  ErrorButton,
  ButtonGroup,
  IconButton,
  LoadingButton,
} from './components/UnifiedButton'

export {
  UnifiedCard,
  Card,
  DefaultCard,
  InnerCard,
  MetaCard,
  ServiceCard,
  NewsCard,
  CaseCard,
  CardGrid,
} from './components/UnifiedCard'

// 样式工具
export {
  cn,
  colorUtils,
  spacingUtils,
  typographyUtils,
  layoutUtils,
  animationUtils,
  shadowUtils,
  responsiveUtils,
  borderUtils,
  stateUtils,
  zIndexUtils,
  styleUtils,
} from './utils/style-utils'

// 常用样式组合
export const commonStyles = {
  // 重置样式
  reset: {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
  },
  
  // 可视化隐藏
  srOnly: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    borderWidth: 0,
  },
  
  // 清除浮动
  clearfix: {
    '&::after': {
      content: '""',
      display: 'table',
      clear: 'both',
    },
  },
  
  // 垂直居中
  centerY: {
    display: 'flex',
    alignItems: 'center',
  },
  
  // 水平居中
  centerX: {
    display: 'flex',
    justifyContent: 'center',
  },
  
  // 完全居中
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // 绝对定位居中
  absoluteCenter: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  
  // 文本截断
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  // 多行文本截断
  lineClamp: (lines: number) => ({
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
  }),
  
  // 按钮重置
  buttonReset: {
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    outline: 'none',
  },
  
  // 列表重置
  listReset: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  
  // 图片响应式
  responsiveImage: {
    maxWidth: '100%',
    height: 'auto',
  },
  
  // 焦点环
  focusRing: {
    outline: 'none',
    '&:focus': {
      boxShadow: 'var(--sp-ring)',
    },
  },
  
  // 无障碍隐藏
  accessibleHide: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    width: '1px',
  },
}

// 预设主题
export const presetThemes = {
  light: {
    background: '#FFFFFF',
    foreground: '#111827',
    primary: '#002145',
    secondary: '#00A651',
    muted: '#F3F4F6',
    border: '#E5E7EB',
    success: '#50E3C2',
    warning: '#F5A623',
    error: '#D0021B',
  },
  
  dark: {
    background: '#111827',
    foreground: '#F9FAFB',
    primary: '#002145',
    secondary: '#00A651',
    muted: '#1F2937',
    border: '#374151',
    success: '#50E3C2',
    warning: '#F5A623',
    error: '#D0021B',
  },
}

// 设计系统版本
export const VERSION = '1.0.0'

// 设计系统信息
export const DESIGN_SYSTEM_INFO = {
  name: 'South Pole Design System',
  version: VERSION,
  description: '统一的设计系统，消除重复代码和样式不一致',
  author: 'South Pole Team',
  created: '2024-01-01',
  updated: new Date().toISOString().split('T')[0],
}

// 使用指南
export const USAGE_GUIDE = {
  installation: `
    // 导入设计系统
    import { Button, Card, styleUtils } from '@/design-system'
    
    // 使用组件
    <Button variant="primary" size="medium">
      Click Me
    </Button>
    
    // 使用样式工具
    const styles = styleUtils.layout.getFlex('column', 'center', 'center')
  `,
  
  theming: `
    // 自定义主题
    import { generateThemeVariables } from '@/design-system'
    
    const customTheme = generateThemeVariables(false)
    // 应用主题变量到 CSS
  `,
  
  migration: `
    // 迁移现有组件
    // 旧代码
    import { Button } from '@/components/ui/Button'
    
    // 新代码
    import { Button } from '@/design-system'
  `,
}

// 最佳实践
export const BEST_PRACTICES = {
  components: [
    '始终使用统一的设计系统组件',
    '避免直接写行内样式',
    '使用设计 token 而不是硬编码值',
    '保持组件的可复用性和可维护性',
  ],
  
  styling: [
    '使用 styleUtils 工具函数生成样式',
    '保持样式的一致性和可预测性',
    '使用 CSS 变量实现主题切换',
    '遵循响应式设计原则',
  ],
  
  accessibility: [
    '确保所有组件都有正确的 ARIA 属性',
    '提供键盘导航支持',
    '使用语义化的 HTML 元素',
    '确保足够的色彩对比度',
  ],
  
  performance: [
    '使用 Tree Shaking 减少包大小',
    '避免不必要的重渲染',
    '使用 CSS-in-JS 的最佳实践',
    '优化动画性能',
  ],
}

// 默认导出设计系统配置
const designSystemConfig = {
  tokens: DESIGN_TOKENS,
  themes: presetThemes,
  version: VERSION,
  info: DESIGN_SYSTEM_INFO,
  usage: USAGE_GUIDE,
  bestPractices: BEST_PRACTICES,
}

export default designSystemConfig