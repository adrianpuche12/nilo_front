import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid,
  IconButton, useTheme, useMediaQuery, Card, CardContent, Stack, Box, Radio
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
import Navbar from './NavBar';
import Footer from './Footer';
import AdminNavbar from './Admin/AdminNavbar';
import Title from './Utiles/Title';
import Descripcion1 from './Utiles/Descripcion1';
import GenericButton from './Utiles/GenericButton';
import { CreateButton, EditButton, CloseButton, DeleteButton } from './Utiles/ActionButtons';

// Variables de entorno para URL y token
const API_URL = process.env.REACT_APP_API_URL;

// Vista móvil en tarjetas
const MobileView = ({ cities, selectedCity, handleSelectionChange, getProvinceName }) => (
  <Grid container spacing={3}>
    {cities.map((city) => (
      <Grid item xs={12} key={city.id}>
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            border: selectedCity === city.id ? 2 : 0,
            borderColor: 'primary.main'
          }}
          onClick={() => handleSelectionChange(city.id)}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Radio
                checked={selectedCity === city.id}
                onChange={() => handleSelectionChange(city.id)}
              />
              <Typography variant="h6" component="div">
                {city.name}
              </Typography>
            </Stack>

            <Box sx={{ pl: 4 }}>
              <Typography color="text.secondary" gutterBottom>
                <strong>ID:</strong> {city.id}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                <strong>Descripción:</strong> {city.description}
              </Typography>
              <Typography color="text.secondary">
                <strong>Provincia:</strong> {getProvinceName(city.province)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Vista desktop en tabla
const DesktopView = ({ cities, handleEdit, handleDelete, getProvinceName }) => (
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
              <EditButton
                onClick={() => handleEdit(city)}
                size="small"
              />
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
);

const Cities = () => {
  //Estados
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accessToken } = useAuth();
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
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

  //Manejador para seleccionar objeto
  const handleSelectionChange = (cityId) => {
    if (selectedCity === cityId) {
      setSelectedCity(null);
    } else {
      setSelectedCity(cityId);
    }
  };

  //Editar seleccionado
  const handleEditSelected = () => {
    if (selectedCity) {
      const city = cities.find(c => c.id === selectedCity);
      if (city) {
        handleEdit(city);
      }
    }
  };

  //Borrar seleccionado
  const handleDeleteSelected = () => {
    if (selectedCity) {
      handleDelete(selectedCity);
    }
  };

  const getProvinceName = (province) => {
    return province?.name || 'Provincia no encontrada';
  };

  const { roles } = useAuth();

  return (
    <div>
      {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}
      <Box sx={{ padding: '10px' }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {isMobile ? (
              // Vista mobile del encabezado
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginBottom: '-40px', width: '100%' }}
              >
                <Title
                  text="Gestión de Ciudades"
                  variant="h4"
                  sx={{
                    marginBottom: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Ciudad"
                  startIcon={<AddIcon />}
                />
              </Stack>
            ) : (
              // Vista desktop del encabezado
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Title text="Gestión de Ciudades" variant="h4" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Ciudad"
                  startIcon={<AddIcon />}
                />
              </Stack>
            )}

            {/* Componente de Descripción */}
            <Grid
              item
              xs={12}
              container
              justifyContent="left"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Descripcion1
                text="Esta pantalla permite gestionar las ciudades relacionadas con los itinerarios y actividades. Aquí puede crear, editar o eliminar ciudades y asociarlas a una provincia."
                sx={{ mt: 10 }}
              />
            </Grid>
          </Grid>

          {/* Botones de acción para mobile */}
          {isMobile && (
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  borderTop: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  py: 2,
                  mb: 2
                }}
              >
                <EditButton
                  onClick={handleEditSelected}
                  disabled={!selectedCity}
                  fullWidth
                />
                <DeleteButton
                  onClick={handleDeleteSelected}
                  disabled={!selectedCity}
                  fullWidth
                />
              </Stack>
            </Grid>
          )}

          <Grid item xs={12}>
            {isMobile ? (
              <MobileView
                cities={cities}
                selectedCity={selectedCity}
                handleSelectionChange={handleSelectionChange}
                getProvinceName={getProvinceName}
              />
            ) : (
              <DesktopView
                cities={cities}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                getProvinceName={getProvinceName}
              />
            )}
          </Grid>
        </Grid>

        {/* Diálogo para crear/editar ciudad */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editMode ? <Title text="Editar Ciudad" /> : <Title text="Nueva Ciudad" />}
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
            <CloseButton
              onClick={handleClose}
              fullWidth
            />
            <GenericButton
              text={editMode ? 'Actualizar' : 'Crear'}
              color="primary"
              onClick={editMode ? handleUpdate : handleCreate}
              fullWidth
            />
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </div>
  );

};

export default Cities;