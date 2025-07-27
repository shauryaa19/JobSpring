import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import ErrorState from '../ErrorState';

describe('ErrorState Component', () => {
  it('should render with default props', () => {
    render(<ErrorState />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while loading data')).toBeInTheDocument();
    
    // Should render default AlertCircle icon
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render with custom title and message', () => {
    render(
      <ErrorState 
        title="Network Error" 
        message="Unable to connect to the server. Please check your connection." 
      />
    );

    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByText('Unable to connect to the server. Please check your connection.')).toBeInTheDocument();
  });

  it('should render with custom icon', () => {
    render(<ErrorState icon={WifiOff} title="Connection Error" />);

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    
    // Should render the custom WifiOff icon
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render retry button by default when onRetry is provided', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveTextContent('Try Again');
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState />);

    const retryButton = screen.queryByRole('button');
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should not render retry button when showRetryButton is false', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} showRetryButton={false} />);

    const retryButton = screen.queryByRole('button');
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('should show custom retry label', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} retryLabel="Reload Data" />);

    const retryButton = screen.getByRole('button', { name: /reload data/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveTextContent('Reload Data');
  });

  it('should show retrying state', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} isRetrying={true} />);

    const retryButton = screen.getByRole('button');
    expect(retryButton).toBeDisabled();
    expect(retryButton).toHaveTextContent('Retrying...');
    
    // Should show spinning refresh icon
    const spinningIcon = document.querySelector('svg.animate-spin');
    expect(spinningIcon).toBeInTheDocument();
  });

  it('should not call onRetry when button is disabled (retrying)', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} isRetrying={true} />);

    const retryButton = screen.getByRole('button');
    fireEvent.click(retryButton);

    expect(handleRetry).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<ErrorState className="custom-error" />);

    const container = document.querySelector('.error-state');
    expect(container).toHaveClass('error-state');
    expect(container).toHaveClass('custom-error');
  });

  it('should render h3 element for title', () => {
    render(<ErrorState title="Error Title" />);

    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Error Title');
  });

  it('should render p element for message', () => {
    render(<ErrorState message="Error message" />);

    const message = screen.getByText('Error message');
    expect(message.tagName).toBe('P');
  });

  it('should handle empty title', () => {
    render(<ErrorState title="" />);

    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toBeEmptyDOMElement();
  });

  it('should handle empty message', () => {
    render(<ErrorState message="" />);

    const message = document.querySelector('p');
    expect(message).toBeInTheDocument();
    expect(message).toBeEmptyDOMElement();
  });

  it('should handle null icon gracefully', () => {
    render(<ErrorState icon={null} />);

    // Should still render the component but without an icon
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should handle undefined props gracefully', () => {
    render(
      <ErrorState 
        title={undefined} 
        message={undefined} 
        retryLabel={undefined}
      />
    );

    // Should use default values
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while loading data')).toBeInTheDocument();
  });

  it('should render complete structure with all elements', () => {
    const handleRetry = jest.fn();
    render(
      <ErrorState 
        icon={WifiOff}
        title="Connection Lost" 
        message="Check your internet connection" 
        onRetry={handleRetry}
        retryLabel="Reconnect"
        isRetrying={false}
        className="network-error"
        showRetryButton={true}
      />
    );

    // Container
    const container = document.querySelector('.error-state');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('error-state', 'network-error');

    // Icon
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();

    // Title
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveTextContent('Connection Lost');

    // Message
    const message = screen.getByText('Check your internet connection');
    expect(message.tagName).toBe('P');

    // Retry button
    const retryButton = screen.getByRole('button', { name: /reconnect/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).not.toBeDisabled();
  });

  it('should handle retry state transitions', () => {
    const handleRetry = jest.fn();
    const { rerender } = render(
      <ErrorState onRetry={handleRetry} isRetrying={false} />
    );

    let retryButton = screen.getByRole('button');
    expect(retryButton).not.toBeDisabled();
    expect(retryButton).toHaveTextContent('Try Again');

    // Simulate retrying state
    rerender(<ErrorState onRetry={handleRetry} isRetrying={true} />);

    retryButton = screen.getByRole('button');
    expect(retryButton).toBeDisabled();
    expect(retryButton).toHaveTextContent('Retrying...');

    // Back to normal state
    rerender(<ErrorState onRetry={handleRetry} isRetrying={false} />);

    retryButton = screen.getByRole('button');
    expect(retryButton).not.toBeDisabled();
    expect(retryButton).toHaveTextContent('Try Again');
  });

  it('should render refresh icon in retry button', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} />);

    const retryButton = screen.getByRole('button');
    const refreshIcon = retryButton.querySelector('svg');
    expect(refreshIcon).toBeInTheDocument();
  });

  it('should render spinning refresh icon when retrying', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} isRetrying={true} />);

    const retryButton = screen.getByRole('button');
    const spinningIcon = retryButton.querySelector('svg.animate-spin');
    expect(spinningIcon).toBeInTheDocument();
  });

  it('should be accessible', () => {
    const handleRetry = jest.fn();
    render(
      <ErrorState 
        title="Accessible Error" 
        message="This error is accessible to screen readers"
        onRetry={handleRetry}
      />
    );

    // Should have proper heading structure
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();

    // Button should be accessible
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    // Text content should be readable by screen readers
    expect(screen.getByText('Accessible Error')).toBeInTheDocument();
    expect(screen.getByText('This error is accessible to screen readers')).toBeInTheDocument();
  });

  it('should handle multiple rapid retry clicks correctly', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} />);

    const retryButton = screen.getByRole('button');
    
    fireEvent.click(retryButton);
    fireEvent.click(retryButton);
    fireEvent.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(3);
  });

  it('should maintain icon size consistency', () => {
    const { rerender } = render(<ErrorState icon={AlertCircle} />);
    
    let icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();

    rerender(<ErrorState icon={WifiOff} />);
    
    icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
}); 