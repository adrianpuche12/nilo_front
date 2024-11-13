import React from 'react';
import { Container, Grid, IconButton, Link } from '@mui/material';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ position: 'absolute', bottom: 0, width: '100%' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <IconButton
              component={Link}
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
            </IconButton>
          </Grid>
          <Grid item>
            <Link href="/contacto" target="_blank" rel="noopener noreferrer" sx={{ mr: 3 }}>
              Contactos
            </Link>
            <Link href="/acerca-de" target="_blank" rel="noopener noreferrer" sx={{ mr: 3 }}>
              Acerca de Nosotros
            </Link>
            <Link href="/politica" target="_blank" rel="noopener noreferrer">
              Política de la Empresa
            </Link>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;