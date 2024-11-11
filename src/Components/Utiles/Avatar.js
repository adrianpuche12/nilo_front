// nilo_proyect_front/src/Components/Utiles/Avatar.js

import React from 'react';
import PropTypes from 'prop-types';
import { Avatar as MUIAvatar, useTheme } from '@mui/material';

function Avatar({ src, alt, size, fallbackText }) {
  const theme = useTheme();

  return (
    <MUIAvatar
      src={src} // Imagen de usuario si está disponible
      alt={alt || 'Avatar'} // Texto alternativo
      sx={{
        width: size || theme.spacing(7), 
        height: size || theme.spacing(7), 
        bgcolor: theme.palette.primary.main, // Fondo para avatar sin imagen
        fontSize: {
          xs: '1rem',
          sm: '1.25rem',
          md: '1.5rem',
        },
      }}
    >
      {!src && fallbackText} {/* Texto de reemplazo si no hay imagen */}
    </MUIAvatar>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,           // URL de la imagen
  alt: PropTypes.string,           // Texto alternativo
  size: PropTypes.oneOfType([      // Tamaño del avatar
    PropTypes.string,
    PropTypes.number,
  ]),
  fallbackText: PropTypes.string,  // Texto de reemplazo si no hay imagen
};

Avatar.defaultProps = {
  alt: 'User Avatar',
  fallbackText: 'U',  // Texto predeterminado si no hay imagen
};

export default Avatar;
