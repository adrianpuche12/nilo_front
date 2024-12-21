import React from 'react';
import { Container, Box } from '@mui/material';
import { useAuth } from './Auth/AuthContext';
import ActivitiesCard from './Activities/ActivitiesCard';
import ItinerariesCard from './Itineraries/ItinerariesCard';
import Footer from './Footer';
import Subtitulo1 from './Utiles/Subtitulo1';
import Descripcion1 from './Utiles/Descripcion1';
import PromotionsCard from './Promotions/PromotionCard';
import { MainTitle, MainSection } from './Utiles/MainComponents';

const sectionStyles = {
  wrapper: {
    mb: 0.5,
  },
  headerContainer: {
    maxWidth: '800px',
    mx: 'auto',
    mb: 0.25,
    textAlign: 'center',
  },
  description: {
    fontSize: '0.8rem',
    color: 'text.secondary',
    lineHeight: 1.2,
    px: { xs: 0.25, sm: 0.5 },
    maxWidth: '500px',
    mx: 'auto',
  },
  carouselWrapper: {
    position: 'relative',
    marginBottom: { xs: 0.25, sm: 0.5 },
  },
  pagination: {
    marginTop: '-4px',
    display: 'flex',
    justifyContent: 'center',
  },
};

const cardStyles = {
  maxWidth: 200,
  height: 250,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  mx: 'auto',
  boxShadow: 0,
  borderRadius: 2,
  p: 0.1,
  '@media (max-width: 600px)': {
    maxWidth: '100%',
    height: 'auto',
  },
};

const Home = () => {
  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 1, mb: 4 }}>
        <MainSection>
          <MainTitle text="Conoce nuestros paquetes de Viaje" align="center" />
        </MainSection>

        {/* Promociones Carrusel */}
        <Box sx={sectionStyles.wrapper}>
          <Box sx={sectionStyles.headerContainer}>
            <Subtitulo1
              text="Promociones Especiales"
              color="primary.main"
              align="center"
              margin="0 0 16px 0"
            />
            <Descripcion1
              text="Descubre nuestras mejores ofertas y aprovecha descuentos exclusivos."
              margin="0 0 24px 0"
            />
          </Box>
          <Box sx={sectionStyles.carouselWrapper}>
            <PromotionsCard sx={cardStyles} />
          </Box>
        </Box>

        {/* Actividades Carrusel */}
        <Box sx={sectionStyles.wrapper}>
          <Box sx={sectionStyles.headerContainer}>
            <Subtitulo1
              text="Actividades Destacadas"
              color="primary.main"
              align="center"
              margin="0 0 1rem 0"
            />
            <Box sx={sectionStyles.description}>
              <Descripcion1
                text="Descubre experiencias únicas y emocionantes en cada destino. Desde aventuras al aire libre hasta tours culturales."
                margin="0"
              />
            </Box>
          </Box>
          <Box sx={sectionStyles.carouselWrapper}>
            <ActivitiesCard sx={cardStyles} />
          </Box>
        </Box>

        {/* Itinerarios Carrusel */}
        <Box sx={sectionStyles.wrapper}>
          <Box sx={sectionStyles.headerContainer}>
            <Subtitulo1
              text="Itinerarios Recomendados"
              color="primary.main"
              align="center"
              margin="0 0 1rem 0"
            />
            <Box sx={sectionStyles.description}>
              <Descripcion1
                text="Planes completos y cuidadosamente diseñados para aprovechar al máximo tu tiempo. Encuentra el itinerario perfecto para tu próxima aventura."
                margin="0"
              />
            </Box>
          </Box>
          <Box sx={sectionStyles.carouselWrapper}>
            <ItinerariesCard sx={cardStyles} />
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Home;