import React, { useState, useContext } from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import { LogOut, User, Menu } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import { ThemeContext } from './Utiles/Theme/ThemeProvider';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home'; // Importamos el ícono de "Home"

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { themeMode, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: "/countries", label: "Countries" },
    { to: "/users", label: "Users" },
    { to: "/activities", label: "Activities" },
    { to: "/province", label: "Province" },
    { to: "/itineraries", label: "Itineraries" },
    { to: "/cities", label: "Cities" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {navLinks.map((link) => (
        <ListItem key={link.to} onClick={() => setMobileOpen(false)}>
          <Button
            component={NavLink}
            to={link.to}
            color="inherit"
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
          >
            <ListItemText primary={link.label} />
          </Button>
        </ListItem>
      ))}
      <ListItem>
        <Button
          component={NavLink}
          to="/profile"
          color="inherit"
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
          startIcon={<User />}
        >
          Profile
        </Button>
      </ListItem>
      <ListItem>
        <Button
          color="inherit"
          fullWidth
          onClick={handleLogout}
          sx={{ justifyContent: 'flex-start' }}
          startIcon={<LogOut />}
        >
          Logout
        </Button>
      </ListItem>
    </List>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
        )}
        
        <Box 
          display={{ xs: 'none', md: 'flex' }} 
          alignItems="center" 
          flexGrow={1}
        >
          {navLinks.map((link) => (
            <NavigationLink key={link.to} to={link.to}>
              {link.label}
            </NavigationLink>
          ))}
        </Box>

        <Box display={{ xs: 'flex', md: 'flex' }} alignItems="center">
          {/* Ícono de Home visible en dispositivos móviles */}
          <IconButton color="inherit" component={NavLink} to="/">
            <HomeIcon />
          </IconButton>

          {/* Icono de cambio de tema */}
          <IconButton onClick={toggleTheme} color="inherit">
            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>

          {/* Íconos de perfil y logout */}
          <IconButton color="inherit" component={NavLink} to="/profile">
            <User />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogOut />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240 
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

const NavigationLink = ({ to, children }) => {
  const theme = useTheme();
  return (
    <Button 
      component={NavLink} 
      to={to} 
      color="inherit" 
      sx={{ marginRight: theme.spacing(2) }}
    >
      {children}
    </Button>
  );
};

export default Navbar;
