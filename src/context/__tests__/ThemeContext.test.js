import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../ThemeContext';
import { useTheme } from '../../hooks/useTheme';

// Test component to use the theme context
const TestComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-status">
        {isDark ? 'dark' : 'light'}
      </span>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Reset localStorage mocks
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should provide default theme (light)', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('should load dark theme from localStorage', () => {
    localStorage.setItem('darkMode', JSON.stringify(true));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('should load light theme from localStorage', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('should toggle theme from light to dark', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    expect(localStorage.getItem('darkMode')).toBe(JSON.stringify(true));
  });

  it('should toggle theme from dark to light', () => {
    localStorage.setItem('darkMode', JSON.stringify(true));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    expect(localStorage.getItem('darkMode')).toBe(JSON.stringify(false));
  });

  it('should save theme changes to localStorage', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(localStorage.getItem('darkMode')).toBe(JSON.stringify(true));
  });

  it('should apply theme-light class to body by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.body).toHaveClass('theme-light');
    expect(document.body).not.toHaveClass('theme-dark');
  });

  it('should apply theme-dark class to body when dark theme is active', () => {
    localStorage.setItem('darkMode', JSON.stringify(true));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.body).toHaveClass('theme-dark');
    expect(document.body).not.toHaveClass('theme-light');
  });

  it('should update body class when theme is toggled', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.body).toHaveClass('theme-light');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(document.body).toHaveClass('theme-dark');
    expect(document.body).not.toHaveClass('theme-light');
  });

  it('should clean up body classes when switching themes', () => {
    localStorage.setItem('darkMode', JSON.stringify(true));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.body).toHaveClass('theme-dark');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(document.body).toHaveClass('theme-light');
    expect(document.body).not.toHaveClass('theme-dark');
  });

  it('should work with multiple theme consumers', () => {
    const SecondTestComponent = () => {
      const { isDark } = useTheme();
      return <div data-testid="second-component">{isDark ? 'dark' : 'light'}</div>;
    };

    localStorage.setItem('darkMode', JSON.stringify(false));

    render(
      <ThemeProvider>
        <TestComponent />
        <SecondTestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    expect(screen.getByTestId('second-component')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    expect(screen.getByTestId('second-component')).toHaveTextContent('dark');
  });

  it('should handle rapid theme toggles', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');

    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('should maintain theme state across re-renders', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));

    const { rerender } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('toggle-theme'));

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');

    rerender(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('should use correct localStorage key', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(localStorage.getItem('darkMode')).toBe(JSON.stringify(false));
  });
}); 
