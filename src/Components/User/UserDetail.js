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
      <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <Typography variant="h6" align="center">
            Cargando detalles del usuario...
          </Typography>
        ) : error ? (
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : (
          user && (
            <Card sx={{
              maxWidth: 900, width: '100%', boxShadow: 6, borderRadius: 2, 
              bgcolor: 'background.paper', padding: 2, marginBottom: 4
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 4 }}>
                  <Title text= "Detalles del Usuario"  />              

                  {/* Avatar o inicial */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                    <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'primary.main' }}>
                      {getAvatarInitial(user.firstName)}
                    </Avatar>
                  </Box>

                  <Grid container spacing={3} justifyContent="center" textAlign="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Nombre:</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>{user.firstName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Apellido:</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>{user.lastName}</Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} justifyContent="center" textAlign="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Email:</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>{user.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Estado:</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {user.enabled ? 'Habilitado' : 'Deshabilitado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Correo Verificado:</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {user.emailVerified ? 'Sí' : 'No'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>TOTP:</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {user.totp ? 'Activado' : 'Desactivado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Fecha de Creación:</Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {new Date(user.createdTimestamp).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ marginY: 3, width: '100%' }} />

                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary', marginBottom: 2, textAlign: 'center' }}>Roles:</Typography>
                  <List sx={{ padding: 0, textAlign: 'center' }}>
                    {[{ label: 'Gestión de miembros', value: user.access?.manageGroupMembership },
                      { label: 'Ver', value: user.access?.view },
                      { label: 'Asignar roles', value: user.access?.mapRoles },
                      { label: 'Suplantar', value: user.access?.impersonate },
                      { label: 'Administrar', value: user.access?.manage }]
                      .map((role, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                <strong>{role.label}</strong>: {role.value ? 'Sí' : 'No'}
                              </Typography>
                            }
                          />
                        </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ marginY: 3, width: '100%' }} />

                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Federation Link:</Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>{user.federationLink || 'No disponible'}</Typography>

                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Client ID:</Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>{user.serviceAccountClientId || 'No disponible'}</Typography>

                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Credentials:</Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>{user.credentials ? JSON.stringify(user.credentials) : 'No disponible'}</Typography>

                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Attributes:</Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>{user.attributes ? JSON.stringify(user.attributes) : 'No disponible'}</Typography>

                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Disableable Credential Types:</Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    {user.disableableCredentialTypes.length > 0 ? user.disableableCredentialTypes.join(', ') : 'Ninguno'}
                  </Typography>

                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Service Account:</Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    {user.serviceAccount ? 'Sí' : 'No'}
                  </Typography>

                  <Divider sx={{ marginY: 3, width: '100%' }} />

                  {/* Botón para eliminar usuario */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="error" onClick={handleOpenDialog} sx={{ marginTop: 3 }}>
                      Eliminar Usuario
                    </Button>

                    <Button variant="contained" color="primary" onClick={() => navigate('/users')} sx={{ marginTop: 3 }}>
                      Volver a Usuarios
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
        )}
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            ¿Estás seguro de que deseas eliminar este usuario? <strong>Esta acción es irreversible</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
}

export default UserDetail;
