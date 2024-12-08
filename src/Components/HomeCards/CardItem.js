import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import GenericButton from '../Utiles/GenericButton';

// Función para truncar texto si excede los 40 caracteres
const truncateText = (text, maxLength = 40) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const CardItem = ({ title, image, description, actionLabel, sx }) => {
  return (
    <Card
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '16px',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: '100%',
          height: '200px', // Aumentamos la altura de la imagen
          objectFit: 'cover',
          borderRadius: '8px', // Aquí se agrega el borde redondeado
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center', // Centra los elementos en el eje horizontal
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.2rem' },
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis', // Trunca el texto que excede el contenedor
            whiteSpace: 'nowrap', // Asegura que el texto no se rompa en varias líneas
            maxHeight: '3.6em', // Limita la altura para que el texto se trunque si es necesario
          }}
        >
          {truncateText(title)} {/* Truncamos el título */}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.8rem', sm: '1rem' },
            marginTop: '8px',
            textAlign: 'justify',
            overflow: 'hidden',
            textOverflow: 'ellipsis', // Trunca el texto que excede el contenedor
            whiteSpace: 'nowrap', // Evita que se parta el texto
            maxHeight: '3em', // Controla la altura máxima para evitar desbordes
          }}
        >
          {truncateText(description)} {/* Truncamos la descripción */}
        </Typography>

        {/* Contenedor Box para centrar el botón */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Centra el botón horizontalmente
            width: '100%', // Asegura que el contenedor ocupe todo el ancho disponible
          }}
        >
          <GenericButton
            text={actionLabel}
            variant="contained"
            color="info"
            sx={{
              marginTop: '12px',
              fontSize: { xs: '0.7rem', sm: '0.9rem' },
              width: '150px', // Ancho fijo para el botón
              height: '40px', // Altura fija para el botón
              // textTransform: 'none', // Evita que el texto se transforme a mayúsculas automáticamente
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardItem;
