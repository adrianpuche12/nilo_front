import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Divider, Pagination, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import 'swiper/css';
import 'swiper/css/pagination';
import Subtitulo1 from '../Utiles/Subtitulo1';
import GenericButton from '../Utiles/GenericButton';

const ItinerariesCard = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Puedes cambiar esto según tus necesidades
  const [openModal, setOpenModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const getAxiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  }), [accessToken]);

  const fetchItineraries = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/itineraries`, getAxiosConfig());
      setItineraries(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [getAxiosConfig]);

  const fetchCities = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cities`, getAxiosConfig());
      setCities(response.data);
    } catch (err) {
      console.error(err);
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

  const handleItineraryClick = (itineraryId) => {
    navigate(`/itineraries/${itineraryId}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenModal = (itinerary) => {
    setSelectedItinerary(itinerary);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItinerary(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItineraries = itineraries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Box className="itineraries-swiper">
      <Swiper
        modules={[SwiperPagination, Autoplay]}
        spaceBetween={20}
        pagination={{
          el: '.itineraries-swiper-pagination',
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {currentItineraries.map((itinerary) => (
          <SwiperSlide key={itinerary.id}>
            <Card
              sx={{
                maxWidth: 400,
                borderRadius: 3,
                boxShadow: 2,
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
              onClick={() => handleItineraryClick(itinerary.id)}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography>
                    <Subtitulo1 text={itinerary.name} align="center" />
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {getCityName(itinerary.cityId)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 2,
                    }}
                  >
                    {itinerary.description}
                  </Typography>
                  <GenericButton
                    text="Ver más"
                    variant="contained"
                    color="info"
                    onClick={() => handleOpenModal(itinerary)}
                  />
                </Box>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

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
        <DialogContent>
          {selectedItinerary && (
            <Box>
              <Subtitulo1 text={selectedItinerary.name} />
              <Typography variant="body2">{selectedItinerary.description}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <GenericButton
            text="Cerrar"
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
          />
          <GenericButton
            text="Reservar"
            variant="contained"
            color="primary"            
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItinerariesCard;
