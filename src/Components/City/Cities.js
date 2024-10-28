// src/Components/Cities.js
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const Cities = () => {
  const [cityId, setCityId] = useState('');
  const [city, setCity] = useState(null);
  const [cities, setCities] = useState([
    { id: 1, name: 'New York', description: 'The Big Apple', province: { id: 1, name: 'New York State' } },
    { id: 2, name: 'Los Angeles', description: 'City of Angels', province: { id: 2, name: 'California' } },
  ]);
  const [newCityName, setNewCityName] = useState('');
  const [newCityDescription, setNewCityDescription] = useState('');
  const [newProvinceId, setNewProvinceId] = useState('');
  const [editCity, setEditCity] = useState(null);
  const [error, setError] = useState(null);

  // Simulación de búsqueda de ciudad
  const fetchCity = () => {
    const foundCity = cities.find((c) => c.id === Number(cityId));
    if (foundCity) {
      setCity(foundCity);
      setError(null);
    } else {
      setError('City not found');
      setCity(null);
    }
  };

  // Simulación de agregar ciudad
  const addCity = () => {
    const newCity = {
      id: cities.length + 1,
      name: newCityName,
      description: newCityDescription,
      province: { id: Number(newProvinceId), name: `Province ${newProvinceId}` },
    };
    setCities([...cities, newCity]);
    setNewCityName('');
    setNewCityDescription('');
    setNewProvinceId('');
  };

  // Simulación de eliminar ciudad
  const deleteCity = (id) => {
    setCities(cities.filter((city) => city.id !== id));
  };

  // Iniciar la edición de la ciudad
  const startEditCity = (city) => {
    setEditCity(city);
  };

  // Guardar cambios de la ciudad
  const saveEditCity = () => {
    setCities(cities.map((c) => (c.id === editCity.id ? editCity : c)));
    setEditCity(null);
  };

  return (
    <Card sx={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          City Management (Simulated)
        </Typography>

        {/* Sección para obtener ciudad por ID */}
        <Typography variant="h6" component="div" gutterBottom>
          Get City by ID
        </Typography>
        <TextField
          label="City ID"
          variant="outlined"
          type="number"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={fetchCity} fullWidth>
          Fetch City
        </Button>
        {error && <Typography color="error" marginTop="10px">{error}</Typography>}

        {/* Tabla para mostrar el City específico si se encuentra */}
        {city && (
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Province ID</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{city.id}</TableCell>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>{city.description}</TableCell>
                  <TableCell>{city.province.id}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Sección para agregar una nueva ciudad */}
        <Typography variant="h6" component="div" gutterBottom style={{ marginTop: '20px' }}>
          Add New City
        </Typography>
        <TextField
          label="City Name"
          variant="outlined"
          value={newCityName}
          onChange={(e) => setNewCityName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          variant="outlined"
          value={newCityDescription}
          onChange={(e) => setNewCityDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Province ID"
          variant="outlined"
          value={newProvinceId}
          onChange={(e) => setNewProvinceId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={addCity} fullWidth>
          Add City
        </Button>

        {/* Tabla de ciudades existentes */}
        <Typography variant="h6" component="div" gutterBottom style={{ marginTop: '20px' }}>
          Existing Cities
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>City ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Province ID</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cities.map(city => (
                <TableRow key={city.id}>
                  <TableCell>{city.id}</TableCell>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>{city.description}</TableCell>
                  <TableCell>{city.province.id}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => startEditCity(city)}
                      sx={{ marginRight: '8px', minWidth: '80px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteCity(city.id)}
                      sx={{ minWidth: '80px' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Diálogo de edición de ciudad */}
        <Dialog open={!!editCity} onClose={() => setEditCity(null)}>
          <DialogTitle>Edit City</DialogTitle>
          <DialogContent>
            <TextField
              label="City Name"
              variant="outlined"
              value={editCity?.name || ''}
              onChange={(e) => setEditCity({ ...editCity, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              variant="outlined"
              value={editCity?.description || ''}
              onChange={(e) => setEditCity({ ...editCity, description: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Province ID"
              variant="outlined"
              value={editCity?.province.id || ''}
              onChange={(e) => setEditCity({ ...editCity, province: { id: Number(e.target.value) } })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditCity(null)} color="secondary">Cancel</Button>
            <Button onClick={saveEditCity} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Cities;
