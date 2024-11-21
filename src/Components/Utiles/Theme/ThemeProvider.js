import React, { useState, useMemo, useEffect, createContext } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import lightTheme from './lightTheme';
import { darkTheme, darkGlobalStyles } from './darkTheme';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // lightTheme por defecto
  const [themeMode, setThemeMode] = useState('light'); 

  useEffect(() => {
    // Si no hay tema en localStorage, guarda 'light' como predeterminado
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
    }
    // Usa el valor de localStorage para establecer el tema (si está definido)
    setThemeMode(localStorage.getItem('theme') || 'light');
  }, []);

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
