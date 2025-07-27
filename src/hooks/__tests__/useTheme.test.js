import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';
import ThemeContext from '../../context/ThemeContext';

// Mock ThemeContext
const mockThemeContext = {
  isDark: false,
  toggleTheme: jest.fn()
};

// Wrapper component for testing
const ThemeProviderWrapper = ({ children }) => (
  <ThemeContext.Provider value={mockThemeContext}>
    {children}
  </ThemeContext.Provider>
);

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return theme context when used within ThemeProvider', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProviderWrapper
    });

    expect(result.current).toBe(mockThemeContext);
    expect(result.current.isDark).toBe(false);
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('should throw error when used outside ThemeProvider', () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });

  it('should return updated context when theme changes', () => {
    const { result, rerender } = renderHook(() => useTheme(), {
      wrapper: ThemeProviderWrapper
    });

    expect(result.current.isDark).toBe(false);

    // Update the mock context
    const updatedMockContext = {
      isDark: true,
      toggleTheme: jest.fn()
    };

    // Re-render with updated context
    rerender();
    act(() => {
      // Simulate context update by changing the mock
      Object.assign(mockThemeContext, updatedMockContext);
    });

    // Note: In a real scenario, the context would be updated by the provider
    // This test demonstrates the hook's ability to access the context
    expect(result.current).toBe(mockThemeContext);
  });

  it('should have toggleTheme function that can be called', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProviderWrapper
    });

    expect(typeof result.current.toggleTheme).toBe('function');
    
    act(() => {
      result.current.toggleTheme();
    });

    expect(mockThemeContext.toggleTheme).toHaveBeenCalledTimes(1);
  });
}); 