import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,  
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const TripCities = () => {
  const [tripCities, setTripCities] = useState([
    { id: 1, tripId: 101, cityId: 1001, duration: 5, order: 1 },
    { id: 2, tripId: 102, cityId: 1002, duration: 3, order: 2 },
  ]);
  const [open, setOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTripCity, setCurrentTripCity] = useState({
    tripId: '',
    cityId: '',
    duration: '',
    order: ''
  });
  const [batchTripCities, setBatchTripCities] = useState([]);
  const [tempTripCity, setTempTripCity] = useState({
    tripId: '',
    cityId: '',
    duration: '',
    order: ''
  });

  // Funciones para el diálogo individual
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTripCity(prev => ({ ...prev, [name]: value }));
  };

  // Funciones para el diálogo en lote
  const handleBatchOpen = () => {
    setBatchOpen(true);
    setBatchTripCities([]);
    setTempTripCity({
      tripId: '',
      cityId: '',
      duration: '',
      order: ''
    });
  };

  const handleBatchClose = () => {
    setBatchOpen(false);
    setBatchTripCities([]);
  };

  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempTripCity(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToBatch = () => {
    if (tempTripCity.tripId && tempTripCity.cityId && tempTripCity.duration && tempTripCity.order) {
      setBatchTripCities([...batchTripCities, { ...tempTripCity }]);
      setTempTripCity({
        tripId: '',
        cityId: '',
        duration: '',
        order: ''
      });
    } else {
      alert("Por favor, completa todos los campos antes de añadir a la lista.");
    }
  };

  const handleRemoveFromBatch = (index) => {
    setBatchTripCities(batchTripCities.filter((_, i) => i !== index));
  };

  const handleSaveBatch = () => {
    const maxId = Math.max(...tripCities.map(trip => trip.id), 0);
    const newTrips = batchTripCities.map((trip, index) => ({
      ...trip,
      id: maxId + index + 1
    }));
    setTripCities([...tripCities, ...newTrips]);
    handleBatchClose();
  };

  const handleCreate = () => {
    if (!currentTripCity.tripId || !currentTripCity.cityId || !currentTripCity.duration || !currentTripCity.order) {
      alert("Por favor, completa todos los campos antes de crear el TripCity.");
      return;
    }

    const maxId = Math.max(...tripCities.map(trip => trip.id), 0);
    const newTrip = {
      id: maxId + 1,
      ...currentTripCity
    };
    setTripCities([...tripCities, newTrip]);
    handleClose();
  };

  const handleEdit = (trip) => {
    setCurrentTripCity(trip);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = () => {
    setTripCities(tripCities.map(trip =>
      trip.id === currentTripCity.id ? currentTripCity : trip
    ));
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este TripCity?')) {
      setTripCities(tripCities.filter(trip => trip.id !== id));
    }
  };

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
            sx={{ mr: 2 }}
          >
            Nuevo TripCity
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBatchOpen}
            startIcon={<PlaylistAddIcon />}
          >
            Crear lista de TripCities
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

      {/* Diálogo para crear/editar TripCity individual */}
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

      {/* Diálogo para crear lista de TripCities */}
      <Dialog open={batchOpen} onClose={handleBatchClose} maxWidth="md" fullWidth>
        <DialogTitle>Nuevos TripCities</DialogTitle>
        <DialogContent>
          <TextField name="tripId" label="Trip ID" fullWidth value={tempTripCity.tripId} onChange={handleTempChange} margin="normal" />
          <TextField name="cityId" label="City ID" fullWidth value={tempTripCity.cityId} onChange={handleTempChange} margin="normal" />
          <TextField name="duration" label="Duración (días)" fullWidth value={tempTripCity.duration} onChange={handleTempChange} margin="normal" />
          <TextField name="order" label="Orden" fullWidth value={tempTripCity.order} onChange={handleTempChange} margin="normal" />
          <Button variant="contained" color="primary" onClick={handleAddToBatch} startIcon={<AddIcon />} fullWidth sx={{ mt: 2 }}>
            Añadir a la lista
          </Button>

          <Typography variant="h6" gutterBottom marginTop={2}>
            TripCities en la lista:
          </Typography>
          <List>
            {batchTripCities.map((trip, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Trip ID: ${trip.tripId}, City ID: ${trip.cityId}, Duración: ${trip.duration}, Orden: ${trip.order}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromBatch(index)}>
                    <DeleteIcon sx={{ color: 'red' }} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBatchClose}>Cancelar</Button>
          <Button onClick={handleSaveBatch} variant="contained" color="primary">
            Guardar lista
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TripCities;
