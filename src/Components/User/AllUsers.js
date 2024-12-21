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
import Navbar from '../NavBar';
import Footer from '../Footer';
import AdminNavbar from '../Admin/AdminNavbar';
import { useAuth } from '../Auth/AuthContext';
import Button from '@mui/material/Button'; 
import { CreateButton, EditButton, CloseButton, DeleteButton } from '../Utiles/ActionButtons';

const API_URL = process.env.REACT_APP_API_URL_USER;

function AllUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la barra de búsqueda
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { roles, accessToken } = useAuth();
  
  const handleUserClick = (id) => {
    navigate(`/user/${id}`);
  };

  const handleCreateUserClick = () => {
    navigate('/create-user'); // Ruta para crear un nuevo usuario
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

  // Filtrar usuarios según la barra de búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}
      <Box sx={{ padding: 4 }}>
        <Title text="Usuarios" />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <TextField
            variant="outlined"
            size="small" // Tamaño más pequeño
            placeholder="Buscar por nombre, apellido o usuario"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: '100%', sm: '70%', md: '60%' }, // Responsive width
              maxWidth: '100%',
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
          />
          {/* Botón "Crear nuevo usuario */}   

            
            <CreateButton
                //onClick={handleOpen}
                componentName="Usuario"
                startIcon={<AddIcon />}
            />
          
        </Box>
        
        {loading ? (
          <Typography variant="h6" align="center">
            Cargando usuarios...
          </Typography>
        ) : error ? (
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
          >
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
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
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      Usuario: {user.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Nombre: {user.firstName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Apellido: {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email: {user.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Estado: {user.enabled ? 'Habilitado' : 'Deshabilitado'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Acceso:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
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
