import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, Grid, CardMedia, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ArrowBack, Check } from '@mui/icons-material';
import { promotionsData } from './PromotionData';
import Footer from '../Footer';
import Subtitulo1 from '../Utiles/Subtitulo1';
import Descripcion1 from '../Utiles/Descripcion1';

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
        id={`promotion-not-found-${id}`}
      >
        <Typography color="error" gutterBottom id={`promotion-not-found-text-${id}`}>
          Promoción no encontrada
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          id={`back-to-home-button-${id}`}
        >
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }} id={`promotion-container-${id}`}>
        <Box mb={4} id={`promotion-box-${id}`}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
            id={`back-button-${id}`}
          >
            Volver
          </Button>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }} id={`promotion-paper-${id}`}>
            <Grid container id={`promotion-grid-${id}`}>
              <Grid item xs={12} md={6} id={`promotion-image-grid-${id}`}>
                <CardMedia
                  component="img"
                  height={400}
                  image={promotion.image}
                  alt={promotion.title}
                  sx={{ objectFit: 'cover' }}
                  id={`promotion-image-${id}`}
                />
              </Grid>
              <Grid item xs={12} md={6} id={`promotion-info-grid-${id}`}>
                <Box sx={{ p: 4 }} id={`promotion-info-box-${id}`}>
                  <Subtitulo1
                    text={promotion.title}
                    color="primary.main"
                    margin="0 0 1rem 0"
                    id={`promotion-title-${id}`}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontStyle: 'italic',
                      mb: 3,
                      color: 'text.secondary'
                    }}
                    id={`promotion-description-${id}`}
                  >
                    {promotion.description}
                  </Typography>

                  <Descripcion1
                    text={promotion.fullDescription}
                    margin="0 0 2rem 0"
                    id={`promotion-full-description-${id}`}
                  />

                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 500,
                      mb: 2
                    }}
                    id={`includes-title-${id}`}
                  >
                    El paquete incluye:
                  </Typography>

                  <List id={`promotion-includes-list-${id}`}>
                    {promotion.includes.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }} id={`include-item-${id}-${index}`}>
                        <ListItemIcon sx={{ minWidth: 36 }} id={`include-icon-${id}-${index}`}>
                          <Check color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '1rem'
                            }
                          }}
                          id={`include-text-${id}-${index}`}
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
                    id={`reserve-now-button-${id}`}
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