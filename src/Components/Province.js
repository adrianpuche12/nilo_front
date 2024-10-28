import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const Province = () => {
  // Datos hardcodeados
  const initialProvinces = [
    {
      id: 1,
      name: "Santa Fe",
      description: "Provincia del litoral argentino",
      country: {
        id: 1,
        name: "Argentina",
        description: "País de América del Sur"
      }
    },
    {
      id: 2,
      name: "Córdoba",
      description: "Provincia del centro de Argentina",
      country: {
        id: 1,
        name: "Argentina",
        description: "País de América del Sur"
      }
    }
  ];

  // Estados
  const [provinces, setProvinces] = useState(initialProvinces);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProvince, setCurrentProvince] = useState({
    name: '',
    description: '',
    country: {
      id: 1,
      name: "Argentina",
      description: "País de América del Sur"
    }
  });

  // Manejadores para el diálogo
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentProvince({
      name: '',
      description: '',
      country: {
        id: 1,
        name: "Argentina",
        description: "País de América del Sur"
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  // Manejador para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProvince(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Crear nueva provincia
  const handleCreate = () => {
    const maxId = Math.max(...provinces.map(province => province.id), 0);
    const newProvince = {
      id: maxId + 1,
      ...currentProvince
    };
    setProvinces([...provinces, newProvince]);
    handleClose();
  };

  // Funciones de editar, actualizar y eliminar
  const handleEdit = (province) => {
    setCurrentProvince(province);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = () => {
    setProvinces(provinces.map(province => 
      province.id === currentProvince.id ? currentProvince : province
    ));
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta provincia?')) {
      setProvinces(provinces.filter(province => province.id !== id));
    }
  };

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
                <TableCell>{province.country.name}</TableCell>
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
                label="País"
                fullWidth
                value={currentProvince.country.name}
                disabled
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
    </div>
  );
};

export default Province;