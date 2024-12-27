import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Tabs, Tab, Pagination, Stack, useTheme, useMediaQuery, Divider, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import AdminNavbar from '../Admin/AdminNavbar';
import Footer from '../Footer';
import { MainTitle, MainDescription1 } from '../Utiles/MainComponents';
import { promotionsData } from '../Promotions/PromotionData';

const ServicesDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 6;

  const getAxiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${accessToken}` }
  }), [accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activitiesRes, itinerariesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/activities`, getAxiosConfig()),
          axios.get(`${process.env.REACT_APP_API_URL}/itineraries`, getAxiosConfig())
        ]);

        setActivities(activitiesRes.data);
        setItineraries(itinerariesRes.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken, getAxiosConfig]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getCurrentItems = () => {
    let items = [];
    switch (currentTab) {
      case 0:
        items = activities;
        break;
      case 1:
        items = itineraries;
        break;
      case 2:
        items = promotionsData;
        break;
      default:
        items = activities;
    }
    
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  const getTotalPages = () => {
    let totalItems = 0;
    switch (currentTab) {
      case 0:
        totalItems = activities.length;
        break;
      case 1:
        totalItems = itineraries.length;
        break;
      case 2:
        totalItems = promotionsData.length;
        break;
      default:
        totalItems = 0;
    }
    return Math.ceil(totalItems / itemsPerPage);
  };



  const ServiceCard = ({ item, type }) => {
    const renderAttributes = () => {
      switch (type) {
        case 'activity':
          return (
            <List dense>
              <ListItem>
                <ListItemText primary="ID" secondary={item.id} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Nombre" secondary={item.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tipo" secondary={item.type || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Duración" secondary={`${item.duration || 'N/A'} minutos`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ciudad ID" secondary={item.cityId || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Descripción" 
                  secondary={item.description || 'Sin descripción'} 
                  sx={{ wordBreak: 'break-word' }}
                />
              </ListItem>
            </List>
          );
        
        case 'itinerary':
          return (
            <List dense>
              <ListItem>
                <ListItemText primary="ID" secondary={item.id} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Nombre" secondary={item.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ciudad ID" secondary={item.cityId || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Actividades" 
                  secondary={item.activities?.length > 0 ? 
                    `${item.activities.length} actividades incluidas` : 
                    'Sin actividades'} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Descripción" 
                  secondary={item.description || 'Sin descripción'} 
                  sx={{ wordBreak: 'break-word' }}
                />
              </ListItem>
            </List>
          );
        
        case 'promotion':
          return (
            <List dense>
              <ListItem>
                <ListItemText primary="ID" secondary={item.id} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Título" secondary={item.title} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Descripción Corta" secondary={item.shortDescription} />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Descripción Completa" 
                  secondary={item.fullDescription || 'Sin descripción'} 
                  sx={{ wordBreak: 'break-word' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Incluye" 
                  secondary={
                    item.includes?.length > 0 ? 
                      item.includes.join(', ') : 
                      'No especificado'
                  } 
                />
              </ListItem>
            </List>
          );
          
        default:
          return null;
      }
    };

    return (
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: 6
          }
        }}
      >
        <CardContent>
          {renderAttributes()}

        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <MainTitle text="Panel de Servicios" />
        <MainDescription1 text="Gestión centralizada de todos los servicios ofrecidos por la agencia." />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label={`Actividades (${activities.length})`} />
            <Tab label={`Itinerarios (${itineraries.length})`} />
            <Tab label={`Promociones (${promotionsData.length})`} />
          </Tabs>
        </Box>

        {loading ? (
          <Typography>Cargando servicios...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {getCurrentItems().map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <ServiceCard 
                    item={item} 
                    type={currentTab === 0 ? 'activity' : currentTab === 1 ? 'itinerary' : 'promotion'} 
                  />
                </Grid>
              ))}
            </Grid>
            
            <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
              <Pagination 
                count={getTotalPages()}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default ServicesDashboard;