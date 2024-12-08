import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Divider, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import ActivityDetailCard from './ActivityDetailCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { HomeCarousel } from '../HomeCards/Carousel';
import GenericButton from '../Utiles/GenericButton';

const ActivitiesCard = ({ sx }) => {
  const theme = useTheme();
  const { accessToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const getAxiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  }), [accessToken]);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/activities`, getAxiosConfig());
      setActivities(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [getAxiosConfig]);

  useEffect(() => {
    if (accessToken) {
      fetchActivities();
    }
  }, [accessToken, fetchActivities]);

  const handleViewMore = (activity) => {
    setSelectedActivity(activity);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const truncateText = (text, maxLength = 50) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  return (
    <HomeCarousel sx={sx}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
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
        style={{ padding: 'auto' }}
      >
        {activities.map((activity) => (
          <SwiperSlide key={activity.id}>
            <Card
              sx={{
                maxWidth: 450,
                minHeight: 350,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: theme.shadows[3],
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s',
                },
              }}
              onClick={() => handleViewMore(activity)}
            >
              <Box
                component="img"
                src={activity.image || '/default-image.jpg'}
                alt={activity.name}
                sx={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: 2,
                  backgroundColor: activity.image ? 'transparent' : 'grey.300', // Fondo gris si no hay imagen
                }}
              />
              <CardContent
                sx={{
                  flex: 1,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxHeight: '3.6em',
                  }}
                >
                  {truncateText(activity.name)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    marginTop: '8px',
                    textAlign: 'justify',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxHeight: '3em',
                  }}
                >
                  {truncateText(activity.type)}
                </Typography>
                <Typography variant="body2">{activity.duration} min</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <GenericButton
                    text="Ver más"
                    variant="contained"
                    color="info"
                    sx={{
                      marginTop: '12px',
                      fontSize: { xs: '0.7rem', sm: '0.9rem' },
                      width: '150px',
                      height: '40px',
                    }}
                    onClick={() => handleViewMore(activity)}
                  />
                </Box>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal para detalle */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <Typography variant="h6" sx={{ p: 2 }}>
          Detalle de la Actividad
        </Typography>
        <DialogContent>
          {selectedActivity && <ActivityDetailCard activity={selectedActivity} />}
        </DialogContent>
        <DialogActions>
          <GenericButton
            text="Cerrar"
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
          />
        </DialogActions>
      </Dialog>
    </HomeCarousel>
  );
};

export default ActivitiesCard;
