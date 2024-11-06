import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Card, CardContent, Tabs, Tab, Box, useTheme } from '@mui/material';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import ActivitiesList from './Activities/ActivitiesList';
import ItinerariesList from './Itineraries/ItinerariesList';
import Title from './Utiles/Title';

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
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit">
            Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            startIcon={<LogOut size={20} />}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
              }
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Title text="Componente Home" />

        <Card variant="outlined">
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: theme.palette.grey[50],
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
            backgroundColor: '#ffffff'
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
    </>
  );
}

export default Home;