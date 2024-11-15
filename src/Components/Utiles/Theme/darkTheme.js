// src/Utiles/Theme/darkTheme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Activar modo oscuro
    primary: {
      main: '#90caf9', // Azul claro para elementos principales
    },
    secondary: {
      main: '#f48fb1', // Rosa tenue para elementos secundarios
    },
    background: {
      default: '#121212', // Gris oscuro para fondo general
      paper: '#1e1e1e', // Gris ligeramente más claro para tarjetas y paneles
    },
    text: {
      primary: '#e0e0e0', // Gris claro para el texto principal
      secondary: '#bdbdbd', // Gris medio para el texto secundario
    },
  },  
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#212121', // Fondo oscuro para AppBar
        },
      },
    },    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e', // Fondo para tarjetas
          color: '#e0e0e0', // Texto de las tarjetas
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#e0e0e0', // Color del texto de las pestañas
          '&.Mui-selected': {
            color: '#90caf9', // Color azul claro para la pestaña seleccionada
          },
        },
      },
    },
  },
});

export default darkTheme;
