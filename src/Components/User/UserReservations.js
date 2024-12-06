import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import Title from '../Utiles/Title';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../NavBar';
import Footer from '../Footer';
import AdminNavbar from '../Admin/AdminNavbar';
import Pagination from '@mui/material/Pagination';

const reservations = [
  { id: 1,  activity: "Excursión a Machu Picchu", date: "2024-12-15", status: "Confirmada", details: "2 personas" },
  { id: 2,  activity: "Tour en barco por el Caribe", date: "2024-12-20", status: "Pendiente", details: "3 personas" },
  { id: 3,  activity: "Escapada a París", date: "2024-12-10", status: "Cancelada", details: "1 persona" },
  { id: 4,  activity: "Safari en Kenia", date: "2024-12-22", status: "Confirmada", details: "4 personas" },
  { id: 5,  activity: "Tour por Tokio", date: "2024-12-18", status: "Pendiente", details: "2 personas" },
  { id: 6,  activity: "Crucero por el Mediterráneo", date: "2024-12-25", status: "Confirmada", details: "3 personas" },
  { id: 7,  activity: "Trekking en los Andes", date: "2024-12-30", status: "Confirmada", details: "5 personas" },
];

function UserReservations() {
  const { roles, userName } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calcular las reservas a mostrar en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = reservations.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}
      <Box sx={{ padding: 4 }}>
        <Title text={`Reservas de ${userName || 'Usuario'}`} />
        <Box
          display="flex"
          flexWrap="wrap"
          gap={3}
          justifyContent="center"
        >
          {currentReservations.map((reservation) => (
            <Card
                key={reservation.id}
                variant="outlined"
                sx={{
                width: 400, 
                height: 250, 
                cursor: 'pointer',
                boxShadow: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                },
                }}
            >
              <CardActionArea>
                <CardContent sx={{ padding: 4 }}> 
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Nombre de Usuario: {userName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    Actividad/Itinerario Reservado: {reservation.activity}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    Fecha de la Reserva: {reservation.date}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    Estado: {reservation.status}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    Detalles: {reservation.details}
                    </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
        {/* Paginación */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(reservations.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
      <Footer />
    </div>
  );
}

export default UserReservations;
