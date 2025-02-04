import React, { useState, useMemo, useEffect, createContext } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import lightTheme from './lightTheme';
import { darkTheme, darkGlobalStyles } from './darkTheme';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // lightTheme por defecto
  const initialTheme = localStorage.getItem('theme') || 'light';
  const [themeMode, setThemeMode] = useState(initialTheme);

  // Persistir el tema en el localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (themeMode === 'light' ? lightTheme : darkTheme), [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {themeMode === 'dark' && darkGlobalStyles}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
