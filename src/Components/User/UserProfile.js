import React, { useState, useEffect } from 'react';
import { Paper, Typography, Avatar, Grid, Button, Box, TextField, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Navbar from '../NavBar';
import GenericButton from '../Utiles/GenericButton';
import { useNavigate } from 'react-router-dom';


const API_URL = process.env.REACT_APP_API_URL;

const UserProfile = () => {
    // Estados
    const { accessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: ''
    });


    const navigate = useNavigate();

    const getAxiosConfig = () => ({
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    // Función para obtener el perfil del usuario
    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/users`, getAxiosConfig());
            const user = response.data[0];
            setUserProfile(user);
            setEditForm(user);
            setError(null);
        } catch (err) {
            setError('Error al cargar el perfil: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchUserProfile();
        }
    }, [accessToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm(userProfile);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm(userProfile);
    };

    const handleClose = () => {
    setIsEditing(false);
    setEditForm(userProfile);
    navigate('/'); // Redirige a la ruta Home ("/")
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            await axios.put(`${API_URL}/users`, editForm, getAxiosConfig());
            await fetchUserProfile();
            setError(null);
        } catch (err) {
            setError('Error al actualizar el perfil: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isEditing) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Navbar />
            <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Paper variant="outlined" sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Box display="flex" justifyContent="center">
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        bgcolor: 'primary.main'
                                    }}
                                >
                                    {userProfile.name?.charAt(0)}
                                </Avatar>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            {!isEditing ? (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        {userProfile.name}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" gutterBottom>
                                        {userProfile.email}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" gutterBottom>
                                        {userProfile.phone}
                                    </Typography>                                    
                                    <Box display="flex" gap={2}> 
                                        <GenericButton
                                            text="Cerrar"
                                            color="secondary"
                                            onClick={handleClose}
                                        />
                                        <GenericButton
                                            text="Editar Perfil"
                                            color="primary"
                                            onClick={handleEdit}
                                        />
                                    </Box>                                 
                                </>
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Nombre"
                                            name="name"
                                            variant="outlined"
                                            value={editForm.name}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email"
                                            name="email"
                                            variant="outlined"
                                            value={editForm.email}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Teléfono"
                                            name="phone"
                                            variant="outlined"
                                            value={editForm.phone}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="flex-end" gap={2}>
                                            <GenericButton
                                                text="Cancelar"
                                                color="secondary"
                                                disabled={loading}
                                                onClick={handleCancel}
                                            />
                                            <GenericButton
                                                text="Guardar Cambios"
                                                color="primary"
                                                onClick={handleSaveChanges}
                                                disabled={loading}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </div>
    );
};

export default UserProfile;