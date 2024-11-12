import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, useTheme } from '@mui/material';
import { LogOut, User } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <NavigationLink to="/dashboard">Dashboard</NavigationLink>
          <NavigationLink to="/countries">Countries</NavigationLink>
          <NavigationLink to="/users">Users</NavigationLink>
          <NavigationLink to="/activities">Activities</NavigationLink>
          <NavigationLink to="/province">Province</NavigationLink>
          <NavigationLink to="/itineraries">Itineraries</NavigationLink>
          <NavigationLink to="/cities">Cities</NavigationLink>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" component={NavLink} to="/profile">
            <User />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogOut />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const NavigationLink = ({ to, children }) => {
  const theme = useTheme();
  return (
    <Button component={NavLink} to={to} color="inherit" sx={{ marginRight: theme.spacing(2) }}>
      {children}
    </Button>
  );
};

export default Navbar;