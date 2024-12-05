import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import ActivityDetailCard from './ActivityDetailCard'; 
import Title from '../Utiles/Title';

const API_URL = process.env.REACT_APP_API_URL;

const ActivitiesCard = () => {
  const { accessToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Para controlar el estado del modal

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Número de actividades por página

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
    setOpenModal(true); // Abrir el modal con el detalle de la actividad
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cerrar el modal
  };

  // Paginación: obtener las actividades de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) return <Typography>Cargando actividades...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Grid container spacing={2} justifyContent="center">
        {currentActivities.map((activity) => (
          <Grid item xs={10} sm={8} md={4} lg={4} key={activity.id}>
            <Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 2 }}>
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

      {/* Paginación */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(activities.length / itemsPerPage)} // Total de páginas
          page={currentPage} // Página actual
          onChange={handlePageChange} // Función de cambio
          color="primary"
          siblingCount={0}
          boundaryCount={1}
        />
      </Box>

      {/* Modal para detalle */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <Title text="Detalle de la Actividad"/>
        <DialogContent>
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
