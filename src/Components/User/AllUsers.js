import React from 'react';
import { useNavigate } from 'react-router-dom';
import users from '../../jsons/users';
import Title from '../Utiles/Title';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function AllUsers() {
  const navigate = useNavigate();

  const handleUserClick = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Title text="Usuarios" />
      <Box display="flex" flexWrap="wrap" gap={2}>
        {users.map((user) => (
          <Card
            key={user.id}
            variant="outlined"
            sx={{ width: 300, cursor: 'pointer' }}
            onClick={() => handleUserClick(user.id)}
          >
            <CardActionArea>
              <CardContent>
                <Typography variant="h6" component="div">
                  Nombre: {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Teléfono: {user.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rol: {user.roles}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default AllUsers;

