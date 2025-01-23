import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Box } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';

const carouselStyles = {
  container: {
    position: 'relative',
    width: '100%',
    '.swiper': {
      pb: 6,
      mb: 4,
    },
    '.swiper-pagination': {
      bottom: '0 !important',
    },
    '.swiper-pagination-bullet': {
      width: '10px',
      height: '10px',
      backgroundColor: 'grey.400',
      opacity: 0.6,
      '&-active': {
        backgroundColor: 'primary.main',
        opacity: 1,
      },
    },
  },
};

export const HomeCarousel = ({ children, className = 'home-cards-swiper', id = 'home-carousel' }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);

  return (
    <Box sx={carouselStyles.container} id={id}>
      <Swiper
        ref={swiperRef}
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{
          el: `.${className}-pagination`,
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
        {children}
        <div id={`${id}-pagination`} className={`${className}-pagination swiper-pagination`}></div> 
      </Swiper>
    </Box>
  );
};

export const ActivityCarousel = ({ children, id = 'activity-carousel' }) => (
  <Box sx={carouselStyles.container} id={id}>
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{
        el: '.activities-swiper-pagination',
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
      {children}
      <div id={`${id}-pagination`} className="activities-swiper-pagination swiper-pagination"></div>
    </Swiper>
  </Box>
);

export const ItineraryCarousel = ({ children, id = 'itinerary-carousel' }) => (
  <Box sx={carouselStyles.container} id={id}>
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
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
      {children}
      <div id={`${id}-pagination`} className="itineraries-swiper-pagination swiper-pagination"></div>
    </Swiper>
  </Box>
);

export default {
  HomeCarousel,
  ActivityCarousel,
  ItineraryCarousel,
};

