import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Radio, IconButton, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, useMediaQuery, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Footer from '../Footer';
import Title from '../Utiles/Title';
import Descripcion1 from '../Utiles/Descripcion1';
import GenericButton from '../Utiles/GenericButton';
import { CreateButton, EditButton, CloseButton, DeleteButton } from '../Utiles/ActionButtons';
import { MainTitle, MainDescription1 } from '../Utiles/MainComponents';

const API_URL = process.env.REACT_APP_API_URL;

// Vista móvil en tarjetas
const MobileView = ({ activities, selectedActivity, handleSelectionChange, getCityName }) => (
  <Grid container spacing={3} id="mobile-view">
    {activities.map((activity) => (
      <Grid item xs={12} key={activity.id} id={`mobile-card-${activity.id}`}>
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            border: selectedActivity === activity.id ? 2 : 0,
            borderColor: 'primary.main'
          }}
          onClick={() => handleSelectionChange(activity.id)}
          id={`card-${activity.id}`}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={2} id={`stack-${activity.id}`}>
              <Radio
                checked={selectedActivity === activity.id}
                onChange={() => handleSelectionChange(activity.id)}
                id={`radio-${activity.id}`}
              />
              <Typography variant="h6" component="div" id={`activity-name-${activity.id}`}>
                {activity.name}
              </Typography>
            </Stack>

            <Box sx={{ pl: 4 }} id={`activity-details-${activity.id}`}>
              <Typography color="text.secondary" gutterBottom id={`activity-id-${activity.id}`}>
                <strong>ID:</strong> {activity.id}
              </Typography>
              <Typography color="text.secondary" gutterBottom id={`activity-type-${activity.id}`}>
                <strong>Tipo:</strong> {activity.type}
              </Typography>
              <Typography color="text.secondary" id={`activity-city-${activity.id}`}>
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
  <TableContainer component={Paper} id="desktop-table-container">
    <Table>
      <TableHead>
        <TableRow>
          <TableCell id="table-id-header">ID</TableCell>
          <TableCell id="table-name-header">Nombre</TableCell>
          <TableCell id="table-type-header">Tipo</TableCell>
          <TableCell id="table-city-header">Ciudad</TableCell>
          <TableCell id="table-actions-header">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id} id={`table-row-${activity.id}`}>
            <TableCell id={`table-id-${activity.id}`}>{activity.id}</TableCell>
            <TableCell id={`table-name-${activity.id}`}>{activity.name}</TableCell>
            <TableCell id={`table-type-${activity.id}`}>{activity.type}</TableCell>
            <TableCell id={`table-city-${activity.id}`}>{getCityName(activity.cityId)}</TableCell>
            <TableCell id={`table-actions-${activity.id}`}>
              <EditButton
                onClick={() => handleEdit(activity)}
                size="small"
                id={`edit-button-${activity.id}`}
              />
              <IconButton
                color="error"
                onClick={() => handleDelete(activity.id)}
                id={`delete-button-${activity.id}`}
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
      <Box sx={{ padding: '10px' }} id="activities-box">
        <Grid container spacing={1} sx={{ mt: 4, px: 2 }} id="activities-grid">
          <Grid item xs={12} id="activities-header">
            {isMobile ? (
              // Vista mobile del encabezado
              <Stack spacing={2} id="mobile-header-stack">
                <MainTitle text="Gestión de Actividades" align="left" id="mobile-main-title" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Actividad"
                  startIcon={<AddIcon />}
                  id="create-button-mobile"
                />
              </Stack>
            ) : (
              // Vista desktop del encabezado
              <Stack direction="row" justifyContent="space-between" alignItems="center" id="desktop-header-stack">
                <MainTitle text="Gestión de Actividades" align="left" id="desktop-main-title" />
                <CreateButton
                  onClick={handleOpen}
                  componentName="Actividad"
                  startIcon={<AddIcon />}
                  id="create-button-desktop"
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
              <MainDescription1 text="Esta pantalla facilita la gestión de actividades, permitiendo su creación, edición y eliminación, así como la integración con ciudades." id="description"/>
            </Grid>
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
                  mb: 2
                }}
                id="mobile-actions-stack"
              >
                <EditButton
                  onClick={handleEditSelected}
                  disabled={!selectedActivity}
                  fullWidth
                  id="edit-selected-button"
                />
                <DeleteButton
                  onClick={handleDeleteSelected}
                  disabled={!selectedActivity}
                  fullWidth
                  id="delete-selected-button"
                />
              </Stack>
            </Grid>
          )}

          <Grid item xs={12} id="activities-list">
            {isMobile ? (
              <MobileView
                activities={activities}
                selectedActivity={selectedActivity}
                handleSelectionChange={handleSelectionChange}
                getCityName={getCityName}
                id="mobile-view-component"
              />
            ) : (
              <DesktopView
                activities={activities}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                getCityName={getCityName}
                id="desktop-view-component"
              />
            )}
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose} id="activity-dialog">
          <DialogTitle>
            {editMode ? <Title text="Editar Actividad" id="dialog-title-edit" /> : <Title text="Nueva Actividad" id="dialog-title-create" />}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }} id="dialog-content-grid">
              <Grid item xs={12} id="dialog-name-field">
                <TextField
                  name="name"
                  label="Nombre"
                  fullWidth
                  value={currentActivity.name}
                  onChange={handleChange}
                  id="name-field"
                />
              </Grid>
              <Grid item xs={12} id="dialog-type-field">
                <TextField
                  name="type"
                  select
                  label="Tipo"
                  fullWidth
                  value={currentActivity.type}
                  onChange={handleChange}
                  id="type-field"
                >
                  {activityTypes.map((type) => (
                    <MenuItem key={type} value={type} id={`type-option-${type}`}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} id="dialog-city-field">
                <TextField
                  name="cityId"
                  select
                  label="Ciudad"
                  fullWidth
                  value={currentActivity.cityId}
                  onChange={handleChange}
                  id="city-field"
                >
                  {cities.map((city) => (
                    <MenuItem key={city.id} value={city.id} id={`city-option-${city.id}`}>
                      {city.name}
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
              id="dialog-close-button"
            />
            <GenericButton
              text={editMode ? 'Actualizar' : 'Crear'}
              color="primary"
              onClick={editMode ? handleUpdate : handleCreate}
              fullWidth
              id="dialog-generic-button"
            />
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </div>
  );
};

export default Activities;