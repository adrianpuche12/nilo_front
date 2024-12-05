// src/components/HomeCards/CardItem.js

import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import GenericButton from '../Utiles/GenericButton'; 
import Subtitulo1 from '../Utiles/Subtitulo1';

const CardItem = ({ title, image, description, actionLabel, onActionClick }) => (
  <Card sx={{ maxWidth: 470, margin: 2 }}>
    <CardMedia component="img" height="140" image={image} alt={title} />
    <CardContent>
        <Subtitulo1 text= {title} />
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      {/* Usar GenericButton */}
      <GenericButton
        text={actionLabel}          
        color="info"              
        onClick={onActionClick}      
        fullWidth={false}            
      />
    </CardContent>
  </Card>
);

export default CardItem;
