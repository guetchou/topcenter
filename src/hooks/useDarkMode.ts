import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface UseDarkModeOutput {
  isDarkMode: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useDarkMode(defaultTheme: Theme = 'system'): UseDarkModeOutput {
  // Get stored theme from localStorage or use defaultTheme
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      return storedTheme || defaultTheme;
    }
    return defaultTheme;
  });

  // Boolean to indicate if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // If theme is 'system', check system preference
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      // Otherwise just check if theme is 'dark'
      return theme === 'dark';
    }
    return false;
  });

  // Effect to update theme when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      const applyTheme = (newTheme: Theme) => {
        root.classList.remove('light', 'dark');
        
        if (newTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
          setIsDarkMode(systemTheme === 'dark');
        } else {
          root.classList.add(newTheme);
          setIsDarkMode(newTheme === 'dark');
        }
      };
      
      applyTheme(theme);
      localStorage.setItem('theme', theme);
      
      // Listen for changes in system preferences
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (theme === 'system') {
          applyTheme('system');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Function to set theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // Function to toggle between light/dark/system
  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  }, []);

  return { isDarkMode, theme, setTheme, toggleTheme };
}

export default useDarkMode;
