import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import countries from '../../jsons/countries';
import Title from '../Utiles/Title';

const CountryDetail = () => {
    const { id } = useParams();
    const country = countries.find((country) => country.id === parseInt(id));

    if (!country) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" id="country-not-found-box">
                <Typography variant="h6" color="error" id="country-not-found-message">País no encontrado</Typography>
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="80vh"
            bgcolor="#f9f9f9"
            p={3}
            id="country-detail-container"
        >
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, width: '100%', textAlign: 'center' }} id="country-detail-paper">
                <Typography variant="h4" component="h1" gutterBottom color="primary" id="country-name">
                    {country.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" id="country-description">
                    {country.description}
                </Typography>
            </Paper>
        </Box>
    );
};

export default CountryDetail;
