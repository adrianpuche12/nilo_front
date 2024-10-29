import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, IconButton } from '@mui/material';
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

const Province = () => {
  // Estados
  const [provinces, setProvinces] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProvince, setCurrentProvince] = useState({
    name: '',
    description: '',
    country: countries.length > 0 ? countries[0] : null,
  });


   // Traer provincias y países
  useEffect(() => {
    fetchProvinces();
    fetchCountries();
  }, []);


   // Función para obtener provincias
  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/provinces`, axiosConfig);
      setProvinces(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las provincias: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

   // Función para obtener países
  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_URL}/countries`, axiosConfig);
      setCountries(response.data);
    } catch (err) {
      setError('Error al cargar los países: ' + err.message);
    }
  };

  // Manejadores para el diálogo
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentProvince({
      name: '',
      description: '',
      country: countries.length > 0 ? countries[0] : null,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  // Manejador para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProvince((prev) => ({
      ...prev,
      [name]: name === 'country' ? countries.find((c) => c.id === value) : value,
    }));
  };

    // Crear nueva provincia 
  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/provinces`, currentProvince, axiosConfig);
      await fetchProvinces();
      handleClose();
    } catch (err) {
      setError('Error al crear la provincia: ' + err.message);
    }
  };

  // Funciones de editar, actualizar y eliminar
  const handleEdit = (province) => {
    setCurrentProvince({
      ...province,
      country: province.country,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const { country, ...updateData } = currentProvince;
      await axios.put(`${API_URL}/provinces/${currentProvince.id}`, updateData, axiosConfig);
      await fetchProvinces();
      handleClose();
    } catch (err) {
      setError('Error al actualizar la provincia: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta provincia?')) {
      try {
        await axios.delete(`${API_URL}/provinces/${id}`, axiosConfig);
        await fetchProvinces();
      } catch (err) {
        setError('Error al eliminar la provincia: ' + err.message);
      }
    }
  };

  // Función para obtener el nombre del país
  const getCountryName = (country) => {
    return country?.name || 'País no encontrado';
  };

  if (loading) return <Typography>Cargando provincias...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ padding: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Gestión de Provincias
          </Typography>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpen}
            startIcon={<AddIcon />}
          >
            Nueva Provincia
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
              <TableCell>País</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {provinces.map((province) => (
              <TableRow key={province.id}>
                <TableCell>{province.id}</TableCell>
                <TableCell>{province.name}</TableCell>
                <TableCell>{province.description}</TableCell>
                <TableCell>{getCountryName(province.country)}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEdit(province)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(province.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo crear/editar provincia */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? 'Editar Provincia' : 'Nueva Provincia'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                value={currentProvince.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={currentProvince.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="country"
                select
                label="País"
                fullWidth
                value={currentProvince.country?.id}
                onChange={handleChange}
                disabled={editMode}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}> 
                    {country.name}
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
    </div>
  );
};

export default Province;