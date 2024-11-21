import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ItineraryDetailCard = ({ itinerary }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'background.paper',
        maxWidth: 500,
        margin: 'auto',
        mt: 5,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Detalles del Itinerario
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">
            <strong>Fecha:</strong> {itinerary.date}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Lugar:</strong> {itinerary.location}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Actividades Incluidas:</strong> {itinerary.activities.join(', ')}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Precio:</strong> {itinerary.price}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Duración:</strong> {itinerary.duration}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Descripción:</strong> {itinerary.description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ItineraryDetailCard;
