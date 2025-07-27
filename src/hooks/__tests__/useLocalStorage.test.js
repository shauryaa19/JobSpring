import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../useLocalStorage';

describe('useLocalStorage Hook', () => {
  const TEST_KEY = 'test-key';
  
  beforeEach(() => {
    // Reset localStorage mocks  
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial value'));
    
    expect(result.current[0]).toBe('initial value');
  });

  it('should initialize with value from localStorage when available', () => {
    const storedValue = 'stored value';
    localStorage.setItem(TEST_KEY, JSON.stringify(storedValue));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial value'));
    
    expect(result.current[0]).toBe(storedValue);
  });

  it('should return setValue function', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    
    expect(typeof result.current[1]).toBe('function');
  });

  it('should update value and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('new value'));
  });

  it('should support functional updates', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify(5));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));
    
    act(() => {
      result.current[1]((prevValue) => prevValue + 1);
    });
    
    expect(result.current[0]).toBe(6);
    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(6));
  });

  it('should handle complex objects', () => {
    const complexObject = {
      name: 'John',
      age: 30,
      hobbies: ['reading', 'coding'],
      profile: {
        email: 'john@example.com',
        active: true
      }
    };
    
    localStorage.setItem(TEST_KEY, JSON.stringify(complexObject));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, {}));
    
    expect(result.current[0]).toEqual(complexObject);
    
    const updatedObject = { ...complexObject, age: 31 };
    
    act(() => {
      result.current[1](updatedObject);
    });
    
    expect(result.current[0]).toEqual(updatedObject);
    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(updatedObject));
  });

  it('should handle arrays', () => {
    const initialArray = [1, 2, 3];
    localStorage.setItem(TEST_KEY, JSON.stringify(initialArray));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, []));
    
    expect(result.current[0]).toEqual(initialArray);
    
    act(() => {
      result.current[1]([...initialArray, 4]);
    });
    
    expect(result.current[0]).toEqual([1, 2, 3, 4]);
    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify([1, 2, 3, 4]));
  });

  it('should handle boolean values', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify(true));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, false));
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1](false);
    });
    
    expect(result.current[0]).toBe(false);
    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(false));
  });

  it('should handle null and undefined values', () => {
    // Test null
    localStorage.setItem(TEST_KEY, JSON.stringify(null));
    
    const { result: nullResult } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    expect(nullResult.current[0]).toBe(null);
    
    // Test undefined
    localStorage.clear();
    const { result: undefinedResult } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    expect(undefinedResult.current[0]).toBe('default');
  });

  it('should handle parsing errors gracefully', () => {
    // Mock invalid JSON
    localStorage.setItem(TEST_KEY, 'invalid json {');
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    
    expect(result.current[0]).toBe('default');
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should support function as initial value', () => {
    const initialValueFunction = jest.fn(() => 'computed initial value');
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialValueFunction));
    
    expect(result.current[0]).toBe('computed initial value');
    expect(initialValueFunction).toHaveBeenCalledTimes(1);
  });

  it('should handle large data structures', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      data: `Data for item ${i}`
    }));
    
    localStorage.setItem(TEST_KEY, JSON.stringify(largeArray));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, []));
    
    expect(result.current[0]).toEqual(largeArray);
    expect(result.current[0]).toHaveLength(1000);
  });

  it('should handle empty string as valid value', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify(''));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    
    expect(result.current[0]).toBe('');
  });

  it('should handle zero as valid value', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify(0));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 100));
    
    expect(result.current[0]).toBe(0);
  });

  it('should work with nested functional updates', () => {
    const initialState = { count: 0, items: [] };
    localStorage.setItem(TEST_KEY, JSON.stringify(initialState));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialState));
    
    act(() => {
      result.current[1](prev => ({
        ...prev,
        count: prev.count + 1,
        items: [...prev.items, 'new item']
      }));
    });
    
    expect(result.current[0]).toEqual({
      count: 1,
      items: ['new item']
    });
  });

  it('should handle multiple keys independently', () => {
    const key1 = 'key1';
    const key2 = 'key2';
    
    localStorage.setItem(key1, JSON.stringify('value1'));
    localStorage.setItem(key2, JSON.stringify('value2'));
    
    const { result: result1 } = renderHook(() => useLocalStorage(key1, 'default1'));
    const { result: result2 } = renderHook(() => useLocalStorage(key2, 'default2'));
    
    expect(result1.current[0]).toBe('value1');
    expect(result2.current[0]).toBe('value2');
  });

  it('should handle rapid updates', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));
    
    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3);
    });
    
    expect(result.current[0]).toBe(3);
  });

  it('should handle removal of items', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify('stored value'));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    
    expect(result.current[0]).toBe('stored value');
    
    // Simulate item removal
    localStorage.removeItem(TEST_KEY);
    
    // Re-render should use default value
    const { result: newResult } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    expect(newResult.current[0]).toBe('default');
  });

  it('should handle localStorage clear', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify('stored value'));
    
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    
    expect(result.current[0]).toBe('stored value');
    
    // Clear localStorage
    localStorage.clear();
    
    // Re-render should use default value
    const { result: newResult } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    expect(newResult.current[0]).toBe('default');
  });
}); 
