import React, { useState } from 'react';
import countries from '../../jsons/countries';
import { TextField, Button, Box, Typography } from '@mui/material';

function CreateCountry() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newCountry = {
            id: countries.length + 1, 
            name: name,
            description: description
        };

        countries.push(newCountry);

        setName('');
        setDescription('');
        alert('Country created successfully!');
    };

    return (
        <Box sx={{ p: 3, maxWidth: '400px', margin: '0 auto' }}>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
                Create New Country
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Country Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Add Country
                </Button>
            </form>
        </Box>
    );
}

export default CreateCountry;
