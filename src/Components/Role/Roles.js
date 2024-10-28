import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Grid } from '@mui/material';
import axios from 'axios';

const Roles = () => {
    const [roleId, setRoleId] = useState('');
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);

    // Obtener el rol por ID
    const fetchRole = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8080/api/roles/${roleId}`);
            setRole(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching role data');
            setRole(null);
        }
    };

    // Agregar un nuevo rol
    const addRole = async (event) => {
        event.preventDefault();

        const newRoleData = {
            name: roleName,
            description: roleDescription,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/roles', newRoleData, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('Role creado:', response.data);
            alert('Role creado con éxito');
            setRole(null);
            setRoleName('');
            setRoleDescription('');
        } catch (error) {
            console.error('Error al crear el rol:', error);
            alert('Error al crear el rol');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Gestión de Roles
            </Typography>
            <form onSubmit={fetchRole}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Buscar Rol por ID"
                            type="number"
                            fullWidth
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Buscar Rol
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {error && <Typography color="error" marginTop="10px">{error}</Typography>}
            {role && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h6">Detalles del Rol</Typography>
                    <Typography variant="body1"><strong>ID:</strong> {role.id}</Typography>
                    <Typography variant="body1"><strong>Nombre:</strong> {role.name}</Typography>
                    <Typography variant="body1"><strong>Descripción:</strong> {role.description}</Typography>
                </div>
            )}

            <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>
                Crear Nuevo Rol
            </Typography>
            <form onSubmit={addRole}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre del Rol"
                            fullWidth
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Descripción"
                            fullWidth
                            value={roleDescription}
                            onChange={(e) => setRoleDescription(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Crear Rol
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Roles;
