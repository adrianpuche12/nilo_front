import React from 'react';
import { useParams } from 'react-router-dom';
import users from '../../jsons/users';
import Title from '../Utiles/Title';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function UserDetail() {
  const { id } = useParams();
  const user = users.find((user) => user.id === parseInt(id, 10));

  if (!user) {
    return <Typography variant="h5" color="error" sx={{ textAlign: 'center', marginTop: 2 }}>Usuario no encontrado</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Title text="Detalle del Usuario" />
      <Card variant="outlined" sx={{ maxWidth: 400, margin: '0 auto' }}>
        <CardContent>
          <Typography variant="h6" component="div">
            ID: {user.id}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Nombre: {user.name}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Email: {user.email}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Teléfono: {user.phone}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Roles: {user.roles.join(', ') || 'Sin roles'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserDetail;
