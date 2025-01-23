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
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { LogOut, User, Menu } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { ThemeContext } from '../Utiles/Theme/ThemeProvider';
import { LanguageContext } from '../../Contexts/LanguageContext';
import { translations } from '../../Contexts/Translations';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import { US, ES } from 'country-flag-icons/react/3x2';

const AdminNavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const { currentLanguage, toggleLanguage } = useContext(LanguageContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: "/services", label: translations[currentLanguage].services },
    { to: "/countries", label: translations[currentLanguage].countries },
    { to: "/users", label: translations[currentLanguage].users },
    { to: "/activities", label: translations[currentLanguage].activities },
    { to: "/province", label: translations[currentLanguage].province },
    { to: "/itineraries", label: translations[currentLanguage].itineraries },
    { to: "/cities", label: translations[currentLanguage].cities },
    { to: "/userReservations", label: translations[currentLanguage].reservations }
  ];

  const LanguageIcon = () => {
    const tooltipText = currentLanguage === 'en' ? 'Cambiar a Español' : 'Switch to English';

    return (
      <Tooltip title={tooltipText}>
        <IconButton
          color="inherit"
          onClick={toggleLanguage}
          id="language-toggle-button"
          sx={{
            padding: '8px',
            '& svg': {
              width: '24px',
              height: '16px',
            }
          }}
        >
          {currentLanguage === 'en' ? <US title="US Flag" id="us-flag" /> : <ES title="Spanish Flag" id="es-flag" />}
        </IconButton>
      </Tooltip>
    );
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List id="drawer-list">
      {navLinks.map((link) => (
        <ListItem key={link.to} onClick={() => setMobileOpen(false)} id={`drawer-item-${link.to}`}>
          <Button
            component={NavLink}
            to={link.to}
            color="inherit"
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
            id={`drawer-link-${link.to}`}
          >
            <ListItemText primary={link.label} id={`drawer-text-${link.to}`} />
          </Button>
        </ListItem>
      ))}
      <ListItem id="drawer-item-profile">
        <Button
          component={NavLink}
          to="/profile"
          color="inherit"
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
          startIcon={<User />}
          id="drawer-profile-button"
        >
          {translations[currentLanguage].profile}
        </Button>
      </ListItem>
      <ListItem id="drawer-item-logout">
        <Button
          color="inherit"
          fullWidth
          onClick={handleLogout}
          sx={{ justifyContent: 'flex-start' }}
          startIcon={<LogOut />}
          id="drawer-logout-button"
        >
          {translations[currentLanguage].logout}
        </Button>
      </ListItem>
    </List>
  );

  return (
    <AppBar position="static" color="primary" id="admin-navbar">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
            id="menu-button"
          >
            <Menu />
          </IconButton>
        )}

        <Box
          display={{ xs: 'none', md: 'flex' }}
          alignItems="center"
          flexGrow={1}
          id="navbar-links"
        >
          {navLinks.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              color="inherit"
              sx={{ marginRight: theme.spacing(2) }}
              id={`navbar-link-${link.to}`}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap={1} id="navbar-icons">
          <IconButton
            color="inherit"
            onClick={() => navigate('/admin/adminhome', { replace: true })}
            id="home-button"
          >
            <HomeIcon />
          </IconButton>

          <LanguageIcon />

          <IconButton onClick={toggleTheme} color="inherit" id="theme-toggle-button">
            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>

          <IconButton color="inherit" component={NavLink} to="/profile" id="profile-button">
            <User />
          </IconButton>

          <IconButton color="inherit" onClick={handleLogout} id="logout-button">
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
        id="mobile-drawer"
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default AdminNavBar;
