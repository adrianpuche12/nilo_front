import React, { useState, useMemo, useEffect, createContext } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import lightTheme from './lightTheme';
import darkTheme from './darkTheme';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Cambiar el estado inicial a 'light' directamente
  const [themeMode, setThemeMode] = useState(() => 'light');

  // Persistir el tema en el localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Seleccionar el tema basado en el valor de themeMode
  const theme = useMemo(() => (themeMode === 'light' ? lightTheme : darkTheme), [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <IconButton onClick={toggleTheme} color="inherit">
          {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
