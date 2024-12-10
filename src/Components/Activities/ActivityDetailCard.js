import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Grid, Chip, CircularProgress, Button, CardMedia } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Navbar from '../NavBar';
import Footer from '../Footer';
import Subtitulo1 from '../Utiles/Subtitulo1';
import Descripcion1 from '../Utiles/Descripcion1';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAxiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  }), [accessToken]);

  const fetchActivityData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/activities/${id}`, 
        getAxiosConfig()
      );
      setActivity(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos de la actividad');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, getAxiosConfig]);

  useEffect(() => {
    if (accessToken) {
      fetchActivityData();
    }
  }, [accessToken, fetchActivityData]);

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

  if (error || !activity) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        py={4}
      >
        <Typography color="error" gutterBottom>
          {error || 'Actividad no encontrada'}
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
                    image={activity.image || 'https://images.unsplash.com/photo-1548574505-5e239809ee19'} 
                    alt={activity.name}
                    sx={{ 
                      objectFit: 'cover', 
                      width: '100%', // La imagen debe ocupar el 100% del ancho
                      height: '100%', // La imagen debe ocupar el 100% de la altura del contenedor
                      maxHeight: '500px', // Limita la altura máxima de la imagen
                      borderRadius: '16px',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Subtitulo1
                  text={activity.name}
                  color="primary.main"
                  margin="0 0 1rem 0"
                />

                <Chip 
                  label={activity.location || 'Ubicación no disponible'}
                  color="primary"
                  sx={{ mb: 2 }}
                />

                <Descripcion1
                  text={activity.description}
                  margin="1rem 0"
                />

                <Typography variant="h6" gutterBottom>
                  Detalles de la Actividad
                </Typography>
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Duración:</strong> {activity.duration || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Tipo:</strong> {activity.type || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Costo:</strong> {activity.cost || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Recomendaciones:</strong> {activity.recommendations || 'N/A'}
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

export default ActivityDetail;
