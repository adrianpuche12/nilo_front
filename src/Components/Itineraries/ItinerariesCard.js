import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import ItineraryDetailCard from '../Itineraries/ItineraryDetailCard';
import Title from '../Utiles/Title';

const API_URL = process.env.REACT_APP_API_URL;

const ItinerariesCard = () => {
  const { accessToken } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Número de itinerarios por página

  const getAxiosConfig = useCallback(() => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Paginación: obtener los itinerarios de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItineraries = itineraries.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) return <Typography>Cargando itinerarios...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Grid container spacing={2} justifyContent="center">
        {currentItineraries.map((itinerary) => (
          <Grid item xs={10} sm={8} md={4} lg={4} key={itinerary.id}>
            <Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 2 }}>
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
                    onClick={() => handleViewMore(itinerary)}
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
          count={Math.ceil(itineraries.length / itemsPerPage)} // Total de páginas
          page={currentPage} // Página actual
          onChange={handlePageChange} // Función de cambio
          color="primary"
          siblingCount={0}
          boundaryCount={1}
        />
      </Box>

      {/* Modal para detalle */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <Title text="Detalle del Itinerario" />
        <DialogContent>
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
