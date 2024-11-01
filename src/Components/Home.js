import React, { useState } from 'react';
import { Container, Card, CardContent, Tabs, Tab, Box, useTheme } from '@mui/material';
import Activities from './Activities';
import Itineraries from './Itineraries';
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
            <Activities />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Itineraries />
          </TabPanel>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Home;