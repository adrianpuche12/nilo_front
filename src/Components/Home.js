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
    mb: 0.5,  // Minimiza el espacio entre secciones
  },
  headerContainer: {
    maxWidth: '800px',
    mx: 'auto',
    mb: 0.25, // Minimiza el margen inferior
    textAlign: 'center',
  },
  description: {
    fontSize: '0.8rem', // Reduce aún más el tamaño de la fuente
    color: 'text.secondary',
    lineHeight: 1.2, // Reduce al máximo el interlineado
    px: { xs: 0.25, sm: 0.5 }, // Minimiza el padding horizontal
    maxWidth: '500px', // Reduce el ancho máximo de la descripción
    mx: 'auto',
  },
  carouselWrapper: {
    position: 'relative',
    marginBottom: { xs: 0.25, sm: 0.5 }, // Minimiza el margen entre carruseles
  },
  pagination: {
    marginTop: '-4px', // Minimiza la distancia entre el carrusel y los puntos
    display: 'flex',
    justifyContent: 'center',
  },
};

// Estilos unificados para las cards
const cardStyles = {
  maxWidth: 200, // Minimiza aún más el ancho de las tarjetas
  height: 250, // Reduce aún más la altura de las tarjetas
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  mx: 'auto',
  boxShadow: 0, // Elimina la sombra para mayor ligereza
  borderRadius: 2,
  p: 0.1,  // Minimiza el padding de las tarjetas
  '@media (max-width: 600px)': {
    maxWidth: '100%',
    height: 'auto',
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
