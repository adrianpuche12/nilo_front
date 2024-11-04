import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@mui/material';

function Subtitulo_1({ text, color, margin, align, variant }) {
  const theme = useTheme();

  return (
    <Typography
      variant={variant}
      color={color}
      sx={{
        margin,
        textAlign: align,
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
  color: PropTypes.string,               // Color del texto
  margin: PropTypes.string,              // Margen
  align: PropTypes.string,               // Alineación (left, center, right)
  variant: PropTypes.string,             // Variante de Typography
};

Subtitulo_1.defaultProps = {
  color: 'text.primary',       // Color predeterminado del tema
  margin: '16px 0',            // Margen predeterminado
  align: 'left',               // Alineación predeterminada
  variant: 'h6',               // Variante predeterminada
};

export default Subtitulo_1;
