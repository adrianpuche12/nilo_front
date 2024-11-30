import React, { useState } from 'react';
import { Container,  Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

import Title from '../Utiles/Title';
//import HomeCards from './HomeCards/HomeCards';
import AdminNavbar from './AdminNavBar';
import Footer from '../Footer';

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

function AdminHome() {
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
      <AdminNavbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Title text="Bienvenido al panel de administración" />        
      </Container>
      <Footer />
    </>
  );
}

export default AdminHome;