import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CardItem from './CardItem';
import { cardsData } from './CardsData';
import { useTheme } from '@mui/material';
import { HomeCarousel } from './Carousel';

const HomeCards = ({ sx }) => {
  const theme = useTheme();
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);

  return (
    <HomeCarousel sx={sx}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 }, // Móviles pequeños
          480: { slidesPerView: 1.2 }, // Móviles grandes
          768: { slidesPerView: 2 }, // Tabletas pequeñas
          1024: { slidesPerView: 3 }, // Pantallas medianas
          1440: { slidesPerView: 4 }, // Pantallas grandes
        }}
        loop
        style={{
          padding: 'auto', // Ajustar espaciado según sea necesario
        }}
      >
        {cardsData.map((card) => (
          <SwiperSlide key={card.id}>
            <CardItem
              title={card.title}
              image={card.image}
              description={card.description}
              actionLabel={card.actionLabel}
              sx={{
                width: 'auto',
                height: 'auto',
                maxWidth: 450,
                minHeight: 300,
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
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </HomeCarousel>
  );
};

export default HomeCards;
