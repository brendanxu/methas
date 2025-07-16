/**
 * CSS变量生成器
 * 将设计token转换为CSS变量，消除重复的样式定义
 */

import { DESIGN_TOKENS } from './tokens'

// 生成CSS变量的前缀
const CSS_VAR_PREFIX = 'sp'

// 扁平化嵌套对象
function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = prefix ? `${prefix}-${key}` : key
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newPrefix))
    } else {
      result[`--${CSS_VAR_PREFIX}-${newPrefix}`] = String(value)
    }
  }
  
  return result
}

// 生成主题CSS变量
export function generateThemeVariables(isDark = false) {
  const lightTheme = {
    // 语义化颜色
    background: DESIGN_TOKENS.colors.white,
    foreground: DESIGN_TOKENS.colors.gray[900],
    muted: DESIGN_TOKENS.colors.gray[50],
    mutedForeground: DESIGN_TOKENS.colors.gray[500],
    border: DESIGN_TOKENS.colors.gray[200],
    input: DESIGN_TOKENS.colors.white,
    card: DESIGN_TOKENS.colors.white,
    cardForeground: DESIGN_TOKENS.colors.gray[900],
    popover: DESIGN_TOKENS.colors.white,
    popoverForeground: DESIGN_TOKENS.colors.gray[900],
    accent: DESIGN_TOKENS.colors.gray[100],
    accentForeground: DESIGN_TOKENS.colors.gray[900],
    destructive: DESIGN_TOKENS.colors.error,
    destructiveForeground: DESIGN_TOKENS.colors.white,
    ring: DESIGN_TOKENS.colors.primary,
  }
  
  const darkTheme = {
    // 暗色主题
    background: DESIGN_TOKENS.colors.gray[900],
    foreground: DESIGN_TOKENS.colors.gray[50],
    muted: DESIGN_TOKENS.colors.gray[800],
    mutedForeground: DESIGN_TOKENS.colors.gray[400],
    border: DESIGN_TOKENS.colors.gray[700],
    input: DESIGN_TOKENS.colors.gray[800],
    card: DESIGN_TOKENS.colors.gray[800],
    cardForeground: DESIGN_TOKENS.colors.gray[50],
    popover: DESIGN_TOKENS.colors.gray[800],
    popoverForeground: DESIGN_TOKENS.colors.gray[50],
    accent: DESIGN_TOKENS.colors.gray[700],
    accentForeground: DESIGN_TOKENS.colors.gray[50],
    destructive: DESIGN_TOKENS.colors.error,
    destructiveForeground: DESIGN_TOKENS.colors.white,
    ring: DESIGN_TOKENS.colors.primary,
  }
  
  const themeColors = isDark ? darkTheme : lightTheme
  
  // 合并所有token
  const allTokens = {
    ...DESIGN_TOKENS.colors,
    ...themeColors,
    ...DESIGN_TOKENS.spacing,
    ...DESIGN_TOKENS.typography,
    ...DESIGN_TOKENS.borderRadius,
    ...DESIGN_TOKENS.shadows,
    ...DESIGN_TOKENS.zIndex,
    ...DESIGN_TOKENS.animations,
    ...DESIGN_TOKENS.componentSizes,
  }
  
  return flattenObject(allTokens)
}

// 生成CSS字符串
export function generateCSSString(isDark = false): string {
  const variables = generateThemeVariables(isDark)
  
  const cssLines = Object.entries(variables)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n')
  
  return `:root {\n${cssLines}\n}`
}

// 生成主题切换CSS
export function generateThemeToggleCSS(): string {
  const lightCSS = generateCSSString(false)
  const darkCSS = generateCSSString(true)
  
  return `
/* 默认主题 (明亮) */
${lightCSS}

/* 暗色主题 */
.dark {
${darkCSS.replace(':root', '').replace('{', '').replace('}', '')}
}

/* 系统主题偏好 */
@media (prefers-color-scheme: dark) {
  :root {
${darkCSS.replace(':root', '').replace('{', '').replace('}', '')}
  }
}

/* 强制明亮主题 */
.light {
${lightCSS.replace(':root', '').replace('{', '').replace('}', '')}
}
`
}

// 实用工具函数
export const cssVar = (name: string) => `var(--${CSS_VAR_PREFIX}-${name})`

// 创建响应式CSS变量
export function createResponsiveVar(name: string, values: Record<string, string>): string {
  const breakpoints = Object.entries(DESIGN_TOKENS.breakpoints)
  
  let css = `:root {\n  --${CSS_VAR_PREFIX}-${name}: ${values.xs || values.default};\n}\n`
  
  for (const [breakpoint, minWidth] of breakpoints) {
    if (values[breakpoint] && breakpoint !== 'xs') {
      css += `
@media (min-width: ${minWidth}) {
  :root {
    --${CSS_VAR_PREFIX}-${name}: ${values[breakpoint]};
  }
}
`
    }
  }
  
  return css
}

// 组件特定的CSS变量
export function generateComponentVariables(componentName: string, tokens: Record<string, any>) {
  const variables = flattenObject(tokens, componentName)
  
  return Object.entries(variables)
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n  ')
}

// 动画CSS变量
export function generateAnimationCSS() {
  const { duration, easing, presets } = DESIGN_TOKENS.animations
  
  let css = `
/* 动画持续时间 */
:root {
  --sp-duration-fast: ${duration.fast};
  --sp-duration-normal: ${duration.normal};
  --sp-duration-slow: ${duration.slow};
}

/* 缓动函数 */
:root {
  --sp-easing-linear: ${easing.linear};
  --sp-easing-ease-in: ${easing.easeIn};
  --sp-easing-ease-out: ${easing.easeOut};
  --sp-easing-ease-in-out: ${easing.easeInOut};
  --sp-easing-bounce: ${easing.bounce};
}

/* 预设动画关键帧 */
@keyframes sp-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes sp-slide-up {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes sp-scale-in {
  from { 
    opacity: 0; 
    transform: scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: scale(1);
  }
}
`
  
  return css
}

// 导出所有生成器
export const CSSGenerators = {
  theme: generateThemeVariables,
  themeToggle: generateThemeToggleCSS,
  cssString: generateCSSString,
  component: generateComponentVariables,
  animation: generateAnimationCSS,
  responsive: createResponsiveVar,
}

// 类型定义
export type CSSVariable = `--${string}`
export type ThemeMode = 'light' | 'dark'
export type ResponsiveValues = Record<string, string> & { default?: string }