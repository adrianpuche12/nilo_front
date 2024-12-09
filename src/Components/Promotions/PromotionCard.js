import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { promotionsData } from './PromotionData';
import { useNavigate } from 'react-router-dom';
import { HomeCarousel } from '../HomeCards/Carousel';
import GenericButton from '../Utiles/GenericButton'

// Función para truncar texto si excede los 40 caracteres
const truncateText = (text, maxLength = 40) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const PromotionsCard = ({ sx }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);

  const handlePromotionClick = (promotionId) => {
    navigate(`/promotions/${promotionId}`);
  };

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
        ref={swiperRef}
      >
        {promotionsData.map((promotion) => (
          <SwiperSlide key={promotion.id}>
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
              onClick={() => handlePromotionClick(promotion.id)}
            >
              <Box
                component="img"
                src={promotion.image}
                alt={promotion.title}
                sx={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: 2,
                  backgroundColor: promotion.image ? 'transparent' : 'grey.300', // Fondo gris si no hay imagen
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
                  {truncateText(promotion.title)}
                </Typography>
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
                  {truncateText(promotion.description)}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
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
                      onClick={() => handlePromotionClick(promotion.id)}
                  />
                </Box>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </HomeCarousel>
  );
};

export default PromotionsCard;
