// nilo_proyect_front/src/Components/Utiles/Descripcion_1.js

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@mui/material';

function Descripcion1({ text, margin }) {
  const theme = useTheme();

  return (
    <Typography
      variant="body1" 
      color={theme.palette.text.primary} // Color predeterminado del texto
      sx={{
        margin: margin || theme.spacing(2), // Margen ajustable
        fontSize: {
          xs: '0.875rem', // Tamaño para pantallas pequeñas
          sm: '1rem',     // Tamaño para pantallas medianas
          md: '1.125rem',  // Tamaño para pantallas grandes
        },
        lineHeight: 1.5, // Ajuste de línea para mejor legibilidad
      }}
    >
      {text}
    </Typography>
  );
}

Descripcion1.propTypes = {
  text: PropTypes.string.isRequired, // Contenido de la descripción
  margin: PropTypes.string,           // Margen ajustable
};

Descripcion1.defaultProps = {
  margin: '16px 0', // Margen predeterminado
};

export default Descripcion1;
