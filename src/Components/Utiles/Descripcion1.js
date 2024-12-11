import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@mui/material';

function Descripcion1({ text, margin, align }) {
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
        textAlign: align, // Alineación del texto (centrado o cualquier valor)
      }}
    >
      {text}
    </Typography>
  );
}

Descripcion1.propTypes = {
  text: PropTypes.string.isRequired, // Contenido de la descripción
  margin: PropTypes.string,           // Margen ajustable
  align: PropTypes.string,            // Alineación del texto (center, left, right)
};

Descripcion1.defaultProps = {
  margin: '16px 0', // Margen predeterminado
  align: 'left',    // Alineación predeterminada
};

export default Descripcion1;
