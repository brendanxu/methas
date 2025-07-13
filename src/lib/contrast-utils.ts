/**
 * 对比度检查和颜色调整工具
 */

/**
 * 将十六进制颜色转换为RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 将RGB颜色转换为亮度值
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 计算两个颜色之间的对比度
 */
function getContrast(luminance1: number, luminance2: number): number {
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * 从CSS颜色字符串中提取RGB值
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // 处理十六进制颜色
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }
  
  // 处理 rgb() 或 rgba() 颜色
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }
  
  return null;
}

/**
 * 确保文字颜色与背景有足够的对比度
 */
export function ensureContrast(
  backgroundColor: string, 
  textColor: string,
  minContrast: number = 4.5
): string {
  const bgColor = parseColor(backgroundColor);
  const txtColor = parseColor(textColor);
  
  if (!bgColor || !txtColor) {
    // 如果无法解析颜色，返回安全的默认值
    const bgLuminance = parseColor(backgroundColor);
    if (bgLuminance) {
      const lum = getLuminance(bgLuminance.r, bgLuminance.g, bgLuminance.b);
      return lum > 0.5 ? '#1a1a1a' : '#ffffff';
    }
    return textColor;
  }
  
  const bgLuminance = getLuminance(bgColor.r, bgColor.g, bgColor.b);
  const txtLuminance = getLuminance(txtColor.r, txtColor.g, txtColor.b);
  const contrast = getContrast(bgLuminance, txtLuminance);
  
  if (contrast >= minContrast) {
    return textColor; // 对比度已经足够
  }
  
  // 对比度不够，选择更合适的颜色
  return bgLuminance > 0.5 ? '#1a1a1a' : '#ffffff';
}

/**
 * 检查颜色是否为深色
 */
export function isColorDark(color: string): boolean {
  const rgb = parseColor(color);
  if (!rgb) return false;
  
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance < 0.5;
}

/**
 * 获取颜色的亮度级别
 */
export function getColorBrightness(color: string): 'very-dark' | 'dark' | 'medium' | 'light' | 'very-light' {
  const rgb = parseColor(color);
  if (!rgb) return 'medium';
  
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  
  if (luminance < 0.1) return 'very-dark';
  if (luminance < 0.3) return 'dark';
  if (luminance < 0.7) return 'medium';
  if (luminance < 0.9) return 'light';
  return 'very-light';
}

/**
 * 根据背景颜色获取最佳文字颜色
 */
export function getBestTextColor(backgroundColor: string): string {
  const brightness = getColorBrightness(backgroundColor);
  
  switch (brightness) {
    case 'very-dark':
    case 'dark':
      return '#ffffff';
    case 'very-light':
    case 'light':
      return '#1a1a1a';
    default:
      return isColorDark(backgroundColor) ? '#ffffff' : '#1a1a1a';
  }
}

/**
 * 生成无障碍友好的颜色对
 */
export function generateAccessibleColorPair(baseColor: string): {
  background: string;
  text: string;
  contrast: number;
} {
  const text = getBestTextColor(baseColor);
  const bgColor = parseColor(baseColor);
  const txtColor = parseColor(text);
  
  let contrast = 1;
  if (bgColor && txtColor) {
    const bgLuminance = getLuminance(bgColor.r, bgColor.g, bgColor.b);
    const txtLuminance = getLuminance(txtColor.r, txtColor.g, txtColor.b);
    contrast = getContrast(bgLuminance, txtLuminance);
  }
  
  return {
    background: baseColor,
    text,
    contrast
  };
}