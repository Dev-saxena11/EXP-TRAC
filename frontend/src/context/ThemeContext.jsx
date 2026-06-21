import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('app-accent-color') || 'teal');
  const [background, setBackground] = useState(() => localStorage.getItem('app-background') || 'none');

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    localStorage.setItem('app-accent-color', accentColor);
    localStorage.setItem('app-background', background);

    const root = document.documentElement;
    const body = document.body;
    
    // Manage dark mode class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Manage accent color classes
    const colors = ['theme-teal', 'theme-blue', 'theme-purple', 'theme-orange'];
    colors.forEach(c => root.classList.remove(c));
    root.classList.add(`theme-${accentColor}`);

    // Apply animated background directly to body (cleanest approach, no z-index issues)
    body.classList.remove('bg-waves', 'bg-fluid');
    if (background === 'waves') {
      body.classList.add('bg-waves');
    } else if (background === 'fluid') {
      body.classList.add('bg-fluid');
    }

  }, [theme, accentColor, background]);

  const value = {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    background,
    setBackground
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
