# South Pole Theme System Documentation

## 🎨 Overview

The South Pole Theme System is a comprehensive, scientifically-designed color and theming solution that provides:

- **Brand Consistency**: Unified South Pole brand colors across all components
- **Dark Mode Support**: Intelligent dark theme adaptation with proper contrast
- **Accessibility**: WCAG 2.1 AA compliant color combinations
- **Performance**: Cached color calculations and optimized CSS variables
- **Developer Experience**: Type-safe, easy-to-use APIs

## 🚀 Quick Start

### 1. Basic Setup

```tsx
import { Providers } from '@/app/providers';

function App() {
  return (
    <Providers defaultTheme="light">
      {/* Your app content */}
    </Providers>
  );
}
```

### 2. Using Theme Hooks

```tsx
import { useTheme, useThemeColors } from '@/app/providers';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <div style={{ 
      backgroundColor: colors.background,
      color: colors.foreground 
    }}>
      <h1>Current theme: {isDark ? 'Dark' : 'Light'}</h1>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

### 3. Using CSS Variables

```css
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}

.primary-button {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

## 📚 API Reference

### Hooks

#### `useTheme()`

Returns the current theme state and controls.

```tsx
const { isDark, toggleTheme, colors } = useTheme();
```

**Returns:**
- `isDark: boolean` - Current theme state
- `toggleTheme: () => void` - Function to toggle theme
- `colors: ThemeColors` - South Pole brand colors

#### `useThemeColors()`

Returns all available theme colors for the current theme.

```tsx
const colors = useThemeColors();
```

**Returns:**
```tsx
{
  // Brand colors (consistent across themes)
  primary: string;
  secondary: string;
  warning: string;
  success: string;
  error: string;
  info: string;
  
  // Theme-specific colors
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}
```

#### `useThemeReady()`

Returns whether the theme system is ready (prevents hydration mismatches).

```tsx
const isReady = useThemeReady();

if (!isReady) {
  return <div>Loading...</div>;
}
```

#### `useAccessibility()`

Controls accessibility settings.

```tsx
const {
  settings,
  toggleHighContrast,
  toggleColorBlindMode,
  toggleReducedMotion,
  setFontSize,
} = useAccessibility();
```

**Settings:**
```tsx
{
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'x-large';
}
```

### Color System Functions

#### `generateColorScale(baseColor: string)`

Generates a complete color scale from a base color.

```tsx
import { generateColorScale } from '@/lib/colors';

const blueScale = generateColorScale('#002145');
// Returns: { 50: '#f0f9ff', 100: '#e0f2fe', ..., 950: '#0c1220' }
```

#### `getContrastRatio(color1: string, color2: string)`

Calculates WCAG contrast ratio between two colors.

```tsx
import { getContrastRatio } from '@/lib/colors';

const ratio = getContrastRatio('#002145', '#FFFFFF');
// Returns: 15.27
```

#### `isAccessible(foreground: string, background: string, level?: 'AA' | 'AAA')`

Checks if color combination meets WCAG standards.

```tsx
import { isAccessible } from '@/lib/colors';

const isValid = isAccessible('#002145', '#FFFFFF', 'AA');
// Returns: true
```

#### `getAccessibleTextColor(backgroundColor: string)`

Returns the best text color for a background.

```tsx
import { getAccessibleTextColor } from '@/lib/colors';

const textColor = getAccessibleTextColor('#002145');
// Returns: '#FFFFFF'
```

### Performance Utilities

#### Color Caching

```tsx
import { colorCache } from '@/lib/performance';

// Cache operations are automatic, but you can control them
colorCache.clear(); // Clear cache
const size = colorCache.size(); // Get cache size
```

#### CSS Optimization

```tsx
import { cssOptimizer } from '@/lib/performance';

// Batch CSS variable updates
cssOptimizer.setBatchVariables({
  '--primary': '#002145',
  '--secondary': '#00875A',
});

// Cleanup unused variables
cssOptimizer.cleanupUnusedVariables(['--primary', '--secondary']);
```

## 🎨 South Pole Brand Colors

### Primary Colors

```tsx
// Available in SOUTH_POLE_BRAND_COLORS
{
  primary: '#002145',    // South Pole Deep Blue
  secondary: '#00875A',  // Environment Green
  warning: '#FF8B00',    // Antarctic Orange
  success: '#00875A',    // Same as secondary
  error: '#DC2626',      // Standard error red
  info: '#0EA5E9',       // Ice blue
}
```

### Color Scales

Each brand color has a full scale (50-950):

```tsx
import { southPoleColorSystem } from '@/lib/colors';

// Available scales
southPoleColorSystem.primary[500]  // Base color
southPoleColorSystem.primary[100]  // Very light
southPoleColorSystem.primary[900]  // Very dark

// Theme-specific colors
southPoleColorSystem.ice[500]      // Ice blue
southPoleColorSystem.arctic[500]   // Arctic gray
```

### CSS Variables

All colors are available as CSS variables:

```css
/* Brand colors */
--sp-primary: #002145;
--sp-secondary: #00875A;
--sp-warning: #FF8B00;

/* Semantic colors */
--primary: var(--sp-primary);
--background: #ffffff; /* Light theme */
--foreground: #374151;
--muted: #f9fafb;
--border: #e5e7eb;

/* Dark theme overrides */
.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --muted: #1e293b;
  --border: #334155;
}
```

## 🔧 Customization

### Custom Theme Colors

```tsx
// Extend the color system
const customColors = {
  ...southPoleColorSystem,
  brand: generateColorScale('#YOUR_COLOR'),
};
```

### Custom CSS Variables

```css
:root {
  /* Add your custom variables */
  --custom-accent: #your-color;
  --custom-radius: 8px;
}

.dark {
  --custom-accent: #dark-mode-color;
}
```

### Ant Design Theme Customization

```tsx
import { antThemeConfig } from '@/styles/ant-theme';

const customAntTheme = {
  ...antThemeConfig,
  token: {
    ...antThemeConfig.token,
    borderRadius: 12,
    colorPrimary: '#YOUR_BRAND_COLOR',
  },
};
```

## ♿ Accessibility Features

### High Contrast Mode

```tsx
import { useAccessibility } from '@/hooks/useAccessibility';

function AccessibilityControls() {
  const { settings, toggleHighContrast } = useAccessibility();
  
  return (
    <button onClick={toggleHighContrast}>
      {settings.highContrast ? 'Disable' : 'Enable'} High Contrast
    </button>
  );
}
```

### Color Blind Support

```tsx
const { toggleColorBlindMode } = useAccessibility();

// Enables color-blind friendly palette
toggleColorBlindMode();
```

### Reduced Motion

```tsx
const { toggleReducedMotion } = useAccessibility();

// Disables animations and transitions
toggleReducedMotion();
```

### Font Size Control

```tsx
const { setFontSize } = useAccessibility();

// Options: 'small', 'normal', 'large', 'x-large'
setFontSize('large');
```

## 🎯 Best Practices

### 1. Color Usage

```tsx
// ✅ Good: Use semantic color names
<div className="bg-background text-foreground">

// ✅ Good: Use brand colors for emphasis
<button className="bg-primary text-primary-foreground">

// ❌ Avoid: Hard-coded colors
<div style={{ backgroundColor: '#002145' }}>
```

### 2. Accessibility

```tsx
// ✅ Good: Check contrast ratios
const isValid = isAccessible(textColor, backgroundColor, 'AA');

// ✅ Good: Use accessible text colors
const textColor = getAccessibleTextColor(backgroundColor);

// ✅ Good: Provide alternative indicators
<div className="bg-success" aria-label="Success">
```

### 3. Performance

```tsx
// ✅ Good: Use cached color functions
const colors = useMemo(() => 
  generateColorScale('#002145'), []
);

// ✅ Good: Batch CSS updates
cssOptimizer.setBatchVariables(colorUpdates);

// ❌ Avoid: Inline color calculations
style={{ color: hslToHex(h, s, l) }}
```

### 4. Theme Switching

```tsx
// ✅ Good: Use debounced theme switching
const { toggleTheme } = useTheme();

// ✅ Good: Check theme readiness
const isReady = useThemeReady();
if (!isReady) return <Skeleton />;

// ✅ Good: Persist user preference
// (Automatically handled by theme provider)
```

## 🧪 Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { Providers } from '@/app/providers';

test('should apply correct theme', () => {
  render(
    <Providers defaultTheme="dark">
      <MyComponent />
    </Providers>
  );
  
  expect(document.documentElement).toHaveClass('dark');
});
```

### Accessibility Tests

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Color Tests

```tsx
import { getContrastRatio, isAccessible } from '@/lib/colors';

test('brand colors should be accessible', () => {
  const ratio = getContrastRatio('#002145', '#FFFFFF');
  expect(ratio).toBeGreaterThan(4.5);
  expect(isAccessible('#002145', '#FFFFFF', 'AA')).toBe(true);
});
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Hydration Mismatch

```tsx
// Use useThemeReady to prevent hydration issues
const isReady = useThemeReady();
if (!isReady) return null;
```

#### 2. Colors Not Updating

```tsx
// Ensure you're using the theme provider
<Providers>
  <App />
</Providers>

// Check CSS variable declarations
console.log(getComputedStyle(document.documentElement)
  .getPropertyValue('--primary'));
```

#### 3. Performance Issues

```tsx
// Clear cache if memory usage is high
import { colorCache, memoryMonitor } from '@/lib/performance';

memoryMonitor.start(); // Monitor memory
colorCache.clear();    // Clear cache
```

#### 4. Accessibility Warnings

```tsx
// Validate your color system
import { validateColorSystemAccessibility } from '@/lib/colors';

const validation = validateColorSystemAccessibility();
console.log(validation.issues);
```

## 📈 Performance Tips

1. **Use CSS Variables**: Prefer CSS variables over inline styles
2. **Cache Color Calculations**: Color functions are automatically cached
3. **Batch Updates**: Use `cssOptimizer.setBatchVariables()` for multiple changes
4. **Monitor Memory**: Enable memory monitoring in development
5. **Debounce Theme Changes**: Theme switching is automatically debounced

## 🤝 Contributing

When extending the theme system:

1. **Maintain Brand Consistency**: Use South Pole brand colors as base
2. **Ensure Accessibility**: All color combinations must meet WCAG AA
3. **Add Tests**: Include unit tests for new functions
4. **Update Documentation**: Keep this guide current
5. **Performance**: Consider caching for expensive operations

## 📄 License

This theme system is part of the South Pole project and follows the project's licensing terms.