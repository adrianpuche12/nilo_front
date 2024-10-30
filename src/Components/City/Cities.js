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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const Cities = () => {
  const initialCities = [
    { id: 1, name: 'New York', description: 'The Big Apple', provinceId: 1 },
    { id: 2, name: 'Los Angeles', description: 'City of Angels', provinceId: 2 },
  ];

  const [cities, setCities] = useState(initialCities);
  const [open, setOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCity, setCurrentCity] = useState({ name: '', description: '', provinceId: '' });
  const [batchCities, setBatchCities] = useState([]);
  const [tempCity, setTempCity] = useState({ name: '', description: '', provinceId: '' });
  const [confirmDeleteCityId, setConfirmDeleteCityId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentCity({ name: '', description: '', provinceId: '' });
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleBatchOpen = () => {
    setBatchOpen(true);
    setBatchCities([]);
    setTempCity({ name: '', description: '', provinceId: '' });
  };

  const handleBatchClose = () => {
    setBatchOpen(false);
    setBatchCities([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCity((prev) => ({ ...prev, [name]: value }));
  };

  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempCity((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToBatch = () => {
    if (tempCity.name && tempCity.description && tempCity.provinceId) {
      setBatchCities([...batchCities, { ...tempCity }]);
      setTempCity({ name: '', description: '', provinceId: '' });
    }
  };

  const handleRemoveFromBatch = (index) => {
    setBatchCities(batchCities.filter((_, i) => i !== index));
  };

  const handleSaveBatch = () => {
    const maxId = Math.max(...cities.map((city) => city.id), 0);
    const newCities = batchCities.map((city, index) => ({
      ...city,
      id: maxId + index + 1,
    }));
    setCities([...cities, ...newCities]);
    handleBatchClose();
  };

  const handleCreate = () => {
    if (!currentCity.name || !currentCity.description || !currentCity.provinceId) {
      alert("Por favor, completa todos los campos antes de agregar la ciudad.");
      return;
    }

    const maxId = Math.max(...cities.map((city) => city.id), 0);
    const newCity = { id: maxId + 1, ...currentCity };
    setCities([...cities, newCity]);
    handleClose();
  };

  const handleEdit = (city) => {
    setCurrentCity(city);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = () => {
    setCities(cities.map((city) => (city.id === currentCity.id ? currentCity : city)));
    handleClose();
  };

  const confirmDeleteCity = (id) => {
    setConfirmDeleteCityId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setConfirmDeleteOpen(false);
    setConfirmDeleteCityId(null);
  };

  const deleteCity = () => {
    setCities(cities.filter((city) => city.id !== confirmDeleteCityId));
    handleDeleteConfirmClose();
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Gestión de Ciudades
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
            Nueva Ciudad
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBatchOpen}
            startIcon={<PlaylistAddIcon />}
          >
            Crear lista de ciudades
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>ID Provincia</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell>{city.id}</TableCell>
                <TableCell>{city.name}</TableCell>
                <TableCell>{city.description}</TableCell>
                <TableCell>{city.provinceId}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(city)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => confirmDeleteCity(city.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmación para eliminar ciudad */}
      <Dialog open={confirmDeleteOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar esta ciudad?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteCity} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo crear/editar ciudad */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Editar Ciudad' : 'Nueva Ciudad'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                value={currentCity.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                value={currentCity.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="provinceId"
                label="ID Provincia"
                type="number"
                fullWidth
                value={currentCity.provinceId}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={editMode ? handleUpdate : handleCreate} variant="contained" color="primary">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear lista de ciudades */}
      <Dialog open={batchOpen} onClose={handleBatchClose} maxWidth="md" fullWidth>
        <DialogTitle>Nuevas Ciudades</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                value={tempCity.name}
                onChange={handleTempChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                value={tempCity.description}
                onChange={handleTempChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="provinceId"
                label="ID Provincia"
                type="number"
                fullWidth
                value={tempCity.provinceId}
                onChange={handleTempChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToBatch}
                startIcon={<AddIcon />}
                fullWidth
              >
                Añadir Ciudad
              </Button>
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Ciudades en la Lista ({batchCities.length})
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>ID Provincia</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batchCities.map((city, index) => (
                  <TableRow key={index}>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>{city.description}</TableCell>
                    <TableCell>{city.provinceId}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveFromBatch(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBatchClose}>Cancelar</Button>
          <Button onClick={handleSaveBatch} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cities;
