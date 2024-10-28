{/* 
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import Title from '../Utiles/Title';
import countries from '../../jsons/countries';

const Country = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                <Title text="Country List" />
            </Typography>
            <Grid container spacing={3}>
                {Array.isArray(countries) ? (
                    countries.map((country, index) => (
                        <Grid item xs={12} sm={6} md={4} key={country.id}>
                            <Paper elevation={3} sx={{ p: 2 }} onClick={() => console.log(`Detalles del país con ID: ${country.id}`)}>
                                <Typography variant="h6">{country.name}</Typography>
                                <Typography color="textSecondary">{country.description}</Typography>
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="error">
                        Error: No se pudo cargar la lista de países.
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default Country;

*/}