import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Search, Download } from 'lucide-react';
import Button from '../Button';

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-medium');
  });

  it('should apply secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-secondary', 'btn-medium');
  });

  it('should apply ghost variant when specified', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-ghost', 'btn-medium');
  });

  it('should apply small size when specified', () => {
    render(<Button size="small">Small Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-small');
  });

  it('should apply large size when specified', () => {
    render(<Button size="large">Large Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-large');
  });

  it('should apply medium size by default', () => {
    render(<Button>Medium Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-medium');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should be disabled when loading', () => {
    const handleClick = jest.fn();
    render(<Button isLoading onClick={handleClick}>Loading Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading spinner when loading', () => {
    render(<Button isLoading>Loading Button</Button>);
    
    // Check for the loading icon (Loader2 with animate-spin class)
    const loadingIcon = document.querySelector('svg.animate-spin');
    expect(loadingIcon).toBeInTheDocument();
  });

  it('should render icon on the left by default', () => {
    render(<Button icon={<Search data-testid="search-icon" />}>Search</Button>);
    
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('search-icon');
    const text = screen.getByText('Search');
    
    expect(button).toContainElement(icon);
    expect(button).toContainElement(text);
    
    // Icon should come before text in DOM order
    const buttonChildren = Array.from(button.children);
    const iconIndex = buttonChildren.findIndex(child => child.contains(icon));
    const textIndex = buttonChildren.findIndex(child => child.contains(text));
    
    expect(iconIndex).toBeLessThan(textIndex);
  });

  it('should render icon on the right when specified', () => {
    render(
      <Button 
        icon={<Download data-testid="download-icon" />} 
        iconPosition="right"
      >
        Download
      </Button>
    );
    
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('download-icon');
    const text = screen.getByText('Download');
    
    expect(button).toContainElement(icon);
    expect(button).toContainElement(text);
    
    // Text should come before icon in DOM order
    const buttonChildren = Array.from(button.children);
    const iconIndex = buttonChildren.findIndex(child => child.contains(icon));
    const textIndex = buttonChildren.findIndex(child => child.contains(text));
    
    expect(textIndex).toBeLessThan(iconIndex);
  });

  it('should prioritize loading spinner over custom icon', () => {
    render(
      <Button 
        isLoading 
        icon={<Search data-testid="search-icon" />}
      >
        Loading
      </Button>
    );
    
    // Should show loading spinner
    const loadingIcon = document.querySelector('svg.animate-spin');
    expect(loadingIcon).toBeInTheDocument();
    
    // Should not show custom icon
    expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-medium'); // Should still have default classes
  });

  it('should set button type correctly', () => {
    render(<Button type="submit">Submit Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should default to button type', () => {
    render(<Button>Default Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should pass through additional props', () => {
    render(
      <Button 
        data-testid="test-button" 
        aria-label="Test button"
        title="Button title"
      >
        Test Button
      </Button>
    );
    
    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'Test button');
    expect(button).toHaveAttribute('title', 'Button title');
  });

  it('should handle icon without children', () => {
    render(<Button icon={<Search data-testid="search-icon" />} />);
    
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('search-icon');
    
    expect(button).toContainElement(icon);
  });

  it('should handle children without icon', () => {
    render(<Button>Text Only Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Text Only Button');
  });

  it('should handle empty button', () => {
    render(<Button />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeEmptyDOMElement();
  });

  it('should combine all size and variant classes correctly', () => {
    const { rerender } = render(
      <Button variant="secondary" size="large">
        Large Secondary Button
      </Button>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-secondary', 'btn-large');
    
    rerender(
      <Button variant="ghost" size="small">
        Small Ghost Button
      </Button>
    );
    
    button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-ghost', 'btn-small');
  });

  it('should handle complex icon scenarios', () => {
    const { rerender } = render(
      <Button 
        icon={<Search data-testid="search-icon" />}
        iconPosition="left"
        isLoading={false}
      >
        Search
      </Button>
    );
    
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-icon')).not.toBeInTheDocument();
    
    // Switch to loading
    rerender(
      <Button 
        icon={<Search data-testid="search-icon" />}
        iconPosition="left"
        isLoading={true}
      >
        Search
      </Button>
    );
    
    expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument();
    expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('should not break with undefined icon', () => {
    render(<Button icon={undefined}>Button with undefined icon</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Button with undefined icon');
  });

  it('should handle multiple rapid clicks when not disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
}); 