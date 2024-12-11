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
import HomeIcon from '@mui/icons-material/Home'; 

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
    { to: "/userReservations", label: "Reservas" },
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
    </List>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {isMobile ? (
          <>
            {/* Menú hamburguesa */}
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <Menu />
              </IconButton>
            </Box>

            {/* Ícono de Home al centro */}
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <IconButton color="inherit" component={NavLink} to="/">
                <HomeIcon />
              </IconButton>
            </Box>

            {/* Iconos al extremo derecho */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Icono de cambio de tema */}
              <IconButton onClick={toggleTheme} color="inherit">
                {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>

              {/* Ícono de perfil */}
              <IconButton color="inherit" component={NavLink} to="/profile">
                <User />
              </IconButton>

              {/* Ícono de logout */}
              <IconButton color="inherit" onClick={handleLogout}>
                <LogOut />
              </IconButton>
            </Box>
          </>
        ) : (
          <>
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
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton color="inherit" component={NavLink} to="/">
                <HomeIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={toggleTheme} color="inherit">
                {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
              <IconButton color="inherit" component={NavLink} to="/profile">
                <User />
              </IconButton>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogOut />
              </IconButton>
            </Box>
          </>
        )}
      </Toolbar>

      {/* Drawer para el menú en móviles */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Mejora de rendimiento en móviles
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
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
