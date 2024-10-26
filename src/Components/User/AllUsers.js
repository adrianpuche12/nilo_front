import { Box, Typography, Paper, Grid } from '@mui/material';
import users from '../../jsons/users';
import Title from "../Utiles/Title"
const AllUsers = () => {

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
      <Title text="User List" />
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(users) ? (
          users.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">{user.name}</Typography>
                <Typography color="textSecondary">{user.email}</Typography>
                <Typography>Teléfono: {user.phone}</Typography>
                <Typography>Rol: {user.role}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="error">
            Error: No se pudo cargar la lista de usuarios.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default AllUsers;
