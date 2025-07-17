import type { ThemeConfig } from 'antd';
import { SOUTH_POLE_BRAND_COLORS, southPoleColorSystem } from '@/lib/colors';

// South Pole Colors for Ant Design
export const southPoleColors = {
  primary: SOUTH_POLE_BRAND_COLORS.primary,
  secondary: SOUTH_POLE_BRAND_COLORS.secondary,
  warning: SOUTH_POLE_BRAND_COLORS.warning,
  success: SOUTH_POLE_BRAND_COLORS.success,
  error: SOUTH_POLE_BRAND_COLORS.error,
  info: SOUTH_POLE_BRAND_COLORS.info,
  text: southPoleColorSystem.gray[700],
  textSecondary: southPoleColorSystem.gray[500],
  background: '#ffffff',
  border: southPoleColorSystem.gray[200],
  borderLight: southPoleColorSystem.gray[100],
  shadow: '0 2px 15px -3px rgba(0, 33, 69, 0.07), 0 10px 20px -2px rgba(0, 33, 69, 0.04)',
};

// Dark mode colors
export const southPoleDarkColors = {
  primary: '#4a9eff',      // Brighter blue for dark mode
  secondary: '#4ade80',    // Brighter green for dark mode  
  warning: '#E65100',      // Improved contrast orange
  success: '#4ade80',
  error: '#ef4444',
  info: '#38bdf8',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  background: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  borderLight: '#475569',
  shadow: '0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)',
};

// Ant Design Theme Configuration for South Pole (Light Mode)
export const antThemeConfig: ThemeConfig = {
  token: {
    // South Pole Brand Colors
    colorPrimary: southPoleColors.primary,
    colorSuccess: southPoleColors.success,
    colorWarning: southPoleColors.warning,
    colorError: southPoleColors.error,
    colorInfo: southPoleColors.info,
    
    // Background Colors
    colorBgContainer: southPoleColors.background,
    colorBgElevated: southPoleColors.background,
    colorBgLayout: southPoleColorSystem.gray[50],
    colorBgSpotlight: southPoleColorSystem.gray[100],
    colorBgMask: 'rgba(0, 33, 69, 0.45)',
    
    // Text Colors
    colorText: southPoleColors.text,
    colorTextSecondary: southPoleColors.textSecondary,
    colorTextTertiary: southPoleColorSystem.gray[400],
    colorTextQuaternary: southPoleColorSystem.gray[300],
    colorTextDisabled: southPoleColorSystem.gray[300],
    
    // Border Colors
    colorBorder: southPoleColors.border,
    colorBorderSecondary: southPoleColors.borderLight,
    
    // Link Colors
    colorLink: southPoleColors.primary,
    colorLinkHover: southPoleColorSystem.primary[600],
    colorLinkActive: southPoleColorSystem.primary[700],
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Line Heights
    lineHeight: 1.5714285714285714,
    lineHeightHeading1: 1.2105263157894737,
    lineHeightHeading2: 1.2666666666666666,
    lineHeightHeading3: 1.3333333333333333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    
    // Border Radius - More rounded for modern feel
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,
    borderRadiusOuter: 4,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    
    // Control Heights
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    controlHeightXS: 24,
    
    // Shadows - Using brand colors
    boxShadow: southPoleColors.shadow,
    boxShadowSecondary: '0 4px 25px -5px rgba(0, 33, 69, 0.1), 0 10px 10px -5px rgba(0, 33, 69, 0.04)',
    boxShadowTertiary: '0 1px 2px 0 rgba(0, 33, 69, 0.05)',
    
    // Motion
    motionDurationFast: '0.15s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    
    // Wireframe mode
    wireframe: false,
    
    // Z-Index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
  },
  
  components: {
    // Button Component
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 500,
      paddingInline: 16,
      paddingBlock: 8,
      primaryShadow: 'none',
      dangerShadow: 'none',
      defaultShadow: 'none',
      ghostBg: 'transparent',
      colorPrimaryBorder: southPoleColors.primary,
      colorPrimaryHover: '#001e3d',
      colorPrimaryActive: '#001a35',
    },
    
    // Card Component
    Card: {
      borderRadius: 12,
      paddingLG: 24,
      headerBg: 'transparent',
      headerHeight: 56,
      headerHeightSM: 48,
      boxShadow: southPoleColors.shadow,
      colorBorderSecondary: southPoleColors.borderLight,
    },
    
    // Input Component
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      activeBorderColor: southPoleColors.primary,
      hoverBorderColor: southPoleColors.primary,
    },
    
    // Select Component
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      optionSelectedBg: '#e6f2ff',
      optionActiveBg: '#f0f9ff',
    },
    
    // Table Component
    Table: {
      borderRadius: 8,
      headerBg: '#f9fafb',
      headerColor: southPoleColors.text,
      headerSortActiveBg: '#f3f4f6',
      headerSortHoverBg: '#f3f4f6',
      rowHoverBg: '#f9fafb',
      colorBorderSecondary: southPoleColors.borderLight,
    },
    
    // Menu Component
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 6,
      itemHeight: 40,
      itemMarginBlock: 4,
      itemMarginInline: 4,
      itemPaddingInline: 12,
      colorActiveBarBorderSize: 0,
      colorItemBg: 'transparent',
      colorItemBgActive: '#e6f2ff',
      colorItemBgHover: '#f0f9ff',
      colorItemBgSelected: '#e6f2ff',
    },
    
    // Modal Component
    Modal: {
      borderRadius: 12,
      headerBg: 'transparent',
      contentBg: southPoleColors.background,
      titleColor: southPoleColors.text,
      titleFontSize: 20,
      titleLineHeight: 1.4,
    },
    
    // Notification Component
    Notification: {
      borderRadius: 8,
      paddingContentHorizontal: 16,
      paddingContentVertical: 12,
      width: 384,
    },
    
    // Message Component
    Message: {
      borderRadius: 8,
      contentPadding: '10px 16px',
    },
    
    // Drawer Component
    Drawer: {
      borderRadius: 0,
      colorBgElevated: southPoleColors.background,
      paddingLG: 24,
    },
    
    // Typography Component
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
      fontFamilyCode: 'ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    
    // Form Component
    Form: {
      labelRequiredMarkColor: southPoleColors.error,
      labelColor: southPoleColors.text,
      labelFontSize: 14,
      verticalLabelPadding: '0 0 8px',
      verticalLabelMargin: 0,
      itemMarginBottom: 24,
    },
    
    // Switch Component
    Switch: {
      colorPrimary: southPoleColors.primary,
      colorPrimaryHover: '#001e3d',
      trackHeight: 22,
      trackMinWidth: 44,
      handleSize: 18,
    },
    
    // Tag Component
    Tag: {
      borderRadiusSM: 6,
      defaultBg: '#f3f4f6',
      defaultColor: southPoleColors.text,
    },
    
    // Badge Component
    Badge: {
      colorBorderBg: southPoleColors.background,
      textFontSize: 12,
      textFontSizeSM: 10,
      textFontWeight: 500,
    },
    
    // Progress Component
    Progress: {
      borderRadius: 8,
      lineBorderRadius: 8,
      circleTextColor: southPoleColors.text,
      remainingColor: '#f3f4f6',
    },
    
    // Steps Component
    Steps: {
      borderRadius: 8,
      colorPrimary: southPoleColors.primary,
      navContentMaxWidth: 'auto',
      navArrowColor: southPoleColors.textSecondary,
    },
  },
};

// Dark theme configuration with enhanced South Pole branding
export const antDarkThemeConfig: ThemeConfig = {
  token: {
    // South Pole Brand Colors - Adapted for Dark Mode
    colorPrimary: southPoleDarkColors.primary,
    colorSuccess: southPoleDarkColors.success,
    colorWarning: southPoleDarkColors.warning,
    colorError: southPoleDarkColors.error,
    colorInfo: southPoleDarkColors.info,
    
    // Background Colors - Dark Theme
    colorBgContainer: southPoleDarkColors.card,
    colorBgElevated: southPoleColorSystem.gray[800],
    colorBgLayout: southPoleDarkColors.background,
    colorBgSpotlight: southPoleColorSystem.gray[700],
    colorBgMask: 'rgba(0, 0, 0, 0.65)',
    
    // Text Colors - High Contrast for Dark Mode
    colorText: southPoleDarkColors.text,
    colorTextSecondary: southPoleDarkColors.textSecondary,
    colorTextTertiary: southPoleColorSystem.gray[400],
    colorTextQuaternary: southPoleColorSystem.gray[500],
    colorTextDisabled: southPoleColorSystem.gray[600],
    
    // Border Colors - Subtle for Dark Mode
    colorBorder: southPoleDarkColors.border,
    colorBorderSecondary: southPoleDarkColors.borderLight,
    
    // Link Colors - Bright for Dark Mode
    colorLink: southPoleDarkColors.primary,
    colorLinkHover: '#60a5fa',
    colorLinkActive: '#3b82f6',
    
    // Typography - Same as light mode
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Line Heights
    lineHeight: 1.5714285714285714,
    lineHeightHeading1: 1.2105263157894737,
    lineHeightHeading2: 1.2666666666666666,
    lineHeightHeading3: 1.3333333333333333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    
    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,
    borderRadiusOuter: 4,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    
    // Control Heights
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    controlHeightXS: 24,
    
    // Shadows - Darker for Dark Mode
    boxShadow: southPoleDarkColors.shadow,
    boxShadowSecondary: '0 4px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    
    // Motion
    motionDurationFast: '0.15s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    
    // Wireframe mode
    wireframe: false,
    
    // Z-Index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
  },
  
  components: {
    // Button Component - Dark Mode
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 500,
      paddingInline: 16,
      paddingBlock: 8,
      primaryShadow: 'none',
      dangerShadow: 'none',
      defaultShadow: 'none',
      ghostBg: 'transparent',
      colorPrimaryBorder: southPoleDarkColors.primary,
      colorPrimaryHover: '#60a5fa',
      colorPrimaryActive: '#3b82f6',
      colorPrimaryTextHover: southPoleDarkColors.background,
      colorPrimaryTextActive: southPoleDarkColors.background,
    },
    
    // Card Component - Dark Mode
    Card: {
      borderRadius: 12,
      paddingLG: 24,
      headerBg: 'transparent',
      headerHeight: 56,
      headerHeightSM: 48,
      boxShadow: southPoleDarkColors.shadow,
      colorBorderSecondary: southPoleDarkColors.borderLight,
      colorBgContainer: southPoleDarkColors.card,
    },
    
    // Input Component - Dark Mode
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      activeBorderColor: southPoleDarkColors.primary,
      hoverBorderColor: southPoleDarkColors.primary,
      colorBgContainer: southPoleDarkColors.card,
    },
    
    // Select Component - Dark Mode
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      optionSelectedBg: 'rgba(74, 158, 255, 0.2)',
      optionActiveBg: 'rgba(74, 158, 255, 0.1)',
      colorBgContainer: southPoleDarkColors.card,
    },
    
    // Menu Component - Dark Mode
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 6,
      itemHeight: 40,
      itemMarginBlock: 4,
      itemMarginInline: 4,
      itemPaddingInline: 12,
      colorActiveBarBorderSize: 0,
      colorItemBg: 'transparent',
      colorItemBgActive: 'rgba(74, 158, 255, 0.2)',
      colorItemBgHover: 'rgba(74, 158, 255, 0.1)',
      colorItemBgSelected: 'rgba(74, 158, 255, 0.2)',
      colorBgContainer: southPoleDarkColors.card,
    },
    
    // Modal Component - Dark Mode
    Modal: {
      borderRadius: 12,
      headerBg: 'transparent',
      contentBg: southPoleDarkColors.card,
      titleColor: southPoleDarkColors.text,
      titleFontSize: 20,
      titleLineHeight: 1.4,
    },
    
    // Typography Component - Dark Mode
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
      fontFamilyCode: 'ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
};

export default antThemeConfig;