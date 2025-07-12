'use client';

import { useState, useEffect } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'x-large';
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    colorBlindMode: false,
    fontSize: 'normal',
  });

  useEffect(() => {
    // Check system preferences
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setSettings(prev => ({
      ...prev,
      highContrast: highContrastQuery.matches,
      reducedMotion: reducedMotionQuery.matches,
    }));

    // Listen for changes
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    highContrastQuery.addEventListener('change', handleHighContrastChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply changes to document
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value as boolean);
    }
    
    if (key === 'colorBlindMode') {
      document.documentElement.classList.toggle('color-blind-mode', value as boolean);
    }
    
    if (key === 'fontSize') {
      document.documentElement.setAttribute('data-font-size', value as string);
    }
  };

  return {
    settings,
    updateSetting,
    toggleHighContrast: () => updateSetting('highContrast', !settings.highContrast),
    toggleReducedMotion: () => updateSetting('reducedMotion', !settings.reducedMotion),
    toggleColorBlindMode: () => updateSetting('colorBlindMode', !settings.colorBlindMode),
    setFontSize: (size: AccessibilitySettings['fontSize']) => updateSetting('fontSize', size),
  };
}