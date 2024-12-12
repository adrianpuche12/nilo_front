import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, IconButton,
    useTheme, useMediaQuery, Card, CardContent, Stack, Box, Radio, List, ListItem, ListItemText, FormControl, InputLabel, Select
} from '@mui/material';
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
import Subtitulo2 from '../Utiles/Subtitulo2'
import { CreateButton, EditButton, CloseButton, DeleteButton } from '../Utiles/ActionButtons';

const API_URL = process.env.REACT_APP_API_URL;

// Vista móvil en tarjetas
const MobileView = ({ itineraries, selectedItinerary, handleSelectionChange, getCityName, getActivityName }) => (
    <Grid container spacing={3}>
        {itineraries.map((itinerary) => (
            <Grid item xs={12} key={itinerary.id}>
                <Card
                    sx={{
                        height: '100%',
                        cursor: 'pointer',
                        border: selectedItinerary === itinerary.id ? 2 : 0,
                        borderColor: 'primary.main'
                    }}
                    onClick={() => handleSelectionChange(itinerary.id)}
                >
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <Radio
                                checked={selectedItinerary === itinerary.id}
                                onChange={() => handleSelectionChange(itinerary.id)}
                            />
                            <Typography variant="h6" component="div">
                                {itinerary.name}
                            </Typography>
                        </Stack>

                        <Box sx={{ pl: 4 }}>
                            <Typography color="text.secondary" gutterBottom>
                                <strong>ID:</strong> {itinerary.id}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                <strong>Descripción:</strong> {itinerary.description}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                <strong>Ciudad:</strong> {getCityName(itinerary.cityId)}
                            </Typography>
                            <Typography color="text.secondary">
                                <strong>Actividades:</strong>
                                <List dense>
                                    {itinerary.activities.map(activity => (
                                        <ListItem key={activity.id}>
                                            <ListItemText primary={getActivityName(activity)} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

// Vista desktop en tabla
const DesktopView = ({ itineraries, handleEdit, handleDelete, getCityName, getActivityName }) => (
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
                            {itinerary.activities.map(activity => getActivityName(activity)).join(', ')}
                        </TableCell>
                        <TableCell>
                            <EditButton
                                onClick={() => handleEdit(itinerary)}
                                size="small"
                            />
                            <IconButton color="error" onClick={() => handleDelete(itinerary.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

const Itineraries = () => {
    //Estados
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { accessToken } = useAuth();
    const [itineraries, setItineraries] = useState([]);
    const [activities, setActivities] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
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

    //Manejador para seleccionar objeto
    const handleSelectionChange = (itineraryId) => {
        if (selectedItinerary === itineraryId) {
            setSelectedItinerary(null);
        } else {
            setSelectedItinerary(itineraryId);
        }
    };

    //Editar seleccionado
    const handleEditSelected = () => {
        if (selectedItinerary) {
            const itinerary = itineraries.find(i => i.id === selectedItinerary);
            if (itinerary) {
                handleEdit(itinerary);
            }
        }
    };

    //Borrar seleccionado
    const handleDeleteSelected = () => {
        if (selectedItinerary) {
            handleDelete(selectedItinerary);
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

    const { roles } = useAuth();

    return (
        <div>
            {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}
            <Box sx={{ padding: '10px' }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        {isMobile ? (
                            // Vista mobile del encabezado
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Title text="Gestión de Itinerarios" variant="h4" />
                                <CreateButton
                                    onClick={handleOpen}
                                    componentName="Itinerario"
                                    startIcon={<AddIcon />}
                                />
                            </Stack>
                        ) : (
                            // Vista desktop del encabezado
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Title text="Gestión de Itinerarios" variant="h4" />
                                <CreateButton
                                    onClick={handleOpen}
                                    componentName="Itinerario"
                                    startIcon={<AddIcon />}
                                />
                            </Stack>
                        )}
                        {/* Componente de Descripción */}
                        <Grid
                            item
                            xs={12}
                            container
                            justifyContent="left"
                            alignItems="center"
                            sx={{ mt: 2 }}
                        >
                            <Descripcion1
                                text="Esta pantalla permite gestionar los itinerarios, incluyendo su creación, edición y eliminación, además de sincronizarlos con actividades y ciudades."
                                sx={{ mt: 10 }}
                            />
                        </Grid>
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
                                <EditButton
                                    onClick={handleEditSelected}
                                    disabled={!selectedItinerary}
                                    fullWidth
                                />
                                <DeleteButton
                                    onClick={handleDeleteSelected}
                                    disabled={!selectedItinerary}
                                    fullWidth
                                />
                            </Stack>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        {isMobile ? (
                            <MobileView
                                itineraries={itineraries}
                                selectedItinerary={selectedItinerary}
                                handleSelectionChange={handleSelectionChange}
                                getCityName={getCityName}
                                getActivityName={getActivityName}
                            />
                        ) : (
                            <DesktopView
                                itineraries={itineraries}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                getCityName={getCityName}
                                getActivityName={getActivityName}
                            />
                        )}
                    </Grid>
                </Grid>

                {/* Diálogo crear/editar itinerario */}
                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {editMode ? <Title text="Editar Itinerario" /> : <Title text="Nuevo Itinerario" />}
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
                                            <Subtitulo2 text="Actividades Seleccionadas:" />
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
                        <CloseButton
                            onClick={handleClose}
                            fullWidth
                        />
                        <GenericButton
                            text={editMode ? 'Actualizar' : 'Crear'}
                            color="primary"
                            variant="contained"
                            onClick={editMode ? handleUpdate : handleCreate}
                            disabled={!currentItinerary.name || !currentItinerary.cityId || currentItinerary.activities.length === 0}
                            fullWidth
                        />
                    </DialogActions>
                </Dialog>
            </Box>
            <Footer />
        </div>
    );
};

export default Itineraries;