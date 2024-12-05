// nilo_proyect_front/src/Components/Utiles/Descripcion_2.js

import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@mui/material';

function Descripcion2({ text, fontSize, fontWeight, margin }) {
  const theme = useTheme();

  return (
    <Typography
      variant="body2" 
      color={theme.palette.text.primary}
      sx={{
        margin: margin || theme.spacing(2), // Margen ajustable
        fontSize: fontSize || {
          xs: '0.875rem', // Tamaño para pantallas pequeñas
          sm: '1rem',     // Tamaño para pantallas medianas
          md: '1.125rem', // Tamaño para pantallas grandes
        },
        fontWeight: fontWeight || theme.typography.fontWeightRegular, // Peso de fuente ajustable
        lineHeight: 1.75, // Espaciado de línea para textos largos
      }}
    >
      {text}
    </Typography>
  );
}

Descripcion2.propTypes = {
  text: PropTypes.string.isRequired,    // Contenido de la descripción
  fontSize: PropTypes.oneOfType([       // Tamaño de fuente ajustable
    PropTypes.string,
    PropTypes.object,
  ]),
  fontWeight: PropTypes.oneOfType([     // Peso de fuente ajustable
    PropTypes.string,
    PropTypes.number,
  ]),
  margin: PropTypes.string,             // Margen ajustable
};

Descripcion2.defaultProps = {
  margin: '16px 0', // Margen predeterminado
};

export default Descripcion2;
