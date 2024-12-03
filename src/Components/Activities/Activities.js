import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Radio, IconButton, List, ListItem, ListItemText,
  ListItemSecondaryAction, Paper, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Navbar from '../NavBar';
import Footer from '../Footer';
import AdminNavbar from '../Admin/AdminNavbar';

const API_URL = process.env.REACT_APP_API_URL;

// Vista móvil en tarjetas
const MobileView = ({ activities, selectedActivity, handleSelectionChange, getCityName }) => (
  <Grid container spacing={3}>
    {activities.map((activity) => (
      <Grid item xs={12} key={activity.id}>
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            border: selectedActivity === activity.id ? 2 : 0,
            borderColor: 'primary.main'
          }}
          onClick={() => handleSelectionChange(activity.id)}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Radio
                checked={selectedActivity === activity.id}
                onChange={() => handleSelectionChange(activity.id)}
              />
              <Typography variant="h6" component="div">
                {activity.name}
              </Typography>
            </Stack>

            <Box sx={{ pl: 4 }}>
              <Typography color="text.secondary" gutterBottom>
                <strong>ID:</strong> {activity.id}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                <strong>Tipo:</strong> {activity.type}
              </Typography>
              <Typography color="text.secondary">
                <strong>Ciudad:</strong> {getCityName(activity.cityId)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Vista desktop en tabla
const DesktopView = ({ activities, handleEdit, handleDelete, getCityName }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Tipo</TableCell>
          <TableCell>Ciudad</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell>{activity.id}</TableCell>
            <TableCell>{activity.name}</TableCell>
            <TableCell>{activity.type}</TableCell>
            <TableCell>{getCityName(activity.cityId)}</TableCell>
            <TableCell>
              <IconButton
                color="primary"
                onClick={() => handleEdit(activity)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(activity.id)}
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

const Activities = () => {
  //Estados
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accessToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentActivity, setCurrentActivity] = useState({
    name: '',
    type: '',
    cityId: ''
  });
  const [batchActivities, setBatchActivities] = useState([]);
  const [tempActivity, setTempActivity] = useState({
    name: '',
    type: '',
    cityId: ''
  });

  const activityTypes = ["TOURISTIC", "GENERAL"];

  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  // Traer actividades y ciudades
  useEffect(() => {
    if (accessToken) {
      fetchActivities();
      fetchCities();
    }
  }, [accessToken]);

  // Función para obtener actividades
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/activities`, getAxiosConfig);
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las actividades: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener ciudades
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`, getAxiosConfig);
      setCities(response.data);
    } catch (err) {
      setError('Error al cargar las ciudades: ' + err.message);
    }
  };

  // Manejadores para el diálogo individual
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentActivity({
      name: '',
      type: '',
      cityId: ''
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  // Manejadores para el diálogo de lote
  const handleBatchOpen = () => {
    setBatchOpen(true);
    setBatchActivities([]);
    setTempActivity({
      name: '',
      type: '',
      cityId: ''
    });
  };

  const handleBatchClose = () => {
    setBatchOpen(false);
    setBatchActivities([]);
  };

  // Manejador para cambios en el formulario individual
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejador para cambios en el formulario de lote
  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Añadir actividad temporal a la lista de lote
  const handleAddToBatch = () => {
    if (tempActivity.name && tempActivity.type && tempActivity.cityId) {
      setBatchActivities([...batchActivities, { ...tempActivity }]);
      setTempActivity({
        name: '',
        type: '',
        cityId: ''
      });
    }
  };

  // Remover actividad de la lista de lote
  const handleRemoveFromBatch = (index) => {
    setBatchActivities(batchActivities.filter((_, i) => i !== index));
  };

  // Guardar todas las actividades del lote
  const handleSaveBatch = async () => {
    try {
      await Promise.all(
        batchActivities.map(activity =>
          axios.post(`${API_URL}/activities`, activity, getAxiosConfig)
        )
      );
      await fetchActivities();
      handleBatchClose();
    } catch (err) {
      setError('Error al guardar las actividades: ' + err.message);
    }
  };

  // Crear nueva actividad individual
  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/activities`, currentActivity, getAxiosConfig);
      await fetchActivities();
      handleClose();
    } catch (err) {
      setError('Error al crear la actividad: ' + err.message);
    }
  };

  // Funciones de editar, actualizar y eliminar
  const handleEdit = (activity) => {
    setCurrentActivity(activity);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/activities/${currentActivity.id}`, currentActivity, getAxiosConfig);
      await fetchActivities();
      handleClose();
    } catch (err) {
      setError('Error al actualizar la actividad: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      try {
        await axios.delete(`${API_URL}/activities/${id}`, getAxiosConfig);
        await fetchActivities();
      } catch (err) {
        setError('Error al eliminar la actividad: ' + err.message);
      }
    }
  };

  //Manejador para seleccionar objeto
  const handleSelectionChange = (activityId) => {
    if (selectedActivity === activityId) {
      setSelectedActivity(null);
    } else {
      setSelectedActivity(activityId);
    }
  };

  //Editar seleccionado
  const handleEditSelected = () => {
    if (selectedActivity) {
      const activity = activities.find(a => a.id === selectedActivity);
      if (activity) {
        handleEdit(activity);
      }
    }
  };

  //Borrar seleccionado
  const handleDeleteSelected = () => {
    if (selectedActivity) {
      handleDelete(selectedActivity);
    }
  };

  // Función para obtener el nombre de la ciudad
  const getCityName = (cityId) => {
    const city = cities.find(city => city.id === parseInt(cityId));
    return city ? city.name : 'Ciudad no encontrada';
  };

  const { roles } = useAuth();
  
  return (
    <div>
      {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}
      <Box sx={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {isMobile ? (
              // Vista mobile del encabezado
              <Stack spacing={2}>
                <Typography variant="h4">
                  Gestión de Actividades
                </Typography>
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                    fullWidth
                  >
                    Nueva Actividad
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBatchOpen}
                    startIcon={<PlaylistAddIcon />}
                    fullWidth
                  >
                    Crear varias actividades
                  </Button>
                </Stack>
              </Stack>
            ) : (
              // Vista desktop del encabezado
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">
                  Gestión de Actividades
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                  >
                    Nueva Actividad
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBatchOpen}
                    startIcon={<PlaylistAddIcon />}
                  >
                    Crear varias actividades
                  </Button>
                </Stack>
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
                  disabled={!selectedActivity}
                  startIcon={<EditIcon />}
                  fullWidth
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteSelected}
                  disabled={!selectedActivity}
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
                activities={activities}
                selectedActivity={selectedActivity}
                handleSelectionChange={handleSelectionChange}
                getCityName={getCityName}
              />
            ) : (
              <DesktopView
                activities={activities}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                getCityName={getCityName}
              />
            )}
          </Grid>
        </Grid>


        {/* Diálogo crear/editar actividad individual */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editMode ? 'Editar Actividad' : 'Nueva Actividad'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Nombre"
                  fullWidth
                  value={currentActivity.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="type"
                  select
                  label="Tipo"
                  fullWidth
                  value={currentActivity.type}
                  onChange={handleChange}
                >
                  {activityTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="cityId"
                  select
                  label="Ciudad"
                  fullWidth
                  value={currentActivity.cityId}
                  onChange={handleChange}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
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

        {/* Diálogo para crear lista de actividades */}
        <Dialog
          open={batchOpen}
          onClose={handleBatchClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Nuevas Actividades</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="name"
                  label="Nombre"
                  fullWidth
                  value={tempActivity.name}
                  onChange={handleTempChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="type"
                  select
                  label="Tipo"
                  fullWidth
                  value={tempActivity.type}
                  onChange={handleTempChange}
                >
                  {activityTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="cityId"
                  select
                  label="Ciudad"
                  fullWidth
                  value={tempActivity.cityId}
                  onChange={handleTempChange}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToBatch}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Añadir a la lista
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Actividades en la Lista ({batchActivities.length})
                </Typography>
                <List>
                  {batchActivities.map((activity, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={activity.name}
                        secondary={`Tipo: ${activity.type}, Ciudad: ${getCityName(activity.cityId)}`}
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBatchClose}>Cancelar</Button>
            <Button
              onClick={handleSaveBatch}
              variant="contained"
              color="primary"
              disabled={batchActivities.length === 0}
            >
              Guardar actividades
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </div>
  );
};

export default Activities;