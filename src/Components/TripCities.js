import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
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
  IconButton,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`
  }
};

const TripCities = () => {
  const [tripCities, setTripCities] = useState([]);
  const [cities, setCities] = useState([]); //para manejar ciudades
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTripCity, setCurrentTripCity] = useState({
    tripId: '',
    cityId: '',
    duration: '',
    order: ''
  });

  // Traer TripCities y Ciudades
  useEffect(() => {
    fetchTripCities();
    fetchCities(); // Llamada para obtener ciudades
  }, []);

  // Función para obtener TripCities
  const fetchTripCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tripCities`, axiosConfig);
      setTripCities(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los TripCities: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener Ciudades
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`, axiosConfig);
      setCities(response.data);
    } catch (err) {
      setError('Error al cargar las ciudades: ' + err.message);
    }
  };

  // Manejadores para el diálogo
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentTripCity({
      tripId: '',
      cityId: '',
      duration: '',
      order: ''
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  // Manejador para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTripCity(prev => ({ ...prev, [name]: value }));
  };

  // Crear nuevo TripCity 
  const handleCreate = async () => {
    try {
      const newTripCity = { ...currentTripCity }; // Se podría necesitar ajustes en la estructura
      await axios.post(`${API_URL}/tripCities`, newTripCity, axiosConfig);
      await fetchTripCities();
      handleClose();
    } catch (err) {
      setError('Error al crear el TripCity: ' + err.message);
    }
  };

  // Funciones de editar, actualizar y eliminar
  const handleEdit = (trip) => {
    setCurrentTripCity(trip);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/tripCities/${currentTripCity.id}`, currentTripCity, axiosConfig);
      await fetchTripCities();
      handleClose();
    } catch (err) {
      setError('Error al actualizar el TripCity: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este TripCity?')) {
      try {
        await axios.delete(`${API_URL}/tripCities/${id}`, axiosConfig);
        await fetchTripCities();
      } catch (err) {
        setError('Error al eliminar el TripCity: ' + err.message);
      }
    }
  };

  if (loading) return <Typography>Cargando TripCities...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ padding: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Gestión de TripCities
          </Typography>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpen}
            startIcon={<AddIcon />}
          >
            Nuevo TripCity
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Trip ID</TableCell>
              <TableCell>City ID</TableCell>
              <TableCell>Duración (días)</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tripCities.map(trip => (
              <TableRow key={trip.id}>
                <TableCell>{trip.id}</TableCell>
                <TableCell>{trip.tripId}</TableCell>
                <TableCell>{trip.cityId}</TableCell>
                <TableCell>{trip.duration}</TableCell>
                <TableCell>{trip.order}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(trip)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(trip.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar TripCity */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Editar TripCity' : 'Nuevo TripCity'}</DialogTitle>
        <DialogContent>
          <TextField name="tripId" label="Trip ID" fullWidth value={currentTripCity.tripId} onChange={handleChange} margin="normal" />
          <TextField name="cityId" label="City ID" fullWidth value={currentTripCity.cityId} onChange={handleChange} margin="normal" />
          <TextField name="duration" label="Duración (días)" fullWidth value={currentTripCity.duration} onChange={handleChange} margin="normal" />
          <TextField name="order" label="Orden" fullWidth value={currentTripCity.order} onChange={handleChange} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={editMode ? handleUpdate : handleCreate} variant="contained" color="primary">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TripCities;
