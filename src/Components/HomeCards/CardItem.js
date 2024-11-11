// src/components/HomeCards/CardItem.js

// Representacion de una tarjeta individual

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const CardItem = ({ title, image, description, actionLabel }) => (
  <Card sx={{ maxWidth: 420, margin: 9 }}>
    <CardMedia component="img" height="180" image={image} alt={title} />
    <CardContent>
      <Typography variant="h5" component="div">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Button size="small">{actionLabel}</Button>      
    </CardContent>
  </Card>
);

export default CardItem;
