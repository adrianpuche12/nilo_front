import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

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
      paper: '#424242', // Gris más claro para tarjetas y paneles
    },
    text: {
      primary: '#e0e0e0', // Gris claro para el texto principal
      secondary: '#99BBDD', // Gris tenue para texto secundario
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
          backgroundColor: '#424242', // Fondo gris claro dinámico para tarjetas
          color: '#e0e0e0', // Texto claro en las tarjetas
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242', // Fondo gris para las tarjetas
          color: '#e0e0e0', // Texto claro en las tarjetas
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#bdbdbd', // Color de texto no seleccionado
          '&.Mui-selected': {
            color: '#90caf9', // Azul claro para pestaña seleccionada
          },
        },
      },
    },
  },
});

const darkGlobalStyles = (
  <GlobalStyles
    styles={{
      body: {
        backgroundColor: '#121212', // Fondo general del body
        color: '#e0e0e0', // Color de texto en el modo oscuro
      },
      '.MuiCard-root': {
        backgroundColor: '#424242', // Fondo para todas las tarjetas
      },
    }}
  />
);

export { darkTheme, darkGlobalStyles };
