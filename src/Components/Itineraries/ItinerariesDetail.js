import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Button,
  CardMedia,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Footer from '../Footer';
import Subtitulo1 from '../Utiles/Subtitulo1';
import Descripcion1 from '../Utiles/Descripcion1';

const ItinerariesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);

  const getAxiosConfig = useCallback(
    () => ({
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    [accessToken]
  );

  const fetchItineraryData = useCallback(async () => {
    try {
      setLoading(true);
      const itineraryResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/itineraries/${id}`,
        getAxiosConfig()
      );
      setItinerary(itineraryResponse.data);

      const cityResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/cities`,
        getAxiosConfig()
      );
      setCity(cityResponse.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del itinerario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, getAxiosConfig]);

  useEffect(() => {
    if (accessToken) {
      fetchItineraryData();
    }
  }, [accessToken, fetchItineraryData]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !itinerary) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={4}>
        <Typography color="error" gutterBottom>
          {error || 'Itinerario no encontrado'}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Volver
          </Button>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: 'grey.300', // Fondo gris
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    borderRadius: '16px',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={itinerary.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'}
                    alt={itinerary.name}
                    sx={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      maxHeight: '500px', // Limita la altura máxima
                      borderRadius: '16px',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Subtitulo1
                  text={itinerary.name}
                  color="primary.main"
                  margin="0 0 1rem 0"
                />

                <Chip
                  label={city?.name || 'Ciudad no disponible'}
                  color="primary"
                  sx={{ mb: 2 }}
                />

                <Descripcion1 text={itinerary.description} margin="1rem 0" />

                <Typography variant="h6" gutterBottom>
                  Detalles del Itinerario
                </Typography>
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Duración:</strong> {itinerary.duration || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Tipo:</strong> {itinerary.type || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Costo:</strong> {itinerary.cost || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Recomendaciones:</strong>{' '}
                    {itinerary.recommendations || 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                  >
                    Reservar Ahora
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ItinerariesDetail;
