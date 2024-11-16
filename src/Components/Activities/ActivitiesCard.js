import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Divider } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const ActivitiesCard = () => {
    // Estados
    const { accessToken } = useAuth();
    const [activities, setActivities] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAxiosConfig = useCallback(() => ({
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }), [accessToken]);  // Ahora, getAxiosConfig tiene `accessToken` como dependencia.

    // Función para obtener actividades con useCallback
    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/activities`, getAxiosConfig());
            setActivities(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las actividades: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [getAxiosConfig]);  // Ahora `getAxiosConfig` es una dependencia

    // Función para obtener ciudades con useCallback
    const fetchCities = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/cities`, getAxiosConfig());
            setCities(response.data);
        } catch (err) {
            setError('Error al cargar las ciudades: ' + err.message);
        }
    }, [getAxiosConfig]);  // Ahora `getAxiosConfig` es una dependencia

    // Traer actividades y ciudades
    useEffect(() => {
        if (accessToken) {
            fetchActivities();
            fetchCities();
        }
    }, [accessToken, fetchActivities, fetchCities]);

    // Función para obtener el nombre de la ciudad
    const getCityName = (cityId) => {
        const city = cities.find(city => city.id === parseInt(cityId));
        return city ? city.name : ''; // Solo retornamos el nombre de la ciudad
    };

    if (loading) return <Typography>Cargando actividades...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Grid container spacing={2} justifyContent="center">
            {activities.map((activity) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id}>
                    <Card
                        sx={{
                            maxWidth: 240,  // Tamaño base para las tarjetas
                            borderRadius: 3,
                            boxShadow: 2,
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: 4,
                            },
                            bgcolor: 'background.paper',
                            height: '100%',  // Para asegurarnos de que las tarjetas sean de la misma altura
                        }}
                    >
                        <CardContent>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {activity.name}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    {getCityName(activity.cityId)} {/* Solo mostramos el nombre de la ciudad */}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {activity.type} {/* Solo mostramos el valor del tipo de actividad */}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                    }}
                                >
                                    Ver más
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ActivitiesCard;
