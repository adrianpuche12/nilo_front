// src/components/HomeCards/HomeCards.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import CardItem from './CardItem';
import { cardsData } from './CardsData';

const HomeCards = () => (
  <Swiper
    modules={[Navigation, Pagination]}
    spaceBetween={1}
    slidesPerView={1} // Ajusta el número de tarjetas visibles según el tamaño de la pantalla
    navigation // Habilita los botones de navegación
    pagination={{ clickable: true }} // Habilita la paginación
    breakpoints={{
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
  >
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
  </Swiper>
);

export default HomeCards;
