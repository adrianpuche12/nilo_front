import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Button, Box, Divider, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import ActivityDetailCard from './ActivityDetailCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ActivityCarousel } from '../HomeCards/Carousel';
import Title from '../Utiles/Title.js'
import Subtitulo1 from '../Utiles/Subtitulo1'
import GenericButton from '../Utiles/GenericButton';

const ActivitiesCard = () => {
  const { accessToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  return (
    <ActivityCarousel>
      {activities.map((activity) => (
        <SwiperSlide key={activity.id}>
          <Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <Typography>
                  <Subtitulo1 text={activity.name} align="center" />
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">{getCityName(activity.cityId)}</Typography>
                <Typography variant="body2">{activity.type}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {activity.duration} min
                </Typography>
                <GenericButton
                  text="Ver más"
                  variant="contained"
                  color="info"
                  onClick={() => handleViewMore(activity)}
                />
              </Box>
            </CardContent>
          </Card>
        </SwiperSlide>
      ))}
      {/* Modal para detalle */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <Title text="Detalle de la Actividad" />
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
    </ActivityCarousel>
  );
};

export default ActivitiesCard;