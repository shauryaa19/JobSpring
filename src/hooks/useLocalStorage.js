import { useState, useRef, useCallback } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Use a ref to track the current value for functional updates
  const currentValueRef = useRef();
  
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      if (item === null || item === undefined) {
        const value = typeof initialValue === 'function' ? initialValue() : initialValue;
        currentValueRef.current = value;
        return value;
      }
      
      const parsedValue = JSON.parse(item);
      currentValueRef.current = parsedValue;
      return parsedValue;
    } catch (error) {
      console.error(`useLocalStorage - Error reading "${key}" from localStorage:`, error);
      const value = typeof initialValue === 'function' ? initialValue() : initialValue;
      currentValueRef.current = value;
      return value;
    }
  });

  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(currentValueRef.current) : value;
      
      // Update the ref immediately
      currentValueRef.current = valueToStore;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`useLocalStorage - Error saving "${key}" to localStorage:`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage; 