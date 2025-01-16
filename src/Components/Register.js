import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Axios from "axios";
import { useAuth } from "./Auth/AuthContext";

const API_URL = process.env.REACT_APP_API_URL_USER;

function borrarLocalStorage() {
  // Eliminar las claves específicas del localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresIn");
  localStorage.removeItem("userId");
}

const Register = () => {
  borrarLocalStorage(); // Funcion para borrar el local storage

  const navigate = useNavigate();
  //const { accessToken } = useAuth(); -. lo trae null ya que no hay usuario registrado

  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isValid, setIsValid] = useState(false);

  // Función para manejar los cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si se está escribiendo en el campo "fullName", dividirlo en firstName y lastName
    if (name === "fullName") {
      setFullName(value);
      const nameParts = value.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
    } else if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  // Función para manejar el toque de los campos
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  // Validación de los campos
  const validateForm = () => {
    const errors = {
      fullName: !fullName.trim()
        ? "El nombre completo es obligatorio."
        : fullName.split(" ").length < 2
        ? "El nombre completo debe contener al menos un nombre y un apellido."
        : fullName.split(" ").some((part) => part.length < 3)
        ? "El nombre y el apellido deben tener al menos 3 letras cada uno."
        : "",
      username: !username
        ? "El nombre de usuario es obligatorio."
        : username.length < 3
        ? "El nombre de usuario debe tener al menos 3 caracteres."
        : "",
      email: !email
        ? "El email es obligatorio."
        : !/\S+@\S+\.\S+/.test(email)
        ? "Ingresa un correo electrónico válido."
        : "",
      password: !password
        ? "La contraseña es obligatoria."
        : password.length < 6
        ? "La contraseña debe tener al menos 6 caracteres."
        : "",
      confirmPassword: !confirmPassword
        ? "Por favor confirma la contraseña."
        : confirmPassword !== password
        ? "Las contraseñas no coinciden."
        : "",
    };

    setFormErrors(errors);
    setIsValid(!Object.values(errors).some((error) => error !== ""));
  };

  // Validar en cada cambio de formulario
  useEffect(() => {
    validateForm();
  }, [fullName, username, email, password, confirmPassword]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar posibles errores previos
    setError("");

    // Asegurarse de que los campos sean válidos antes de enviar
    if (isValid) {
      try {
        // Aquí se enviarán los datos de firstName y lastName junto con el resto del formulario
        const userData = {
          firstName,
          lastName,
          username,
          email,
          password,
          enabled: true,
          emailVerified: true,
          roles: ["Client"], // Rol Client para que solo tenga acceso a la visualizacion
          realmRoles: ["Client"], // No se ingresan - Posible configuracion BackEnd
        };

        //  Realizar login para hacer obtener token
        //login("admindev", "admin");
        await login("admindev", "admin"); // Espera a que se obtenga el accessToken
        const accessToken = localStorage.getItem("accessToken");

        const response = await Axios.post(`${API_URL}/user`, userData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        alert("Usuario registrado con éxito");
        borrarLocalStorage(); // Funcion para borrar el local storage
        navigate("/login");
      } catch (error) {
        setError("Hubo un error al registrar el usuario.");
      }
    } else {
      setError("Por favor, corrige los errores en el formulario.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                align="center"
              >
                Registro de Usuario
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <AlertTitle>Error</AlertTitle>
                      {error}
                    </Alert>
                  )}
                  <TextField
                    label="Nombre Completo"
                    variant="outlined"
                    fullWidth
                    name="fullName"
                    value={fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isSubmitting}
                    error={touched.fullName && !!formErrors.fullName}
                    helperText={touched.fullName && formErrors.fullName}
                  />
                  <TextField
                    label="Usuario"
                    variant="outlined"
                    fullWidth
                    name="username"
                    value={username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isSubmitting}
                    error={touched.username && !!formErrors.username}
                    helperText={touched.username && formErrors.username}
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    type="email"
                    disabled={isSubmitting}
                    error={touched.email && !!formErrors.email}
                    helperText={touched.email && formErrors.email}
                  />
                  <TextField
                    label="Contraseña"
                    variant="outlined"
                    type="password"
                    fullWidth
                    name="password"
                    value={password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isSubmitting}
                    error={touched.password && !!formErrors.password}
                    helperText={touched.password && formErrors.password}
                  />
                  <TextField
                    label="Confirmar Contraseña"
                    variant="outlined"
                    type="password"
                    fullWidth
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isSubmitting}
                    error={
                      touched.confirmPassword && !!formErrors.confirmPassword
                    }
                    helperText={
                      touched.confirmPassword && formErrors.confirmPassword
                    }
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? "Registrando..." : "Registrar"}
                  </Button>
                </Box>
              </form>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#FFB74D",
                  "&:hover": {
                    backgroundColor: "#FF9800",
                  },
                }}
                component="a"
                href="/login"
              >
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
