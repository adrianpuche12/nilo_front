import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, 
  Grid, IconButton, useTheme, useMediaQuery, Card, CardContent, Stack, Box, Radio } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
import Navbar from './NavBar';
import Footer from './Footer';

const API_URL = process.env.REACT_APP_API_URL;

// Vista móvil en tarjetas
const MobileView = ({ provinces, selectedProvince, handleSelectionChange, getCountryName }) => (
  <Grid container spacing={3}>
    {provinces.map((province) => (
      <Grid item xs={12} key={province.id}>
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            border: selectedProvince === province.id ? 2 : 0,
            borderColor: 'primary.main'
          }}
          onClick={() => handleSelectionChange(province.id)}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Radio
                checked={selectedProvince === province.id}
                onChange={() => handleSelectionChange(province.id)}
              />
              <Typography variant="h6" component="div">
                {province.name}
              </Typography>
            </Stack>

            <Box sx={{ pl: 4 }}>
              <Typography color="text.secondary" gutterBottom>
                <strong>ID:</strong> {province.id}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                <strong>Descripción:</strong> {province.description}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
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
              <IconButton color="primary" onClick={() => handleEdit(province)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(province.id)}>
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

  return (
    <div>
      <Navbar />
      <Box sx={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {isMobile ? (
              // Vista mobile del encabezado
              <Stack spacing={2}>
                <Typography variant="h4">
                  Gestión de Provincias
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Nueva Provincia
                </Button>
              </Stack>
            ) : (
              // Vista desktop del encabezado
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">
                  Gestión de Provincias
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                  startIcon={<AddIcon />}
                >
                  Nueva Provincia
                </Button>
              </Stack>
            )}
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditSelected}
                  disabled={!selectedProvince}
                  startIcon={<EditIcon />}
                  fullWidth
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteSelected}
                  disabled={!selectedProvince}
                  startIcon={<DeleteIcon />}
                  fullWidth
                >
                  Eliminar
                </Button>
              </Stack>
            </Grid>
          )}

          <Grid item xs={12}>
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
      </Box>
      <Footer />
    </div>
  );
};

export default Province;