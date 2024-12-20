import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Title from '../Utiles/Title';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../NavBar';
import Footer from '../Footer';
import AdminNavbar from '../Admin/AdminNavbar';
import { useAuth } from '../Auth/AuthContext';

function AllUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // Estado para almacenar usuarios
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const { roles, accessToken } = useAuth(); // Obtenemos roles y accessToken desde AuthContext

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      if (!accessToken) {
        setError('No se encontró un token de acceso. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Inicia el estado de carga
        const response = await Axios.get(`${process.env.REACT_APP_API_URL_USER}/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Usamos el token del contexto
          },
        });
        setUsers(response.data); // Almacenar usuarios en el estado
        setError(null); // Limpiar errores
      } catch (err) {
        console.error('Error fetching users:', err);
        if (err.response?.status === 403) {
          setError('No tienes permisos para acceder a esta información.');
        } else {
          setError('Hubo un problema al cargar los usuarios. Inténtalo más tarde.');
        }
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchUsers();
  }, [accessToken]); // Dependemos de accessToken para evitar errores de sincronización

  // Manejar clic en un usuario
  const handleUserClick = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <div>
      {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}
      <Box sx={{ padding: 4 }}>
        <Title text="Usuarios" />
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
            {users.map((user) => (
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
                      Nombre: {user.firstName} {user.lastName}
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
