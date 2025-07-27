import React, { createContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { THEME_CONSTANTS } from '../data/ui';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useLocalStorage(THEME_CONSTANTS.localStorageKey, THEME_CONSTANTS.defaultTheme);

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(isDark ? 'theme-dark' : 'theme-light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 