import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const Itineraries = () => {
    // Datos hardcodeados
    const initialCities = [
        { id: 1, name: "Buenos Aires" },
        { id: 2, name: "Rosario" },
        { id: 3, name: "Córdoba" }
    ];

    const initialActivities = [
        { id: 1, name: "City Tour", type: "TOURISTIC", cityId: 1 },
        { id: 2, name: "Visita museo", type: "GENERAL", cityId: 1 },
        { id: 3, name: "Parana Tour", type: "TOURISTIC", cityId: 2 },
        { id: 4, name: "Caminata por el centro", type: "GENERAL", cityId: 2 },
        { id: 5, name: "Paseo por las montañas", type: "TOURISTIC", cityId: 3 }
    ];

    const initialItineraries = [
        {
            id: 1,
            name: "Buenos Aires Tour",
            description: "Explorar la ciudad en un día",
            cityId: 1,
            activities: [{ id: 1 }, { id: 2 }]
        },
        {
            id: 2,
            name: "Rosario Tour",
            description: "Lo mejor de rosario",
            cityId: 2,
            activities: [{ id: 3 }, { id: 4 }]
        }
    ];

    // Estados
    const [itineraries, setItineraries] = useState(initialItineraries);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentItinerary, setCurrentItinerary] = useState({
        name: '',
        description: '',
        cityId: '',
        activities: []
    });

    // Manejadores para el diálogo
    const handleOpen = () => {
        setOpen(true);
        setEditMode(false);
        setCurrentItinerary({
            name: '',
            description: '',
            cityId: '',
            activities: []
        });
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
    };

    // Obtener actividades disponibles para una ciudad
    const getActivitiesForCity = (cityId) => {
        return initialActivities.filter(activity => activity.cityId === cityId);
    };

    // Obtener nombres de actividades para mostrar en la tabla
    const getActivityNames = (activityIds) => {
        return activityIds
            .map(act => initialActivities.find(a => a.id === act.id)?.name)
            .filter(Boolean)
            .join(', ');
    };

    // Obtener nombre de ciudad
    const getCityName = (cityId) => {
        return initialCities.find(city => city.id === cityId)?.name || '';
    };

    // Manejador para cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentItinerary(prev => {
            // Si cambiamos la ciudad, resetear las actividades seleccionadas
            if (name === 'cityId') {
                return {
                    ...prev,
                    [name]: Number(value),
                    activities: []
                };
            }
            return {
                ...prev,
                [name]: value
            };
        });
    };

    // Manejador para selección de actividades
    const handleActivityChange = (e) => {
        const activityId = Number(e.target.value);
        setCurrentItinerary(prev => ({
            ...prev,
            activities: [...prev.activities, { id: activityId }]
        }));
    };

    // Remover actividad del itinerario actual
    const handleRemoveActivity = (activityId) => {
        setCurrentItinerary(prev => ({
            ...prev,
            activities: prev.activities.filter(act => act.id !== activityId)
        }));
    };

    // Crear nuevo itinerario
    const handleCreate = () => {
        const maxId = Math.max(...itineraries.map(itinerary => itinerary.id), 0);
        const newItinerary = {
            id: maxId + 1,
            ...currentItinerary
        };
        setItineraries([...itineraries, newItinerary]);
        handleClose();
    };

    // Funciones de editar, actualizar y eliminar
    const handleEdit = (itinerary) => {
        setCurrentItinerary(itinerary);
        setEditMode(true);
        setOpen(true);
    };

    const handleUpdate = () => {
        setItineraries(itineraries.map(itinerary =>
            itinerary.id === currentItinerary.id ? currentItinerary : itinerary
        ));
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este itinerario?')) {
            setItineraries(itineraries.filter(itinerary => itinerary.id !== id));
        }
    };

    return (
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
                                <TableCell>{getActivityNames(itinerary.activities)}</TableCell>
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
                                    value={currentItinerary.cityId}
                                    onChange={handleChange}
                                    label="Ciudad"
                                >
                                    {initialCities.map((city) => (
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
                                            {getActivitiesForCity(currentItinerary.cityId).map((activity) => (
                                                <MenuItem
                                                    key={activity.id}
                                                    value={activity.id}
                                                    disabled={currentItinerary.activities.some(a => a.id === activity.id)}
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
                                        {currentItinerary.activities.map((activity) => {
                                            const activityDetails = initialActivities.find(a => a.id === activity.id);
                                            return (
                                                <ListItem key={activity.id}>
                                                    <ListItemText
                                                        primary={activityDetails?.name}
                                                        secondary={`Tipo: ${activityDetails?.type}`}
                                                    />
                                                    <IconButton
                                                        edge="end"
                                                        color="error"
                                                        onClick={() => handleRemoveActivity(activity.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItem>
                                            );
                                        })}
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
    );
};

export default Itineraries;