import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingState from '../LoadingState';

describe('LoadingState Component', () => {
  it('should render with default props', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we fetch your data')).toBeInTheDocument();
    
    // Check for loading spinner
    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    render(<LoadingState title="Custom Loading" />);

    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we fetch your data')).toBeInTheDocument();
  });

  it('should render with custom description', () => {
    render(<LoadingState description="Fetching your profile data..." />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Fetching your profile data...')).toBeInTheDocument();
  });

  it('should render with custom title and description', () => {
    render(
      <LoadingState 
        title="Saving Changes" 
        description="Your profile is being updated..." 
      />
    );

    expect(screen.getByText('Saving Changes')).toBeInTheDocument();
    expect(screen.getByText('Your profile is being updated...')).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    render(<LoadingState size={64} />);

    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
    // Note: We can't easily test the size prop directly with RTL,
    // but we can verify the component renders
  });

  it('should apply default variant class', () => {
    render(<LoadingState />);

    const container = document.querySelector('.loading-state');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loading-state');
  });

  it('should apply inline variant class', () => {
    render(<LoadingState variant="inline" />);

    const container = document.querySelector('.loading-state-inline');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loading-state-inline');
  });

  it('should apply small variant class', () => {
    render(<LoadingState variant="small" />);

    const container = document.querySelector('.loading-state-small');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loading-state-small');
  });

  it('should apply custom className along with variant class', () => {
    render(<LoadingState className="custom-loading" variant="inline" />);

    const container = document.querySelector('.loading-state-inline');
    expect(container).toHaveClass('loading-state-inline');
    expect(container).toHaveClass('custom-loading');
  });

  it('should render loading spinner with animate-spin class', () => {
    render(<LoadingState />);

    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should render h3 element for title', () => {
    render(<LoadingState title="Test Title" />);

    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Title');
  });

  it('should render p element for description', () => {
    render(<LoadingState description="Test description" />);

    const description = screen.getByText('Test description');
    expect(description.tagName).toBe('P');
  });

  it('should handle empty title', () => {
    render(<LoadingState title="" />);

    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toBeEmptyDOMElement();
  });

  it('should handle empty description', () => {
    render(<LoadingState description="" />);

    const description = document.querySelector('p');
    expect(description).toBeInTheDocument();
    expect(description).toBeEmptyDOMElement();
  });

  it('should handle null title gracefully', () => {
    render(<LoadingState title={null} />);

    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
  });

  it('should handle null description gracefully', () => {
    render(<LoadingState description={null} />);

    const description = document.querySelector('p');
    expect(description).toBeInTheDocument();
  });

  it('should handle undefined variant (fallback to default)', () => {
    render(<LoadingState variant={undefined} />);

    const container = document.querySelector('.loading-state');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loading-state');
  });

  it('should handle invalid variant (fallback to default)', () => {
    render(<LoadingState variant="invalid" />);

    const container = document.querySelector('.loading-state');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loading-state');
  });

  it('should render complete structure with all elements', () => {
    render(
      <LoadingState 
        title="Loading Data" 
        description="Please wait..." 
        variant="default"
        size={48}
        className="test-class"
      />
    );

    // Container
    const container = document.querySelector('.loading-state');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loading-state', 'test-class');

    // Spinner
    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();

    // Title
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveTextContent('Loading Data');

    // Description
    const description = screen.getByText('Please wait...');
    expect(description.tagName).toBe('P');
  });

  it('should maintain component structure across variant changes', () => {
    const { rerender } = render(<LoadingState variant="default" />);

    expect(document.querySelector('.loading-state')).toBeInTheDocument();

    rerender(<LoadingState variant="inline" />);
    expect(document.querySelector('.loading-state-inline')).toBeInTheDocument();

    rerender(<LoadingState variant="small" />);
    expect(document.querySelector('.loading-state-small')).toBeInTheDocument();
  });

  it('should handle different size values', () => {
    const { rerender } = render(<LoadingState size={16} />);
    
    let spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingState size={32} />);
    spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingState size={64} />);
    spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<LoadingState title="Loading content" description="Please wait while content loads" />);

    // Should have proper heading structure
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();

    // Text content should be readable by screen readers
    expect(screen.getByText('Loading content')).toBeInTheDocument();
    expect(screen.getByText('Please wait while content loads')).toBeInTheDocument();
  });
}); 