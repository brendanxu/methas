import { render, screen } from '@testing-library/react'

// Simple test component
const SimpleButton = ({ children, ...props }: any) => (
  <button {...props}>{children}</button>
)

describe('Basic Component Tests', () => {
  it('renders a simple button', () => {
    render(<SimpleButton>Click me</SimpleButton>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<SimpleButton disabled>Disabled Button</SimpleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('applies custom classes', () => {
    render(<SimpleButton className="custom-class">Styled Button</SimpleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})