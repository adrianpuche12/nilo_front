import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const ItinerariesList = () => {
    // Estados
    const [itineraries, setItineraries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    };

    // Cargar itinerarios y ciudades
    useEffect(() => {
        fetchItineraries();
        fetchCities();
    }, []);

    // Función para obtener itinerarios
    const fetchItineraries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/itineraries`, axiosConfig);
            setItineraries(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los itinerarios: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener ciudades
    const fetchCities = async () => {
        try {
            const response = await axios.get(`${API_URL}/cities`, axiosConfig);
            setCities(response.data);
        } catch (err) {
            setError('Error al cargar las ciudades: ' + err.message);
        }
    };

    // Función para obtener el nombre de la ciudad
    const getCityName = (cityId) => {
        const city = cities.find(c => c.id === cityId);
        return city ? city.name : 'Ciudad no encontrada';
    };

    if (loading) return <Typography>Cargando itinerarios...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Ciudad</TableCell>
                        <TableCell>Actividades</TableCell>
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
                                {itinerary.activities.map(activity => activity.name).join(', ')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ItinerariesList;