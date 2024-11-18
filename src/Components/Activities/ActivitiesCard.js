import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import ActivityDetailCard from './ActivityDetailCard';  // Importamos el ActivityDetailCard

const API_URL = process.env.REACT_APP_API_URL;

const ActivitiesCard = () => {
  const { accessToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Para controlar el estado del modal

  const getAxiosConfig = useCallback(() => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }), [accessToken]);

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
      fetchActivities();
      fetchCities();
    }
  }, [accessToken, fetchActivities, fetchCities]);

  const getCityName = (cityId) => {
    const city = cities.find(city => city.id === parseInt(cityId));
    return city ? city.name : '';
  };

  const handleViewMore = (activity) => {
    setSelectedActivity(activity);
    setOpenModal(true);  // Abrir el modal con el detalle de la actividad
  };

  const handleCloseModal = () => {
    setOpenModal(false);  // Cerrar el modal
  };

  if (loading) return <Typography>Cargando actividades...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Grid container spacing={2} justifyContent="center">
        {activities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id}>
            <Card sx={{ maxWidth: 240, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">{activity.name}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">{getCityName(activity.cityId)}</Typography>
                  <Typography variant="body2">{activity.type}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {activity.duration} min
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleViewMore(activity)} // Al hacer clic, muestra el detalle en el modal
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
        <DialogTitle>Detalle de la Actividad</DialogTitle>
        <DialogContent sx={{ maxWidth: { xs: 320, sm: 400, md: 600 } }}>
          {selectedActivity && <ActivityDetailCard activity={selectedActivity} />}
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

export default ActivitiesCard;
