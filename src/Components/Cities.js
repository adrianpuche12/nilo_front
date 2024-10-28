import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Grid } from '@mui/material';
import axios from 'axios';

const Cities = () => {
    const [cityId, setCityId] = useState('');
    const [city, setCity] = useState(null);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState('');
    const [cityDescription, setCityDescription] = useState('');
    const [provinceName, setProvinceName] = useState('');

    // Obtener la ciudad por ID
    const fetchCity = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8080/api/cities/${cityId}`);
            setCity(response.data);
            setError(null);
        } catch (err) {
            setError('Error al obtener los datos de la ciudad');
            setCity(null);
        }
    };

    // Agregar una nueva ciudad
    const addCity = async (event) => {
        event.preventDefault();

        const newCityData = {
            name: cityName,
            description: cityDescription,
            province: { name: provinceName }
        };

        try {
            const response = await axios.post('http://localhost:8080/api/cities', newCityData, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('Ciudad creada:', response.data);
            alert('Ciudad creada con éxito');
            setCityName('');
            setCityDescription('');
            setProvinceName('');
        } catch (error) {
            console.error('Error al crear la ciudad:', error);
            alert('Error al crear la ciudad');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Gestión de Ciudades
            </Typography>

            {/* Formulario de Búsqueda de Ciudad por ID */}
            <form onSubmit={fetchCity}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Buscar Ciudad por ID"
                            type="number"
                            fullWidth
                            value={cityId}
                            onChange={(e) => setCityId(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Buscar Ciudad
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Mensaje de error o detalles de la ciudad */}
            {error && <Typography color="error" marginTop="10px">{error}</Typography>}
            {city && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h6">Detalles de la Ciudad</Typography>
                    <Typography variant="body1"><strong>ID:</strong> {city.id}</Typography>
                    <Typography variant="body1"><strong>Nombre:</strong> {city.name}</Typography>
                    <Typography variant="body1"><strong>Descripción:</strong> {city.description}</Typography>
                    <Typography variant="body1"><strong>Provincia:</strong> {city.province.name}</Typography>
                </div>
            )}

            {/* Formulario para Crear Nueva Ciudad */}
            <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>
                Crear Nueva Ciudad
            </Typography>
            <form onSubmit={addCity}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre de la Ciudad"
                            fullWidth
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Descripción"
                            fullWidth
                            value={cityDescription}
                            onChange={(e) => setCityDescription(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Provincia"
                            fullWidth
                            value={provinceName}
                            onChange={(e) => setProvinceName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Crear Ciudad
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Cities;
