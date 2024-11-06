import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;


const ActivitiesList = () => {
    // Estados
    const { accessToken } = useAuth();
    const [activities, setActivities] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAxiosConfig = () => ({
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    // Traer actividades y ciudades
    useEffect(() => {
        if (accessToken) {
            fetchActivities();
            fetchCities();
        }
    }, [accessToken]);

    // Función para obtener actividades
    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/activities`, getAxiosConfig);
            setActivities(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las actividades: ' + err.message);
        } finally {
            setLoading(false);
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

    // Función para obtener el nombre de la ciudad
    const getCityName = (cityId) => {
        const city = cities.find(city => city.id === parseInt(cityId));
        return city ? city.name : 'Ciudad no encontrada';
    };

    if (loading) return <Typography>Cargando actividades...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Ciudad</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell>{activity.id}</TableCell>
                            <TableCell>{activity.name}</TableCell>
                            <TableCell>{activity.type}</TableCell>
                            <TableCell>{getCityName(activity.cityId)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ActivitiesList;