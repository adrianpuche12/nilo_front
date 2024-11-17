import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Divider } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate

const API_URL = process.env.REACT_APP_API_URL;

const ItinerariesCard = () => {
    const { accessToken } = useAuth();
    const [itineraries, setItineraries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();  // Hook para la navegación

    const getAxiosConfig = useCallback(() => ({
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }), [accessToken]);

    const fetchItineraries = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/itineraries`, getAxiosConfig());
            setItineraries(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los itinerarios: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [getAxiosConfig]);

    const fetchCities = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/cities`, getAxiosConfig());
            setCities(response.data);
        } catch (err) {
            setError('Error al cargar las ciudades: ' + err.message);
        }
    }, [getAxiosConfig]);

    useEffect(() => {
        if (accessToken) {
            fetchItineraries();
            fetchCities();
        }
    }, [accessToken, fetchItineraries, fetchCities]);

    const getCityName = (cityId) => {
        const city = cities.find(city => city.id === parseInt(cityId));
        return city ? city.name : '';
    };

    const handleViewMore = (itineraryId) => {
        navigate(`/itineraries/${itineraryId}`);  // Navegar al detalle del itinerario
    };

    if (loading) return <Typography>Cargando itinerarios...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Grid container spacing={2} justifyContent="center">
            {itineraries.map((itinerary) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={itinerary.id}>
                    <Card
                        sx={{
                            maxWidth: 240,
                            borderRadius: 3,
                            boxShadow: 2,
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: 4,
                            },
                            bgcolor: 'background.paper',
                            height: '100%',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {itinerary.name}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    {getCityName(itinerary.cityId)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    {itinerary.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {itinerary.activities.map(activity => activity.name).join(', ')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleViewMore(itinerary.id)}  // Llamar a la función de navegación
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

export default ItinerariesCard;
