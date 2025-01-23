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
import Footer from './Footer';
import Title from './Utiles/Title';
import Descripcion1 from './Utiles/Descripcion1';
import GenericButton from './Utiles/GenericButton';
import { CreateButton, EditButton, CloseButton, DeleteButton } from './Utiles/ActionButtons';
import { MainTitle, MainDescription1 } from './Utiles/MainComponents';

// Variables de entorno para URL y token
const API_URL = process.env.REACT_APP_API_URL;

// Vista móvil en tarjetas
const MobileView = ({ cities, selectedCity, handleSelectionChange, getProvinceName }) => (
  <Grid container spacing={3} id="mobile-view-container">
    {cities.map((city) => (
      <Grid item xs={12} key={city.id} id={`city-card-${city.id}`}>
        <Card
          id={`card-${city.id}`}
          sx={{
            height: '100%',
            cursor: 'pointer',
            border: selectedCity === city.id ? 2 : 0,
            borderColor: 'primary.main'
          }}
          onClick={() => handleSelectionChange(city.id)}
        >
          <CardContent id={`card-content-${city.id}`}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Radio
                id={`radio-${city.id}`}
                checked={selectedCity === city.id}
                onChange={() => handleSelectionChange(city.id)}
              />
              <Typography id={`city-name-${city.id}`} variant="h6" component="div">
                {city.name}
              </Typography>
            </Stack>

            <Box id={`city-details-${city.id}`} sx={{ pl: 4 }}>
              <Typography id={`city-id-${city.id}`} color="text.secondary" gutterBottom>
                <strong>ID:</strong> {city.id}
              </Typography>
              <Typography id={`city-description-${city.id}`} color="text.secondary" gutterBottom>
                <strong>Descripción:</strong> {city.description}
              </Typography>
              <Typography id={`city-province-${city.id}`} color="text.secondary">
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
  <TableContainer component={Paper} id="desktop-view-table">
    <Table id="city-table">
      <TableHead>
        <TableRow id="table-header">
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Provincia</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody id="table-body">
        {cities.map((city) => (
          <TableRow key={city.id} id={`row-${city.id}`}>
            <TableCell id={`cell-id-${city.id}`}>{city.id}</TableCell>
            <TableCell id={`cell-name-${city.id}`}>{city.name}</TableCell>
            <TableCell id={`cell-description-${city.id}`}>{city.description}</TableCell>
            <TableCell id={`cell-province-${city.id}`}>{getProvinceName(city.province)}</TableCell>
            <TableCell id={`cell-actions-${city.id}`}>
              <EditButton
                id={`edit-button-${city.id}`}
                onClick={() => handleEdit(city)}
                size="small"
              />
              <IconButton
                id={`delete-button-${city.id}`}
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
    <div id="cities-container">
      <Box sx={{ padding: '10px' }} id="box-container">
        <Grid container spacing={1} sx={{ mt: 4, px: 2 }} id="grid-container">
          <Grid item xs={12} id="grid-header">
            {isMobile ? (
              // Vista mobile del encabezado
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginBottom: '-40px', width: '100%' }}
                id="mobile-header"
              >
                <MainTitle text="Gestión de Ciudades" align="left" id="main-title-mobile" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Ciudad"
                  startIcon={<AddIcon />}
                  id="create-button-mobile"
                />
              </Stack>
            ) : (
              // Vista desktop del encabezado
              <Stack direction="row" justifyContent="space-between" alignItems="center" id="desktop-header">
                <MainTitle text="Gestión de Ciudades" align="left" id="main-title-desktop" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Ciudad"
                  startIcon={<AddIcon />}
                  id="create-button-desktop"
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
              id="description-grid"
            >
              <MainDescription1 text="Esta pantalla permite gestionar las ciudades relacionadas con los itinerarios y actividades. Aquí puede crear, editar o eliminar ciudades y asociarlas a una provincia." id="main-description" />
            </Grid>
          </Grid>

          {/* Botones de acción para mobile */}
          {isMobile && (
            <Grid item xs={12} id="action-buttons-mobile">
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
                id="action-buttons-stack"
              >
                <EditButton
                  onClick={handleEditSelected}
                  disabled={!selectedCity}
                  fullWidth
                  id="edit-button-mobile"
                />
                <DeleteButton
                  onClick={handleDeleteSelected}
                  disabled={!selectedCity}
                  fullWidth
                  id="delete-button-mobile"
                />
              </Stack>
            </Grid>
          )}

          <Grid item xs={12} id="cities-grid">
            {isMobile ? (
              <MobileView
                cities={cities}
                selectedCity={selectedCity}
                handleSelectionChange={handleSelectionChange}
                getProvinceName={getProvinceName}
                id="mobile-view"
              />
            ) : (
              <DesktopView
                cities={cities}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                getProvinceName={getProvinceName}
                id="desktop-view"
              />
            )}
          </Grid>
        </Grid>

        {/* Diálogo para crear/editar ciudad */}
        <Dialog open={open} onClose={handleClose} id="dialog">
          <DialogTitle id="dialog-title">
            {editMode ? <Title text="Editar Ciudad" id="edit-title" /> : <Title text="Nueva Ciudad" id="create-title" />}
          </DialogTitle>
          <DialogContent id="dialog-content">
            <Grid container spacing={2} sx={{ mt: 1 }} id="dialog-grid">
              <Grid item xs={12} id="name-grid">
                <TextField
                  name="name"
                  label="Nombre"
                  fullWidth
                  value={currentCity.name}
                  onChange={handleChange}
                  id="name-textfield"
                />
              </Grid>
              <Grid item xs={12} id="description-grid">
                <TextField
                  name="description"
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  value={currentCity.description}
                  onChange={handleChange}
                  id="description-textfield"
                />
              </Grid>
              <Grid item xs={12} id="province-grid">
                <TextField
                  name="province"
                  select
                  label="Provincia"
                  fullWidth
                  value={currentCity.province?.id}
                  onChange={handleChange}
                  disabled={editMode}
                  id="province-select"
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.id} value={province.id} id={`province-option-${province.id}`}>
                      {province.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions id="dialog-actions">
            <CloseButton
              onClick={handleClose}
              fullWidth
              id="close-button"
            />
            <GenericButton
              text={editMode ? 'Actualizar' : 'Crear'}
              color="primary"
              onClick={editMode ? handleUpdate : handleCreate}
              fullWidth
              id="generic-button"
            />
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </div>
  );

};

export default Cities;