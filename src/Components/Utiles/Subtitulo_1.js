import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

function Subtitulo_1({
  text,
  color = 'textPrimary',
  align = 'left',
  fontSize = '1.25rem', 
  fontWeight = '600', 
  sx = {}, // Estilos adicionales
  ariaLabel = '',
}) {
  return (
    <Typography
      variant="h6"
      color={color}
      align={align}
      sx={{
        fontSize,       
        fontWeight,      
        lineHeight: 1.5, 
        letterSpacing: '0.5px', 
        ...sx,           // Estilos adicionales personalizados
      }}
      aria-label={ariaLabel || text} 
    >
      {text}
    </Typography>
  );
}

Subtitulo_1.propTypes = {
  text: PropTypes.string.isRequired,    // Texto del subtítulo, obligatorio
  color: PropTypes.string,              
  align: PropTypes.oneOf(['inherit', 'left', 'center', 'right', 'justify']), // Alineación
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  sx: PropTypes.object,                 
  ariaLabel: PropTypes.string,          
};

export default Subtitulo_1;
