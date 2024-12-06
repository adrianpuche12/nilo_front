import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, Grid, CardMedia,  List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ArrowBack, Check } from '@mui/icons-material';
import { promotionsData } from './PromotionData';
import Navbar from '../NavBar';
import Footer from '../Footer';
import Subtitulo_1 from '../Utiles/Subtitulo1';
import Descripcion_1 from '../Utiles/Descripcion1';

const PromotionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const promotion = promotionsData.find(p => p.id === parseInt(id));

  if (!promotion) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        py={4}
      >
        <Typography color="error" gutterBottom>
          Promoción no encontrada
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Volver
          </Button>
          
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height={400}
                  image={promotion.image}
                  alt={promotion.title}
                  sx={{ objectFit: 'cover' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 4 }}>
                  <Subtitulo_1 
                    text={promotion.title}
                    color="primary.main"
                    margin="0 0 1rem 0"
                  />
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontStyle: 'italic',
                      mb: 3,
                      color: 'text.secondary'
                    }}
                  >
                    {promotion.description}
                  </Typography>

                  <Descripcion_1 
                    text={promotion.fullDescription}
                    margin="0 0 2rem 0"
                  />

                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 500,
                      mb: 2
                    }}
                  >
                    El paquete incluye:
                  </Typography>

                  <List>
                    {promotion.includes.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Check color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item} 
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '1rem'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ 
                      mt: 4,
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    Reservar Ahora
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default PromotionDetail;