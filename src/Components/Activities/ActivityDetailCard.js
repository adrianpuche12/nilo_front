import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ActivityDetailCard = ({ activity }) => {
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
        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Detalles de la Actividad
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">
            <strong>Nombre:</strong> {activity.name}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Lugar:</strong> {activity.location}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Duración:</strong> {activity.duration}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Tipo:</strong> {activity.type}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Costo:</strong> {activity.cost}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Recomendaciones:</strong> {activity.recommendations}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Descripción:</strong> {activity.description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityDetailCard;
