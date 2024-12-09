// src/components/utiles/GenericButton.js
import React from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@mui/material";

const GenericButton = ({
  text,
  icon,
  variant = "contained",
  size = "medium",
  color = "primary",
  disabled = false,
  loading = false,
  onClick,
  onSubmit,
  className = "",
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      disabled={disabled || loading}
      onClick={onClick}
      onSubmit={onSubmit}
      className={className}
      startIcon={icon && !loading ? icon : null}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : text}
    </Button>
  );
};

GenericButton.propTypes = {
  text: PropTypes.string.isRequired, // Texto del botón
  icon: PropTypes.element, // Ícono opcional
  variant: PropTypes.oneOf(["contained", "outlined", "text"]), // Estilo del botón
  size: PropTypes.oneOf(["small", "medium", "large"]), // Tamaño
  color: PropTypes.oneOf(["primary", "secondary", "success", "error", "info", "warning"]), // Color
  disabled: PropTypes.bool, // Estado deshabilitado
  loading: PropTypes.bool, // Estado de carga
  onClick: PropTypes.func, // Función al hacer clic
  onSubmit: PropTypes.func, // Función al enviar formulario
  className: PropTypes.string, // Clases personalizadas
};

export default GenericButton;
