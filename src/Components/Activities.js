import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const Activities = () => {
  // Datos hardcodeados
  const initialActivities = [
    { id: 1, name: "City Tour", type: "TOURISTIC", cityId: 1 },
    { id: 2, name: "Visita museo", type: "GENERAL", cityId: 1 },
    { id: 3, name: "Parana Tour", type: "TOURISTIC", cityId: 2 },
    { id: 4, name: "Caminata por el centro", type: "GENERAL", cityId: 2 },
    { id: 5, name: "Paseo por las montañas", type: "TOURISTIC", cityId: 3 }
  ];

  // Estados
  const [activities, setActivities] = useState(initialActivities);
  const [open, setOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
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
  const handleSaveBatch = () => {
    const maxId = Math.max(...activities.map(activity => activity.id), 0);
    const newActivities = batchActivities.map((activity, index) => ({
      ...activity,
      id: maxId + index + 1
    }));
    
    setActivities([...activities, ...newActivities]);
    handleBatchClose();
  };

  // Crear nueva actividad individual
  const handleCreate = () => {
    const maxId = Math.max(...activities.map(activity => activity.id), 0);
    const newActivity = {
      id: maxId + 1,
      ...currentActivity
    };
    setActivities([...activities, newActivity]);
    handleClose();
  };

  // Funciones de editar, actualizar y eliminar
  const handleEdit = (activity) => {
    setCurrentActivity(activity);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = () => {
    setActivities(activities.map(activity => 
      activity.id === currentActivity.id ? currentActivity : activity
    ));
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      setActivities(activities.filter(activity => activity.id !== id));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Gestión de Actividades
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
            Nueva Actividad
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBatchOpen}
            startIcon={<PlaylistAddIcon />}
          >
            Crear lista de actividades
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ciudad ID</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.id}</TableCell>
                <TableCell>{activity.name}</TableCell>
                <TableCell>{activity.type}</TableCell>
                <TableCell>{activity.cityId}</TableCell>
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
                label="Ciudad ID"
                type="number"
                fullWidth
                value={currentActivity.cityId}
                onChange={handleChange}
              />
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
                label="Ciudad ID"
                type="number"
                fullWidth
                value={tempActivity.cityId}
                onChange={handleTempChange}
              />
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
                      secondary={`Tipo: ${activity.type}, Ciudad ID: ${activity.cityId}`}
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
    </div>
  );
};

export default Activities;