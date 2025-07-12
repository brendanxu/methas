/**
 * South Pole Color System
 * 科学的色彩生成和管理系统
 */

import { colorCache } from './performance';

// 色彩工具函数 - 缓存优化
export function hexToHsl(hex: string): [number, number, number] {
  const cacheKey = `hexToHsl:${hex}`;
  const cached = colorCache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const result: [number, number, number] = (() => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  })();
  
  colorCache.set(cacheKey, JSON.stringify(result));
  return result;
}

export function hslToHex(h: number, s: number, l: number): string {
  const cacheKey = `hslToHex:${h}:${s}:${l}`;
  const cached = colorCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const result = (() => {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  })();
  
  colorCache.set(cacheKey, result);
  return result;
}

// 生成色彩渐变 - 缓存优化
export function generateColorScale(baseColor: string) {
  const cacheKey = `colorScale:${baseColor}`;
  const cached = colorCache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const result = (() => {
  const [h, s, l] = hexToHsl(baseColor);
  
  // 针对深色（如 South Pole 深蓝）的特殊处理
  const isDark = l < 30;
  
  const scale: Record<number, string> = {};
  
  if (isDark) {
    // 对于深色，生成更亮的渐变
    scale[50] = hslToHex(h, Math.max(20, s * 0.3), 97);
    scale[100] = hslToHex(h, Math.max(30, s * 0.4), 94);
    scale[200] = hslToHex(h, Math.max(40, s * 0.5), 87);
    scale[300] = hslToHex(h, Math.max(50, s * 0.6), 77);
    scale[400] = hslToHex(h, Math.max(60, s * 0.7), 65);
    scale[500] = baseColor; // 基准色
    scale[600] = hslToHex(h, s, Math.max(5, l * 0.85));
    scale[700] = hslToHex(h, s, Math.max(4, l * 0.75));
    scale[800] = hslToHex(h, s, Math.max(3, l * 0.65));
    scale[900] = hslToHex(h, s, Math.max(2, l * 0.55));
    scale[950] = hslToHex(h, s, Math.max(1, l * 0.45));
  } else {
    // 对于亮色的标准处理
    scale[50] = hslToHex(h, s * 0.3, 97);
    scale[100] = hslToHex(h, s * 0.4, 93);
    scale[200] = hslToHex(h, s * 0.5, 83);
    scale[300] = hslToHex(h, s * 0.6, 70);
    scale[400] = hslToHex(h, s * 0.7, 55);
    scale[500] = baseColor;
    scale[600] = hslToHex(h, s, l * 0.85);
    scale[700] = hslToHex(h, s, l * 0.75);
    scale[800] = hslToHex(h, s, l * 0.65);
    scale[900] = hslToHex(h, s, l * 0.55);
    scale[950] = hslToHex(h, s, l * 0.45);
  }
  
    return scale;
  })();
  
  colorCache.set(cacheKey, JSON.stringify(result));
  return result;
}

// South Pole 品牌色定义
export const SOUTH_POLE_BRAND_COLORS = {
  primary: '#002145',    // South Pole Deep Blue
  secondary: '#00875A',  // Environment Green  
  warning: '#FF8B00',    // Antarctic Orange
  success: '#00875A',    // Same as secondary for consistency
  error: '#DC2626',      // Standard error red
  info: '#0EA5E9',       // Ice blue for information
} as const;

// 生成完整的色彩系统
export const southPoleColorSystem = {
  primary: generateColorScale(SOUTH_POLE_BRAND_COLORS.primary),
  secondary: generateColorScale(SOUTH_POLE_BRAND_COLORS.secondary),
  warning: generateColorScale(SOUTH_POLE_BRAND_COLORS.warning),
  success: generateColorScale(SOUTH_POLE_BRAND_COLORS.success),
  error: generateColorScale(SOUTH_POLE_BRAND_COLORS.error),
  info: generateColorScale(SOUTH_POLE_BRAND_COLORS.info),
  
  // 主题特定颜色
  ice: generateColorScale('#0EA5E9'),
  arctic: generateColorScale('#64748B'),
  
  // 中性色
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
    950: '#030712',
  },
};

// 深色主题适配色彩 - 缓存优化
export function adaptColorForDarkMode(color: string, adjustment: number = 0.2): string {
  const cacheKey = `darkMode:${color}:${adjustment}`;
  const cached = colorCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const result = (() => {
  const [h, s, l] = hexToHsl(color);
  // 在深色模式下，提高亮度和降低饱和度
  const newL = Math.min(95, l + (adjustment * 100));
  const newS = Math.max(10, s * 0.8);
    return hslToHex(h, newS, newL);
  })();
  
  colorCache.set(cacheKey, result);
  return result;
}

// 深色主题色彩系统
export const southPoleDarkColorSystem = {
  primary: {
    ...southPoleColorSystem.primary,
    // 深色模式下的主色调整
    400: adaptColorForDarkMode(southPoleColorSystem.primary[500], 0.4),
    500: adaptColorForDarkMode(southPoleColorSystem.primary[500], 0.3),
    600: adaptColorForDarkMode(southPoleColorSystem.primary[500], 0.2),
  },
  secondary: {
    ...southPoleColorSystem.secondary,
    400: adaptColorForDarkMode(southPoleColorSystem.secondary[500], 0.4),
    500: adaptColorForDarkMode(southPoleColorSystem.secondary[500], 0.3),
    600: adaptColorForDarkMode(southPoleColorSystem.secondary[500], 0.2),
  },
  warning: {
    ...southPoleColorSystem.warning,
    400: adaptColorForDarkMode(southPoleColorSystem.warning[500], 0.4),
    500: adaptColorForDarkMode(southPoleColorSystem.warning[500], 0.3),
    600: adaptColorForDarkMode(southPoleColorSystem.warning[500], 0.2),
  },
  success: southPoleColorSystem.success,
  error: southPoleColorSystem.error,
  info: southPoleColorSystem.info,
  ice: southPoleColorSystem.ice,
  arctic: southPoleColorSystem.arctic,
  gray: southPoleColorSystem.gray,
};

// 可访问性检查 (WCAG 2.1) - 缓存优化
export function getContrastRatio(color1: string, color2: string): number {
  const cacheKey = `contrast:${color1}:${color2}`;
  const cached = colorCache.get(cacheKey);
  if (cached) {
    return parseFloat(cached);
  }
  
  const result = (() => {
  const getLuminance = (hex: string): number => {
    const rgb = [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16), 
      parseInt(hex.slice(5, 7), 16)
    ].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
    return (brightest + 0.05) / (darkest + 0.05);
  })();
  
  colorCache.set(cacheKey, result.toString());
  return result;
}

// 检查颜色组合是否符合 WCAG AA 标准
export function isAccessible(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

// 为文本选择合适的颜色
export function getAccessibleTextColor(backgroundColor: string): string {
  const whiteRatio = getContrastRatio('#FFFFFF', backgroundColor);
  const blackRatio = getContrastRatio('#000000', backgroundColor);
  const primaryRatio = getContrastRatio(SOUTH_POLE_BRAND_COLORS.primary, backgroundColor);
  
  // 优先使用品牌色，如果对比度足够
  if (primaryRatio >= 4.5) {
    return SOUTH_POLE_BRAND_COLORS.primary;
  }
  
  return whiteRatio > blackRatio ? '#FFFFFF' : '#000000';
}

// 高对比度模式色彩
export const HIGH_CONTRAST_COLORS = {
  light: {
    background: '#FFFFFF',
    foreground: '#000000',
    primary: '#0000FF',
    secondary: '#008000',
    warning: '#FF8C00',
    error: '#FF0000',
    success: '#008000',
    border: '#000000',
    muted: '#F5F5F5',
  },
  dark: {
    background: '#000000',
    foreground: '#FFFFFF',
    primary: '#00FFFF',
    secondary: '#00FF00',
    warning: '#FFFF00',
    error: '#FF0000',
    success: '#00FF00',
    border: '#FFFFFF',
    muted: '#1A1A1A',
  },
} as const;

// 色盲友好色彩检查
export function isColorBlindFriendly(color1: string, color2: string): boolean {
  const [h1] = hexToHsl(color1);
  const [h2] = hexToHsl(color2);
  
  // 确保色相差异大于30度，避免红绿色盲混淆
  const hueDiff = Math.abs(h1 - h2);
  return hueDiff > 30 && hueDiff < 330;
}

// 生成色盲友好的替代色彩
export function getColorBlindAlternatives(baseColor: string) {
  const [h, s, l] = hexToHsl(baseColor);
  
  return {
    deuteranopia: hslToHex((h + 60) % 360, s, l), // 绿色盲
    protanopia: hslToHex((h + 45) % 360, s, l),   // 红色盲
    tritanopia: hslToHex((h + 90) % 360, s, l),   // 蓝色盲
  };
}

// 动态生成可访问的色彩组合
export function generateAccessibleColorPair(baseColor: string, level: 'AA' | 'AAA' = 'AA'): {
  foreground: string;
  background: string;
  ratio: number;
} {
  const targetRatio = level === 'AA' ? 4.5 : 7;
  const [h, s] = hexToHsl(baseColor);
  
  // 尝试不同的亮度值直到找到合适的对比度
  for (let lightness = 5; lightness <= 95; lightness += 5) {
    const testColor = hslToHex(h, s, lightness);
    const ratio = getContrastRatio(baseColor, testColor);
    
    if (ratio >= targetRatio) {
      return {
        foreground: baseColor,
        background: testColor,
        ratio,
      };
    }
  }
  
  // 如果找不到合适的组合，返回默认的黑白组合
  return {
    foreground: '#000000',
    background: '#FFFFFF',
    ratio: 21,
  };
}

// 验证完整色彩系统的可访问性
export function validateColorSystemAccessibility() {
  const issues: Array<{ color: string; issue: string; suggestion: string }> = [];
  
  // 检查主要品牌色的对比度
  Object.entries(SOUTH_POLE_BRAND_COLORS).forEach(([name, color]) => {
    const whiteContrast = getContrastRatio(color, '#FFFFFF');
    const blackContrast = getContrastRatio(color, '#000000');
    
    if (whiteContrast < 4.5 && blackContrast < 4.5) {
      issues.push({
        color: name,
        issue: 'Insufficient contrast with both white and black text',
        suggestion: 'Consider adjusting brightness or saturation'
      });
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations: [
      'Use high contrast mode for users with visual impairments',
      'Provide alternative color indicators for color-blind users',
      'Ensure all interactive elements meet WCAG 2.1 AA standards'
    ]
  };
}

export default southPoleColorSystem;