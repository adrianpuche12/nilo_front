import React, { useState, useEffect } from 'react';
import { Paper, Typography, Avatar, Grid, Box, TextField, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import GenericButton from '../Utiles/GenericButton';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import Historia from './Historia';

const API_URL = process.env.REACT_APP_API_URL_USER;

const UserProfile = () => {
    const { accessToken, userId, roles } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
    });

    const [showHistoria, setShowHistoria] = useState(false); // Estado para mostrar Historia

    const navigate = useNavigate();

    const getAxiosConfig = () => ({
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            // Usa el userId en la URL o en la configuración de la solicitud
            const response = await axios.get(`${API_URL}/user/${userId}`, getAxiosConfig());
            
            const user = response.data;
            
            // Actualiza el estado con los datos del usuario
            setUserProfile(user);
            setEditForm(user);
            setError(null);
        } catch (err) {
            // Maneja errores
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
        if (roles.includes('admin')) {
            navigate('/admin/adminhome');
        } else {
            navigate('/');
        }
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
    
            // Crear un objeto con solo los campos que se quieren actualizar
            const updatedData = {
                username: editForm.username,
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                email: editForm.email,
            };
    
            // Hacer la petición para actualizar el perfil
            await axios.put(`${API_URL}/user`, updatedData, getAxiosConfig());
    
            // Refrescar el perfil del usuario
            await fetchUserProfile();
    
            // Cambiar el estado de edición y resetear errores
            setIsEditing(false);
            setError(null);
        } catch (err) {
            // Manejo de errores
            setError('Error al actualizar el perfil: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para mostrar/ocultar el componente Historia
    const toggleHistoria = () => {
        setShowHistoria(!showHistoria);
    };
    

    if (loading && !isEditing) {
        return (
            <Box 
                id="loading-container"
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box 
                    id="loading-spinner"
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
            id="user-profile-container"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default'
            }}
        >
            <Box 
                id="user-profile-content"
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
                    <Alert id="error-alert" severity="error" sx={{ mb: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}
                <Paper 
                    id="user-profile-card"
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
                        id="user-profile-grid"
                        container 
                        spacing={3} 
                        alignItems="start"
                    >
                        <Grid 
                            id="avatar-container"
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
                                id="user-avatar"
                                sx={{
                                    width: { xs: 80, sm: 100, md: 120 },
                                    height: { xs: 80, sm: 100, md: 120 },
                                    bgcolor: 'primary.main',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                }}
                            >
                                {userProfile.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            {!isEditing ? (
                                <Box id="user-info" sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 2,
                                    width: '100%'
                                }}>
                                    <Typography id="username-text" variant="body2" color="textSecondary">
                                        Usuario: {userProfile.username}
                                    </Typography>
                                    <Typography id="firstname-text" variant="body2" color="textSecondary">
                                        Nombre: {userProfile.firstName}
                                    </Typography>
                                    <Typography id="lastname-text" variant="body2" color="textSecondary">
                                        Apellido: {userProfile.lastName}
                                    </Typography>
                                    <Typography id="email-text" variant="body2" color="textSecondary">
                                        Email: {userProfile.email}
                                    </Typography>
                                    <Box 
                                        id="buttons-container"
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            mt: { xs: 2, sm: 'auto' },
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <GenericButton
                                            id="back-button"
                                            text="Volver"
                                            color="secondary"
                                            onClick={handleClose}
                                        />
                                       {/*  <GenericButton
                                            id="edit-button"
                                            text="Editar Perfil"
                                            color="primary"
                                            onClick={handleEdit}
                                        /> */}
                                        <GenericButton 
                                            id="history-button"
                                            text="Ver Historia" 
                                            color="primary" 
                                            onClick={toggleHistoria} /> {/* Botón Historia */}
                                    </Box>
                                </Box>
                            ) : (
                                <Grid id="edit-form" container spacing={2}>
                                    <Grid id="edit-username" item xs={12}>
                                        <TextField
                                            label="Usuario"
                                            name="username"
                                            variant="outlined"
                                            value={editForm.username}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid id="edit-firstname" item xs={12}>
                                        <TextField
                                            label="Nombre"
                                            name="firstName"
                                            variant="outlined"
                                            value={editForm.firstName}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid id="edit-lastname" item xs={12}>
                                        <TextField
                                            label="Apellido"
                                            name="lastName"
                                            variant="outlined"
                                            value={editForm.lastName}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid id="edit-email" item xs={12}>
                                        <TextField
                                            label="Email"
                                            name="email"
                                            variant="outlined"
                                            value={editForm.email}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid id="edit-buttons" item xs={12}>
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
                                                id="cancel-button"
                                                text="Cancelar"
                                                color="secondary"
                                                disabled={loading}
                                                onClick={handleCancel}
                                            />
                                            <GenericButton
                                                id="save-button"
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
                {showHistoria && <Historia id="user-history" />} {/* Mostrar componente Historia */}
            </Box>
            <Footer />
        </Box>
    );
};

export default UserProfile;
