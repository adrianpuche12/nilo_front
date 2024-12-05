import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CardItem from './CardItem';
import { cardsData } from './CardsData';
import { useTheme } from '@mui/material';

const HomeCards = () => {
  const theme = useTheme();
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={16}
      slidesPerView={1}
      navigation={window.innerWidth >= 768 ? {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        disabledClass: 'swiper-button-disabled',
      } : false}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000, 
        disableOnInteraction: false, 
      }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      style={{
        '--swiper-navigation-color': theme.palette.grey[700],
        '--swiper-pagination-color': theme.palette.grey[700],
      }}
      ref={swiperRef}
    >
      {cardsData.map((card) => (
        <SwiperSlide key={card.id}>
          <CardItem
            title={card.title}
            image={card.image}
            description={card.description}
            actionLabel={card.actionLabel}
            //onActionClick={() => console.log(`Clicked on ${card.title}`)} // Acción del botón
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeCards;