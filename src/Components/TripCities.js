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
import { useAuth } from './Auth/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const TripCities = () => {
  const { accessToken } = useAuth();
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

  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  // Traer TripCities y Ciudades
  useEffect(() => {
    if(accessToken){
    fetchTripCities();
    fetchCities(); // Llamada para obtener ciudades
    }
  }, [accessToken]);

  // Función para obtener TripCities
  const fetchTripCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tripCities`, getAxiosConfig);
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
      const response = await axios.get(`${API_URL}/cities`, getAxiosConfig);
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
      await axios.post(`${API_URL}/tripCities`, newTripCity, getAxiosConfig);
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
      await axios.put(`${API_URL}/tripCities/${currentTripCity.id}`, currentTripCity, getAxiosConfig);
      await fetchTripCities();
      handleClose();
    } catch (err) {
      setError('Error al actualizar el TripCity: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este TripCity?')) {
      try {
        await axios.delete(`${API_URL}/tripCities/${id}`, getAxiosConfig);
        await fetchTripCities();
      } catch (err) {
        setError('Error al eliminar el TripCity: ' + err.message);
      }
    }
  };

  if (loading) return <Typography>Cargando TripCities...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ padding: '20px' }} id="tripCities-container">
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2} id="header-grid">
        <Grid item id="title-grid">
          <Typography variant="h4" gutterBottom id="title">
            Gestión de TripCities
          </Typography>
        </Grid>
        <Grid item id="button-grid">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpen}
            startIcon={<AddIcon />}
            id="new-tripCity-button"
          >
            Nuevo TripCity
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} id="table-container">
        <Table id="tripCities-table">
          <TableHead>
            <TableRow>
              <TableCell id="table-header-id">ID</TableCell>
              <TableCell id="table-header-tripId">Trip ID</TableCell>
              <TableCell id="table-header-cityId">City ID</TableCell>
              <TableCell id="table-header-duration">Duración (días)</TableCell>
              <TableCell id="table-header-order">Orden</TableCell>
              <TableCell id="table-header-actions">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tripCities.map(trip => (
              <TableRow key={trip.id} id={`table-row-${trip.id}`}>
                <TableCell id={`table-cell-id-${trip.id}`}>{trip.id}</TableCell>
                <TableCell id={`table-cell-tripId-${trip.id}`}>{trip.tripId}</TableCell>
                <TableCell id={`table-cell-cityId-${trip.id}`}>{trip.cityId}</TableCell>
                <TableCell id={`table-cell-duration-${trip.id}`}>{trip.duration}</TableCell>
                <TableCell id={`table-cell-order-${trip.id}`}>{trip.order}</TableCell>
                <TableCell id={`table-cell-actions-${trip.id}`}>
                  <IconButton color="primary" onClick={() => handleEdit(trip)} id={`edit-button-${trip.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(trip.id)} id={`delete-button-${trip.id}`}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar TripCity */}
      <Dialog open={open} onClose={handleClose} id="tripCity-dialog">
        <DialogTitle id="dialog-title">{editMode ? 'Editar TripCity' : 'Nuevo TripCity'}</DialogTitle>
        <DialogContent id="dialog-content">
          <TextField 
            name="tripId" 
            label="Trip ID" 
            fullWidth 
            value={currentTripCity.tripId} 
            onChange={handleChange} 
            margin="normal"
            id="tripId-input"
          />
          <TextField 
            name="cityId" 
            label="City ID" 
            fullWidth 
            value={currentTripCity.cityId} 
            onChange={handleChange} 
            margin="normal"
            id="cityId-input"
          />
          <TextField 
            name="duration" 
            label="Duración (días)" 
            fullWidth 
            value={currentTripCity.duration} 
            onChange={handleChange} 
            margin="normal"
            id="duration-input"
          />
          <TextField 
            name="order" 
            label="Orden" 
            fullWidth 
            value={currentTripCity.order} 
            onChange={handleChange} 
            margin="normal"
            id="order-input"
          />
        </DialogContent>
        <DialogActions id="dialog-actions">
          <Button onClick={handleClose} id="cancel-button">Cancelar</Button>
          <Button onClick={editMode ? handleUpdate : handleCreate} variant="contained" color="primary" id="submit-button">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TripCities;
