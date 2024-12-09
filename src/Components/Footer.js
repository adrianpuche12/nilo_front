import React from 'react';
import { Container, Grid, IconButton, Link, Box } from '@mui/material';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid 
          container 
          justifyContent="space-between" 
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <IconButton
              component={Link}
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              component={Link}
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Instagram />
            </IconButton>
          </Grid>
          <Grid 
            item 
            xs={12} 
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              gap: 2
            }}
          >
            
            <Link
              href="/contacto"
              underline="none"
              color="text.primary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Contactos
            </Link>
            <Link
              href="/acerca-de"
              underline="none"
              color="text.primary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Acerca de Nosotros
            </Link>
            <Link
              href="/politica"
              underline="none"
              color="text.primary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Política de la Empresa
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;