import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('hz_theme');
    return saved !== null ? saved === 'dark' : true; // default dark
  });

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    localStorage.setItem('hz_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#07091a';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.style.backgroundColor = '#f8fafc'; // Default light surface background
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
