import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, IconButton, useTheme,
  useMediaQuery, Card, CardContent, Stack, Box, Radio,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
import Footer from './Footer';
import Title from './Utiles/Title';
import Descripcion1 from './Utiles/Descripcion1'
import GenericButton from './Utiles/GenericButton';
import { CreateButton, EditButton, CloseButton, DeleteButton } from './Utiles/ActionButtons';
import { MainTitle, MainDescription1 } from './Utiles/MainComponents';
import { Margin } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL;

const Countries = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accessToken, roles } = useAuth();

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentCountry, setCurrentCountry] = useState({
    name: '',
    population: '',
    region: '',
  });

  const getAxiosConfig = () => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  useEffect(() => {
    if (accessToken) {
      fetchCountries();
    }
  }, [accessToken]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/countries`, getAxiosConfig());
      setCountries(response.data);
      setError(null);
    } catch (err) {
      setError(`Error al cargar los países: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentCountry({ name: '', population: '', region: '' });
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCountry((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/countries`, currentCountry, getAxiosConfig());
      await fetchCountries();
      handleClose();
    } catch (err) {
      setError(`Error al crear el país: ${err.message}`);
    }
  };

  const handleEdit = (country) => {
    setCurrentCountry(country);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/countries/${currentCountry.id}`,
        currentCountry,
        getAxiosConfig()
      );
      await fetchCountries();
      handleClose();
    } catch (err) {
      setError(`Error al actualizar el país: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este país?')) {
      try {
        await axios.delete(`${API_URL}/countries/${id}`, getAxiosConfig());
        await fetchCountries();
      } catch (err) {
        setError(`Error al eliminar el país: ${err.message}`);
      }
    }
  };

  const handleSelectionChange = (countryId) => {
    setSelectedCountry((prev) => (prev === countryId ? null : countryId));
  };

  const handleDeleteSelected = () => {
    if (selectedCountry) {
      handleDelete(selectedCountry);
    }
  };

  const getCountryName = (id) => {
    const country = countries.find((country) => country.id === id);
    return country ? country.name : 'Desconocido';
  };


  const MobileView = () => (
    <Grid container spacing={3}>
      {countries.map((country) => (
        <Grid item xs={12} key={country.id}>
          <Card
            sx={{
              height: '100%',
              cursor: 'pointer',
              border: selectedCountry === country.id ? 2 : 0,
              borderColor: 'primary.main',
            }}
            onClick={() => handleSelectionChange(country.id)} // Este evento se dispara al hacer clic en el Card
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Radio
                  checked={selectedCountry === country.id} // Marca el Radio cuando el país es seleccionado
                  onChange={() => handleSelectionChange(country.id)} // Cambia la selección del país al hacer clic
                />
                <Typography variant="h6">{country.name}</Typography>
              </Stack>
              <Box sx={{ pl: 4 }}>
                <Typography color="text.secondary">ID: {country.id}</Typography>
                <Typography color="text.secondary">
                  Población: {country.population}
                </Typography>
                <Typography color="text.secondary">Región: {country.region}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );


  const DesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Población</TableCell>
            <TableCell>Región</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries.map((country) => (
            <TableRow key={country.id}>
              <TableCell>{country.id}</TableCell>
              <TableCell>{country.name}</TableCell>
              <TableCell>{country.population}</TableCell>
              <TableCell>{country.region}</TableCell>
              <TableCell>
                <EditButton
                  onClick={() => handleEdit(country)}
                  size="small"
                />
                <IconButton color="error" onClick={() => handleDelete(country.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      <Box sx={{ padding: '10px' }}>
        <Grid container spacing={1} sx={{ mt: 4, px: 2 }}>
          <Grid item xs={12}>
            {isMobile ? (
              <Stack direction="row" justifyContent="space-between" alignItems="center">

                <MainTitle text="Gestión de Países" align="left" />

                <CreateButton
                  onClick={handleOpen}
                  componentName="País"
                  startIcon={<AddIcon />}
                />
              </Stack>
            ) : (
              <Stack direction="row" justifyContent="space-between" alignItems="center">

                <MainTitle text="Gestión de Países" align="left" />

                <CreateButton
                  onClick={handleOpen}
                  componentName="País"
                  startIcon={<AddIcon />}
                />
              </Stack>
            )}
          </Grid>

          <Grid item xs={12} container justifyContent="left" alignItems="center" sx={{ mt: 2 }}>
            <MainDescription1 text="Esta pantalla permite gestionar los países, incluyendo su creación, edición y eliminación." />
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
                  mb: 2,
                }}
              >
                <EditButton
                  onClick={handleEdit}
                  disabled={!selectedCountry}
                  fullWidth
                />
                <DeleteButton
                  onClick={handleDeleteSelected}
                  disabled={!selectedCountry}
                  fullWidth
                />
              </Stack>
            </Grid>
          )}

          <Grid item xs={12}>
            {isMobile ? (
              <MobileView
                countries={countries}
                selectedCountry={selectedCountry}
                handleSelectionChange={handleSelectionChange}
              />
            ) : (
              <DesktopView
                countries={countries}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </Grid>

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
              {editMode ? <Title text="Editar País" /> : <Title text="Nuevo País" />}
            </DialogTitle>

            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Nombre"
                    fullWidth
                    value={currentCountry.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="population"
                    label="Población"
                    type="number"
                    fullWidth
                    value={currentCountry.population}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="region"
                    label="Región"
                    fullWidth
                    value={currentCountry.region}
                    onChange={handleChange}
                  />
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
        </Grid>
      </Box>
      <Footer />
    </div>
  );
};

export default Countries;
