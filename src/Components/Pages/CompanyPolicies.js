import React from 'react';
import { Box, Container } from '@mui/material';
import Footer from '../Footer';
import Subtitulo1 from '../Utiles/Subtitulo1';
import Subtitulo2 from '../Utiles/Subtitulo2';
import Descripcion1 from '../Utiles/Descripcion1';
import { MainTitle } from '../Utiles/MainComponents';

const CompanyPolicies = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} id="company-policies">
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }} id="company-policies-container">
        <MainTitle text="Política de la Empresa" align='center' id="main-title" />

        <section id="compromisos-fundamentales">
          <Subtitulo1
            text="Compromisos Fundamentales"
            color="primary.main"
            margin="2rem 0 1rem 0"
            id="compromisos-subtitulo"
          />
          <Descripcion1
            text="Nos comprometemos a mantener los más altos estándares éticos en todas nuestras operaciones, garantizando transparencia, integridad y responsabilidad en cada interacción con clientes, empleados y proveedores."
            id="compromisos-descripcion"
          />
        </section>

        <section id="politicas-clientes">
          <Subtitulo1
            text="Políticas para Clientes"
            color="primary.main"
            margin="2rem 0 1rem 0"
            id="politicas-subtitulo"
          />
          <Subtitulo2 text="Calidad de Servicio" margin="1rem 0 0.5rem 0" id="calidad-servicio-subtitulo" />
          <Descripcion1
            text="Garantizamos la máxima calidad en nuestros servicios turísticos, con un compromiso firme de satisfacción al cliente y mejora continua."
            id="calidad-servicio-descripcion"
          />
          <Subtitulo2 text="Seguridad y Privacidad" margin="1rem 0 0.5rem 0" id="seguridad-privacidad-subtitulo" />
          <Descripcion1
            text="Protegemos la información personal de nuestros clientes siguiendo estrictos protocolos de seguridad y cumpliendo con todas las regulaciones de protección de datos."
            id="seguridad-privacidad-descripcion"
          />
        </section>

        <section id="responsabilidad-social">
          <Subtitulo1
            text="Responsabilidad Social"
            color="primary.main"
            margin="2rem 0 1rem 0"
            id="responsabilidad-social-subtitulo"
          />
          <Descripcion1
            text="Nos comprometemos con el desarrollo sostenible, implementando prácticas empresariales que beneficien a la sociedad y protejan el medio ambiente."
            id="responsabilidad-social-descripcion"
          />
        </section>

        <section id="cumplimiento-legal">
          <Subtitulo1
            text="Cumplimiento Legal"
            color="primary.main"
            margin="2rem 0 1rem 0"
            id="cumplimiento-legal-subtitulo"
          />
          <Descripcion1
            text="Operamos en estricto cumplimiento de todas las leyes y regulaciones aplicables, manteniendo los más altos estándares de ética empresarial."
            id="cumplimiento-legal-descripcion"
          />
        </section>
      </Container>
      <Footer />
    </Box>
  );
};

export default CompanyPolicies;