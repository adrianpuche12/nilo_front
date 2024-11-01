import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Card, CardContent, Box } from '@mui/material';
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
            <Box sx={{ mt: 17, mb: 17 }}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Registro de Usuario
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        type="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Password"
                                        variant="outlined"
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
                                        variant="outlined"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Phone"
                                        variant="outlined"
                                        fullWidth
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        type="tel"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Roles"
                                        variant="outlined"
                                        fullWidth
                                        value={roles}
                                        onChange={(e) => setRoles(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="large"
                                    >
                                        Registrar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Register;