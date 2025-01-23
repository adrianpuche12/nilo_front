import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import Footer from '../Footer';
import Title from '../Utiles/Title';
import Subtitulo1 from '../Utiles/Subtitulo1';
import Descripcion1 from '../Utiles/Descripcion1';
import { MainTitle } from '../Utiles/MainComponents';

const AboutUs = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }} id="about-us">

      {/* Contenido principal */}
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }} id="about-us-container">
        {/* Título principal */}
        <MainTitle text="Acerca de Nosotros" align='center' id="main-title" />

        {/* Sección: Historia */}
        <section id="historia">
          <Subtitulo1 text="Nuestra Historia"
            align="center"
            color="primary"
            id="historia-subtitulo"
          />
          <Descripcion1 text="Nuestra empresa nació con el propósito de ofrecer experiencias únicas a nuestros clientes. Desde nuestro inicio en 2010, hemos trabajado arduamente para posicionarnos como líderes en el sector de viajes y turismo."
            align="center"
            id="historia-descripcion"
          />
        </section>

        {/* Sección: Misión */}
        <section id="mision">
          <Subtitulo1 text="Misión"
            align="center"
            color="primary"
            id="mision-subtitulo"
          />
          <Descripcion1 text="Nuestra misión es inspirar y facilitar experiencias inolvidables, promoviendo el turismo sostenible y apoyando a comunidades locales."
            align="center"
            id="mision-descripcion"
          />
        </section>

        {/* Sección: Visión */}
        <section id="vision">
          <Subtitulo1 text="Visión"
            align="center"
            color="primary"
            id="vision-subtitulo"
          />
          <Descripcion1 text="Ser reconocidos como la agencia de viajes más innovadora y confiable, brindando servicios de calidad que superen las expectativas de nuestros clientes."
            align="center"
          />
        </section>

        {/* Sección: Objetivos */}
        <section id="objetivos">
          <Subtitulo1 text="Objetivos"
            align="center"
            color="primary"
            id="objetivos-subtitulo"
          />
          <Grid container spacing={2} id="objetivos-grid">
            <Grid item xs={12} id="objetivo-1">
              <Descripcion1 text="1. Ofrecer servicios personalizados a cada cliente."
                align="center"
                id="objetivo-1-descripcion"
              />
            </Grid>
            <Grid item xs={12} id="objetivo-2">
              <Descripcion1 text="2. Fomentar el turismo responsable y sostenible."
                align="center"
                id="objetivo-2-descripcion"
              />
            </Grid>
            <Grid item xs={12} id="objetivo-3">
              <Descripcion1 text="3. Expandir nuestra presencia a nivel internacional."
                align="center"
                id="objetivo-3-descripcion"
              />
            </Grid>
          </Grid>
        </section>
      </Container>
      <Footer />
    </Box>
  );
};

export default AboutUs;
