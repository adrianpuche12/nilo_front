import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';

// Variables de entorno para URL y token
const API_URL = process.env.REACT_APP_API_URL;

const Cities = () => {
  // Estados
  const { accessToken } = useAuth();
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCity, setCurrentCity] = useState({
    name: '',
    description: '',
    province: provinces.length > 0 ? provinces[0] : null,
  });

  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  // Cargar ciudades y provincias al montar el componente
  useEffect(() => {
    if (accessToken) {
      fetchCities();
      fetchProvinces();
    }
  }, [accessToken]);

  // Trae la lista de ciudades del backend
  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/cities`, getAxiosConfig);
      setCities(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las ciudades: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trae la lista de provincias del backend
  const fetchProvinces = async () => {
    try {
      const response = await axios.get(`${API_URL}/provinces`, getAxiosConfig);
      setProvinces(response.data);
    } catch (err) {
      setError('Error al cargar las provincias: ' + err.message);
    }
  };

  // Abrir el diálogo para crear o editar una ciudad
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentCity({
      name: '',
      description: '',
      province: provinces.length > 0 ? provinces[0] : null,
    });
  };

  // Cerrar el diálogo de creación/edición
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  // Manejador para cambios en los campos del formulario de ciudad
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCity((prev) => ({
      ...prev,
      [name]: name === 'province' ? provinces.find((p) => p.id === value) : value,
    }));
  };

  // Crear una nueva ciudad
  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/cities`, currentCity, getAxiosConfig);
      await fetchCities();
      handleClose();
    } catch (err) {
      setError('Error al crear la ciudad: ' + err.message);
    }
  };

  // Preparar la edición de una ciudad específica
  const handleEdit = (city) => {
    setCurrentCity({
      ...city,
      province: city.province,
    });
    setEditMode(true);
    setOpen(true);
  };

  // Actualizar los datos de una ciudad existente
  const handleUpdate = async () => {
    try {
      const { province, ...updateData } = currentCity;
      await axios.put(`${API_URL}/cities/${currentCity.id}`, updateData, getAxiosConfig);
      await fetchCities();
      handleClose();
    } catch (err) {
      setError('Error al actualizar la ciudad: ' + err.message);
    }
  };

  // Eliminar una ciudad de la lista
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta ciudad?')) {
      try {
        await axios.delete(`${API_URL}/cities/${id}`, getAxiosConfig);
        await fetchCities();
      } catch (err) {
        setError('Error al eliminar la ciudad: ' + err.message);
      }
    }
  };

  // Obtiene el nombre de la provincia de la ciudad actual
  const getProvinceName = (province) => {
    return province?.name || 'Provincia no encontrada';
  };

  if (loading) return <Typography>Cargando ciudades...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

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
          >
            Nueva Ciudad
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
              <TableCell>Provincia</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell>{city.id}</TableCell>
                <TableCell>{city.name}</TableCell>
                <TableCell>{city.description}</TableCell>
                <TableCell>{getProvinceName(city.province)}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(city)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(city.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar ciudad */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? 'Editar Ciudad' : 'Nueva Ciudad'}
        </DialogTitle>
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
                multiline
                rows={3}
                value={currentCity.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="province"
                select
                label="Provincia"
                fullWidth
                value={currentCity.province?.id}
                onChange={handleChange}
                disabled={editMode}
              >
                {provinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
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

export default Cities;
