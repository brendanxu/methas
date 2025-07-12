# South Pole Theme System API Reference

## 📋 Table of Contents

- [Core Hooks](#core-hooks)
- [Color Functions](#color-functions)
- [Performance Utilities](#performance-utilities)
- [Accessibility Functions](#accessibility-functions)
- [Constants](#constants)
- [Type Definitions](#type-definitions)

## 🎣 Core Hooks

### `useTheme()`

**Description**: Main hook for theme state management and control.

**Import**: `import { useTheme } from '@/app/providers'`

**Returns**: `ThemeContextType`

```tsx
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof southPoleColors;
}
```

**Example**:
```tsx
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

**Throws**: Error if used outside of `ThemeProvider`

---

### `useThemeColors()`

**Description**: Returns all available theme colors for the current theme.

**Import**: `import { useThemeColors } from '@/app/providers'`

**Returns**: `ThemeColors`

```tsx
interface ThemeColors {
  // Brand colors
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

**Example**:
```tsx
function StyledCard() {
  const colors = useThemeColors();
  
  return (
    <div style={{
      backgroundColor: colors.card,
      color: colors.cardForeground,
      border: `1px solid ${colors.border}`
    }}>
      Card content
    </div>
  );
}
```

---

### `useThemeReady()`

**Description**: Returns whether the theme system is ready. Prevents hydration mismatches.

**Import**: `import { useThemeReady } from '@/app/providers'`

**Returns**: `boolean`

**Example**:
```tsx
function App() {
  const isReady = useThemeReady();
  
  if (!isReady) {
    return <div>Loading theme...</div>;
  }
  
  return <MainContent />;
}
```

---

### `useAccessibility()`

**Description**: Controls accessibility settings and preferences.

**Import**: `import { useAccessibility } from '@/hooks/useAccessibility'`

**Returns**: `AccessibilityHook`

```tsx
interface AccessibilityHook {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleColorBlindMode: () => void;
  setFontSize: (size: AccessibilitySettings['fontSize']) => void;
}

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'x-large';
}
```

**Example**:
```tsx
function AccessibilityPanel() {
  const { settings, toggleHighContrast, setFontSize } = useAccessibility();
  
  return (
    <div>
      <button onClick={toggleHighContrast}>
        {settings.highContrast ? 'Disable' : 'Enable'} High Contrast
      </button>
      <select 
        value={settings.fontSize} 
        onChange={(e) => setFontSize(e.target.value as any)}
      >
        <option value="small">Small</option>
        <option value="normal">Normal</option>
        <option value="large">Large</option>
        <option value="x-large">X-Large</option>
      </select>
    </div>
  );
}
```

## 🎨 Color Functions

### `hexToHsl(hex: string)`

**Description**: Converts hex color to HSL values. Results are cached for performance.

**Import**: `import { hexToHsl } from '@/lib/colors'`

**Parameters**:
- `hex: string` - Hex color code (e.g., '#002145')

**Returns**: `[number, number, number]` - [hue, saturation, lightness]

**Example**:
```tsx
const [h, s, l] = hexToHsl('#002145');
// Returns: [220, 100, 13]
```

---

### `hslToHex(h: number, s: number, l: number)`

**Description**: Converts HSL values to hex color. Results are cached for performance.

**Import**: `import { hslToHex } from '@/lib/colors'`

**Parameters**:
- `h: number` - Hue (0-360)
- `s: number` - Saturation (0-100)
- `l: number` - Lightness (0-100)

**Returns**: `string` - Hex color code

**Example**:
```tsx
const hex = hslToHex(220, 100, 13);
// Returns: '#002145'
```

---

### `generateColorScale(baseColor: string)`

**Description**: Generates a complete color scale (50-950) from a base color. Optimized for dark colors like South Pole brand colors.

**Import**: `import { generateColorScale } from '@/lib/colors'`

**Parameters**:
- `baseColor: string` - Base hex color

**Returns**: `Record<number, string>` - Color scale object

**Example**:
```tsx
const scale = generateColorScale('#002145');
// Returns: {
//   50: '#f0f9ff',
//   100: '#e0f2fe',
//   200: '#bae6fd',
//   // ... more steps
//   500: '#002145', // base color
//   // ... darker steps
//   950: '#0c1220'
// }
```

---

### `adaptColorForDarkMode(color: string, adjustment?: number)`

**Description**: Adapts a color for dark mode by increasing lightness and adjusting saturation.

**Import**: `import { adaptColorForDarkMode } from '@/lib/colors'`

**Parameters**:
- `color: string` - Source hex color
- `adjustment?: number` - Adjustment factor (0-1, default: 0.2)

**Returns**: `string` - Adapted hex color

**Example**:
```tsx
const darkModeColor = adaptColorForDarkMode('#002145', 0.3);
// Returns: '#4a9eff' (brighter blue for dark mode)
```

---

### `getContrastRatio(color1: string, color2: string)`

**Description**: Calculates the WCAG contrast ratio between two colors. Results are cached.

**Import**: `import { getContrastRatio } from '@/lib/colors'`

**Parameters**:
- `color1: string` - First hex color
- `color2: string` - Second hex color

**Returns**: `number` - Contrast ratio (1-21)

**Example**:
```tsx
const ratio = getContrastRatio('#002145', '#FFFFFF');
// Returns: 15.27
```

---

### `isAccessible(foreground: string, background: string, level?: 'AA' | 'AAA')`

**Description**: Checks if a color combination meets WCAG accessibility standards.

**Import**: `import { isAccessible } from '@/lib/colors'`

**Parameters**:
- `foreground: string` - Foreground hex color
- `background: string` - Background hex color  
- `level?: 'AA' | 'AAA'` - WCAG level (default: 'AA')

**Returns**: `boolean` - Whether combination is accessible

**Example**:
```tsx
const isValid = isAccessible('#002145', '#FFFFFF', 'AA');
// Returns: true (ratio 15.27 > 4.5)

const isAAA = isAccessible('#767676', '#FFFFFF', 'AAA');
// Returns: false (ratio 4.54 < 7)
```

---

### `getAccessibleTextColor(backgroundColor: string)`

**Description**: Returns the best text color (brand, white, or black) for a given background.

**Import**: `import { getAccessibleTextColor } from '@/lib/colors'`

**Parameters**:
- `backgroundColor: string` - Background hex color

**Returns**: `string` - Optimal text color

**Example**:
```tsx
const textColor = getAccessibleTextColor('#002145');
// Returns: '#FFFFFF' (white on dark blue)

const brandTextColor = getAccessibleTextColor('#F0F9FF');
// Returns: '#002145' (brand color on light blue)
```

---

### `isColorBlindFriendly(color1: string, color2: string)`

**Description**: Checks if two colors have sufficient hue difference for color-blind users.

**Import**: `import { isColorBlindFriendly } from '@/lib/colors'`

**Parameters**:
- `color1: string` - First hex color
- `color2: string` - Second hex color

**Returns**: `boolean` - Whether colors are distinguishable

**Example**:
```tsx
const isFriendly = isColorBlindFriendly('#FF0000', '#0000FF');
// Returns: true (red vs blue)

const notFriendly = isColorBlindFriendly('#FF0000', '#FF4444');
// Returns: false (similar reds)
```

---

### `getColorBlindAlternatives(baseColor: string)`

**Description**: Generates color-blind friendly alternatives for a color.

**Import**: `import { getColorBlindAlternatives } from '@/lib/colors'`

**Parameters**:
- `baseColor: string` - Base hex color

**Returns**: `{ deuteranopia: string; protanopia: string; tritanopia: string; }`

**Example**:
```tsx
const alternatives = getColorBlindAlternatives('#002145');
// Returns: {
//   deuteranopia: '#4a5cc7', // Green-blind alternative
//   protanopia: '#3248a8',   // Red-blind alternative  
//   tritanopia: '#6b45c7'    // Blue-blind alternative
// }
```

---

### `generateAccessibleColorPair(baseColor: string, level?: 'AA' | 'AAA')`

**Description**: Generates an accessible foreground/background color pair.

**Import**: `import { generateAccessibleColorPair } from '@/lib/colors'`

**Parameters**:
- `baseColor: string` - Base hex color
- `level?: 'AA' | 'AAA'` - Target WCAG level

**Returns**: `{ foreground: string; background: string; ratio: number; }`

**Example**:
```tsx
const pair = generateAccessibleColorPair('#002145', 'AA');
// Returns: {
//   foreground: '#002145',
//   background: '#f0f9ff',
//   ratio: 4.52
// }
```

---

### `validateColorSystemAccessibility()`

**Description**: Validates the entire South Pole color system for accessibility compliance.

**Import**: `import { validateColorSystemAccessibility } from '@/lib/colors'`

**Returns**: `{ isValid: boolean; issues: Array<Issue>; recommendations: string[]; }`

```tsx
interface Issue {
  color: string;
  issue: string;
  suggestion: string;
}
```

**Example**:
```tsx
const validation = validateColorSystemAccessibility();
// Returns: {
//   isValid: false,
//   issues: [
//     {
//       color: 'warning',
//       issue: 'Insufficient contrast with white text',
//       suggestion: 'Consider adjusting brightness'
//     }
//   ],
//   recommendations: [
//     'Use high contrast mode for users with visual impairments',
//     'Provide alternative color indicators for color-blind users'
//   ]
// }
```

## ⚡ Performance Utilities

### `colorCache`

**Description**: Global color cache for expensive calculations.

**Import**: `import { colorCache } from '@/lib/performance'`

**Methods**:
```tsx
interface ColorCache {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  clear(): void;
  size(): number;
}
```

**Example**:
```tsx
// Cache is used automatically by color functions
const cached = colorCache.get('hexToHsl:#002145');
colorCache.clear(); // Clear all cached values
console.log(colorCache.size()); // Current cache size
```

---

### `cssOptimizer`

**Description**: Batch CSS variable updates for better performance.

**Import**: `import { cssOptimizer } from '@/lib/performance'`

**Methods**:
```tsx
interface CSSVariableOptimizer {
  setBatchVariables(variables: Record<string, string>): void;
  cleanupUnusedVariables(activeVariables: string[]): void;
  getAppliedVariables(): string[];
}
```

**Example**:
```tsx
// Batch update multiple CSS variables
cssOptimizer.setBatchVariables({
  '--primary': '#002145',
  '--secondary': '#00875A',
  '--background': '#ffffff'
});

// Clean up unused variables
cssOptimizer.cleanupUnusedVariables(['--primary', '--secondary']);
```

---

### `debounce(func, wait)`

**Description**: Debounces function calls to improve performance.

**Import**: `import { debounce } from '@/lib/performance'`

**Parameters**:
- `func: Function` - Function to debounce
- `wait: number` - Wait time in milliseconds

**Example**:
```tsx
const debouncedToggle = debounce(() => {
  console.log('Theme toggled');
}, 300);
```

---

### `throttle(func, limit)`

**Description**: Throttles function calls to limit execution frequency.

**Import**: `import { throttle } from '@/lib/performance'`

**Parameters**:
- `func: Function` - Function to throttle
- `limit: number` - Limit in milliseconds

**Example**:
```tsx
const throttledResize = throttle(() => {
  console.log('Window resized');
}, 100);
```

---

### `memoryMonitor`

**Description**: Monitors memory usage and triggers cleanup when needed.

**Import**: `import { memoryMonitor } from '@/lib/performance'`

**Methods**:
```tsx
interface MemoryMonitor {
  start(intervalMs?: number): void;
  stop(): void;
}
```

**Example**:
```tsx
// Start monitoring (automatically used in theme provider)
memoryMonitor.start(30000); // Check every 30 seconds

// Stop monitoring
memoryMonitor.stop();
```

---

### `profiler`

**Description**: Performance profiling for color operations.

**Import**: `import { profiler } from '@/lib/performance'`

**Methods**:
```tsx
interface PerformanceProfiler {
  start(name: string): void;
  end(name: string): number;
  measure(name: string, fn: () => void): number;
  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T>;
}
```

**Example**:
```tsx
// Measure synchronous operation
const duration = profiler.measure('colorGeneration', () => {
  generateColorScale('#002145');
});

// Measure asynchronous operation
const result = await profiler.measureAsync('apiCall', async () => {
  return fetch('/api/colors');
});
```

## 📊 Constants

### `SOUTH_POLE_BRAND_COLORS`

**Description**: Core South Pole brand colors.

**Import**: `import { SOUTH_POLE_BRAND_COLORS } from '@/lib/colors'`

**Value**:
```tsx
{
  primary: '#002145',    // South Pole Deep Blue
  secondary: '#00875A',  // Environment Green
  warning: '#FF8B00',    // Antarctic Orange  
  success: '#00875A',    // Same as secondary
  error: '#DC2626',      // Standard error red
  info: '#0EA5E9',       // Ice blue
}
```

---

### `southPoleColorSystem`

**Description**: Complete generated color system with scales.

**Import**: `import { southPoleColorSystem } from '@/lib/colors'`

**Structure**:
```tsx
{
  primary: { 50: string, 100: string, ..., 950: string },
  secondary: { 50: string, 100: string, ..., 950: string },
  warning: { 50: string, 100: string, ..., 950: string },
  success: { 50: string, 100: string, ..., 950: string },
  error: { 50: string, 100: string, ..., 950: string },
  info: { 50: string, 100: string, ..., 950: string },
  ice: { 50: string, 100: string, ..., 950: string },
  arctic: { 50: string, 100: string, ..., 950: string },
  gray: { 50: string, 100: string, ..., 950: string },
}
```

---

### `HIGH_CONTRAST_COLORS`

**Description**: High contrast color palette for accessibility.

**Import**: `import { HIGH_CONTRAST_COLORS } from '@/lib/colors'`

**Value**:
```tsx
{
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
  }
}
```

## 📝 Type Definitions

### Core Types

```tsx
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof southPoleColors;
}

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'x-large';
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

interface ValidationIssue {
  color: string;
  issue: string;
  suggestion: string;
}

interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  recommendations: string[];
}

interface AccessibleColorPair {
  foreground: string;
  background: string;
  ratio: number;
}

interface ColorBlindAlternatives {
  deuteranopia: string;
  protanopia: string;
  tritanopia: string;
}
```

### Provider Types

```tsx
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}

interface ProvidersProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}
```

### Component Props

```tsx
interface AccessibilityPanelProps {
  className?: string;
}

interface ThemeShowcaseProps {
  className?: string;
}
```