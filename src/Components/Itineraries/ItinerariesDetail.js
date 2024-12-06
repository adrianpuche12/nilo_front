import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Card, CardContent, Divider, Button, Grid, Chip, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Navbar from '../NavBar';
import Footer from '../Footer';
import Subtitulo_1 from '../Utiles/Subtitulo1';
import Descripcion_1 from '../Utiles/Descripcion1';

const ItinerariesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);

  const getAxiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  }), [accessToken]);

  const fetchItineraryData = useCallback(async () => {
    try {
      setLoading(true);
      const itineraryResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/itineraries/${id}`, 
        getAxiosConfig()
      );
      setItinerary(itineraryResponse.data);
      
      const cityResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/cities/${itineraryResponse.data.cityId}`,
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
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        py={4}
      >
        <Typography color="error" gutterBottom>
          {error || 'Itinerario no encontrado'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
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
            <Subtitulo_1 
              text={itinerary.name}
              color="primary.main"
              margin="0 0 1rem 0"
            />
            
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Chip 
                  label={city?.name || 'Ciudad no disponible'}
                  color="primary"
                  sx={{ mb: 2 }}
                />
                
                <Descripcion_1 
                  text={itinerary.description}
                  margin="1rem 0"
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Actividades Incluidas
                </Typography>
                <Grid container spacing={2}>
                  {itinerary.activities.map((activity) => (
                    <Grid item xs={12} sm={6} md={4} key={activity.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {activity.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.type}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
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