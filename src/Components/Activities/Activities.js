import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Radio, IconButton, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, useMediaQuery, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Navbar from '../NavBar';
import Footer from '../Footer';
import AdminNavbar from '../Admin/AdminNavbar';
import Title from '../Utiles/Title';
import Descripcion1 from '../Utiles/Descripcion1';
import GenericButton from '../Utiles/GenericButton';
import { CreateButton, EditButton, CloseButton, DeleteButton } from '../Utiles/ActionButtons';
import { MainTitle, MainDescription1 } from '../Utiles/MainComponents';

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
              <EditButton
                onClick={() => handleEdit(activity)}
                size="small"
              />
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accessToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentActivity, setCurrentActivity] = useState({
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

  useEffect(() => {
    if (accessToken) {
      fetchActivities();
      fetchCities();
    }
  }, [accessToken]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/activities`, getAxiosConfig());
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las actividades: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`, getAxiosConfig());
      setCities(response.data);
    } catch (err) {
      setError('Error al cargar las ciudades: ' + err.message);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/activities`, currentActivity, getAxiosConfig());
      await fetchActivities();
      handleClose();
    } catch (err) {
      setError('Error al crear la actividad: ' + err.message);
    }
  };

  const handleEdit = (activity) => {
    setCurrentActivity(activity);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/activities/${currentActivity.id}`, currentActivity, getAxiosConfig());
      await fetchActivities();
      handleClose();
    } catch (err) {
      setError('Error al actualizar la actividad: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      try {
        await axios.delete(`${API_URL}/activities/${id}`, getAxiosConfig());
        await fetchActivities();
      } catch (err) {
        setError('Error al eliminar la actividad: ' + err.message);
      }
    }
  };

  const handleSelectionChange = (activityId) => {
    if (selectedActivity === activityId) {
      setSelectedActivity(null);
    } else {
      setSelectedActivity(activityId);
    }
  };

  const handleEditSelected = () => {
    if (selectedActivity) {
      const activity = activities.find(a => a.id === selectedActivity);
      if (activity) {
        handleEdit(activity);
      }
    }
  };

  const handleDeleteSelected = () => {
    if (selectedActivity) {
      handleDelete(selectedActivity);
    }
  };

  const getCityName = (cityId) => {
    const city = cities.find(city => city.id === parseInt(cityId));
    return city ? city.name : 'Ciudad no encontrada';
  };

  const { roles } = useAuth();

  return (
    <div>
      {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}
      <Box sx={{ padding: '10px' }}>
        <Grid container spacing={1} sx={{ mt: 4, px: 2 }}>
          <Grid item xs={12}>
            {isMobile ? (
              // Vista mobile del encabezado
              <Stack spacing={2}>
                <MainTitle text="Gestión de Actividades" align="left" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Actividad"
                  startIcon={<AddIcon />}
                />
              </Stack>
            ) : (
              // Vista desktop del encabezado
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <MainTitle text="Gestión de Actividades" align="left" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Actividad"
                  startIcon={<AddIcon />}
                />
              </Stack>
            )}

            <Grid
              item
              xs={12}
              container
              justifyContent="left"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <MainDescription1 text="Esta pantalla facilita la gestión de actividades, permitiendo su creación, edición y eliminación, así como la integración con ciudades." />
            </Grid>
          </Grid>

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
                  disabled={!selectedActivity}
                  fullWidth
                />
                <DeleteButton
                  onClick={handleDeleteSelected}
                  disabled={!selectedActivity}
                  fullWidth
                />
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

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editMode ? <Title text="Editar Actividad" /> : <Title text="Nueva Actividad" />}
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

export default Activities;