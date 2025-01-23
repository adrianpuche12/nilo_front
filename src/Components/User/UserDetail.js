import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useAuth } from '../Auth/AuthContext';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Footer from '../Footer';
import { Button, Card, CardContent, Grid, List, ListItem, ListItemText, Divider, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Title from '../Utiles/Title';

const API_URL = process.env.REACT_APP_API_URL_USER;

function UserDetail() {
  const { id } = useParams(); // Obtiene el ID del usuario desde la URL
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // Control del diálogo de confirmación
  const { roles, accessToken } = useAuth();

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!accessToken) {
        setError('No se encontró un token de acceso. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await Axios.get(`${API_URL}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('No tienes permisos para acceder a esta información.');
        } else {
          setError('Hubo un problema al cargar los detalles del usuario. Inténtalo más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [accessToken, id]);

  // Función para abrir el diálogo de confirmación
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Función para cerrar el diálogo de confirmación
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Función para manejar la eliminación del usuario
  const handleDelete = async () => {
    if (!accessToken) {
      setError('No se encontró un token de acceso. Por favor, inicia sesión.');
      return;
    }

    try {
      await Axios.delete(`${API_URL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert('Usuario eliminado con éxito.');
      navigate('/users'); // Redirigir a la lista de usuarios
    } catch (err) {
      if (err.response?.status === 403) {
        setError('No tienes permisos para eliminar este usuario.');
      } else {
        setError('Hubo un problema al eliminar el usuario. Inténtalo más tarde.');
      }
    } finally {
      setOpenDialog(false); // Cerrar el diálogo después de completar la acción
    }
  };

  // Función para obtener la primera letra del nombre del usuario
  const getAvatarInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <div>
      <Box id="user-detail-container" sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <Typography id="loading-message" variant="h6" align="center">
            Cargando detalles del usuario...
          </Typography>
        ) : error ? (
          <Typography id="error-message" variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : (
          user && (
            <Card id="user-detail-card" sx={{ maxWidth: 900, width: '100%', boxShadow: 6, borderRadius: 2, bgcolor: 'background.paper', padding: 2, marginBottom: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 4 }}>
                  <Title id="user-detail-title" text="Detalles del Usuario" />

                  <Box id="user-avatar-container" sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                    <Avatar id="user-avatar" sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'primary.main' }}>
                      {getAvatarInitial(user.firstName)}
                    </Avatar>
                  </Box>

                  <Grid id="user-info-grid" container spacing={3} justifyContent="center" textAlign="center">
                    <Grid item xs={12} sm={6}>
                      <Typography id="user-first-name-label" variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Nombre:</Typography>
                      <Typography id="user-first-name" variant="body1" sx={{ color: 'text.primary' }}>{user.firstName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography id="user-last-name-label" variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Apellido:</Typography>
                      <Typography id="user-last-name" variant="body1" sx={{ color: 'text.primary' }}>{user.lastName}</Typography>
                    </Grid>
                  </Grid>

                  {/* Más campos con IDs aquí */}
                  <Divider sx={{ marginY: 3, width: '100%' }} />
                  <Box id="user-actions-container" sx={{ display: 'flex', gap: 2 }}>
                    <Button id="delete-user-button" variant="contained" color="error" onClick={handleOpenDialog} sx={{ marginTop: 3 }}>
                      Eliminar Usuario
                    </Button>
                    <Button id="back-to-users-button" variant="contained" color="primary" onClick={() => navigate('/users')} sx={{ marginTop: 3 }}>
                      Volver a Usuarios
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
        )}
      </Box>

      <Dialog id="confirm-delete-dialog" open={openDialog} onClose={handleCloseDialog} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
        <DialogTitle id="confirm-dialog-title">Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            ¿Estás seguro de que deseas eliminar este usuario? <strong>Esta acción es irreversible</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="cancel-delete-button" onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button id="confirm-delete-button" onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
}

export default UserDetail;
