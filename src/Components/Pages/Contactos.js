import React, { useState } from 'react';
import { Box, Container, TextField, Button, } from '@mui/material';
import Subtitulo1 from '../Utiles/Subtitulo1';
import Descripcion1 from '../Utiles/Descripcion1';
import Footer from '../Footer';
import { MainTitle } from '../Utiles/MainComponents';

const Contactos = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado', formData);
    // Aquí va la lógica para enviar el formulario
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }} id="contactos">
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }} id="contactos-container">
        {/* Título principal */}
        <MainTitle text="Contáctanos" align='center' id="main-title" />

        {/* Sección: Teléfonos */}
        <section id="telefonos">
          <Subtitulo1
            text="Teléfonos"
            align="center"
            color="primary"
            id="telefonos-subtitulo"
          />
          <Descripcion1 text="+123 456 789"
            align="center"
            color="primary"
            id="telefono-1"
          />
          <Descripcion1 text="+987 654 321"
            align="center"
            id="telefono-2"
          />
        </section>

        {/* Sección: Dirección */}
        <section id="direccion">
          <Subtitulo1 text="Dirección"
            align="center"
            color="primary"
            id="direccion-subtitulo"
          />
          <Descripcion1 text="Calle Ficticia 123, Ciudad, País"
            align="center"
            id="direccion-texto"
          />
        </section>

        {/* Sección: Correo Electrónico */}
        <section id="correo-electronico">
          <Subtitulo1 text="Correo Electrónico"
            align="center"
            color="primary"
            id="correo-subtitulo"
          />
          <Descripcion1 text="contacto@empresa.com"
            align="center"
            id="correo-texto"
          />
        </section>

        {/* Sección: Formulario de Contacto */}
        <section id="formulario-contacto">
          <Subtitulo1 text="Formulario de Contacto"
            align="center"
            color="primary"
            id="formulario-subtitulo"
          />
          <Descripcion1 text="Si prefieres, puedes dejarnos un mensaje a través de nuestro formulario de contacto."
            align="center"
            id="formulario-descripcion"
          />

          {/* Formulario de contacto */}
          <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }} id="formulario">
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleChange}
              id="input-nombre"
            />
            <TextField
              label="Correo Electrónico"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleChange}
              id="input-email"
            />
            <TextField
              label="Mensaje"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              id="input-mensaje"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              id="submit-button"
            >
              Enviar
            </Button>
          </form>
        </section>
      </Container>

      <Footer />
    </Box>
  );
};

export default Contactos;
