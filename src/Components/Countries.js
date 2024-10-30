// src/Components/Countries.js

import React, { useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem, Grid, IconButton, List, ListItem, ListItemText, 
    ListItemSecondaryAction 
  } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const Countries = () => {
  // Datos simulados
  const initialCountries = [
    { id: 1, name: "Argentina", population: 45000000, region: "América" },
    { id: 2, name: "Brasil", population: 210000000, region: "América" },
    { id: 3, name: "Francia", population: 67000000, region: "Europa" },
  ];

  // Estados
  const [countries, setCountries] = useState(initialCountries);
  const [open, setOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCountry, setCurrentCountry] = useState({
    name: '',
    population: '',
    region: ''
  });
  const [batchCountries, setBatchCountries] = useState([]);
  const [tempCountry, setTempCountry] = useState({
    name: '',
    population: '',
    region: ''
  });

  // Regiones predefinidas
  const regions = ["América", "Europa", "Asia", "África", "Oceanía"];

  // Abrir diálogo para crear/editar
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentCountry({ name: '', population: '', region: '' });
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  // Abrir diálogo de lote
  const handleBatchOpen = () => {
    setBatchOpen(true);
    setBatchCountries([]);
    setTempCountry({ name: '', population: '', region: '' });
  };

  const handleBatchClose = () => {
    setBatchOpen(false);
    setBatchCountries([]);
  };

  // Cambios en el formulario individual
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCountry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cambios en el formulario de lote
  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempCountry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Añadir país a la lista de lote
  const handleAddToBatch = () => {
    if (tempCountry.name && tempCountry.population && tempCountry.region) {
      setBatchCountries([...batchCountries, { ...tempCountry }]);
      setTempCountry({ name: '', population: '', region: '' });
    }
  };

  // Remover país de la lista de lote
  const handleRemoveFromBatch = (index) => {
    setBatchCountries(batchCountries.filter((_, i) => i !== index));
  };

  // Guardar países del lote
  const handleSaveBatch = () => {
    const maxId = Math.max(...countries.map(country => country.id), 0);
    const newCountries = batchCountries.map((country, index) => ({
      ...country,
      id: maxId + index + 1
    }));
    
    setCountries([...countries, ...newCountries]);
    handleBatchClose();
  };

  // Crear nuevo país
    const handleCreate = () => {
        // Verificar si alguno de los campos está vacío
        if (!currentCountry.name || !currentCountry.population || !currentCountry.region) {
        alert('Por favor, complete todos los campos.'); // Puedes usar un mensaje más estilizado si lo prefieres
        return; // Salir de la función si hay campos vacíos
        }

        const maxId = Math.max(...countries.map(country => country.id), 0);
        const newCountry = {
        id: maxId + 1,
        ...currentCountry
        };

        setCountries([...countries, newCountry]);
        handleClose();
    };
  
  // Editar, actualizar y eliminar país
  const handleEdit = (country) => {
    setCurrentCountry(country);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = () => {
    setCountries(countries.map(country => 
      country.id === currentCountry.id ? currentCountry : country
    ));
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este país?')) {
      setCountries(countries.filter(country => country.id !== id));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Gestión de Países
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
            Nuevo País
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBatchOpen}
            startIcon={<PlaylistAddIcon />}
          >
            Crear lista de países
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Población</TableCell>
              <TableCell>Región</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell>{country.id}</TableCell>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.population}</TableCell>
                <TableCell>{country.region}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEdit(country)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(country.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo crear/editar país individual */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Editar País' : 'Nuevo País'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                value={currentCountry.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="population"
                label="Población"
                type="number"
                fullWidth
                value={currentCountry.population}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="region"
                select
                label="Región"
                fullWidth
                value={currentCountry.region}
                onChange={handleChange}
              >
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={editMode ? handleUpdate : handleCreate} 
            variant="contained" 
            color="primary"
          >
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear lista de países */}
      <Dialog open={batchOpen} onClose={handleBatchClose} maxWidth="md" fullWidth>
        <DialogTitle>Nuevos Países</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                value={tempCountry.name}
                onChange={handleTempChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="population"
                label="Población"
                type="number"
                fullWidth
                value={tempCountry.population}
                onChange={handleTempChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="region"
                select
                label="Región"
                fullWidth
                value={tempCountry.region}
                onChange={handleTempChange}
              >
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleAddToBatch}
                startIcon={<AddIcon />}
              >
                Añadir a la lista
              </Button>
            </Grid>
          </Grid>
          <List>
            {batchCountries.map((country, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={country.name} 
                  secondary={`Población: ${country.population} - Región: ${country.region}`} 
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    color="error" 
                    onClick={() => handleRemoveFromBatch(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBatchClose}>Cancelar</Button>
          <Button 
            onClick={handleSaveBatch} 
            variant="contained" 
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Countries;
