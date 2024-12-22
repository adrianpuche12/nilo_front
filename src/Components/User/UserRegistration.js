import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { TextField, Card, CardContent, Box, Grid } from "@mui/material";
import { useAuth } from "../Auth/AuthContext"; 
import dayjs from "dayjs";
import AdminNavbar from "../Admin/AdminNavbar"; 
import Footer from "../Footer"; 
import GenericButton from "../Utiles/GenericButton";
import { CloseButton } from "../Utiles/ActionButtons";
import Title from "../Utiles/Title";

const API_URL = process.env.REACT_APP_API_URL_USER;

function UserRegistrationCard() {
  const navigate = useNavigate();
  const { accessToken } = useAuth(); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    username: "", 
    password: "", 
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    birthDate: false,
    username: false, 
    password: false, 
  });

  const [isValid, setIsValid] = useState(false);

  // Función para manejar los cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el botón de "Volver"
  const handleGoBack = () => {
    navigate("/users"); 
  };

  // Validación de los campos
  const validateForm = () => {
    const { firstName, lastName, email, birthDate, username, password } = formData;
    const newErrors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      birthDate: !birthDate || dayjs().diff(dayjs(birthDate), "year") < 18,
      username: !username.trim(), 
      password: password.length < 6, 
    };
    setErrors(newErrors);
    setIsValid(!Object.values(newErrors).includes(true));
  };

  // Validar en cada cambio de formulario
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      try {
        const { firstName, lastName, email, username, password } = formData;
        const userData = {
          firstName,
          lastName,
          email,
          username, 
          password, 
          enabled: true,
          emailVerified: true,
          realmRoles: ["User"], // Asignar el rol de 'user'
        };

        // Llamada a la API con el token de autenticación
        const response = await Axios.post(`${API_URL}/user`, userData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("Usuario registrado con éxito");
        navigate("/users"); 
      } catch (error) {
        alert("Hubo un error al registrar el usuario.");
      }
    }
  };

  return (
    <div>
      {/* Navbar Admin */}
      <AdminNavbar />

      {/* Contenido principal */}
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
        <Card style={{ maxWidth: 400, padding: "20px 15px" }}>
          <CardContent>     
            <Title text="Registro de Usuario" align="left" />                              
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                helperText={errors.firstName && "El nombre es obligatorio"}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                helperText={errors.lastName && "El apellido es obligatorio"}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                helperText={errors.email && "Ingresa un correo válido"}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                helperText={errors.username && "El username es obligatorio"}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                helperText={errors.password && "La contraseña debe tener al menos 6 caracteres"}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Fecha de Nacimiento"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                error={errors.birthDate}
                helperText={errors.birthDate && "Debes ser mayor de 18 años"}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Box display="flex" justifyContent="space-between" marginTop="16px">
                <CloseButton 
                  onClick={handleGoBack}    
                />
                <GenericButton 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={!isValid}
                  text= "Registrar"
                  
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default UserRegistrationCard;
