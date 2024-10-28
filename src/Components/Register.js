import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [roles, setRoles] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const registerData = {
            email,
            password,
            name,
            phone,       
        };

        try {
            const response = await axios.post('http://localhost:8080/register', registerData, {
                headers: {
                    
                    'Content-Type': 'application/json'
                }
            });

            console.log('Registro exitoso:', response.data);
            alert('Registro exitoso');

        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Error en el registro');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Registro de Usuario
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Phone"
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Roles"
                            fullWidth
                            value={roles}
                            onChange={(e) => setRoles(e.target.value)}
                            required
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Registrar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Register;
