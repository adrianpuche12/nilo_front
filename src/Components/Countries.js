import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Card, CardContent } from '@mui/material';

const Countries = () => {
  const [country, setCountry] = useState(null);
  const [countryId, setCountryId] = useState(1);
  const [error, setError] = useState(null);

  const fetchCountry = async () => {
    try {
      const response = await axios.get(`{{host}}/api/countries/${countryId}`, {
        headers: {
          Authorization: `Bearer {{token}}` 
        }
      });
      setCountry(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching country data');
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: '20px auto', padding: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Get Country by ID
        </Typography>
        <TextField
          label="Country ID"
          variant="outlined"
          type="number"
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={fetchCountry} fullWidth>
          Fetch Country
        </Button>
        {error && <Typography color="error" marginTop="10px">{error}</Typography>}
        {country && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6">Country Details</Typography>
            <Typography variant="body1"><strong>ID:</strong> {country.id}</Typography>
            <Typography variant="body1"><strong>Name:</strong> {country.name}</Typography>
            {/* Añadir más detalles según los datos disponibles */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Countries;
