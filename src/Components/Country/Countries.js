import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import countries from '../../jsons/countries';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Countries() {
  const navigate = useNavigate();
  const handleCountriesClick = (id) => {
    console.log(`Clicked on country with id: ${id}`);
    navigate(`/country-detail/${id}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 2,
        bgcolor: 'background.default',
      }}
    >
      {countries.map((country) => (
        <Card
          key={country.id}
          sx={{
            width: 240,
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.05)' },
            boxShadow: 3,
          }}
          onClick={() => handleCountriesClick(country.id)}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}
            >
              {country.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', color: 'text.secondary', mt: 1 }}
            >
              {country.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Countries;
