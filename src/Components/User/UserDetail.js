import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import users from '../../jsons/users';
import Title from '../Utiles/Title';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

function UserDetail() {
  const { id } = useParams();
  const user = users.find((user) => user.id === parseInt(id, 10));

  const [avatarImage, setAvatarImage] = useState(null);

  // Función para manejar la carga de imágenes
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Si no se encuentra el usuario, mostramos un mensaje de error
  if (!user) {
    return (
      <Typography 
        variant="h5" 
        color="error" 
        sx={{ textAlign: 'center', marginTop: 2 }}
      >
        Usuario no encontrado
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Title text="Detalle del Usuario" />
      <Card
        variant="outlined"
        sx={{
          maxWidth: 400,
          margin: '0 auto',
          boxShadow: 3,
          borderRadius: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          {/* Caja del Avatar */}
          <Box 
            sx={{
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 3,
              position: 'relative'
            }}
          >
            {/* Avatar del usuario */}
            <Avatar
              alt={user.name}
              src={avatarImage || ''}
              sx={{
                width: 120,  // Aumentamos el tamaño del avatar
                height: 120, // Aumentamos el tamaño del avatar
                fontSize: 50, // Aumentamos el tamaño de la inicial
                backgroundColor: '#1976d2',
                border: '3px solid white', // Borde blanco alrededor del avatar
                boxShadow: 3,
              }}
            >
              {!avatarImage && user.name.charAt(0)} {/* Mostrar inicial si no hay imagen */}
            </Avatar>

            {/* Botón para subir imagen */}
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  transform: 'translate(25%, 25%)', // Posicionar el icono correctamente
                  backgroundColor: 'white', // Fondo blanco para el icono
                  borderRadius: '50%',
                  padding: 0.5,
                  boxShadow: 2,
                  '&:hover': {
                    backgroundColor: '#e3f2fd', // Hover en el icono
                  },
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>

          {/* Información del Usuario */}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            ID: {user.id}
          </Typography>
          <Typography variant="body1" color="textPrimary" sx={{ textAlign: 'center', marginBottom: 1 }}>
            Nombre: {user.name}
          </Typography>
          <Typography variant="body1" color="textPrimary" sx={{ textAlign: 'center', marginBottom: 1 }}>
            Email: {user.email}
          </Typography>
          <Typography variant="body1" color="textPrimary" sx={{ textAlign: 'center', marginBottom: 1 }}>
            Teléfono: {user.phone}
          </Typography>
          <Typography variant="body1" color="textPrimary" sx={{ textAlign: 'center', marginBottom: 1 }}>
            Roles: {user.roles.join(', ') || 'Sin roles'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserDetail;
