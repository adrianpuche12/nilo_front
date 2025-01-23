import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid,
  IconButton, useTheme, useMediaQuery, Card, CardContent, Stack, Box, Radio
}
  from '@mui/material';
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


const API_URL = process.env.REACT_APP_API_URL;

// Vista móvil en tarjetas
const MobileView = ({ provinces, selectedProvince, handleSelectionChange, getCountryName }) => (
  <Grid container spacing={3} id="mobile-view">
    {provinces.map((province) => (
      <Grid item xs={12} key={province.id} id={`province-card-${province.id}`}>
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            border: selectedProvince === province.id ? 2 : 0,
            borderColor: 'primary.main'
          }}
          onClick={() => handleSelectionChange(province.id)}
          id={`card-${province.id}`}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={2} id={`stack-${province.id}`}>
              <Radio
                checked={selectedProvince === province.id}
                onChange={() => handleSelectionChange(province.id)}
                id={`radio-${province.id}`}
              />
              <Typography variant="h6" component="div" id={`province-name-${province.id}`}>
                {province.name}
              </Typography>
            </Stack>

            <Box sx={{ pl: 4 }} id={`box-${province.id}`}>
              <Typography color="text.secondary" gutterBottom id={`province-id-${province.id}`}>
                <strong>ID:</strong> {province.id}
              </Typography>
              <Typography color="text.secondary" gutterBottom id={`province-description-${province.id}`}>
                <strong>Descripción:</strong> {province.description}
              </Typography>
              <Typography color="text.secondary" gutterBottom id={`province-country-${province.id}`}>
                <strong>País:</strong> {getCountryName(province.country)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Vista desktop en tabla
const DesktopView = ({ provinces, handleEdit, handleDelete, getCountryName }) => (
  <TableContainer component={Paper} id="desktop-view">
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
          <TableRow key={province.id} id={`table-row-${province.id}`}>
            <TableCell id={`table-cell-id-${province.id}`}>{province.id}</TableCell>
            <TableCell id={`table-cell-name-${province.id}`}>{province.name}</TableCell>
            <TableCell id={`table-cell-description-${province.id}`}>{province.description}</TableCell>
            <TableCell id={`table-cell-country-${province.id}`}>{getCountryName(province.country)}</TableCell>
            <TableCell id={`table-cell-actions-${province.id}`}>
              <EditButton
                onClick={() => handleEdit(province)}
                size="small"
                id={`edit-button-${province.id}`}
              />
              <IconButton color="error" onClick={() => handleDelete(province.id)} id={`delete-button-${province.id}`}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const Province = () => {
  // Estados
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accessToken } = useAuth();
  const [provinces, setProvinces] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [currentProvince, setCurrentProvince] = useState({
    name: '',
    description: '',
    country: countries.length > 0 ? countries[0] : null,
  });

  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  // Traer provincias y países
  useEffect(() => {
    if (accessToken) {
      fetchProvinces();
      fetchCountries();
    }
  }, [accessToken]);


  // Función para obtener provincias
  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/provinces`, getAxiosConfig());
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
      const response = await axios.get(`${API_URL}/countries`, getAxiosConfig());
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
      await axios.post(`${API_URL}/provinces`, currentProvince, getAxiosConfig());
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
      await axios.put(`${API_URL}/provinces/${currentProvince.id}`, updateData, getAxiosConfig());
      await fetchProvinces();
      handleClose();
    } catch (err) {
      setError('Error al actualizar la provincia: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta provincia?')) {
      try {
        await axios.delete(`${API_URL}/provinces/${id}`, getAxiosConfig());
        await fetchProvinces();
      } catch (err) {
        setError('Error al eliminar la provincia: ' + err.message);
      }
    }
  };

  //Manejador para seleccionar objeto
  const handleSelectionChange = (provinceId) => {
    if (selectedProvince === provinceId) {
      setSelectedProvince(null);
    } else {
      setSelectedProvince(provinceId);
    }
  };

  //Editar seleccionado
  const handleEditSelected = () => {
    if (selectedProvince) {
      const province = provinces.find(p => p.id === selectedProvince);
      if (province) {
        handleEdit(province);
      }
    }
  };

  //Borrar seleccionado
  const handleDeleteSelected = () => {
    if (selectedProvince) {
      handleDelete(selectedProvince);
    }
  };

  // Función para obtener el nombre del país
  const getCountryName = (country) => {
    return country?.name || 'País no encontrado';
  };

  const { roles } = useAuth();

  return (
    <div>
      <Box sx={{ padding: '10px' }} id="province-box">
        <Grid container spacing={1} sx={{ mt: 4, px: 2 }} id="province-grid">
          <Grid item xs={12} id="title-grid">
            {isMobile ? (
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <MainTitle text="Gestión de Provincias" align="left" id="main-title" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Provincia"
                  startIcon={<AddIcon />}
                  id="create-button"
                />
              </Stack>
            ) : (
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <MainTitle text="Gestión de Provincias" align="left" id="main-title" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Provincia"
                  startIcon={<AddIcon />}
                  id="create-button"
                />
              </Stack>
            )}
          </Grid>

          <Grid item xs={12} container justifyContent="left" alignItems="center" sx={{ mt: 2 }} id="description-grid">
            <MainDescription1 text="Esta pantalla permite gestionar las provincias, incluyendo su creación, edición y eliminación." id="main-description" />
          </Grid>

          {isMobile && (
            <Grid item xs={12} id="mobile-actions">
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  borderTop: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  py: 2,
                  mb: 2,
                }}
                id="mobile-actions-stack"
              >
                <EditButton
                  onClick={handleEditSelected}
                  disabled={!selectedProvince}
                  fullWidth
                  id="edit-selected-button"
                />
                <DeleteButton
                  onClick={handleDeleteSelected}
                  disabled={!selectedProvince}
                  fullWidth
                  id="delete-selected-button"
                />
              </Stack>
            </Grid>
          )}

          <Grid item xs={12} id="provinces-grid">
            {isMobile ? (
              <MobileView
                provinces={provinces}
                selectedProvince={selectedProvince}
                handleSelectionChange={handleSelectionChange}
                getCountryName={getCountryName}
              />
            ) : (
              <DesktopView
                provinces={provinces}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                getCountryName={getCountryName}
              />
            )}
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose} id="province-dialog">
          <DialogTitle id="dialog-title">
            {editMode ? <Title text="Editar Provincia" /> : <Title text="Nueva Provincia" />}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }} id="dialog-content">
              <Grid item xs={12} id="name-grid">
                <TextField
                  name="name"
                  label="Nombre"
                  fullWidth
                  value={currentProvince.name}
                  onChange={handleChange}
                  id="name-input"
                />
              </Grid>
              <Grid item xs={12} id="description-grid">
                <TextField
                  name="description"
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  value={currentProvince.description}
                  onChange={handleChange}
                  id="description-input"
                />
              </Grid>
              <Grid item xs={12} id="country-grid">
                <TextField
                  name="country"
                  select
                  label="País"
                  fullWidth
                  value={currentProvince.country?.id}
                  onChange={handleChange}
                  disabled={editMode}
                  id="country-select"
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id} id={`country-item-${country.id}`}>
                      {country.name}
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

export default Province;