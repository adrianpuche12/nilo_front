import React from 'react';
import { Container, Box } from '@mui/material';
import { useAuth } from './Auth/AuthContext';
import ActivitiesCard from './Activities/ActivitiesCard';
import ItinerariesCard from './Itineraries/ItinerariesCard';
import HomeCards from './HomeCards/HomeCards';
import Navbar from './NavBar';
import Footer from './Footer';
import Subtitulo_1 from './Utiles/Subtitulo1';
import Descripcion_1 from './Utiles/Descripcion1';
import Title from './Utiles/Title'
import PromotionsCard from './Promotions/PromotionCard';

const sectionStyles = {
  wrapper: {
    mb: 8,
  },
  headerContainer: {
    maxWidth: '800px',
    mx: 'auto',
    mb: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: '1.1rem',
    color: 'text.secondary',
    lineHeight: 1.6,
    px: { xs: 2, sm: 4 },
    maxWidth: '650px',
    mx: 'auto',
  }
};

const Home = () => {
  const { logout } = useAuth();

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Paquetes Carrusel */}
        <Box sx={sectionStyles.wrapper}>
          <Box sx={sectionStyles.headerContainer}>
            <Title
              text="Conoce nuestros paquetes de Viaje"
            />
            <Box sx={sectionStyles.description}>
              <Descripcion_1
                text="Explora nuestros paquetes exclusivos para hacer tu próximo viaje inolvidable."
                margin="0"
              />
            </Box>
          </Box>
          <HomeCards />
        </Box>

        {/* Promociones Carrusel */}
        <Box sx={sectionStyles.wrapper}>
          <Box sx={sectionStyles.headerContainer}>
            <Subtitulo_1
              text="Promociones Especiales"
              color="primary.main"
              align="center"
              margin="0 0 16px 0"
            />
            <Descripcion_1
              text="Descubre nuestras mejores ofertas y aprovecha descuentos exclusivos."
              margin="0 0 24px 0"
            />
            <PromotionsCard />
          </Box>
        </Box>

        {/* Actividades Carrusel */}
        <Box sx={sectionStyles.wrapper}>
          <Box sx={sectionStyles.headerContainer}>
            <Subtitulo_1
              text="Actividades Destacadas"
              color="primary.main"
              align="center"
              margin="0 0 1rem 0"
            />
            <Box sx={sectionStyles.description}>
              <Descripcion_1
                text="Descubre experiencias únicas y emocionantes en cada destino. Desde aventuras al aire libre hasta tours culturales."
                margin="0"
              />
            </Box>
          </Box>
          <ActivitiesCard />
        </Box>

        {/* Itinerarios Carrusel */}
        <Box sx={sectionStyles.wrapper}>
          <Box sx={sectionStyles.headerContainer}>
            <Subtitulo_1
              text="Itinerarios Recomendados"
              color="primary.main"
              align="center"
              margin="0 0 1rem 0"
            />
            <Box sx={sectionStyles.description}>
              <Descripcion_1
                text="Planes completos y cuidadosamente diseñados para aprovechar al máximo tu tiempo. Encuentra el itinerario perfecto para tu próxima aventura."
                margin="0"
              />
            </Box>
          </Box>
          <ItinerariesCard />
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Home;