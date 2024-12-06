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

const HomeCards = () => {
  const theme = useTheme();
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);

  return (
    <HomeCarousel>
      {cardsData.map((card) => (
        <SwiperSlide key={card.id}>
          <CardItem
            title={card.title}
            image={card.image}
            description={card.description}
            actionLabel={card.actionLabel}
          />
        </SwiperSlide>
      ))}
    </HomeCarousel>
  );
};

export default HomeCards;