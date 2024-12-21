import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Paper,
} from '@mui/material';
import { Menu as MenuIcon, LogOut, User } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import axios from 'axios';
import { ThemeContext } from '../Utiles/Theme/ThemeProvider';
import { LanguageContext } from '../../Contexts/LanguageContext';
import { translations } from '../../Contexts/Translations';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import { US, ES } from 'country-flag-icons/react/3x2';

const UserNavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const { currentLanguage, toggleLanguage } = useContext(LanguageContext);

  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [promotions, setPromotions] = useState([
    { id: 1, title: translations[currentLanguage].promoMountain },
    { id: 2, title: translations[currentLanguage].promoCaribbean },
    { id: 3, title: translations[currentLanguage].promoCity }
  ]);

  const getAxiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  }), [accessToken]);

  useEffect(() => {
    if (accessToken) {
      axios.get(`${process.env.REACT_APP_API_URL}/activities`, getAxiosConfig())
        .then(response => setActivities(response.data))
        .catch(error => console.error('Error fetching activities:', error));

      axios.get(`${process.env.REACT_APP_API_URL}/itineraries`, getAxiosConfig())
        .then(response => setItineraries(response.data))
        .catch(error => console.error('Error fetching itineraries:', error));
    }
  }, [accessToken, getAxiosConfig]);

  const handleMenuEnter = (menuName) => {
    setHoveredMenu(menuName);
  };

  const handleMenuLeave = () => {
    setHoveredMenu(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const LanguageIcon = () => {
    const tooltipText = currentLanguage === 'en' ? 'Cambiar a Español' : 'Switch to English';
    
    return (
      <Tooltip title={tooltipText}>
        <IconButton
          color="inherit"
          onClick={toggleLanguage}
          sx={{
            padding: '8px',
            '& svg': {
              width: '24px',
              height: '16px',
            }
          }}
        >
          {currentLanguage === 'en' ? <US title="US Flag" /> : <ES title="Spanish Flag" />}
        </IconButton>
      </Tooltip>
    );
  };

  const handleItemClick = (type, id) => {
    setHoveredMenu(null);
    setMobileOpen(false);
    switch (type) {
      case 'activity':
        navigate(`/activities/${id}`);
        break;
      case 'itinerary':
        navigate(`/itineraries/${id}`);
        break;
      case 'promotion':
        navigate(`/promotions/${id}`);
        break;
      default:
        break;
    }
  };

  const MenuComponent = ({ items, type, menuName }) => (
    <Box
      onMouseEnter={() => handleMenuEnter(menuName)}
      onMouseLeave={handleMenuLeave}
      sx={{ position: 'relative', display: 'inline-block' }}
    >
      <Button 
        color="inherit"
        sx={{ 
          backgroundColor: hoveredMenu === menuName ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {translations[currentLanguage][menuName.toLowerCase()]}
      </Button>
      {hoveredMenu === menuName && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: '200px',
            zIndex: 1000,
            mt: 0,
            borderTop: '4px solid transparent'
          }}
        >
          {items.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => handleItemClick(type, item.id)}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              {item.name || item.title}
            </MenuItem>
          ))}
        </Paper>
      )}
    </Box>
  );

  const drawerContent = (
    <List>
      {['Activities', 'Itineraries', 'Promotions'].map((section) => (
        <React.Fragment key={section}>
          <ListItem button onClick={() => handleMenuEnter(section)}>
            <ListItemText primary={translations[currentLanguage][section.toLowerCase()]} />
          </ListItem>
          {hoveredMenu === section && (
            <List>
              {(section === 'Activities' ? activities :
                section === 'Itineraries' ? itineraries :
                promotions).map((item) => (
                <ListItem
                  button
                  key={item.id}
                  sx={{ pl: 4 }}
                  onClick={() => handleItemClick(section.toLowerCase().slice(0, -1), item.id)}
                >
                  <ListItemText primary={item.name || item.title} />
                </ListItem>
              ))}
            </List>
          )}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
            >
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <Box display="flex" gap={2}>
            <MenuComponent items={activities} type="activity" menuName="Activities" />
            <MenuComponent items={itineraries} type="itinerary" menuName="Itineraries" />
            <MenuComponent items={promotions} type="promotion" menuName="Promotions" />
          </Box>
        )}

        <Box sx={{ marginLeft: 'auto' }} display="flex" alignItems="center" gap={1}>
          <IconButton color="inherit" component={NavLink} to="/">
            <HomeIcon />
          </IconButton>

          <LanguageIcon />

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
      </Toolbar>
    </AppBar>
  );
};

export default UserNavBar;