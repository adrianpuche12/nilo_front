import React, { useState } from 'react';
import { Container, Card, CardContent, Tabs, Tab, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import ActivitiesList from './Activities/ActivitiesCard';
import ItinerariesList from './Itineraries/ItinerariesCard';
import Title from './Utiles/Title';
import HomeCards from './HomeCards/HomeCards';
import Navbar from './NavBar';
import Footer from './Footer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Home() {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Title text="Componente Home" />

        {/* Aquí se agrega el componente HomeCards */}
        <HomeCards />

        <Card variant="outlined">
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: theme.palette.background.default,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="navigation tabs"
              centered
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  minHeight: 56,
                  py: 2,
                  px: 4,
                  color: theme.palette.text.secondary,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                  '&:hover': {
                    color: theme.palette.primary.main,
                    opacity: 0.8,
                  },
                }
              }}
            >
              <Tab
                label="Actividades"
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab
                label="Itinerarios"
                id="tab-1"
                aria-controls="tabpanel-1"
              />
            </Tabs>
          </Box>

          <CardContent sx={{
            p: 0,
            '&:last-child': {
              pb: 0
            },
            backgroundColor: theme.palette.background.default
          }}>
            <TabPanel value={value} index={0}>
              <ActivitiesList />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ItinerariesList />
            </TabPanel>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default Home;