import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import ItineraryDetailCard from '../Itineraries/ItineraryDetailCard';  

const API_URL = process.env.REACT_APP_API_URL;

const ItinerariesCard = () => {
  const { accessToken } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Para controlar el estado del modal

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

  const handleViewMore = (itinerary) => {
    setSelectedItinerary(itinerary);
    setOpenModal(true);  // Abrir el modal con el detalle del itinerario
  };

  const handleCloseModal = () => {
    setOpenModal(false);  // Cerrar el modal
  };

  if (loading) return <Typography>Cargando itinerarios...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Grid container spacing={2} justifyContent="center">
        {itineraries.map((itinerary) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={itinerary.id}>
            <Card sx={{ maxWidth: 240, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">{itinerary.name}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">{getCityName(itinerary.cityId)}</Typography>
                  <Typography variant="body2">{itinerary.description}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {itinerary.activities.map(activity => activity.name).join(', ')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleViewMore(itinerary)}  // Al hacer clic, muestra el detalle en el modal
                  >
                    Ver más
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm" // Ajustamos el tamaño del modal para pantallas medianas o pequeñas
        sx={{
            '& .MuiDialogContent-root': {
            padding: { xs: '8px', sm: '16px' }, // Ajustamos el padding en pantallas pequeñas y medianas
            },
        }}
        >
        <DialogTitle>Detalle del Itinerario</DialogTitle>
        <DialogContent sx={{ maxWidth: { xs: 320, sm: 400, md: 600 } }}> {/* Ajustamos el tamaño de la tarjeta dentro del modal */}
            {selectedItinerary && <ItineraryDetailCard itinerary={selectedItinerary} />}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
            Cerrar
            </Button>
        </DialogActions>
        </Dialog>

    </div>
  );
};

export default ItinerariesCard;
