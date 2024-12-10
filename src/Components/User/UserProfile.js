import React, { useState, useEffect } from 'react';
import { Paper, Typography, Avatar, Grid, Box, TextField, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Navbar from '../NavBar';
import GenericButton from '../Utiles/GenericButton';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

const API_URL = process.env.REACT_APP_API_URL;

const UserProfile = () => {
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
        navigate('/');
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            await axios.put(`${API_URL}/users`, editForm, getAxiosConfig());
            await fetchUserProfile();
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError('Error al actualizar el perfil: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isEditing) {
        return (
            <Box 
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Navbar />
                <Box 
                    sx={{ 
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CircularProgress />
                </Box>
                <Footer />
            </Box>
        );
    }

    return (
        <Box 
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default'
            }}
        >
            <Navbar />
            <Box 
                sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 2, sm: 3 },
                    width: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto'
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}
                <Paper 
                    variant="outlined" 
                    sx={{ 
                        p: { xs: 2, sm: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        my: { xs: 1, sm: 2 },
                        boxSizing: 'border-box'
                    }}
                >
                    <Grid 
                        container 
                        spacing={3} 
                        alignItems="start"
                    >
                        <Grid 
                            item 
                            xs={12} 
                            sm={4}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: { xs: 80, sm: 100, md: 120 },
                                    height: { xs: 80, sm: 100, md: 120 },
                                    bgcolor: 'primary.main',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                }}
                            >
                                {userProfile.name?.charAt(0)}
                            </Avatar>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            {!isEditing ? (
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 2,
                                    width: '100%'
                                }}>
                                    <Typography variant="h5" component="h1">
                                        {userProfile.name}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {userProfile.email}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {userProfile.phone}
                                    </Typography>
                                    <Box 
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            mt: { xs: 2, sm: 'auto' },
                                            flexWrap: 'wrap'
                                        }}
                                    >
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
                                </Box>
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
                                        <Box 
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                gap: 2,
                                                mt: 2,
                                                flexWrap: 'wrap'
                                            }}
                                        >
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
            <Footer />
        </Box>
    );
};

export default UserProfile;