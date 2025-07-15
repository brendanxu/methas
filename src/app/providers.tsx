'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { antThemeConfig, antDarkThemeConfig, southPoleColors } from '@/styles/ant-theme';
import { cssOptimizer, debounce, memoryMonitor } from '@/lib/performance';
import { Session } from 'next-auth';

// Theme context types
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof southPoleColors;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // 启动性能监控 (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      memoryMonitor.start();
      return () => memoryMonitor.stop();
    }
    return undefined; // Explicit return for server-side
  }, []);

  // Initialize theme from localStorage or default (client-side only)
  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') return;
    
    const savedTheme = localStorage.getItem('southpole-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme 
      ? savedTheme === 'dark'
      : defaultTheme === 'dark' || systemPrefersDark;
    
    setIsDark(initialTheme);
    setMounted(true);

    // Apply theme to document
    document.documentElement.classList.toggle('dark', initialTheme);
  }, [defaultTheme]);

  // Toggle theme function with performance optimization
  const toggleTheme = debounce(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Only access browser APIs on client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('southpole-theme', newTheme ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newTheme);
    }
  }, 100);

  // Theme context value
  const themeValue: ThemeContextType = {
    isDark,
    toggleTheme,
    colors: southPoleColors,
  };

  // Provide consistent SSR/client rendering to avoid hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        isDark: defaultTheme === 'dark',
        toggleTheme: () => {},
        colors: southPoleColors,
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Ant Design ConfigProvider wrapper
interface AntdProviderProps {
  children: ReactNode;
}

export const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={isDark ? antDarkThemeConfig : antThemeConfig}
      componentSize="middle"
    >
      {children}
    </ConfigProvider>
  );
};

// Combined providers component
interface ProvidersProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
  session?: Session | null;
}

export const Providers: React.FC<ProvidersProps> = ({ 
  children, 
  defaultTheme = 'light',
  session
}) => {
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <ThemeProvider defaultTheme={defaultTheme}>
          <AntdProvider>
            {children}
          </AntdProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
};

// Global styles provider for CSS variables - Performance Optimized
export const GlobalStylesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isDark, colors } = useTheme();

  useEffect(() => {
    // 使用优化的批量CSS变量更新
    const themeVariables = isDark ? {
      '--background': '#111827',
      '--foreground': '#f3f4f6',
      '--muted': '#1f2937',
      '--muted-foreground': '#d1d5db',
      '--border': '#374151',
      '--input': '#1f2937',
      '--card': '#1f2937',
      '--card-foreground': '#f3f4f6',
      '--popover': '#1f2937',
      '--popover-foreground': '#f3f4f6',
      '--secondary': '#374151',
      '--secondary-foreground': '#f3f4f6',
      '--accent': '#374151',
      '--accent-foreground': '#f3f4f6',
    } : {
      '--background': '#ffffff',
      '--foreground': '#374151',
      '--muted': '#f9fafb',
      '--muted-foreground': '#6b7280',
      '--border': '#e5e7eb',
      '--input': '#ffffff',
      '--card': '#ffffff',
      '--card-foreground': '#374151',
      '--popover': '#ffffff',
      '--popover-foreground': '#374151',
      '--secondary': '#f3f4f6',
      '--secondary-foreground': '#374151',
      '--accent': '#f3f4f6',
      '--accent-foreground': '#374151',
    };

    // 添加品牌色（跨主题一致）
    const brandVariables = {
      '--primary': colors.primary,
      '--primary-foreground': '#ffffff',
      '--secondary-brand': colors.secondary,
      '--warning': colors.warning,
      '--success': colors.success,
      '--error': colors.error,
      '--ring': colors.primary,
    };

    // 批量更新CSS变量以提高性能
    cssOptimizer.setBatchVariables({ ...themeVariables, ...brandVariables });
    
    // 清理未使用的变量
    const activeVariables = Object.keys({ ...themeVariables, ...brandVariables });
    cssOptimizer.cleanupUnusedVariables(activeVariables);
  }, [isDark, colors]);

  return <>{children}</>;
};

// Hook to get current theme colors
export const useThemeColors = () => {
  const { isDark, colors } = useTheme();
  
  return {
    ...colors,
    background: isDark ? '#111827' : '#ffffff',
    foreground: isDark ? '#f3f4f6' : '#374151',
    muted: isDark ? '#1f2937' : '#f9fafb',
    mutedForeground: isDark ? '#d1d5db' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    card: isDark ? '#1f2937' : '#ffffff',
    cardForeground: isDark ? '#f3f4f6' : '#374151',
  };
};

// Hook to check if theme is ready (to prevent hydration issues)
export const useThemeReady = (): boolean => {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    setReady(true);
  }, []);
  
  return ready;
};

export default Providers;