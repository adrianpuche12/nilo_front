import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Divider, Dialog, DialogActions, DialogContent, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination, Autoplay } from 'swiper/modules';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Subtitulo1 from '../Utiles/Subtitulo1';
import { HomeCarousel } from '../HomeCards/Carousel';
import GenericButton from '../Utiles/GenericButton';

const ItinerariesCard = ({ sx }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
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

  const handleViewMore = (activity) => {
    setSelectedItinerary(activity);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItinerary(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItineraries = itineraries.slice(indexOfFirstItem, indexOfLastItem);

  const truncateText = (text, maxLength = 50) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  return (
    <HomeCarousel sx={{}}>
      <Swiper
        modules={[Navigation, SwiperPagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 4 },
        }}
        loop
      >
        {currentItineraries.map((itinerary) => (
          <SwiperSlide key={itinerary.id}>
            <Card
              sx={{
                maxWidth: 450,
                minHeight: 350,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: 3,
                padding: 2,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.2s",
                },
              }}
              onClick={() => handleItineraryClick(itinerary.id)}
            >
              <Box
                component="img"
                src={itinerary.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'}
                alt={itinerary.name}
                sx={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: 2,
                  backgroundColor: itinerary.image ? 'transparent' : 'grey.300', // Fondo gris si no hay imagen
                }}
              />

              <CardContent
                sx={{
                  flex: 1,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxHeight: "3.6em",
                  }}
                >
                  {truncateText(itinerary.name)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                    marginTop: "8px",
                    textAlign: "justify",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxHeight: "3em",
                  }}
                >
                  {truncateText(itinerary.description)}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <GenericButton
                    text="Ver más"
                    variant="contained"
                    color="info"
                    sx={{
                      marginTop: "12px",
                      fontSize: { xs: "0.7rem", sm: "0.9rem" },
                      width: "150px",
                      height: "40px",
                    }}
                    onClick={() => handleItineraryClick(itinerary.id)}
                  />
                </Box>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

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
    </HomeCarousel>
  );
};

export default ItinerariesCard;
