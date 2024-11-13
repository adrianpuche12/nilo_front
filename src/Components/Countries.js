import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Grid, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
import Navbar from './NavBar';
import Footer from './Footer';

const API_URL = process.env.REACT_APP_API_URL; // URL de la API

const Countries = () => {
    // Estados
    const { accessToken } = useAuth();
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCountry, setCurrentCountry] = useState({
        name: '',
        population: '',
        region: ''
    });

    const getAxiosConfig = () => ({
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    // Obtener países al montar el componente
    useEffect(() => {
        if (accessToken) {
            fetchCountries();
        }
    }, [accessToken]);

    // Función para obtener países
    const fetchCountries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/countries`, getAxiosConfig);
            setCountries(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los países: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Abrir diálogo para crear/editar
    const handleOpen = () => {
        setOpen(true);
        setEditMode(false);
        setCurrentCountry({ name: '', population: '', region: '' });
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
    };

    // Cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCountry(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Crear nuevo país
    const handleCreate = async () => {
        try {
            await axios.post(`${API_URL}/countries`, currentCountry, getAxiosConfig);
            await fetchCountries();
            handleClose();
        } catch (err) {
            setError('Error al crear el país: ' + err.message);
        }
    };

    // Editar, actualizar y eliminar país
    const handleEdit = (country) => {
        setCurrentCountry(country);
        setEditMode(true);
        setOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API_URL}/countries/${currentCountry.id}`, currentCountry, getAxiosConfig);
            await fetchCountries();
            handleClose();
        } catch (err) {
            setError('Error al actualizar el país: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este país?')) {
            try {
                await axios.delete(`${API_URL}/countries/${id}`, getAxiosConfig);
                await fetchCountries();
            } catch (err) {
                setError('Error al eliminar el país: ' + err.message);
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Grid item>
                        <Typography variant="h4" gutterBottom>
                            Gestión de Países
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpen}
                            startIcon={<AddIcon />}
                        >
                            Nuevo País
                        </Button>
                    </Grid>
                </Grid>

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
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(country)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(country.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Diálogo crear/editar país */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editMode ? 'Editar País' : 'Nuevo País'}</DialogTitle>
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
            <Footer />
        </div>
    );
};

export default Countries;
