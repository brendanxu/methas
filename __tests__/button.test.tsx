import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/Button';
import { Providers } from '@/app/providers';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Wrapper component that provides theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Providers defaultTheme="light">
    {children}
  </Providers>
);

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(
        <TestWrapper>
          <Button>Click me</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    test('renders with custom className', () => {
      render(
        <TestWrapper>
          <Button className="custom-class">Test</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    test('renders primary variant by default', () => {
      render(
        <TestWrapper>
          <Button>Primary Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-white');
    });

    test('renders secondary variant correctly', () => {
      render(
        <TestWrapper>
          <Button variant="secondary">Secondary Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-background', 'border-2');
    });

    test('renders ghost variant correctly', () => {
      render(
        <TestWrapper>
          <Button variant="ghost">Ghost Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });

    test('renders success variant correctly', () => {
      render(
        <TestWrapper>
          <Button variant="success">Success Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-white');
    });
  });

  describe('Sizes', () => {
    test('renders medium size by default', () => {
      render(
        <TestWrapper>
          <Button>Medium Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ height: '40px' });
    });

    test('renders small size correctly', () => {
      render(
        <TestWrapper>
          <Button size="small">Small Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ height: '32px' });
    });

    test('renders large size correctly', () => {
      render(
        <TestWrapper>
          <Button size="large">Large Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ height: '48px' });
    });
  });

  describe('Loading State', () => {
    test('shows loading spinner when loading prop is true', () => {
      render(
        <TestWrapper>
          <Button loading>Loading Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // Check for loading spinner (Ant Design Spin component)
      const spinner = button.querySelector('.ant-spin');
      expect(spinner).toBeInTheDocument();
    });

    test('shows custom loading text', () => {
      render(
        <TestWrapper>
          <Button loading loadingText="Processing...">Submit</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Processing...');
    });

    test('prevents click when loading', () => {
      const handleClick = jest.fn();
      render(
        <TestWrapper>
          <Button loading onClick={handleClick}>Loading Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    test('disables button when disabled prop is true', () => {
      render(
        <TestWrapper>
          <Button disabled>Disabled Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('prevents click when disabled', () => {
      const handleClick = jest.fn();
      render(
        <TestWrapper>
          <Button disabled onClick={handleClick}>Disabled Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    test('renders icon on the left by default', () => {
      render(
        <TestWrapper>
          <Button icon={<TestIcon />}>Button with Icon</Button>
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('test-icon');
      const button = screen.getByRole('button');
      
      expect(icon).toBeInTheDocument();
      expect(button).toHaveTextContent('Button with Icon');
    });

    test('renders icon on the right when specified', () => {
      render(
        <TestWrapper>
          <Button icon={<TestIcon />} iconPosition="right">Button with Icon</Button>
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('test-icon');
      expect(icon).toBeInTheDocument();
    });

    test('renders icon-only button', () => {
      render(
        <TestWrapper>
          <Button icon={<TestIcon />} aria-label="Icon button" />
        </TestWrapper>
      );
      
      const button = screen.getByRole('button', { name: /icon button/i });
      const icon = screen.getByTestId('test-icon');
      
      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Full Width', () => {
    test('applies full width styles when fullWidth is true', () => {
      render(
        <TestWrapper>
          <Button fullWidth>Full Width Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Click Handling', () => {
    test('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(
        <TestWrapper>
          <Button onClick={handleClick}>Clickable Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('passes event to onClick handler', () => {
      const handleClick = jest.fn();
      render(
        <TestWrapper>
          <Button onClick={handleClick}>Clickable Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <Button aria-label="Custom label">Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button', { name: /custom label/i });
      expect(button).toBeInTheDocument();
    });

    test('sets aria-disabled when disabled', () => {
      render(
        <TestWrapper>
          <Button disabled>Disabled Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('sets aria-disabled when loading', () => {
      render(
        <TestWrapper>
          <Button loading>Loading Button</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Forward Ref', () => {
    test('forwards ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(
        <TestWrapper>
          <Button ref={ref}>Button with Ref</Button>
        </TestWrapper>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Button with Ref');
    });
  });
});