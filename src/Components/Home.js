import React from 'react';
import { Container, Box } from '@mui/material';
import { useAuth } from './Auth/AuthContext';
import ActivitiesCard from './Activities/ActivitiesCard';
import ItinerariesCard from './Itineraries/ItinerariesCard';
import HomeCards from './HomeCards/HomeCards';
import Navbar from './NavBar';
import Footer from './Footer';
import Subtitulo1 from './Utiles/Subtitulo1';
import Descripcion1 from './Utiles/Descripcion1';
import Title from './Utiles/Title';
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
  },
  carouselWrapper: {
    position: 'relative',
    marginBottom: { xs: 4, sm: 6 }, // Ajusta la distancia globalmente
  },
  pagination: {
    marginTop: '-10px', // Reduce la distancia entre el carrusel y los puntos
    display: 'flex',
    justifyContent: 'center',
  },
};

// Estilos unificados para las cards
const cardStyles = {
  maxWidth: 300, // Tamaño fijo para ancho máximo
  height: 400, // Altura fija
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  mx: 'auto', // Centramos cada card en su carrusel
  boxShadow: 3, // Añadimos sombra para uniformidad
  borderRadius: 2, // Bordes redondeados
  p: 2, // Espaciado interno
  '@media (max-width: 600px)': {
    maxWidth: '100%', // Ajuste responsivo para móvil
    height: 'auto', // Altura dinámica
  },
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
            <Title text="Conoce nuestros paquetes de Viaje" />
            <Box sx={sectionStyles.description}>
              <Descripcion1
                text="Explora nuestros paquetes exclusivos para hacer tu próximo viaje inolvidable."
                margin="0"
              />
            </Box>
          </Box>
          <Box sx={sectionStyles.carouselWrapper}>
            <HomeCards sx={cardStyles} />
          </Box>
        </Box>

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
