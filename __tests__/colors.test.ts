/**
 * South Pole Color System Unit Tests
 * 南极色彩系统单元测试
 */

import {
  hexToHsl,
  hslToHex,
  generateColorScale,
  adaptColorForDarkMode,
  getContrastRatio,
  isAccessible,
  getAccessibleTextColor,
  isColorBlindFriendly,
  getColorBlindAlternatives,
  generateAccessibleColorPair,
  validateColorSystemAccessibility,
  SOUTH_POLE_BRAND_COLORS,
  southPoleColorSystem,
} from '../src/lib/colors';

describe('Color Conversion Functions', () => {
  describe('hexToHsl', () => {
    test('should convert white correctly', () => {
      const [h, s, l] = hexToHsl('#FFFFFF');
      expect(h).toBe(0);
      expect(s).toBe(0);
      expect(l).toBe(100);
    });

    test('should convert black correctly', () => {
      const [h, s, l] = hexToHsl('#000000');
      expect(h).toBe(0);
      expect(s).toBe(0);
      expect(l).toBe(0);
    });

    test('should convert South Pole primary color correctly', () => {
      const [h, s, l] = hexToHsl('#002145');
      expect(h).toBeCloseTo(220, 0);
      expect(s).toBeCloseTo(100, 0);
      expect(l).toBeCloseTo(13, 0);
    });

    test('should handle red color correctly', () => {
      const [h, s, l] = hexToHsl('#FF0000');
      expect(h).toBe(0);
      expect(s).toBe(100);
      expect(l).toBe(50);
    });
  });

  describe('hslToHex', () => {
    test('should convert HSL to hex correctly', () => {
      expect(hslToHex(0, 0, 100)).toBe('#ffffff');
      expect(hslToHex(0, 0, 0)).toBe('#000000');
      expect(hslToHex(0, 100, 50)).toBe('#ff0000');
    });

    test('should be reversible with hexToHsl', () => {
      const originalHex = '#002145';
      const [h, s, l] = hexToHsl(originalHex);
      const convertedHex = hslToHex(h, s, l);
      expect(convertedHex.toLowerCase()).toBe(originalHex.toLowerCase());
    });
  });
});

describe('Color Scale Generation', () => {
  describe('generateColorScale', () => {
    test('should generate correct number of scale steps', () => {
      const scale = generateColorScale('#002145');
      const expectedSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      expectedSteps.forEach(step => {
        expect(scale).toHaveProperty(step);
        expect(typeof scale[step]).toBe('string');
        expect(scale[step]).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    test('should maintain base color at 500 level', () => {
      const baseColor = '#002145';
      const scale = generateColorScale(baseColor);
      expect(scale[500]).toBe(baseColor);
    });

    test('should generate lighter colors for lower numbers', () => {
      const scale = generateColorScale('#002145');
      const [, , l50] = hexToHsl(scale[50]);
      const [, , l500] = hexToHsl(scale[500]);
      expect(l50).toBeGreaterThan(l500);
    });

    test('should generate darker colors for higher numbers', () => {
      const scale = generateColorScale('#002145');
      const [, , l500] = hexToHsl(scale[500]);
      const [, , l900] = hexToHsl(scale[900]);
      expect(l900).toBeLessThanOrEqual(l500);
    });
  });
});

describe('Dark Mode Adaptation', () => {
  describe('adaptColorForDarkMode', () => {
    test('should increase lightness for dark mode', () => {
      const originalColor = '#002145';
      const darkModeColor = adaptColorForDarkMode(originalColor);
      
      const [, , originalL] = hexToHsl(originalColor);
      const [, , darkL] = hexToHsl(darkModeColor);
      
      expect(darkL).toBeGreaterThan(originalL);
    });

    test('should maintain hue', () => {
      const originalColor = '#002145';
      const darkModeColor = adaptColorForDarkMode(originalColor);
      
      const [originalH] = hexToHsl(originalColor);
      const [darkH] = hexToHsl(darkModeColor);
      
      expect(Math.abs(originalH - darkH)).toBeLessThan(5); // Allow small variation
    });

    test('should respect adjustment parameter', () => {
      const originalColor = '#002145';
      const lightAdjustment = adaptColorForDarkMode(originalColor, 0.1);
      const heavyAdjustment = adaptColorForDarkMode(originalColor, 0.5);
      
      const [, , lightL] = hexToHsl(lightAdjustment);
      const [, , heavyL] = hexToHsl(heavyAdjustment);
      
      expect(heavyL).toBeGreaterThan(lightL);
    });
  });
});

describe('Accessibility Functions', () => {
  describe('getContrastRatio', () => {
    test('should return 21 for black on white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 1);
    });

    test('should return 1 for identical colors', () => {
      const ratio = getContrastRatio('#002145', '#002145');
      expect(ratio).toBeCloseTo(1, 1);
    });

    test('should be symmetric', () => {
      const ratio1 = getContrastRatio('#002145', '#FFFFFF');
      const ratio2 = getContrastRatio('#FFFFFF', '#002145');
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });

    test('should calculate South Pole primary contrast correctly', () => {
      const ratio = getContrastRatio('#002145', '#FFFFFF');
      expect(ratio).toBeGreaterThan(4.5); // Should meet WCAG AA standard
    });
  });

  describe('isAccessible', () => {
    test('should pass for high contrast combinations', () => {
      expect(isAccessible('#000000', '#FFFFFF')).toBe(true);
      expect(isAccessible('#FFFFFF', '#000000')).toBe(true);
    });

    test('should fail for low contrast combinations', () => {
      expect(isAccessible('#CCCCCC', '#FFFFFF')).toBe(false);
      expect(isAccessible('#777777', '#888888')).toBe(false);
    });

    test('should respect AA vs AAA standards', () => {
      const color1 = '#767676';
      const color2 = '#FFFFFF';
      
      // This combination should pass AA but fail AAA
      expect(isAccessible(color1, color2, 'AA')).toBe(true);
      expect(isAccessible(color1, color2, 'AAA')).toBe(false);
    });
  });

  describe('getAccessibleTextColor', () => {
    test('should return white for dark backgrounds', () => {
      const textColor = getAccessibleTextColor('#000000');
      expect(textColor).toBe('#FFFFFF');
    });

    test('should return black for light backgrounds', () => {
      const textColor = getAccessibleTextColor('#FFFFFF');
      expect(textColor).toBe('#000000');
    });

    test('should prefer brand color when accessible', () => {
      const textColor = getAccessibleTextColor('#F0F9FF'); // Very light blue
      expect(textColor).toBe(SOUTH_POLE_BRAND_COLORS.primary);
    });
  });
});

describe('Color Blind Accessibility', () => {
  describe('isColorBlindFriendly', () => {
    test('should return true for colors with sufficient hue difference', () => {
      expect(isColorBlindFriendly('#FF0000', '#0000FF')).toBe(true); // Red vs Blue
      expect(isColorBlindFriendly('#002145', '#FF8B00')).toBe(true); // South Pole primary vs warning
    });

    test('should return false for colors with similar hues', () => {
      expect(isColorBlindFriendly('#FF0000', '#FF4444')).toBe(false); // Similar reds
    });
  });

  describe('getColorBlindAlternatives', () => {
    test('should generate three alternative colors', () => {
      const alternatives = getColorBlindAlternatives('#002145');
      
      expect(alternatives).toHaveProperty('deuteranopia');
      expect(alternatives).toHaveProperty('protanopia');
      expect(alternatives).toHaveProperty('tritanopia');
      
      expect(alternatives.deuteranopia).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(alternatives.protanopia).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(alternatives.tritanopia).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test('should generate different colors for each type', () => {
      const alternatives = getColorBlindAlternatives('#002145');
      
      expect(alternatives.deuteranopia).not.toBe(alternatives.protanopia);
      expect(alternatives.protanopia).not.toBe(alternatives.tritanopia);
      expect(alternatives.tritanopia).not.toBe(alternatives.deuteranopia);
    });
  });
});

describe('Accessible Color Pair Generation', () => {
  describe('generateAccessibleColorPair', () => {
    test('should generate pair meeting AA standard', () => {
      const pair = generateAccessibleColorPair('#002145', 'AA');
      
      expect(pair.ratio).toBeGreaterThanOrEqual(4.5);
      expect(pair.foreground).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(pair.background).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test('should generate pair meeting AAA standard when requested', () => {
      const pair = generateAccessibleColorPair('#002145', 'AAA');
      
      expect(pair.ratio).toBeGreaterThanOrEqual(7);
    });

    test('should maintain base color as foreground', () => {
      const baseColor = '#002145';
      const pair = generateAccessibleColorPair(baseColor);
      
      expect(pair.foreground).toBe(baseColor);
    });
  });
});

describe('South Pole Brand Colors', () => {
  test('should have all required brand colors', () => {
    expect(SOUTH_POLE_BRAND_COLORS).toHaveProperty('primary');
    expect(SOUTH_POLE_BRAND_COLORS).toHaveProperty('secondary');
    expect(SOUTH_POLE_BRAND_COLORS).toHaveProperty('warning');
    expect(SOUTH_POLE_BRAND_COLORS).toHaveProperty('success');
    expect(SOUTH_POLE_BRAND_COLORS).toHaveProperty('error');
    expect(SOUTH_POLE_BRAND_COLORS).toHaveProperty('info');
  });

  test('should have correct brand color values', () => {
    expect(SOUTH_POLE_BRAND_COLORS.primary).toBe('#002145');
    expect(SOUTH_POLE_BRAND_COLORS.secondary).toBe('#00875A');
    expect(SOUTH_POLE_BRAND_COLORS.warning).toBe('#FF8B00');
  });

  test('all brand colors should be valid hex colors', () => {
    Object.values(SOUTH_POLE_BRAND_COLORS).forEach(color => {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

describe('Color System Validation', () => {
  describe('validateColorSystemAccessibility', () => {
    test('should return validation object with correct structure', () => {
      const validation = validateColorSystemAccessibility();
      
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('issues');
      expect(validation).toHaveProperty('recommendations');
      
      expect(typeof validation.isValid).toBe('boolean');
      expect(Array.isArray(validation.issues)).toBe(true);
      expect(Array.isArray(validation.recommendations)).toBe(true);
    });

    test('should identify accessibility issues correctly', () => {
      const validation = validateColorSystemAccessibility();
      
      if (!validation.isValid) {
        expect(validation.issues.length).toBeGreaterThan(0);
        validation.issues.forEach(issue => {
          expect(issue).toHaveProperty('color');
          expect(issue).toHaveProperty('issue');
          expect(issue).toHaveProperty('suggestion');
        });
      }
    });

    test('should provide recommendations', () => {
      const validation = validateColorSystemAccessibility();
      
      expect(validation.recommendations.length).toBeGreaterThan(0);
      validation.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('South Pole Color System', () => {
  test('should generate complete color system', () => {
    expect(southPoleColorSystem).toHaveProperty('primary');
    expect(southPoleColorSystem).toHaveProperty('secondary');
    expect(southPoleColorSystem).toHaveProperty('warning');
    expect(southPoleColorSystem).toHaveProperty('success');
    expect(southPoleColorSystem).toHaveProperty('error');
    expect(southPoleColorSystem).toHaveProperty('info');
    expect(southPoleColorSystem).toHaveProperty('ice');
    expect(southPoleColorSystem).toHaveProperty('arctic');
    expect(southPoleColorSystem).toHaveProperty('gray');
  });

  test('each color should have complete scale', () => {
    const colorKeys = ['primary', 'secondary', 'warning', 'success', 'error', 'info', 'ice', 'arctic'];
    const expectedSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    
    colorKeys.forEach(colorKey => {
      const colorScale = southPoleColorSystem[colorKey as keyof typeof southPoleColorSystem];
      expectedSteps.forEach(step => {
        expect(colorScale).toHaveProperty(step);
        expect(typeof colorScale[step]).toBe('string');
        expect(colorScale[step]).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  test('gray scale should have all standard steps', () => {
    const expectedSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    
    expectedSteps.forEach(step => {
      expect(southPoleColorSystem.gray).toHaveProperty(step);
      expect(typeof southPoleColorSystem.gray[step]).toBe('string');
      expect(southPoleColorSystem.gray[step]).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

describe('Performance and Caching', () => {
  test('should cache color conversions', () => {
    // Clear any existing cache
    const { colorCache } = require('../src/lib/performance');
    colorCache.clear();
    
    const initialCacheSize = colorCache.size();
    
    // Perform operations that should be cached
    hexToHsl('#002145');
    hslToHex(220, 100, 13);
    generateColorScale('#002145');
    
    const finalCacheSize = colorCache.size();
    expect(finalCacheSize).toBeGreaterThan(initialCacheSize);
  });

  test('should return cached results', () => {
    const color = '#002145';
    
    // First call
    const start1 = performance.now();
    const result1 = hexToHsl(color);
    const end1 = performance.now();
    
    // Second call (should be cached)
    const start2 = performance.now();
    const result2 = hexToHsl(color);
    const end2 = performance.now();
    
    expect(result1).toEqual(result2);
    expect(end2 - start2).toBeLessThan(end1 - start1); // Cached call should be faster
  });
});