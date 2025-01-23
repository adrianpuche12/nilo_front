import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import TextField from '@mui/material/TextField';
import Title from '../Utiles/Title';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Footer from '../Footer';
import { useAuth } from '../Auth/AuthContext';
import { CreateButton } from '../Utiles/ActionButtons';

const API_URL = process.env.REACT_APP_API_URL_USER;

function AllUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { roles, accessToken } = useAuth();

  const handleUserClick = (id) => {
    navigate(`/user/${id}`);
  };

  const handleOpen = () => {
    navigate('/user-registration'); 
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!accessToken) {
        setError('No se encontró un token de acceso. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await Axios.get(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data);
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('No tienes permisos para acceder a esta información.');
        } else {
          setError('Hubo un problema al cargar los usuarios. Inténtalo más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [accessToken]);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="all-users-page">
      <Box id="users-container" sx={{ padding: 4 }}>
        <Title id="users-title" text="Usuarios" />

        <Box
          id="search-and-create-container"
          sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}
        >
          <TextField
            id="user-search-field"
            variant="outlined"
            size="small"
            placeholder="Buscar por nombre, apellido o usuario"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: '100%', sm: '70%', md: '60%' },
              maxWidth: '100%',
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
          />
          <CreateButton
            id="create-user-button"
            onClick={handleOpen}
            componentName="Usuario"
            startIcon={<AddIcon />}
          />
        </Box>

        {loading ? (
          <Typography id="loading-message" variant="h6" align="center">
            Cargando usuarios...
          </Typography>
        ) : error ? (
          <Typography id="error-message" variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Box
            id="users-list"
            display="flex"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
          >
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                id={`user-card-${user.id}`}
                variant="outlined"
                sx={{
                  width: 300,
                  cursor: 'pointer',
                  boxShadow: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleUserClick(user.id)}
              >
                <CardActionArea id={`user-card-action-${user.id}`}>
                  <CardContent id={`user-card-content-${user.id}`}>
                    <Typography id={`user-username-${user.id}`} variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      Usuario: {user.username}
                    </Typography>
                    <Typography id={`user-firstname-${user.id}`} variant="body2" color="textSecondary">
                      Nombre: {user.firstName}
                    </Typography>
                    <Typography id={`user-lastname-${user.id}`} variant="body2" color="textSecondary">
                      Apellido: {user.lastName}
                    </Typography>
                    <Typography id={`user-email-${user.id}`} variant="body2" color="textSecondary">
                      Email: {user.email}
                    </Typography>
                    <Typography id={`user-status-${user.id}`} variant="body2" color="textSecondary">
                      Estado: {user.enabled ? 'Habilitado' : 'Deshabilitado'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Acceso:
                    </Typography>
                    <ul id={`user-access-${user.id}`} style={{ margin: 0, paddingLeft: '20px' }}>
                      <li>Gestión de miembros: {user.access?.manageGroupMembership ? 'Sí' : 'No'}</li>
                      <li>Ver: {user.access?.view ? 'Sí' : 'No'}</li>
                      <li>Asignar roles: {user.access?.mapRoles ? 'Sí' : 'No'}</li>
                      <li>Suplantar: {user.access?.impersonate ? 'Sí' : 'No'}</li>
                      <li>Administrar: {user.access?.manage ? 'Sí' : 'No'}</li>
                    </ul>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Box>
      <Footer />
    </div>
  );
}

export default AllUsers;
