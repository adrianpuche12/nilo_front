import React, { useState } from 'react';
import { Box, Container,TextField, Button,} from '@mui/material';
import Title from '../Utiles/Title';
import Subtitulo1 from '../Utiles/Subtitulo1';
import Descripcion1 from '../Utiles/Descripcion1';
import Navbar from '../NavBar';  
import Footer from '../Footer'; 

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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 1 }}>
        {/* Título principal */}
        <Title text="Contáctanos" 
            align="center"
        />

        {/* Sección: Teléfonos */}
        <section>
        <Subtitulo1
            text="Teléfonos"
            align="center" 
            color="primary"  
        />
          <Descripcion1 text="+123 456 789" 
            align="center"
            color="primary"
          />
          <Descripcion1 text="+987 654 321" 
            align="center"
          />
        </section>

        {/* Sección: Dirección */}
        <section>
          <Subtitulo1 text="Dirección" 
            align="center"
            color="primary"
          />
          <Descripcion1 text="Calle Ficticia 123, Ciudad, País" 
            align="center"
          />
        </section>

        {/* Sección: Correo Electrónico */}
        <section>
          <Subtitulo1 text="Correo Electrónico" 
            align="center"
            color="primary"
          />
          <Descripcion1 text="contacto@empresa.com" 
            align="center"
          />
        </section>

        {/* Sección: Formulario de Contacto */}
        <section>
          <Subtitulo1 text="Formulario de Contacto" 
            align="center"
            color="primary"
          />
          <Descripcion1 text="Si prefieres, puedes dejarnos un mensaje a través de nuestro formulario de contacto." 
            align="center"
          />

          {/* Formulario de contacto */}
          <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Correo Electrónico"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
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
