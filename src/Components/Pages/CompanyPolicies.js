import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../NavBar';
import Footer from '../Footer';
import Title from '../Utiles/Title';
import Subtitulo1 from '../Utiles/Subtitulo1';
import Subtitulo2 from '../Utiles/Subtitulo2';
import Descripcion1 from '../Utiles/Descripcion1';

const CompanyPolicies = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Title text="Política de la Empresa" />

        <section>
          <Subtitulo1 
            text="Compromisos Fundamentales" 
            color="primary.main"
            margin="2rem 0 1rem 0"
          />
          <Descripcion1 
            text="Nos comprometemos a mantener los más altos estándares éticos en todas nuestras operaciones, garantizando transparencia, integridad y responsabilidad en cada interacción con clientes, empleados y proveedores."
          />
        </section>

        <section>
          <Subtitulo1 
            text="Políticas para Clientes" 
            color="primary.main"
            margin="2rem 0 1rem 0"
          />
          <Subtitulo2 text="Calidad de Servicio" margin="1rem 0 0.5rem 0" />
          <Descripcion1 
            text="Garantizamos la máxima calidad en nuestros servicios turísticos, con un compromiso firme de satisfacción al cliente y mejora continua."
          />
          <Subtitulo2 text="Seguridad y Privacidad" margin="1rem 0 0.5rem 0" />
          <Descripcion1 
            text="Protegemos la información personal de nuestros clientes siguiendo estrictos protocolos de seguridad y cumpliendo con todas las regulaciones de protección de datos."
          />
        </section>

        <section>
          <Subtitulo1 
            text="Responsabilidad Social" 
            color="primary.main"
            margin="2rem 0 1rem 0"
          />
          <Descripcion1 
            text="Nos comprometemos con el desarrollo sostenible, implementando prácticas empresariales que beneficien a la sociedad y protejan el medio ambiente."
          />
        </section>

        <section>
          <Subtitulo1 
            text="Cumplimiento Legal" 
            color="primary.main"
            margin="2rem 0 1rem 0"
          />
          <Descripcion1 
            text="Operamos en estricto cumplimiento de todas las leyes y regulaciones aplicables, manteniendo los más altos estándares de ética empresarial."
          />
        </section>
      </Container>
      <Footer />
    </Box>
  );
};

export default CompanyPolicies;