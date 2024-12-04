import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Box,
  Radio,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
import Navbar from './NavBar';
import Footer from './Footer';
import AdminNavbar from './Admin/AdminNavBar';
import Title from './Utiles/Title';

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
            onClick={() => handleSelectionChange(country.id)}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Radio
                  checked={selectedCountry === country.id}
                  onChange={() => handleSelectionChange(country.id)}
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
                <IconButton color="primary" onClick={() => handleEdit(country)}>
                  <EditIcon />
                </IconButton>
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
      {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}
      <Box sx={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Title text="Gestión de Países" variant="h4" />
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                startIcon={<AddIcon />}
              >
                Nuevo País
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            {isMobile ? <MobileView /> : <DesktopView />}
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? 'Editar País' : 'Nuevo País'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
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

export default Countries;
