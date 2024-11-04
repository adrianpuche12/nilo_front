import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@mui/material';

function Subtitulo_1({ text, color, margin, align, variant }) {
  const theme = useTheme();

  return (
    <Typography
      variant={variant || 'h6'}
      color={color || theme.palette.text.primary}
      sx={{
        margin: margin || theme.spacing(2, 0),
        textAlign: align || 'left',
        fontSize: {
          xs: '1.25rem',  // Tamaño para pantallas pequeñas
          sm: '1.5rem',    // Tamaño para pantallas medianas
          md: '1.75rem',   // Tamaño para pantallas grandes
        },
        fontWeight: theme.typography.fontWeightMedium,
      }}
    >
      {text}
    </Typography>
  );
}

Subtitulo_1.propTypes = {
  text: PropTypes.string.isRequired,     // Contenido del subtítulo
  color: PropTypes.string,               // Color opcional del texto
  margin: PropTypes.string,              // Margen opcional
  align: PropTypes.string,               // Alineación opcional (left, center, right)
  variant: PropTypes.string,             // Variante de Typography (opcional)
};

export default Subtitulo_1;
