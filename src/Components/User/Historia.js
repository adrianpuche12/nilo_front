import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Title from '../Utiles/Title';

const Historia = () => {
    const servicios = [
        { id: 1, nombre: 'Paquete de Vacaciones', fecha: '15/12/2024', precio: '$500' },
        { id: 2, nombre: 'Excursión a la montaña', fecha: '20/11/2024', precio: '$200' },
        { id: 3, nombre: 'City Tour', fecha: '10/10/2024', precio: '$300' },
    ];

    return (
        <Box sx={{ mt: 4 }} id="history-services">
            <Title text="Historia de Servicios Adquiridos" id="history-services-title" />
            <Grid container spacing={3} id="services-grid">
                {servicios.map((servicio) => (
                    <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        key={servicio.id} 
                        id={`service-grid-item-${servicio.id}`}
                    >
                        <Card variant="outlined" id={`service-card-${servicio.id}`}>
                            <CardContent id={`service-card-content-${servicio.id}`}>
                                <Typography 
                                    variant="h6" 
                                    id={`service-name-${servicio.id}`}
                                >
                                    {servicio.nombre}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="textSecondary" 
                                    id={`service-date-${servicio.id}`}
                                >
                                    Fecha: {servicio.fecha}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="textSecondary" 
                                    id={`service-price-${servicio.id}`}
                                >
                                    Precio: {servicio.precio}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Historia;
