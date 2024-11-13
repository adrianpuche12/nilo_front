import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Navbar from '../NavBar';
import Footer from '../Footer';

const API_URL = process.env.REACT_APP_API_URL;

const Itineraries = () => {
    // Estados
    const { accessToken } = useAuth();
    const [itineraries, setItineraries] = useState([]);
    const [activities, setActivities] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentItinerary, setCurrentItinerary] = useState({
        name: '',
        description: '',
        cityId: null,
        activities: []
    });

    const getAxiosConfig = () => ({
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    // Cargar itinerarios, actividades y ciudades
    useEffect(() => {
        if (accessToken) {
            fetchItineraries();
            fetchActivities();
            fetchCities();
        }
    }, [accessToken]);

    // Función para obtener itinerarios
    const fetchItineraries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/itineraries`, getAxiosConfig);
            setItineraries(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los itinerarios: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener actividades
    const fetchActivities = async () => {
        try {
            const response = await axios.get(`${API_URL}/activities`, getAxiosConfig);
            setActivities(response.data);
        } catch (err) {
            setError('Error al cargar las actividades: ' + err.message);
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
        setCurrentItinerary({
            name: '',
            description: '',
            cityId: null,
            activities: []
        });
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
    };

    // Manejadores de cambios en el formulario de itinerario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentItinerary((prev) => ({
            ...prev,
            [name]: name === 'cityId' ? value : value,
            activities: name === 'cityId' ? [] : prev.activities
        }));
    };

    const handleActivityChange = (e) => {
        const activityId = Number(e.target.value);
        const activity = activities.find(a => a.id === activityId);
        if (!currentItinerary.activities.some(a => a.id === activityId)) {
            setCurrentItinerary(prev => ({
                ...prev,
                activities: [...prev.activities, activity]
            }));
        }
    };

    const handleRemoveActivity = (activity) => {
        setCurrentItinerary(prev => ({
            ...prev,
            activities: prev.activities.filter(a => a.id !== activity.id)
        }));
    };

    // Crear nuevo itinerario
    const handleCreate = async () => {
        try {
            await axios.post(`${API_URL}/itineraries`, currentItinerary, getAxiosConfig);
            await fetchItineraries();
            handleClose();
        } catch (err) {
            setError('Error al crear itinerario: ' + err.message);
        }
    };

    // Funciones de editar, actualizar y eliminar
    const handleEdit = (itinerary) => {
        setCurrentItinerary(itinerary);
        setEditMode(true);
        setOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API_URL}/itineraries/${currentItinerary.id}`, currentItinerary, getAxiosConfig);
            await fetchItineraries();
            handleClose();
        } catch (err) {
            setError('Error al actualizar itinerario: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este itinerario?')) {
            try {
                await axios.delete(`${API_URL}/itineraries/${id}`, getAxiosConfig);
                await fetchItineraries();
            } catch (err) {
                setError('Error al eliminar itinerario: ' + err.message);
            }
        }
    };

    // Función para obtener el nombre de la ciudad
    const getCityName = (cityId) => {
        const city = cities.find(c => c.id === cityId);
        return city ? city.name : 'Ciudad no encontrada';
    };

    // Función para obtener el nombre de la actividad
    const getActivityName = (activity) => {
        return activity ? activity.name : 'Actividad no encontrada';
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Grid item>
                        <Typography variant="h4" gutterBottom>
                            Gestión de Itinerarios
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpen}
                            startIcon={<AddIcon />}
                        >
                            Nuevo Itinerario
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
                                <TableCell>Ciudad</TableCell>
                                <TableCell>Actividades</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itineraries.map((itinerary) => (
                                <TableRow key={itinerary.id}>
                                    <TableCell>{itinerary.id}</TableCell>
                                    <TableCell>{itinerary.name}</TableCell>
                                    <TableCell>{itinerary.description}</TableCell>
                                    <TableCell>{getCityName(itinerary.cityId)}</TableCell>
                                    <TableCell>
                                        {itinerary.activities.map(activityId => getActivityName(activityId)).join(', ')}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(itinerary)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(itinerary.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Diálogo crear/editar itinerario */}
                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {editMode ? 'Editar Itinerario' : 'Nuevo Itinerario'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    label="Nombre"
                                    fullWidth
                                    value={currentItinerary.name}
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
                                    value={currentItinerary.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Ciudad</InputLabel>
                                    <Select
                                        name="cityId"
                                        value={currentItinerary.cityId || ''}
                                        onChange={handleChange}
                                        label="Ciudad"
                                    >
                                        <MenuItem value="">Seleccione una ciudad</MenuItem>
                                        {cities.map((city) => (
                                            <MenuItem key={city.id} value={city.id}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {currentItinerary.cityId && (
                                <>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Agregar Actividad</InputLabel>
                                            <Select
                                                value=""
                                                onChange={handleActivityChange}
                                                label="Agregar Actividad"
                                            >
                                                <MenuItem value="">Seleccione una actividad</MenuItem>
                                                {activities.filter(a => a.cityId === currentItinerary.cityId && !currentItinerary.activities.some(ca => ca.id === a.id)).map((activity) => (
                                                    <MenuItem
                                                        key={activity.id}
                                                        value={activity.id}
                                                    >
                                                        {activity.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Actividades Seleccionadas:
                                        </Typography>
                                        <List>
                                            {currentItinerary.activities.map((activity) => (
                                                <ListItem key={activity.id}>
                                                    <ListItemText primary={activity.name} />
                                                    <IconButton
                                                        edge="end"
                                                        color="error"
                                                        onClick={() => handleRemoveActivity(activity)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button
                            onClick={editMode ? handleUpdate : handleCreate}
                            variant="contained"
                            color="primary"
                            disabled={!currentItinerary.name || !currentItinerary.cityId || currentItinerary.activities.length === 0}
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

export default Itineraries;