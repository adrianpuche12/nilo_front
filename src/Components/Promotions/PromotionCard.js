import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { promotionsData } from './PromotionData';
import GenericButton from '../Utiles/GenericButton';



const PromotionsCard = () => {
  const navigate = useNavigate();

  const handlePromotionClick = (promotionId) => {
    navigate(`/promotions/${promotionId}`);
  };

  return (
    <Box className="promotions-swiper">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        pagination={{
          el: '.promotions-swiper-pagination',
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
        {promotionsData.map((promotion) => (
          <SwiperSlide key={promotion.id}>
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
                },
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => handlePromotionClick(promotion.id)}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ fontWeight: 'bold', mb: 2 }}
                    >
                      {promotion.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ mb: 2, fontStyle: 'italic' }}
                    >
                      {promotion.description}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 3 }}
                    >
                      {promotion.shortDescription}
                    </Typography>
                  </div>
                  <GenericButton
                    text="Ver más"
                    variant="contained"
                    color="info"
                    />   
                </Box>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
        <div className="promotions-swiper-pagination swiper-pagination"></div>
      </Swiper>
    </Box>
  );
};

export default PromotionsCard;