// nilo_proyect_front/src/Components/Utiles/Subtitulo_2.js

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@mui/material';

function Subtitulo2({ text, color, margin, align, variant }) {
  const theme = useTheme();

  return (
    <Typography
      variant={variant || 'subtitle1'}
      color={color || theme.palette.text.secondary}
      sx={{
        margin: margin || theme.spacing(1.5, 0),  // Margen más pequeño que Subtitulo_1
        textAlign: align || 'left',
        fontSize: {
          xs: '1rem',     // Tamaño para pantallas pequeñas
          sm: '1.125rem', // Tamaño para pantallas medianas
          md: '1.25rem',  // Tamaño para pantallas grandes
        },
        fontWeight: theme.typography.fontWeightRegular,
      }}
    >
      {text}
    </Typography>
  );
}

Subtitulo2.propTypes = {
  text: PropTypes.string.isRequired,     // Contenido del subtítulo
  color: PropTypes.string,               // Color del texto
  margin: PropTypes.string,              // Margen
  align: PropTypes.string,               // Alineación (left, center, right)
  variant: PropTypes.string,             // Variante de Typography
};

Subtitulo2.defaultProps = {
  color: 'text.secondary',               // Color predeterminado del tema para subtítulos secundarios
  margin: '12px 0',                      // Margen predeterminado, más pequeño que Subtitulo_1
  align: 'left',                         // Alineación predeterminada
  variant: 'subtitle1',                  // Variante predeterminada para subtítulos secundarios
};

export default Subtitulo2;
