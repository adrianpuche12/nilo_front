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
              <ListItem id={`activity-id-${item.id}`}>
                <ListItemText primary="ID" secondary={item.id} />
              </ListItem>
              <ListItem id={`activity-name-${item.id}`}>
                <ListItemText primary="Nombre" secondary={item.name} />
              </ListItem>
              <ListItem id={`activity-type-${item.id}`}>
                <ListItemText primary="Tipo" secondary={item.type || 'N/A'} />
              </ListItem>
              <ListItem id={`activity-duration-${item.id}`}>
                <ListItemText primary="Duración" secondary={`${item.duration || 'N/A'} minutos`} />
              </ListItem>
              <ListItem id={`activity-city-${item.id}`}>
                <ListItemText primary="Ciudad ID" secondary={item.cityId || 'N/A'} />
              </ListItem>
              <ListItem id={`activity-description-${item.id}`}>
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
              <ListItem id={`itinerary-id-${item.id}`}>
                <ListItemText primary="ID" secondary={item.id} />
              </ListItem>
              <ListItem id={`itinerary-name-${item.id}`}>
                <ListItemText primary="Nombre" secondary={item.name} />
              </ListItem>
              <ListItem id={`itinerary-city-${item.id}`}>
                <ListItemText primary="Ciudad ID" secondary={item.cityId || 'N/A'} />
              </ListItem>
              <ListItem id={`itinerary-activities-${item.id}`}>
                <ListItemText 
                  primary="Actividades" 
                  secondary={item.activities?.length > 0 ? 
                    `${item.activities.length} actividades incluidas` : 
                    'Sin actividades'} 
                />
              </ListItem>
              <ListItem id={`itinerary-description-${item.id}`}>
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
              <ListItem id={`promotion-id-${item.id}`}>
                <ListItemText primary="ID" secondary={item.id} />
              </ListItem>
              <ListItem id={`promotion-title-${item.id}`}>
                <ListItemText primary="Título" secondary={item.title} />
              </ListItem>
              <ListItem id={`promotion-shortDesc-${item.id}`}>
                <ListItemText primary="Descripción Corta" secondary={item.shortDescription} />
              </ListItem>
              <ListItem id={`promotion-fullDesc-${item.id}`}>
                <ListItemText 
                  primary="Descripción Completa" 
                  secondary={item.fullDescription || 'Sin descripción'} 
                  sx={{ wordBreak: 'break-word' }}
                />
              </ListItem>
              <ListItem id={`promotion-includes-${item.id}`}>
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
        id={`service-card-${type}-${item.id}`}
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
      <Container id="services-dashboard" maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <MainTitle text="Panel de Servicios" />
        <MainDescription1 text="Gestión centralizada de todos los servicios ofrecidos por la agencia." />

        <Box id="services-tabs" sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab id="tab-activities" label={`Actividades (${activities.length})`} />
            <Tab id="tab-itineraries" label={`Itinerarios (${itineraries.length})`} />
            <Tab id="tab-promotions" label={`Promociones (${promotionsData.length})`} />
          </Tabs>
        </Box>

        {loading ? (
          <Typography id="loading-services">Cargando servicios...</Typography>
        ) : error ? (
          <Typography id="error-services" color="error">{error}</Typography>
        ) : (
          <>
            <Grid id="services-grid" container spacing={3}>
              {getCurrentItems().map((item) => (
                <Grid id={`service-grid-item-${item.id}`} item xs={12} sm={6} md={4} key={item.id}>
                  <ServiceCard 
                    item={item} 
                    type={currentTab === 0 ? 'activity' : currentTab === 1 ? 'itinerary' : 'promotion'} 
                  />
                </Grid>
              ))}
            </Grid>
            
            <Stack id="services-pagination" spacing={2} alignItems="center" sx={{ mt: 4 }}>
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
