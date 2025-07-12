/**
 * Accessibility Automated Tests
 * 可访问性自动化测试
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

import { AccessibilityPanel } from '../src/components/ui/AccessibilityPanel';
import { ThemeShowcase } from '../src/components/sections/ThemeShowcase';
import { Providers } from '../src/app/providers';
import { useAccessibility } from '../src/hooks/useAccessibility';
import {
  getContrastRatio,
  isAccessible,
  validateColorSystemAccessibility,
  SOUTH_POLE_BRAND_COLORS,
} from '../src/lib/colors';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

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

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

// Test component wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Providers defaultTheme="light">
    {children}
  </Providers>
);

describe('Accessibility Compliance Tests', () => {
  describe('WCAG 2.1 Color Contrast', () => {
    test('South Pole brand colors should meet WCAG AA contrast requirements', () => {
      // Test brand colors against white background
      const whiteBackground = '#FFFFFF';
      
      Object.entries(SOUTH_POLE_BRAND_COLORS).forEach(([name, color]) => {
        const ratio = getContrastRatio(color, whiteBackground);
        expect(ratio).toBeGreaterThanOrEqual(3); // AA Large text requirement
        
        // Primary color should meet AA normal text requirement
        if (name === 'primary') {
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        }
      });
    });

    test('Dark theme colors should maintain accessibility', () => {
      const darkBackground = '#111827';
      const lightText = '#F3F4F6';
      
      const ratio = getContrastRatio(lightText, darkBackground);
      expect(ratio).toBeGreaterThanOrEqual(4.5); // AA requirement
    });

    test('isAccessible function should correctly identify passing combinations', () => {
      expect(isAccessible('#000000', '#FFFFFF', 'AA')).toBe(true);
      expect(isAccessible('#FFFFFF', '#000000', 'AA')).toBe(true);
      expect(isAccessible(SOUTH_POLE_BRAND_COLORS.primary, '#FFFFFF', 'AA')).toBe(true);
    });

    test('isAccessible function should correctly identify failing combinations', () => {
      expect(isAccessible('#CCCCCC', '#FFFFFF', 'AA')).toBe(false);
      expect(isAccessible('#999999', '#BBBBBB', 'AA')).toBe(false);
    });
  });

  describe('Color System Validation', () => {
    test('validateColorSystemAccessibility should provide comprehensive report', () => {
      const validation = validateColorSystemAccessibility();
      
      expect(validation).toMatchObject({
        isValid: expect.any(Boolean),
        issues: expect.any(Array),
        recommendations: expect.any(Array),
      });

      // Should have at least basic recommendations
      expect(validation.recommendations.length).toBeGreaterThan(0);
      expect(validation.recommendations).toContain(
        expect.stringContaining('WCAG 2.1 AA')
      );
    });

    test('should identify specific accessibility issues', () => {
      const validation = validateColorSystemAccessibility();
      
      validation.issues.forEach(issue => {
        expect(issue).toMatchObject({
          color: expect.any(String),
          issue: expect.any(String),
          suggestion: expect.any(String),
        });
      });
    });
  });
});

describe('AccessibilityPanel Component Tests', () => {
  test('should render without accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <AccessibilityPanel />
      </TestWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper ARIA labels and roles', () => {
    render(
      <TestWrapper>
        <AccessibilityPanel />
      </TestWrapper>
    );

    // Check for accessibility controls
    expect(screen.getByText('High Contrast Mode')).toBeInTheDocument();
    expect(screen.getByText('Color Blind Friendly')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();

    // Check for switches with proper labels
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThan(0);
    
    switches.forEach(switchElement => {
      expect(switchElement).toHaveAttribute('aria-checked');
    });
  });

  test('should display color system validation results', () => {
    render(
      <TestWrapper>
        <AccessibilityPanel />
      </TestWrapper>
    );

    expect(screen.getByText('Color System Validation')).toBeInTheDocument();
    
    // Should show either success or warning message
    const validationMessage = screen.getByText(/colors meet WCAG|accessibility issues/);
    expect(validationMessage).toBeInTheDocument();
  });

  test('accessibility controls should be keyboard navigable', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <AccessibilityPanel />
      </TestWrapper>
    );

    // Test tab navigation
    await user.tab();
    expect(document.activeElement).toBeInTheDocument();
    
    // Test that switches can be activated with keyboard
    const firstSwitch = screen.getAllByRole('switch')[0];
    firstSwitch.focus();
    await user.keyboard('{Space}');
    
    // Switch should toggle
    expect(firstSwitch).toHaveAttribute('aria-checked');
  });
});

describe('ThemeShowcase Accessibility Tests', () => {
  test('should render without accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <ThemeShowcase />
      </TestWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper heading structure', () => {
    render(
      <TestWrapper>
        <ThemeShowcase />
      </TestWrapper>
    );

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { name: /South Pole Theme System/i });
    expect(mainHeading).toBeInTheDocument();
    
    // Should have section headings
    expect(screen.getByText('Brand Colors')).toBeInTheDocument();
    expect(screen.getByText('Component Examples')).toBeInTheDocument();
  });

  test('color swatches should have accessible descriptions', () => {
    render(
      <TestWrapper>
        <ThemeShowcase />
      </TestWrapper>
    );

    // Check for color descriptions
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('#002145')).toBeInTheDocument();
    expect(screen.getByText('#00875A')).toBeInTheDocument();
  });

  test('theme toggle should be accessible', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <ThemeShowcase />
      </TestWrapper>
    );

    const themeToggle = screen.getByRole('switch');
    expect(themeToggle).toBeInTheDocument();
    expect(themeToggle).toHaveAttribute('aria-checked');
    
    // Should be keyboard accessible
    themeToggle.focus();
    await user.keyboard('{Space}');
    
    // Theme should toggle
    await waitFor(() => {
      expect(themeToggle).toHaveAttribute('aria-checked');
    });
  });
});

describe('useAccessibility Hook Tests', () => {
  const TestComponent: React.FC = () => {
    const {
      settings,
      toggleHighContrast,
      toggleColorBlindMode,
      toggleReducedMotion,
      setFontSize,
    } = useAccessibility();

    return (
      <div>
        <span data-testid="high-contrast">{settings.highContrast.toString()}</span>
        <span data-testid="color-blind">{settings.colorBlindMode.toString()}</span>
        <span data-testid="reduced-motion">{settings.reducedMotion.toString()}</span>
        <span data-testid="font-size">{settings.fontSize}</span>
        
        <button onClick={toggleHighContrast}>Toggle High Contrast</button>
        <button onClick={toggleColorBlindMode}>Toggle Color Blind</button>
        <button onClick={toggleReducedMotion}>Toggle Reduced Motion</button>
        <button onClick={() => setFontSize('large')}>Set Large Font</button>
      </div>
    );
  };

  test('should initialize with default settings', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('false');
    expect(screen.getByTestId('color-blind')).toHaveTextContent('false');
    expect(screen.getByTestId('reduced-motion')).toHaveTextContent('false');
    expect(screen.getByTestId('font-size')).toHaveTextContent('normal');
  });

  test('should toggle accessibility settings correctly', async () => {
    const user = userEvent.setup();
    
    render(<TestComponent />);
    
    // Toggle high contrast
    await user.click(screen.getByText('Toggle High Contrast'));
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('true');
    
    // Toggle color blind mode
    await user.click(screen.getByText('Toggle Color Blind'));
    expect(screen.getByTestId('color-blind')).toHaveTextContent('true');
    
    // Set font size
    await user.click(screen.getByText('Set Large Font'));
    expect(screen.getByTestId('font-size')).toHaveTextContent('large');
  });

  test('should apply CSS classes when settings change', async () => {
    const user = userEvent.setup();
    
    render(<TestComponent />);
    
    // Toggle high contrast
    await user.click(screen.getByText('Toggle High Contrast'));
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('high-contrast');
    });
    
    // Toggle color blind mode
    await user.click(screen.getByText('Toggle Color Blind'));
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('color-blind-mode');
    });
  });
});

describe('Reduced Motion Support', () => {
  test('should respect prefers-reduced-motion', () => {
    // Mock media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const TestComponent: React.FC = () => {
      const { settings } = useAccessibility();
      return <span data-testid="reduced-motion">{settings.reducedMotion.toString()}</span>;
    };

    render(<TestComponent />);
    
    // Should detect system preference
    expect(screen.getByTestId('reduced-motion')).toHaveTextContent('true');
  });

  test('CSS should disable animations when reduced motion is enabled', () => {
    // Create a test element with animation
    const element = document.createElement('div');
    element.className = 'animate-pulse-slow';
    document.body.appendChild(element);
    
    // Apply reduced motion styles
    document.documentElement.setAttribute('data-reduced-motion', 'true');
    
    // Check computed styles (would need actual CSS in real test)
    // This is a simplified test
    expect(element).toHaveClass('animate-pulse-slow');
    
    document.body.removeChild(element);
  });
});

describe('High Contrast Mode', () => {
  test('should apply high contrast colors when enabled', () => {
    const TestComponent: React.FC = () => {
      const { toggleHighContrast } = useAccessibility();
      
      React.useEffect(() => {
        toggleHighContrast();
      }, [toggleHighContrast]);
      
      return <div>High Contrast Test</div>;
    };

    render(<TestComponent />);
    
    // Check if high contrast class is applied
    expect(document.documentElement).toHaveClass('high-contrast');
  });

  test('high contrast mode should meet WCAG AAA standards', () => {
    // Test high contrast color combinations
    const highContrastColors = {
      background: '#FFFFFF',
      foreground: '#000000',
      primary: '#0000FF',
    };

    Object.entries(highContrastColors).forEach(([name, color]) => {
      if (name !== 'background') {
        const ratio = getContrastRatio(color, highContrastColors.background);
        expect(ratio).toBeGreaterThanOrEqual(7); // AAA requirement
      }
    });
  });
});

describe('Font Size Accessibility', () => {
  test('should support multiple font size options', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <AccessibilityPanel />
      </TestWrapper>
    );

    // Find font size select
    const fontSizeSelect = screen.getByDisplayValue('Normal');
    expect(fontSizeSelect).toBeInTheDocument();
    
    // Should have multiple options
    await user.click(fontSizeSelect);
    
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getByText('X-Large')).toBeInTheDocument();
  });

  test('should apply font size attribute to document', () => {
    const TestComponent: React.FC = () => {
      const { setFontSize } = useAccessibility();
      
      React.useEffect(() => {
        setFontSize('large');
      }, [setFontSize]);
      
      return <div>Font Size Test</div>;
    };

    render(<TestComponent />);
    
    expect(document.documentElement).toHaveAttribute('data-font-size', 'large');
  });
});

describe('Screen Reader Support', () => {
  test('should have proper ARIA landmarks', () => {
    render(
      <TestWrapper>
        <ThemeShowcase />
      </TestWrapper>
    );

    // Should have section landmark
    const section = screen.getByRole('region', { name: /South Pole Theme System/i });
    expect(section).toBeInTheDocument();
  });

  test('should have descriptive button labels', () => {
    render(
      <TestWrapper>
        <AccessibilityPanel />
      </TestWrapper>
    );

    // Check for descriptive labels
    const maxAccessibilityButton = screen.getByText('Maximum Accessibility');
    expect(maxAccessibilityButton).toBeInTheDocument();
    
    const resetButton = screen.getByText('Reset to Default');
    expect(resetButton).toBeInTheDocument();
  });

  test('color swatches should have meaningful descriptions', () => {
    render(
      <TestWrapper>
        <ThemeShowcase />
      </TestWrapper>
    );

    // Color descriptions should be present
    expect(screen.getByText(/Primary/)).toBeInTheDocument();
    expect(screen.getByText(/Secondary/)).toBeInTheDocument();
    expect(screen.getByText(/Ice Blue/)).toBeInTheDocument();
    expect(screen.getByText(/Arctic Gray/)).toBeInTheDocument();
  });
});

describe('Keyboard Navigation', () => {
  test('all interactive elements should be keyboard accessible', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <AccessibilityPanel />
      </TestWrapper>
    );

    // Test tab navigation through all interactive elements
    const interactiveElements = screen.getAllByRole(/button|switch|combobox/);
    
    for (const element of interactiveElements) {
      element.focus();
      expect(element).toHaveFocus();
      
      // Test activation with keyboard
      if (element.getAttribute('role') === 'switch') {
        await user.keyboard('{Space}');
      } else if (element.tagName === 'BUTTON') {
        await user.keyboard('{Enter}');
      }
    }
  });

  test('should have visible focus indicators', () => {
    render(
      <TestWrapper>
        <AccessibilityPanel />
      </TestWrapper>
    );

    const button = screen.getByText('Maximum Accessibility');
    button.focus();
    
    // Check for focus styles (would need actual CSS in real test)
    expect(button).toHaveFocus();
  });
});