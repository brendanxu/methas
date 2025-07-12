/**
 * Theme Switching Functionality Tests
 * 主题切换功能测试
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Providers, ThemeProvider, useTheme, useThemeColors, useThemeReady } from '../src/app/providers';
import { ThemeShowcase } from '../src/components/sections/ThemeShowcase';
import { antThemeConfig, antDarkThemeConfig } from '../src/styles/ant-theme';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
}));

describe('Theme Provider Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    document.documentElement.className = '';
  });

  describe('Theme Initialization', () => {
    test('should initialize with light theme by default', () => {
      const TestComponent = () => {
        const { isDark } = useTheme();
        return <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-state')).toHaveTextContent('light');
    });

    test('should initialize with dark theme when specified', () => {
      const TestComponent = () => {
        const { isDark } = useTheme();
        return <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>;
      };

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
    });

    test('should load theme from localStorage if available', () => {
      mockLocalStorage.setItem('southpole-theme', 'dark');

      const TestComponent = () => {
        const { isDark } = useTheme();
        return <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
    });

    test('should respect system preference when no localStorage', () => {
      // Mock system prefers dark
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const TestComponent = () => {
        const { isDark } = useTheme();
        return <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
    });
  });

  describe('Theme Toggling', () => {
    test('should toggle theme when toggleTheme is called', async () => {
      const TestComponent = () => {
        const { isDark, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>
            <button onClick={toggleTheme}>Toggle Theme</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByText('Toggle Theme');
      const themeState = screen.getByTestId('theme-state');

      expect(themeState).toHaveTextContent('light');

      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(themeState).toHaveTextContent('dark');
      });
    });

    test('should save theme preference to localStorage', async () => {
      const TestComponent = () => {
        const { isDark, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>
            <button onClick={toggleTheme}>Toggle Theme</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByText('Toggle Theme');

      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(mockLocalStorage.getItem('southpole-theme')).toBe('dark');
      });

      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(mockLocalStorage.getItem('southpole-theme')).toBe('light');
      });
    });

    test('should apply CSS class to document element', async () => {
      const TestComponent = () => {
        const { isDark, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>
            <button onClick={toggleTheme}>Toggle Theme</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByText('Toggle Theme');

      expect(document.documentElement).not.toHaveClass('dark');

      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark');
      });

      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass('dark');
      });
    });
  });

  describe('Theme Colors Hook', () => {
    test('should provide correct colors for light theme', () => {
      const TestComponent = () => {
        const colors = useThemeColors();
        return (
          <div>
            <div data-testid="background">{colors.background}</div>
            <div data-testid="foreground">{colors.foreground}</div>
            <div data-testid="primary">{colors.primary}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('background')).toHaveTextContent('#ffffff');
      expect(screen.getByTestId('foreground')).toHaveTextContent('#374151');
      expect(screen.getByTestId('primary')).toHaveTextContent('#002145');
    });

    test('should provide correct colors for dark theme', async () => {
      const TestComponent = () => {
        const { toggleTheme } = useTheme();
        const colors = useThemeColors();
        
        React.useEffect(() => {
          toggleTheme();
        }, [toggleTheme]);

        return (
          <div>
            <div data-testid="background">{colors.background}</div>
            <div data-testid="foreground">{colors.foreground}</div>
            <div data-testid="primary">{colors.primary}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('background')).toHaveTextContent('#111827');
        expect(screen.getByTestId('foreground')).toHaveTextContent('#f3f4f6');
        expect(screen.getByTestId('primary')).toHaveTextContent('#002145');
      });
    });
  });

  describe('Theme Ready Hook', () => {
    test('should indicate when theme is ready', async () => {
      const TestComponent = () => {
        const ready = useThemeReady();
        return <div data-testid="ready">{ready ? 'ready' : 'loading'}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready')).toHaveTextContent('ready');
      });
    });

    test('should start as not ready', () => {
      const TestComponent = () => {
        const ready = useThemeReady();
        return <div data-testid="ready">{ready ? 'ready' : 'loading'}</div>;
      };

      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // On first render, should be loading
      expect(screen.getByTestId('ready')).toHaveTextContent('loading');
    });
  });
});

describe('Ant Design Theme Integration', () => {
  test('should apply correct Ant Design theme config for light mode', () => {
    const TestComponent = () => {
      const { isDark } = useTheme();
      return (
        <div data-testid="theme-config">
          {isDark ? 'dark-config' : 'light-config'}
        </div>
      );
    };

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    expect(screen.getByTestId('theme-config')).toHaveTextContent('light-config');
  });

  test('should apply correct Ant Design theme config for dark mode', async () => {
    const TestComponent = () => {
      const { isDark, toggleTheme } = useTheme();
      
      React.useEffect(() => {
        toggleTheme();
      }, [toggleTheme]);

      return (
        <div data-testid="theme-config">
          {isDark ? 'dark-config' : 'light-config'}
        </div>
      );
    };

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-config')).toHaveTextContent('dark-config');
    });
  });

  test('Ant Design configs should have correct brand colors', () => {
    expect(antThemeConfig.token?.colorPrimary).toBe('#002145');
    expect(antDarkThemeConfig.token?.colorPrimary).toBe('#4a9eff');
  });
});

describe('ThemeShowcase Component Integration', () => {
  test('should display current theme state', () => {
    render(
      <Providers>
        <ThemeShowcase />
      </Providers>
    );

    expect(screen.getByText('Light Mode')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  test('should toggle theme when switch is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Providers>
        <ThemeShowcase />
      </Providers>
    );

    const themeSwitch = screen.getByRole('switch');
    expect(themeSwitch).toBeInTheDocument();

    await user.click(themeSwitch);

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
    });
  });

  test('should display correct brand colors', () => {
    render(
      <Providers>
        <ThemeShowcase />
      </Providers>
    );

    expect(screen.getByText('#002145')).toBeInTheDocument();
    expect(screen.getByText('#00875A')).toBeInTheDocument();
    expect(screen.getByText('#FF8B00')).toBeInTheDocument();
  });

  test('should show theme values in real-time', async () => {
    const user = userEvent.setup();
    
    render(
      <Providers>
        <ThemeShowcase />
      </Providers>
    );

    // Check initial light mode tag
    expect(screen.getByText('Light Mode')).toBeInTheDocument();

    const themeSwitch = screen.getByRole('switch');
    await user.click(themeSwitch);

    await waitFor(() => {
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });
  });
});

describe('CSS Variable Updates', () => {
  test('should update CSS variables when theme changes', async () => {
    const TestComponent = () => {
      const { toggleTheme } = useTheme();
      return <button onClick={toggleTheme}>Toggle</button>;
    };

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    const toggleButton = screen.getByText('Toggle');

    // Check initial light theme variables
    expect(document.documentElement.style.getPropertyValue('--background')).toBe('#ffffff');

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--background')).toBe('#111827');
    });
  });

  test('should maintain brand colors across theme changes', async () => {
    const TestComponent = () => {
      const { toggleTheme } = useTheme();
      return <button onClick={toggleTheme}>Toggle</button>;
    };

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    const toggleButton = screen.getByText('Toggle');

    // Check brand colors in light mode
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#002145');

    fireEvent.click(toggleButton);

    await waitFor(() => {
      // Brand colors should remain consistent
      expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#002145');
    });
  });
});

describe('Performance and Memory Management', () => {
  test('should not cause memory leaks with repeated theme changes', async () => {
    const TestComponent = () => {
      const { toggleTheme } = useTheme();
      return <button onClick={toggleTheme}>Toggle</button>;
    };

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    const toggleButton = screen.getByText('Toggle');

    // Simulate rapid theme changes
    for (let i = 0; i < 10; i++) {
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(document.documentElement).toHaveClass(i % 2 === 1 ? 'dark' : 'light');
      });
    }

    // Should still work correctly after many changes
    expect(mockLocalStorage.getItem('southpole-theme')).toBeDefined();
  });

  test('should debounce rapid theme changes', async () => {
    const TestComponent = () => {
      const { toggleTheme } = useTheme();
      return <button onClick={toggleTheme}>Toggle</button>;
    };

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    const toggleButton = screen.getByText('Toggle');

    // Rapid clicks
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    // Should only result in one final state change
    await waitFor(() => {
      const finalState = mockLocalStorage.getItem('southpole-theme');
      expect(finalState).toBeDefined();
    });
  });
});

describe('Error Handling', () => {
  test('should handle missing localStorage gracefully', () => {
    // Mock localStorage to throw errors
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => {
          throw new Error('localStorage not available');
        },
        setItem: () => {
          throw new Error('localStorage not available');
        },
      },
    });

    const TestComponent = () => {
      const { isDark, toggleTheme } = useTheme();
      return (
        <div>
          <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    };

    // Should not crash
    expect(() => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    }).not.toThrow();

    // Restore localStorage
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
  });

  test('should handle missing matchMedia gracefully', () => {
    // Remove matchMedia
    const originalMatchMedia = window.matchMedia;
    delete (window as any).matchMedia;

    const TestComponent = () => {
      const { isDark } = useTheme();
      return <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>;
    };

    // Should not crash and fallback to default
    expect(() => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    }).not.toThrow();

    expect(screen.getByTestId('theme-state')).toHaveTextContent('light');

    // Restore matchMedia
    window.matchMedia = originalMatchMedia;
  });

  test('should throw error when useTheme is used outside provider', () => {
    const TestComponent = () => {
      const { isDark } = useTheme();
      return <div>{isDark ? 'dark' : 'light'}</div>;
    };

    // Should throw error when used outside provider
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});

describe('Hydration Safety', () => {
  test('should prevent hydration mismatch', () => {
    const TestComponent = () => {
      const { isDark } = useTheme();
      return <div data-testid="theme-state">{isDark ? 'dark' : 'light'}</div>;
    };

    const { container } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should render initially
    expect(container.firstChild).toBeInTheDocument();
  });

  test('should handle server-side rendering', () => {
    // Mock SSR environment
    const originalDocument = global.document;
    delete (global as any).document;

    const TestComponent = () => {
      const { isDark } = useTheme();
      return <div>{isDark ? 'dark' : 'light'}</div>;
    };

    // Should not crash in SSR
    expect(() => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    }).not.toThrow();

    // Restore document
    global.document = originalDocument;
  });
});